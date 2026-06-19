import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import {
  createDb,
  integrations,
  webhookSubscriptions,
  webhookDeliveries,
  apiKeys,
  workflows,
  supportTickets,
  supportMessages,
} from '@chasehorse/database';
import { CONNECTOR_METADATA } from '@chasehorse/integrations-sdk';
import { generateApiKey, hashToken, verifyWebhookSignature } from '@chasehorse/core';
import { generateId } from '../lib/auth';
import { authMiddleware, requireRoles } from '../middleware/auth';
import type { Env, Variables } from '../types';

const integrationsRouter = new Hono<{ Bindings: Env; Variables: Variables }>();
integrationsRouter.use('*', authMiddleware);

integrationsRouter.get('/providers', async (c) => {
  return c.json({ success: true, data: CONNECTOR_METADATA });
});

integrationsRouter.get('/', async (c) => {
  const db = createDb(c.env.DB);
  const companyId = c.req.query('companyId') ?? c.get('companyId');
  const items = await db.select().from(integrations).where(eq(integrations.companyId, companyId!)).all();
  return c.json({ success: true, data: items });
});

integrationsRouter.post('/', requireRoles('super_admin', 'company_admin'), async (c) => {
  const body = await c.req.json();
  const db = createDb(c.env.DB);
  const id = generateId();
  const companyId = body.companyId ?? c.get('companyId');

  await db.insert(integrations).values({
    id,
    companyId,
    provider: body.provider,
    status: 'pending',
    syncConfig: body.syncConfig ? JSON.stringify(body.syncConfig) : null,
  });

  const integration = await db.select().from(integrations).where(eq(integrations.id, id)).get();
  return c.json({ success: true, data: integration }, 201);
});

integrationsRouter.post('/:id/sync', requireRoles('super_admin', 'company_admin'), async (c) => {
  const db = createDb(c.env.DB);
  await db
    .update(integrations)
    .set({ lastSyncAt: new Date().toISOString(), status: 'active', updatedAt: new Date().toISOString() })
    .where(eq(integrations.id, c.req.param('id')));
  return c.json({ success: true, message: 'Sync initiated' });
});

const webhooksRouter = new Hono<{ Bindings: Env; Variables: Variables }>();
webhooksRouter.use('*', authMiddleware);

webhooksRouter.get('/', async (c) => {
  const db = createDb(c.env.DB);
  const companyId = c.req.query('companyId') ?? c.get('companyId');
  const items = await db
    .select()
    .from(webhookSubscriptions)
    .where(eq(webhookSubscriptions.companyId, companyId!))
    .all();
  return c.json({ success: true, data: items });
});

webhooksRouter.post('/', requireRoles('super_admin', 'company_admin', 'enterprise_user'), async (c) => {
  const body = await c.req.json();
  const db = createDb(c.env.DB);
  const id = generateId();
  const companyId = body.companyId ?? c.get('companyId');
  const secret = body.secret ?? crypto.randomUUID();

  await db.insert(webhookSubscriptions).values({
    id,
    companyId,
    url: body.url,
    secret,
    events: JSON.stringify(body.events),
    enabled: true,
  });

  const sub = await db.select().from(webhookSubscriptions).where(eq(webhookSubscriptions.id, id)).get();
  return c.json({ success: true, data: { ...sub, secret } }, 201);
});

export async function processWebhookDelivery(env: Env, data: Record<string, unknown>) {
  const db = createDb(env.DB);
  const companyId = data.companyId as string;
  const event = data.event as string;

  const subs = await db
    .select()
    .from(webhookSubscriptions)
    .where(eq(webhookSubscriptions.companyId, companyId))
    .all();

  for (const sub of subs) {
    const events = JSON.parse(sub.events) as string[];
    if (!events.includes(event) && !events.includes('*')) continue;

    const payload = JSON.stringify({ event, data, timestamp: new Date().toISOString() });
    const deliveryId = generateId();

    try {
      const signature = await createHmacSignature(payload, sub.secret);
      const res = await fetch(sub.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-ChaseHorse-Signature': signature,
          'X-ChaseHorse-Event': event,
        },
        body: payload,
      });

      await db.insert(webhookDeliveries).values({
        id: deliveryId,
        subscriptionId: sub.id,
        event,
        payload,
        status: res.ok ? 'delivered' : 'failed',
        attempts: 1,
        lastAttemptAt: new Date().toISOString(),
        responseCode: res.status,
      });
    } catch {
      await db.insert(webhookDeliveries).values({
        id: deliveryId,
        subscriptionId: sub.id,
        event,
        payload,
        status: 'failed',
        attempts: 1,
        lastAttemptAt: new Date().toISOString(),
      });
    }
  }
}

