import { Hono } from 'hono';
import { eq, desc } from 'drizzle-orm';
import { createDb, invoices, subscriptions } from '@chasehorse/database';
import { calculateShipmentPrice, generateInvoiceNumber } from '@chasehorse/core';
import { generateId } from '../lib/auth';
import { authMiddleware, requireRoles } from '../middleware/auth';
import { audit } from '../lib/audit-helper';
import { executeWorkflows } from './integrations';
import type { Env, Variables } from '../types';

async function createRazorpayOrder(
  env: Env,
  amount: number,
  receipt: string,
): Promise<{ id: string; amount: number } | null> {
  if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) return null;
  const auth = btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`);
  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount: Math.round(amount * 100), currency: 'INR', receipt }),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { id: string; amount: number };
  return data;
}

async function verifyRazorpaySignatureAsync(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string,
): Promise<boolean> {
  const body = `${orderId}|${paymentId}`;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
  const expected = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return expected === signature;
}

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
  const customerId = c.req.query('customerId');
  let items;
  if (customerId) {
    items = await db
      .select()
      .from(invoices)
      .where(eq(invoices.customerId, customerId))
      .orderBy(desc(invoices.createdAt))
      .all();
  } else {
    items = await db
      .select()
      .from(invoices)
      .where(eq(invoices.companyId, companyId!))
      .orderBy(desc(invoices.createdAt))
      .all();
  }
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

  const invoiceNumber = generateInvoiceNumber();

  await db.insert(invoices).values({
    id,
    companyId,
    shipmentId: body.shipmentId,
    customerId: body.customerId,
    invoiceNumber,
    lineItems: JSON.stringify(lineItems),
    subtotal: pricing.subtotal,
    gstAmount: pricing.gstAmount,
    total: pricing.total,
    paymentStatus: 'pending',
  });

  await c.env.NOTIFICATION_QUEUE?.send({
    event: 'invoice.generated',
    invoiceId: id,
    companyId,
    invoiceNumber,
    amount: pricing.total,
  });
  await audit(c, 'create', 'invoice', id);

  const invoice = await db.select().from(invoices).where(eq(invoices.id, id)).get();
  return c.json({ success: true, data: invoice }, 201);
});

billingRouter.post('/payments/razorpay/order', async (c) => {
  const { invoiceId, amount } = await c.req.json<{ invoiceId: string; amount: number }>();
  const db = createDb(c.env.DB);
  const invoice = await db.select().from(invoices).where(eq(invoices.id, invoiceId)).get();
  if (!invoice) return c.json({ success: false, error: 'Invoice not found' }, 404);

  const order = await createRazorpayOrder(c.env, amount || invoice.total, invoiceId);
  const orderId = order?.id ?? `order_${generateId().replace(/-/g, '').slice(0, 14)}`;

  await db.update(invoices).set({ razorpayOrderId: orderId }).where(eq(invoices.id, invoiceId));

  return c.json({
    success: true,
    data: {
      orderId,
      amount: (order?.amount ?? amount * 100),
      currency: 'INR',
      keyId: c.env.RAZORPAY_KEY_ID ?? 'rzp_test_placeholder',
    },
  });
});

billingRouter.post('/payments/razorpay/verify', async (c) => {
  const { invoiceId, paymentId, orderId, signature } = await c.req.json<{
    invoiceId: string;
    paymentId: string;
    orderId: string;
    signature: string;
  }>();
  const db = createDb(c.env.DB);

  if (c.env.RAZORPAY_KEY_SECRET && signature) {
    const valid = await verifyRazorpaySignatureAsync(
      orderId,
      paymentId,
      signature,
      c.env.RAZORPAY_KEY_SECRET,
    );
    if (!valid) return c.json({ success: false, error: 'Invalid payment signature' }, 400);
  }

  await db
    .update(invoices)
    .set({ paymentStatus: 'paid', updatedAt: new Date().toISOString() })
    .where(eq(invoices.id, invoiceId));

  const invoice = await db.select().from(invoices).where(eq(invoices.id, invoiceId)).get();
  if (invoice) {
    await executeWorkflows(c.env, 'payment.received', invoice.companyId, { invoiceId, paymentId });
  }
  await audit(c, 'payment', 'invoice', invoiceId, { paymentId });

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

export async function handleRazorpayWebhook(env: Env, body: string, signature: string | null) {
  if (env.RAZORPAY_WEBHOOK_SECRET && signature) {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(env.RAZORPAY_WEBHOOK_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    );
    const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
    const expected = Array.from(new Uint8Array(sig))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    if (expected !== signature) return { ok: false };
  }

  const payload = JSON.parse(body) as { event: string; payload?: { payment?: { entity?: { id: string; order_id: string } } } };
  if (payload.event === 'payment.captured') {
    const orderId = payload.payload?.payment?.entity?.order_id;
    if (orderId) {
      const db = createDb(env.DB);
      const invoice = await db.select().from(invoices).where(eq(invoices.razorpayOrderId, orderId)).get();
      if (invoice) {
        await db
          .update(invoices)
          .set({ paymentStatus: 'paid', updatedAt: new Date().toISOString() })
          .where(eq(invoices.id, invoice.id));
      }
    }
  }
  return { ok: true };
}
