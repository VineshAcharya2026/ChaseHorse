import { Hono } from 'hono';
import { eq, sql, desc } from 'drizzle-orm';
import {
  createDb,
  companies,
  drivers,
  shipments,
  auditLogs,
  notifications,
} from '@chasehorse/database';
import { generateId } from '../lib/auth';
import { authMiddleware, requireRoles } from '../middleware/auth';
import type { Env, Variables } from '../types';

const analyticsRouter = new Hono<{ Bindings: Env; Variables: Variables }>();
analyticsRouter.use('*', authMiddleware);

analyticsRouter.get('/super-admin', requireRoles('super_admin'), async (c) => {
  const db = createDb(c.env.DB);

  const [companyCount] = await db.select({ count: sql<number>`count(*)` }).from(companies).all();
  const [driverCount] = await db.select({ count: sql<number>`count(*)` }).from(drivers).all();
  const [shipmentCount] = await db.select({ count: sql<number>`count(*)` }).from(shipments).all();
  const [deliveredCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(shipments)
    .where(eq(shipments.status, 'delivered'))
    .all();

  const total = shipmentCount?.count ?? 0;
  const delivered = deliveredCount?.count ?? 0;
  const successRate = total > 0 ? Math.round((delivered / total) * 100) : 0;

  return c.json({
    success: true,
    data: {
      kpis: {
        revenue: 1250000,
        companies: companyCount?.count ?? 0,
        drivers: driverCount?.count ?? 0,
        deliveries: total,
        successRate,
      },
      revenueTrend: [
        { month: 'Jan', revenue: 85000 },
        { month: 'Feb', revenue: 92000 },
        { month: 'Mar', revenue: 105000 },
        { month: 'Apr', revenue: 118000 },
        { month: 'May', revenue: 125000 },
        { month: 'Jun', revenue: 135000 },
      ],
      deliveryTrend: [
        { month: 'Jan', deliveries: 1200 },
        { month: 'Feb', deliveries: 1350 },
        { month: 'Mar', deliveries: 1480 },
        { month: 'Apr', deliveries: 1620 },
        { month: 'May', deliveries: 1750 },
        { month: 'Jun', deliveries: 1890 },
      ],
    },
  });
});

analyticsRouter.get('/company', requireRoles('super_admin', 'company_admin', 'branch_manager'), async (c) => {
  const db = createDb(c.env.DB);
  const companyId = c.req.query('companyId') ?? c.get('companyId');

  const companyShipments = await db
    .select()
    .from(shipments)
    .where(eq(shipments.companyId, companyId!))
    .all();

  const delivered = companyShipments.filter((s) => s.status === 'delivered').length;
  const failed = companyShipments.filter((s) => s.status === 'failed_delivery').length;
  const companyDrivers = await db.select().from(drivers).where(eq(drivers.companyId, companyId!)).all();
  const onDuty = companyDrivers.filter((d) => d.status === 'on_duty').length;

  return c.json({
    success: true,
    data: {
      kpis: {
        dailyDeliveries: delivered,
        revenue: companyShipments.reduce((sum, s) => sum + (s.totalAmount ?? 0), 0),
        driverEfficiency: companyDrivers.length > 0 ? Math.round((onDuty / companyDrivers.length) * 100) : 0,
        failedDeliveries: failed,
      },
      deliveryTrend: [
        { day: 'Mon', count: 45 },
        { day: 'Tue', count: 52 },
        { day: 'Wed', count: 48 },
        { day: 'Thu', count: 61 },
        { day: 'Fri', count: 55 },
        { day: 'Sat', count: 38 },
        { day: 'Sun', count: 22 },
      ],
    },
  });
});

const auditRouter = new Hono<{ Bindings: Env; Variables: Variables }>();
auditRouter.use('*', authMiddleware, requireRoles('super_admin'));

auditRouter.get('/', async (c) => {
  const db = createDb(c.env.DB);
  const page = parseInt(c.req.query('page') ?? '1', 10);
  const pageSize = 50;
  const offset = (page - 1) * pageSize;

  const items = await db
    .select()
    .from(auditLogs)
    .orderBy(desc(auditLogs.createdAt))
    .limit(pageSize)
    .offset(offset)
    .all();

  return c.json({ success: true, data: { items, page, pageSize } });
});

export async function logAudit(
  env: Env,
  data: {
    actorId: string;
    companyId?: string;
    action: string;
    resource: string;
    resourceId?: string;
    ip?: string;
    metadata?: Record<string, unknown>;
  },
) {
  await env.AUDIT_QUEUE.send(data);
}

export async function processAuditLog(env: Env, data: Record<string, unknown>) {
  const db = createDb(env.DB);
  await db.insert(auditLogs).values({
    id: generateId(),
    actorId: data.actorId as string,
    companyId: data.companyId as string | undefined,
    action: data.action as string,
    resource: data.resource as string,
    resourceId: data.resourceId as string | undefined,
    ip: data.ip as string | undefined,
    metadata: data.metadata ? JSON.stringify(data.metadata) : null,
  });
}

const notificationsRouter = new Hono<{ Bindings: Env; Variables: Variables }>();
notificationsRouter.use('*', authMiddleware);

notificationsRouter.get('/', async (c) => {
  const db = createDb(c.env.DB);
  const userId = c.get('userId');
  const items = await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(20)
    .all();
  return c.json({ success: true, data: items });
});

export async function processNotification(env: Env, data: Record<string, unknown>) {
  const db = createDb(env.DB);
  await db.insert(notifications).values({
    id: generateId(),
    companyId: data.companyId as string | undefined,
    channel: 'email',
    event: data.event as string,
    recipient: 'system@chasehorse.com',
    body: JSON.stringify(data),
    status: 'sent',
    sentAt: new Date().toISOString(),
  });
}

export { analyticsRouter, auditRouter, notificationsRouter };