async function createHmacSignature(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

const apiRouter = new Hono<{ Bindings: Env; Variables: Variables }>();

apiRouter.use('/v1/*', async (c, next) => {
  const apiKey = c.req.header('X-API-Key');
  if (!apiKey) return c.json({ success: false, error: 'API key required' }, 401);

  const db = createDb(c.env.DB);
  const keyHash = await hashToken(apiKey);
  const keys = await db.select().from(apiKeys).all();
  const matched = keys.find((k) => k.keyHash === keyHash);

  if (!matched) return c.json({ success: false, error: 'Invalid API key' }, 401);

  c.set('companyId', matched.companyId);
  c.set('userRole', 'enterprise_user');
  await next();
});

apiRouter.get('/v1/shipments', async (c) => {
  const db = createDb(c.env.DB);
  const companyId = c.get('companyId');
  const { shipments: shipmentsTable } = await import('@chasehorse/database');
  const items = await db.select().from(shipmentsTable).where(eq(shipmentsTable.companyId, companyId!)).all();
  return c.json({ success: true, data: items });
});

const apiKeysRouter = new Hono<{ Bindings: Env; Variables: Variables }>();
apiKeysRouter.use('*', authMiddleware, requireRoles('super_admin', 'company_admin', 'enterprise_user'));

apiKeysRouter.get('/', async (c) => {
  const db = createDb(c.env.DB);
  const companyId = c.req.query('companyId') ?? c.get('companyId');
  const items = await db.select().from(apiKeys).where(eq(apiKeys.companyId, companyId!)).all();
  return c.json({
    success: true,
    data: items.map((k) => ({ ...k, keyHash: undefined })),
  });
});

apiKeysRouter.post('/', async (c) => {
  const body = await c.req.json();
  const db = createDb(c.env.DB);
  const id = generateId();
  const companyId = body.companyId ?? c.get('companyId');
  const { key, prefix } = generateApiKey();

  await db.insert(apiKeys).values({
    id,
    companyId,
    name: body.name,
    keyHash: await hashToken(key),
    keyPrefix: prefix,
    scopes: JSON.stringify(body.scopes ?? ['shipments:read', 'shipments:write']),
  });

  return c.json({ success: true, data: { id, key, prefix } }, 201);
});

const workflowsRouter = new Hono<{ Bindings: Env; Variables: Variables }>();
workflowsRouter.use('*', authMiddleware);

workflowsRouter.get('/', async (c) => {
  const db = createDb(c.env.DB);
  const companyId = c.req.query('companyId') ?? c.get('companyId');
  const items = await db.select().from(workflows).where(eq(workflows.companyId, companyId!)).all();
  return c.json({ success: true, data: items });
});

workflowsRouter.post('/', requireRoles('super_admin', 'company_admin'), async (c) => {
  const body = await c.req.json();
  const db = createDb(c.env.DB);
  const id = generateId();
  const companyId = body.companyId ?? c.get('companyId');

  await db.insert(workflows).values({
    id,
    companyId,
    name: body.name,
    trigger: body.trigger,
    steps: JSON.stringify(body.steps),
    enabled: body.enabled ?? true,
  });

  const workflow = await db.select().from(workflows).where(eq(workflows.id, id)).get();
  return c.json({ success: true, data: workflow }, 201);
});

workflowsRouter.put('/:id', requireRoles('super_admin', 'company_admin'), async (c) => {
  const body = await c.req.json();
  const db = createDb(c.env.DB);
  const updates: Record<string, unknown> = { ...body, updatedAt: new Date().toISOString() };
  if (body.steps) updates.steps = JSON.stringify(body.steps);
  await db.update(workflows).set(updates).where(eq(workflows.id, c.req.param('id')));
  const workflow = await db.select().from(workflows).where(eq(workflows.id, c.req.param('id'))).get();
  return c.json({ success: true, data: workflow });
});

export async function executeWorkflows(env: Env, event: string, companyId: string, context: Record<string, unknown>) {
  const db = createDb(env.DB);
  const activeWorkflows = await db
    .select()
    .from(workflows)
    .where(eq(workflows.companyId, companyId))
    .all();

  for (const workflow of activeWorkflows) {
    if (!workflow.enabled || workflow.trigger !== event) continue;
    const steps = JSON.parse(workflow.steps) as Array<{ action: string; config: Record<string, unknown> }>;
    for (const step of steps) {
      await env.NOTIFICATION_QUEUE.send({
        event: `workflow.${step.action}`,
        workflowId: workflow.id,
        config: step.config,
        context,
      });
    }
  }
}

const supportRouter = new Hono<{ Bindings: Env; Variables: Variables }>();
supportRouter.use('*', authMiddleware);

supportRouter.get('/tickets', async (c) => {
  const db = createDb(c.env.DB);
  const userId = c.get('userId');
  const role = c.get('userRole');

  let items;
  if (role === 'super_admin' || role === 'company_admin') {
    const companyId = c.req.query('companyId') ?? c.get('companyId');
    items = await db.select().from(supportTickets).where(eq(supportTickets.companyId, companyId!)).all();
  } else {
    items = await db.select().from(supportTickets).where(eq(supportTickets.userId, userId)).all();
  }
  return c.json({ success: true, data: items });
});

supportRouter.post('/tickets', async (c) => {
  const body = await c.req.json();
  const db = createDb(c.env.DB);
  const id = generateId();
  const userId = c.get('userId');

  await db.insert(supportTickets).values({
    id,
    companyId: c.get('companyId') ?? undefined,
    userId,
    subject: body.subject,
    description: body.description,
    category: body.category,
    priority: body.priority ?? 'medium',
    status: 'open',
  });

  const ticket = await db.select().from(supportTickets).where(eq(supportTickets.id, id)).get();
  return c.json({ success: true, data: ticket }, 201);
});

supportRouter.post('/tickets/:id/messages', async (c) => {
  const { message } = await c.req.json<{ message: string }>();
  const db = createDb(c.env.DB);
  const id = generateId();

  await db.insert(supportMessages).values({
    id,
    ticketId: c.req.param('id'),
    userId: c.get('userId'),
    message,
  });

  return c.json({ success: true, message: 'Message added' }, 201);
});

supportRouter.get('/tickets/:id/messages', async (c) => {
  const db = createDb(c.env.DB);
  const items = await db
    .select()
    .from(supportMessages)
    .where(eq(supportMessages.ticketId, c.req.param('id')))
    .all();
  return c.json({ success: true, data: items });
});

export {
  integrationsRouter,
  webhooksRouter,
  apiRouter,
  apiKeysRouter,
  workflowsRouter,
  supportRouter,
};
