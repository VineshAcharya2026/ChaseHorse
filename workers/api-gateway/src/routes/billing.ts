import { Hono } from 'hono';
import { eq, desc } from 'drizzle-orm';
import { createDb, invoices, subscriptions } from '@chasehorse/database';
import { calculateShipmentPrice, generateInvoiceNumber } from '@chasehorse/core';
import { generateId } from '../lib/auth';
import { authMiddleware, requireRoles } from '../middleware/auth';
import type { Env, Variables } from '../types';

const billingRouter = new Hono<{ Bindings: Env; Variables: Variables }>();
billingRouter.use('*', authMiddleware);

billingRouter.post('/calculate', async (c) => {
  const { type, weight, distanceKm } = await c.req.json<{
    type: string;
    weight: number;
    distanceKm?: number;
  }>();
  const pricing = calculateShipmentPrice(type, weight, distanceKm);
  return c.json({ success: true, data: pricing });
});

billingRouter.get('/invoices', async (c) => {
  const db = createDb(c.env.DB);
  const companyId = c.req.query('companyId') ?? c.get('companyId');
  const items = await db
    .select()
    .from(invoices)
    .where(eq(invoices.companyId, companyId!))
    .orderBy(desc(invoices.createdAt))
    .all();
  return c.json({ success: true, data: items });
});

billingRouter.post('/invoices', requireRoles('super_admin', 'company_admin'), async (c) => {
  const body = await c.req.json();
  const db = createDb(c.env.DB);
  const id = generateId();
  const companyId = body.companyId ?? c.get('companyId');
  const pricing = calculateShipmentPrice(body.type ?? 'standard', body.weight ?? 1);

  const lineItems = [
    { description: 'Shipping charges', amount: pricing.subtotal },
    { description: 'GST (18%)', amount: pricing.gstAmount },
  ];

  await db.insert(invoices).values({
    id,
    companyId,
    shipmentId: body.shipmentId,
    customerId: body.customerId,
    invoiceNumber: generateInvoiceNumber(),
    lineItems: JSON.stringify(lineItems),
    subtotal: pricing.subtotal,
    gstAmount: pricing.gstAmount,
    total: pricing.total,
    paymentStatus: 'pending',
  });

  await c.env.NOTIFICATION_QUEUE.send({ event: 'invoice.generated', invoiceId: id, companyId });

  const invoice = await db.select().from(invoices).where(eq(invoices.id, id)).get();
  return c.json({ success: true, data: invoice }, 201);
});

billingRouter.post('/payments/razorpay/order', async (c) => {
  const { invoiceId, amount } = await c.req.json<{ invoiceId: string; amount: number }>();
  const orderId = `order_${generateId().replace(/-/g, '').slice(0, 14)}`;

  const db = createDb(c.env.DB);
  await db.update(invoices).set({ razorpayOrderId: orderId }).where(eq(invoices.id, invoiceId));

  return c.json({
    success: true,
    data: {
      orderId,
      amount: amount * 100,
      currency: 'INR',
      keyId: c.env.RAZORPAY_KEY_ID ?? 'rzp_test_placeholder',
    },
  });
});

billingRouter.post('/payments/razorpay/verify', async (c) => {
  const { invoiceId, paymentId } = await c.req.json<{ invoiceId: string; paymentId: string }>();
  const db = createDb(c.env.DB);
  await db
    .update(invoices)
    .set({ paymentStatus: 'paid', updatedAt: new Date().toISOString() })
    .where(eq(invoices.id, invoiceId));

  return c.json({ success: true, data: { paymentId, status: 'paid' } });
});

billingRouter.get('/subscriptions', requireRoles('super_admin', 'company_admin'), async (c) => {
  const db = createDb(c.env.DB);
  const companyId = c.req.query('companyId') ?? c.get('companyId');
  const items = await db.select().from(subscriptions).where(eq(subscriptions.companyId, companyId!)).all();
  return c.json({ success: true, data: items });
});

billingRouter.post('/subscriptions', requireRoles('super_admin'), async (c) => {
  const body = await c.req.json();
  const db = createDb(c.env.DB);
  const id = generateId();

  await db.insert(subscriptions).values({
    id,
    companyId: body.companyId,
    plan: body.plan,
    billingCycle: body.billingCycle ?? 'monthly',
    amount: body.amount,
    status: 'active',
    currentPeriodStart: new Date().toISOString(),
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  });

  const sub = await db.select().from(subscriptions).where(eq(subscriptions.id, id)).get();
  return c.json({ success: true, data: sub }, 201);
});

export { billingRouter };
