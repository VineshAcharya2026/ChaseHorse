import { Hono } from 'hono';
import { eq, desc } from 'drizzle-orm';
import {
  createDb,
  shipments,
  shipmentEvents,
  pickups,
  proofOfDelivery,
  drivers,
} from '@chasehorse/database';
import { canTransitionShipment, calculateShipmentPrice, generateAwbNumber } from '@chasehorse/core';
import { generateId, hashPassword } from '../lib/auth';
import { authMiddleware, requireRoles } from '../middleware/auth';
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

  return c.json({
    success: true,
    data: {
      shipment: {
        awbNumber: shipment.awbNumber,
        status: shipment.status,
        type: shipment.type,
        sender: JSON.parse(shipment.sender),
        receiver: JSON.parse(shipment.receiver),
        estimatedDelivery: shipment.deliveredAt,
      },
      events,
      driver: driver ? { name: driver.name, phone: driver.phone } : null,
    },
  });
});

shipmentsRouter.use('*', authMiddleware);

shipmentsRouter.get('/', async (c) => {
  const db = createDb(c.env.DB);
  const companyId = c.req.query('companyId') ?? c.get('companyId');
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
  const pricing = calculateShipmentPrice(body.type, body.weight);

  await db.insert(shipments).values({
    id,
    awbNumber: generateAwbNumber(),
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

  await c.env.NOTIFICATION_QUEUE.send({
    event: 'shipment.created',
    shipmentId: id,
    companyId,
  });

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

  await c.env.WEBHOOK_QUEUE.send({ event: `shipment.${status}`, shipmentId, companyId: shipment.companyId });

  return c.json({ success: true, message: 'Status updated' });
});

shipmentsRouter.post('/:id/assign', requireRoles('super_admin', 'company_admin', 'branch_manager'), async (c) => {
  const { driverId } = await c.req.json<{ driverId: string }>();
  const db = createDb(c.env.DB);
  const shipmentId = c.req.param('id');

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

  await c.env.NOTIFICATION_QUEUE.send({ event: 'pickup.scheduled', pickupId: id, companyId });
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
  return c.json({ success: true, message: 'Pickup assigned' });
});

const podRouter = new Hono<{ Bindings: Env; Variables: Variables }>();
podRouter.use('*', authMiddleware);

podRouter.post('/', requireRoles('driver', 'branch_manager', 'company_admin'), async (c) => {
  const body = await c.req.json();
  const db = createDb(c.env.DB);
  const id = generateId();

  let otpHash = null;
  if (body.method === 'otp' && body.otp) {
    otpHash = await hashPassword(body.otp);
  }

  await db.insert(proofOfDelivery).values({
    id,
    shipmentId: body.shipmentId,
    method: body.method,
    otpHash,
    signatureUrl: body.signatureData,
    photoUrl: body.photoUrl,
    qrCode: body.qrCode,
    barcode: body.barcode,
    deliveredBy: c.get('userId'),
  });

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

  return c.json({ success: true, message: 'Delivery confirmed' }, 201);
});

export { shipmentsRouter, pickupsRouter, podRouter };
