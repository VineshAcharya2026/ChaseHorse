import { Hono } from 'hono';
import { eq, desc, and } from 'drizzle-orm';
import {
  createDb,
  shipments,
  shipmentEvents,
  pickups,
  proofOfDelivery,
  drivers,
  customers,
} from '@chasehorse/database';
import {
  canTransitionShipment,
  calculateShipmentPrice,
  generateAwbNumber,
  validatePickupSlot,
  slotLabelForDate,
} from '@chasehorse/core';
import { generateId, hashPassword } from '../lib/auth';
import { authMiddleware, requireRoles } from '../middleware/auth';
import { enforceTenant } from '../lib/tenant-access';
import { audit } from '../lib/audit-helper';
import { uploadBase64Image } from '../lib/storage';
import { executeWorkflows } from './integrations';
import type { Env, Variables } from '../types';
import type { ShipmentStatus } from '@chasehorse/shared';

const shipmentsRouter = new Hono<{ Bindings: Env; Variables: Variables }>();

shipmentsRouter.get('/track/:awb', async (c) => {
  const db = createDb(c.env.DB);
  const shipment = await db
    .select()
    .from(shipments)
    .where(eq(shipments.awbNumber, c.req.param('awb')))
    .get();

  if (!shipment) return c.json({ success: false, error: 'Shipment not found' }, 404);

  const events = await db
    .select()
    .from(shipmentEvents)
    .where(eq(shipmentEvents.shipmentId, shipment.id))
    .orderBy(desc(shipmentEvents.createdAt))
    .all();

  let driver = null;
  if (shipment.driverId) {
    driver = await db.select().from(drivers).where(eq(drivers.id, shipment.driverId)).get();
  }

  const pod = await db
    .select()
    .from(proofOfDelivery)
    .where(eq(proofOfDelivery.shipmentId, shipment.id))
    .get();

  return c.json({
    success: true,
    data: {
      shipment: {
        id: shipment.id,
        awbNumber: shipment.awbNumber,
        status: shipment.status,
        type: shipment.type,
        sender: JSON.parse(shipment.sender),
        receiver: JSON.parse(shipment.receiver),
        estimatedDelivery: shipment.deliveredAt,
      },
      events,
      driver: driver ? { name: driver.name, phone: driver.phone } : null,
      pod: pod
        ? { method: pod.method, signatureUrl: pod.signatureUrl, photoUrl: pod.photoUrl }
        : null,
    },
  });
});

shipmentsRouter.use('*', authMiddleware);

shipmentsRouter.get('/', async (c) => {
  const db = createDb(c.env.DB);
  const companyId = c.req.query('companyId') ?? c.get('companyId');
  const driverId = c.req.query('driverId');
  const customerId = c.req.query('customerId');

  if (driverId) {
    const items = await db
      .select()
      .from(shipments)
      .where(eq(shipments.driverId, driverId))
      .orderBy(desc(shipments.createdAt))
      .limit(50)
      .all();
    return c.json({ success: true, data: items });
  }

  if (customerId && companyId) {
    const items = await db
      .select()
      .from(shipments)
      .where(and(eq(shipments.companyId, companyId), eq(shipments.customerId, customerId)))
      .orderBy(desc(shipments.createdAt))
      .limit(50)
      .all();
    return c.json({ success: true, data: items });
  }

  if (!companyId) return c.json({ success: false, error: 'companyId required' }, 400);

  const items = await db
    .select()
    .from(shipments)
    .where(eq(shipments.companyId, companyId))
    .orderBy(desc(shipments.createdAt))
    .limit(50)
    .all();

  return c.json({ success: true, data: items });
});

shipmentsRouter.get('/:id', async (c) => {
  const db = createDb(c.env.DB);
  const shipment = await db.select().from(shipments).where(eq(shipments.id, c.req.param('id'))).get();
  if (!shipment) return c.json({ success: false, error: 'Not found' }, 404);

  try {
    enforceTenant(c, shipment.companyId, shipment.branchId);
  } catch {
    return c.json({ success: false, error: 'Forbidden' }, 403);
  }

  const events = await db
    .select()
    .from(shipmentEvents)
    .where(eq(shipmentEvents.shipmentId, shipment.id))
    .orderBy(desc(shipmentEvents.createdAt))
    .all();

  return c.json({ success: true, data: { ...shipment, events } });
});

