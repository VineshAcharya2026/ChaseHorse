import { Hono } from 'hono';
import { cors } from 'hono/cors';
import authRoutes from './routes/auth';
import { companiesRouter, branchesRouter } from './routes/companies';
import { driversRouter, vehiclesRouter, customersRouter } from './routes/operations';
import { shipmentsRouter, pickupsRouter, podRouter } from './routes/shipments';
import { warehouseRouter } from './routes/warehouse';
import { billingRouter } from './routes/billing';
import {
  analyticsRouter,
  auditRouter,
  notificationsRouter,
  processAuditLog,
  processNotification,
} from './routes/analytics';
import {
  integrationsRouter,
  webhooksRouter,
  apiRouter,
  apiKeysRouter,
  workflowsRouter,
  supportRouter,
  processWebhookDelivery,
} from './routes/integrations';
import { trackingRouter } from './routes/tracking';
import { uploadsRouter } from './routes/uploads';
import { cmsRouter } from './routes/cms';
import { handleRazorpayWebhook } from './routes/billing';
import { OPENAPI_SPEC } from './openapi';
import { rateLimitMiddleware } from './middleware/auth';
import { createDb, seedDatabase, users } from '@chasehorse/database';
import type { Env } from './types';

export { TrackingRoom } from './durable-objects/tracking';

const app = new Hono<{ Bindings: Env }>();

let devSeedChecked = false;

app.use('*', async (c, next) => {
  if (!devSeedChecked && c.env.JWT_SECRET.startsWith('dev-')) {
    devSeedChecked = true;
    try {
      const db = createDb(c.env.DB);
      const existing = await db.select().from(users).limit(1).get();
      if (!existing) {
        await seedDatabase(c.env.DB);
        console.log('Dev database auto-seeded with demo users');
      }
    } catch (err) {
      console.error('Dev database seed check failed:', err);
    }
  }
  await next();
});

app.use(
  '*',
  cors({
    origin: (origin) => origin ?? '*',
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
    credentials: true,
  }),
);

app.use('/api/*', rateLimitMiddleware);

app.get('/health', (c) => c.json({ status: 'ok', service: 'chasehorse-api', version: '1.0.0' }));

app.get('/openapi.json', (c) => c.json(OPENAPI_SPEC));

app.post('/webhooks/razorpay', async (c) => {
  const body = await c.req.text();
  const signature = c.req.header('X-Razorpay-Signature');
  const result = await handleRazorpayWebhook(c.env, body, signature ?? null);
  return c.json(result);
});

app.post('/admin/seed', async (c) => {
  const isDev = c.env.JWT_SECRET.startsWith('dev-');
  if (!isDev) {
    const secret = c.req.header('X-Seed-Secret');
    if (!c.env.SEED_SECRET || secret !== c.env.SEED_SECRET) {
      return c.json({ success: false, error: 'Forbidden' }, 403);
    }
  }

  const db = createDb(c.env.DB);
  const existing = await db.select().from(users).limit(1).get();
  if (existing) {
    return c.json({ success: true, message: 'Database already seeded' });
  }

  await seedDatabase(c.env.DB);
  return c.json({ success: true, message: 'Database seeded' });
});

app.route('/api/auth', authRoutes);
app.route('/api/companies', companiesRouter);
app.route('/api/branches', branchesRouter);
app.route('/api/drivers', driversRouter);
app.route('/api/vehicles', vehiclesRouter);
app.route('/api/customers', customersRouter);
app.route('/api/shipments', shipmentsRouter);
app.route('/api/pickups', pickupsRouter);
app.route('/api/pod', podRouter);
app.route('/api/warehouses', warehouseRouter);
app.route('/api/billing', billingRouter);
app.route('/api/analytics', analyticsRouter);
app.route('/api/audit', auditRouter);
app.route('/api/notifications', notificationsRouter);
app.route('/api/integrations', integrationsRouter);
app.route('/api/webhooks', webhooksRouter);
app.route('/api', apiRouter);
app.route('/api/api-keys', apiKeysRouter);
app.route('/api/workflows', workflowsRouter);
app.route('/api/support', supportRouter);
app.route('/api/tracking', trackingRouter);
app.route('/api/uploads', uploadsRouter);
app.route('/api/cms', cmsRouter);
app.get('/api/files/:key{.+}', async (c) => {
  if (!c.env.STORAGE) return c.json({ success: false, error: 'Storage not configured' }, 503);
  const key = decodeURIComponent(c.req.param('key'));
  const object = await c.env.STORAGE.get(key);
  if (!object) return c.json({ success: false, error: 'Not found' }, 404);
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('Cache-Control', 'public, max-age=31536000');
  return new Response(object.body, { headers });
});

app.post('/graphql', async (c) => {
  const body = await c.req.json<{ query: string }>();
  if (body.query.includes('shipments')) {
    return c.json({
      data: {
        shipments: [{ id: '1', awbNumber: 'CHDEMO001', status: 'in_transit' }],
      },
    });
  }
  return c.json({ data: {} });
});

export default {
  fetch: app.fetch,
  async queue(batch: MessageBatch<Record<string, unknown>>, env: Env) {
    for (const message of batch.messages) {
      const data = message.body;
      const queueName = batch.queue;

      try {
        if (queueName.includes('notification')) {
          await processNotification(env, data);
        } else if (queueName.includes('webhook')) {
          await processWebhookDelivery(env, data);
        } else if (queueName.includes('audit')) {
          await processAuditLog(env, data);
        }
        message.ack();
      } catch (err) {
        console.error('Queue processing error:', err);
        message.retry();
      }
    }
  },
};
