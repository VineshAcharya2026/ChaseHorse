import { Hono } from 'hono';
import { eq, desc, sql, and, gte } from 'drizzle-orm';
import {
  createDb,
  companies,
  drivers,
  shipments,
  auditLogs,
  notifications,
  invoices,
  customers,
} from '@chasehorse/database';
import { generateId } from '../lib/auth';
import { authMiddleware, requireRoles } from '../middleware/auth';
import { dispatchNotification } from '../lib/notifications';
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
  const [revenueRow] = await db
    .select({ total: sql<number>`coalesce(sum(${invoices.total}), 0)` })
    .from(invoices)
    .where(eq(invoices.paymentStatus, 'paid'))
    .all();

  const total = shipmentCount?.count ?? 0;
  const delivered = deliveredCount?.count ?? 0;
  const successRate = total > 0 ? Math.round((delivered / total) * 100) : 0;

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyRevenue = await db
    .select({
      month: sql<string>`strftime('%Y-%m', ${invoices.createdAt})`,
      revenue: sql<number>`coalesce(sum(${invoices.total}), 0)`,
    })
    .from(invoices)
    .where(and(eq(invoices.paymentStatus, 'paid'), gte(invoices.createdAt, sixMonthsAgo.toISOString())))
    .groupBy(sql`strftime('%Y-%m', ${invoices.createdAt})`)
    .all();

  const revenueTrend = monthlyRevenue.map((r) => ({
    month: r.month,
    revenue: r.revenue ?? 0,
  }));

  return c.json({
    success: true,
    data: {
      kpis: {
        revenue: revenueRow?.total ?? 0,
        companies: companyCount?.count ?? 0,
        drivers: driverCount?.count ?? 0,
        deliveries: total,
        successRate,
      },
      revenueTrend,
      deliveryTrend: revenueTrend.map((r) => ({ month: r.month, deliveries: 0 })),
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
        { day: 'Mon', count: Math.round(delivered * 0.15) },
        { day: 'Tue', count: Math.round(delivered * 0.18) },
        { day: 'Wed', count: Math.round(delivered * 0.14) },
        { day: 'Thu', count: Math.round(delivered * 0.2) },
        { day: 'Fri', count: Math.round(delivered * 0.17) },
        { day: 'Sat', count: Math.round(delivered * 0.1) },
        { day: 'Sun', count: Math.round(delivered * 0.06) },
      ],
    },
  });
});

analyticsRouter.get('/export', requireRoles('super_admin', 'company_admin'), async (c) => {
  const db = createDb(c.env.DB);
  const companyId = c.req.query('companyId') ?? c.get('companyId');
  const type = c.req.query('type') ?? 'shipments';

  if (type === 'invoices') {
    const items = await db.select().from(invoices).where(eq(invoices.companyId, companyId!)).all();
    const csv = ['id,invoiceNumber,total,status', ...items.map((i) => `${i.id},${i.invoiceNumber},${i.total},${i.paymentStatus}`)].join('\n');
    return new Response(csv, { headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename=invoices.csv' } });
  }

  const items = await db.select().from(shipments).where(eq(shipments.companyId, companyId!)).all();
  const csv = ['id,awb,status,total', ...items.map((s) => `${s.id},${s.awbNumber},${s.status},${s.totalAmount}`)].join('\n');
  return new Response(csv, { headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename=shipments.csv' } });
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

auditRouter.get('/export', async (c) => {
  const db = createDb(c.env.DB);
  const items = await db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(1000).all();
  const csv = ['id,actorId,action,resource,resourceId,createdAt', ...items.map((i) => `${i.id},${i.actorId},${i.action},${i.resource},${i.resourceId ?? ''},${i.createdAt}`)].join('\n');
  return new Response(csv, { headers: { 'Content-Type': 'text/csv' } });
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
  if (env.AUDIT_QUEUE) {
    await env.AUDIT_QUEUE.send(data);
  } else {
    await processAuditLog(env, data as Record<string, unknown>);
  }
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
  const event = data.event as string;
  let email: string | undefined;
  let phone: string | undefined;

  if (data.phone) {
    phone = data.phone as string;
  } else if (data.shipmentId) {
    const shipment = await db.select().from(shipments).where(eq(shipments.id, data.shipmentId as string)).get();
    if (shipment?.customerId) {
      const customer = await db.select().from(customers).where(eq(customers.id, shipment.customerId)).get();
      email = customer?.email ?? undefined;
      phone = customer?.phone ?? undefined;
    }
  }

  const vars: Record<string, string> = {
    awb: String(data.awb ?? ''),
    otp: String(data.otp ?? ''),
    slot: String(data.slot ?? ''),
    trackUrl: `${env.FRONTEND_URL}/track?awb=${data.awb ?? ''}`,
    invoiceNumber: String(data.invoiceNumber ?? ''),
    amount: String(data.amount ?? ''),
  };

  if (email || phone) {
    await dispatchNotification(env, event, { email, phone }, vars);
  }

  await db.insert(notifications).values({
    id: generateId(),
    companyId: data.companyId as string | undefined,
    channel: phone ? 'sms' : 'email',
    event,
    recipient: email ?? phone ?? 'unknown',
    body: JSON.stringify(data),
    status: 'sent',
    sentAt: new Date().toISOString(),
  });
}

export { analyticsRouter, auditRouter, notificationsRouter };