shipmentsRouter.post('/', async (c) => {
  const body = await c.req.json();
  const db = createDb(c.env.DB);
  const id = generateId();
  const companyId = body.companyId ?? c.get('companyId');
  if (!companyId) return c.json({ success: false, error: 'companyId required' }, 400);

  const pricing = calculateShipmentPrice(body.type, body.weight);
  const awbPrefix = c.env.AWB_PREFIX ?? 'CH';

  await db.insert(shipments).values({
    id,
    awbNumber: generateAwbNumber(awbPrefix),
    companyId,
    branchId: body.branchId,
    customerId: body.customerId,
    type: body.type,
    status: 'created',
    sender: JSON.stringify(body.sender),
    receiver: JSON.stringify(body.receiver),
    weight: body.weight,
    length: body.length,
    width: body.width,
    height: body.height,
    description: body.description,
    price: pricing.subtotal,
    gstAmount: pricing.gstAmount,
    totalAmount: pricing.total,
  });

  await db.insert(shipmentEvents).values({
    id: generateId(),
    shipmentId: id,
    status: 'created',
    actorId: c.get('userId'),
    notes: 'Shipment created',
  });

  await c.env.NOTIFICATION_QUEUE?.send({
    event: 'shipment.created',
    shipmentId: id,
    companyId,
    awb: (await db.select().from(shipments).where(eq(shipments.id, id)).get())?.awbNumber,
  });
  await c.env.WEBHOOK_QUEUE?.send({ event: 'shipment.created', shipmentId: id, companyId });
  await executeWorkflows(c.env, 'shipment.created', companyId, { shipmentId: id });
  await audit(c, 'create', 'shipment', id);

  const shipment = await db.select().from(shipments).where(eq(shipments.id, id)).get();
  return c.json({ success: true, data: shipment }, 201);
});

shipmentsRouter.patch('/:id/status', async (c) => {
  const { status, notes, latitude, longitude } = await c.req.json<{
    status: ShipmentStatus;
    notes?: string;
    latitude?: number;
    longitude?: number;
  }>();
  const db = createDb(c.env.DB);
  const shipmentId = c.req.param('id');

  const shipment = await db.select().from(shipments).where(eq(shipments.id, shipmentId)).get();
  if (!shipment) return c.json({ success: false, error: 'Not found' }, 404);

  if (!canTransitionShipment(shipment.status as ShipmentStatus, status)) {
    return c.json({ success: false, error: `Cannot transition from ${shipment.status} to ${status}` }, 400);
  }

  const updates: Record<string, unknown> = { status, updatedAt: new Date().toISOString() };
  if (status === 'assigned') updates.assignedAt = new Date().toISOString();
  if (status === 'picked_up') updates.pickedUpAt = new Date().toISOString();
  if (status === 'delivered') updates.deliveredAt = new Date().toISOString();

  await db.update(shipments).set(updates).where(eq(shipments.id, shipmentId));

  await db.insert(shipmentEvents).values({
    id: generateId(),
    shipmentId,
    status,
    actorId: c.get('userId'),
    notes,
    latitude,
    longitude,
  });

  await c.env.WEBHOOK_QUEUE?.send({ event: `shipment.${status}`, shipmentId, companyId: shipment.companyId });
  await c.env.NOTIFICATION_QUEUE?.send({
    event: `shipment.${status}`,
    shipmentId,
    companyId: shipment.companyId,
    awb: shipment.awbNumber,
  });
  await executeWorkflows(c.env, `shipment.${status}`, shipment.companyId, { shipmentId, status });
  await audit(c, 'update_status', 'shipment', shipmentId, { status });

  return c.json({ success: true, message: 'Status updated' });
});

shipmentsRouter.post('/:id/assign', requireRoles('super_admin', 'company_admin', 'branch_manager'), async (c) => {
  const { driverId } = await c.req.json<{ driverId: string }>();
  const db = createDb(c.env.DB);
  const shipmentId = c.req.param('id');

  const shipment = await db.select().from(shipments).where(eq(shipments.id, shipmentId)).get();
  if (!shipment) return c.json({ success: false, error: 'Not found' }, 404);

  if (!canTransitionShipment(shipment.status as ShipmentStatus, 'assigned')) {
    return c.json({ success: false, error: 'Cannot assign shipment in current status' }, 400);
  }

  await db
    .update(shipments)
    .set({ driverId, status: 'assigned', assignedAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    .where(eq(shipments.id, shipmentId));

  await db.insert(shipmentEvents).values({
    id: generateId(),
    shipmentId,
    status: 'assigned',
    actorId: c.get('userId'),
    notes: `Assigned to driver ${driverId}`,
  });

  const stub = c.env.TRACKING.get(c.env.TRACKING.idFromName(shipmentId));
  await stub.fetch(new Request('https://internal/init', { method: 'POST' }));

  await audit(c, 'assign', 'shipment', shipmentId, { driverId });
  return c.json({ success: true, message: 'Driver assigned' });
});

const pickupsRouter = new Hono<{ Bindings: Env; Variables: Variables }>();
pickupsRouter.use('*', authMiddleware);

pickupsRouter.get('/', async (c) => {
  const db = createDb(c.env.DB);
  const companyId = c.req.query('companyId') ?? c.get('companyId');
  const items = await db.select().from(pickups).where(eq(pickups.companyId, companyId!)).all();
  return c.json({ success: true, data: items });
});

pickupsRouter.post('/', async (c) => {
  const body = await c.req.json();
  const db = createDb(c.env.DB);
  const id = generateId();
  const companyId = body.companyId ?? c.get('companyId');

  const slotCheck = validatePickupSlot(body.scheduledAt);
  if (!slotCheck.valid) return c.json({ success: false, error: slotCheck.error }, 400);

  await db.insert(pickups).values({
    id,
    companyId,
    branchId: body.branchId,
    shipmentId: body.shipmentId,
    status: 'requested',
    scheduledAt: body.scheduledAt,
    address: JSON.stringify(body.address),
    instant: body.instant ?? false,
  });

  await c.env.NOTIFICATION_QUEUE?.send({
    event: 'pickup.scheduled',
    pickupId: id,
    companyId,
    slot: slotLabelForDate(body.scheduledAt),
  });
  await audit(c, 'create', 'pickup', id);

  const pickup = await db.select().from(pickups).where(eq(pickups.id, id)).get();
  return c.json({ success: true, data: pickup }, 201);
});

pickupsRouter.patch('/:id/assign', requireRoles('super_admin', 'company_admin', 'branch_manager'), async (c) => {
  const { driverId } = await c.req.json<{ driverId: string }>();
  const db = createDb(c.env.DB);
  await db
    .update(pickups)
    .set({ driverId, status: 'assigned', updatedAt: new Date().toISOString() })
    .where(eq(pickups.id, c.req.param('id')));
  await audit(c, 'assign', 'pickup', c.req.param('id'), { driverId });
  return c.json({ success: true, message: 'Pickup assigned' });
});

const podRouter = new Hono<{ Bindings: Env; Variables: Variables }>();
podRouter.use('*', authMiddleware);

podRouter.post('/', requireRoles('driver', 'branch_manager', 'company_admin'), async (c) => {
  const body = await c.req.json();
  const db = createDb(c.env.DB);
  const id = generateId();

  const shipment = await db.select().from(shipments).where(eq(shipments.id, body.shipmentId)).get();
  if (!shipment) return c.json({ success: false, error: 'Shipment not found' }, 404);

  let signatureUrl = body.signatureData;
  let photoUrl = body.photoUrl;

  if (body.signatureData?.startsWith('data:')) {
    const key = `pod/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${shipment.awbNumber}-sig.png`;
    await uploadBase64Image(c.env.STORAGE, key, body.signatureData);
    signatureUrl = key;
  }
  if (body.photoData?.startsWith('data:')) {
    const key = `pod/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${shipment.awbNumber}-photo.png`;
    await uploadBase64Image(c.env.STORAGE, key, body.photoData);
    photoUrl = key;
  }

  let otpHash = null;
  if (body.method === 'otp' && body.otp) {
    otpHash = await hashPassword(body.otp);
  }

  await db.insert(proofOfDelivery).values({
    id,
    shipmentId: body.shipmentId,
    method: body.method,
    otpHash,
    signatureUrl,
    photoUrl,
    qrCode: body.qrCode,
    barcode: body.barcode,
    deliveredBy: c.get('userId'),
  });

  if (canTransitionShipment(shipment.status as ShipmentStatus, 'delivered')) {
    await db
      .update(shipments)
      .set({ status: 'delivered', deliveredAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
      .where(eq(shipments.id, body.shipmentId));

    await db.insert(shipmentEvents).values({
      id: generateId(),
      shipmentId: body.shipmentId,
      status: 'delivered',
      actorId: c.get('userId'),
      notes: `POD via ${body.method}`,
    });

    await c.env.WEBHOOK_QUEUE?.send({
      event: 'shipment.delivered',
      shipmentId: body.shipmentId,
      companyId: shipment.companyId,
    });
    await c.env.NOTIFICATION_QUEUE?.send({
      event: 'shipment.delivered',
      shipmentId: body.shipmentId,
      companyId: shipment.companyId,
      awb: shipment.awbNumber,
    });
  }

  await audit(c, 'create', 'pod', id, { shipmentId: body.shipmentId });
  return c.json({ success: true, message: 'Delivery confirmed' }, 201);
});

export { shipmentsRouter, pickupsRouter, podRouter };
