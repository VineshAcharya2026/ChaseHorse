import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { createDb, drivers, vehicles, customers } from '@chasehorse/database';
import { generateId } from '../lib/auth';
import { authMiddleware, requireRoles } from '../middleware/auth';
import { audit } from '../lib/audit-helper';
import type { Env, Variables } from '../types';

const driversRouter = new Hono<{ Bindings: Env; Variables: Variables }>();
driversRouter.use('*', authMiddleware);

driversRouter.get('/', async (c) => {
  const db = createDb(c.env.DB);
  const companyId = c.req.query('companyId') ?? c.get('companyId');
  if (!companyId) return c.json({ success: false, error: 'companyId required' }, 400);

  const items = await db.select().from(drivers).where(eq(drivers.companyId, companyId)).all();
  return c.json({ success: true, data: items });
});

driversRouter.get('/:id', async (c) => {
  const db = createDb(c.env.DB);
  const driver = await db.select().from(drivers).where(eq(drivers.id, c.req.param('id'))).get();
  if (!driver) return c.json({ success: false, error: 'Not found' }, 404);
  return c.json({ success: true, data: driver });
});

driversRouter.post('/', requireRoles('super_admin', 'company_admin', 'branch_manager'), async (c) => {
  const body = await c.req.json();
  const db = createDb(c.env.DB);
  const id = generateId();
  const companyId = body.companyId ?? c.get('companyId');

  await db.insert(drivers).values({
    id,
    companyId,
    branchId: body.branchId,
    name: body.name,
    email: body.email,
    phone: body.phone,
    licenseNumber: body.licenseNumber,
    vehicleId: body.vehicleId,
    status: 'offline',
  });

  const driver = await db.select().from(drivers).where(eq(drivers.id, id)).get();
  await audit(c, 'create', 'driver', id);
  return c.json({ success: true, data: driver }, 201);
});

driversRouter.put('/:id', requireRoles('super_admin', 'company_admin', 'branch_manager'), async (c) => {
  const body = await c.req.json();
  const db = createDb(c.env.DB);
  await db.update(drivers).set({ ...body, updatedAt: new Date().toISOString() }).where(eq(drivers.id, c.req.param('id')));
  const driver = await db.select().from(drivers).where(eq(drivers.id, c.req.param('id'))).get();
  return c.json({ success: true, data: driver });
});

driversRouter.patch('/:id/status', async (c) => {
  const { status } = await c.req.json<{ status: string }>();
  const db = createDb(c.env.DB);
  await db.update(drivers).set({ status, updatedAt: new Date().toISOString() }).where(eq(drivers.id, c.req.param('id')));
  return c.json({ success: true, message: 'Status updated' });
});

const vehiclesRouter = new Hono<{ Bindings: Env; Variables: Variables }>();
vehiclesRouter.use('*', authMiddleware);

vehiclesRouter.get('/', async (c) => {
  const db = createDb(c.env.DB);
  const companyId = c.req.query('companyId') ?? c.get('companyId');
  if (!companyId) return c.json({ success: false, error: 'companyId required' }, 400);
  const items = await db.select().from(vehicles).where(eq(vehicles.companyId, companyId)).all();
  return c.json({ success: true, data: items });
});

vehiclesRouter.post('/', requireRoles('super_admin', 'company_admin'), async (c) => {
  const body = await c.req.json();
  const db = createDb(c.env.DB);
  const id = generateId();
  const companyId = body.companyId ?? c.get('companyId');

  await db.insert(vehicles).values({
    id,
    companyId,
    branchId: body.branchId,
    type: body.type,
    registrationNumber: body.registrationNumber,
    model: body.model,
    insuranceExpiry: body.insuranceExpiry,
    gpsDeviceId: body.gpsDeviceId,
  });

  const vehicle = await db.select().from(vehicles).where(eq(vehicles.id, id)).get();
  return c.json({ success: true, data: vehicle }, 201);
});

vehiclesRouter.put('/:id', requireRoles('super_admin', 'company_admin'), async (c) => {
  const body = await c.req.json();
  const db = createDb(c.env.DB);
  await db.update(vehicles).set({ ...body, updatedAt: new Date().toISOString() }).where(eq(vehicles.id, c.req.param('id')));
  const vehicle = await db.select().from(vehicles).where(eq(vehicles.id, c.req.param('id'))).get();
  return c.json({ success: true, data: vehicle });
});

const customersRouter = new Hono<{ Bindings: Env; Variables: Variables }>();
customersRouter.use('*', authMiddleware);

customersRouter.get('/', async (c) => {
  const db = createDb(c.env.DB);
  const companyId = c.req.query('companyId') ?? c.get('companyId');
  if (!companyId) return c.json({ success: false, error: 'companyId required' }, 400);
  const items = await db.select().from(customers).where(eq(customers.companyId, companyId)).all();
  return c.json({ success: true, data: items });
});

customersRouter.post('/', requireRoles('super_admin', 'company_admin', 'branch_manager'), async (c) => {
  const body = await c.req.json();
  const db = createDb(c.env.DB);
  const id = generateId();
  const companyId = body.companyId ?? c.get('companyId');

  await db.insert(customers).values({
    id,
    companyId,
    name: body.name,
    email: body.email,
    phone: body.phone,
    type: body.type ?? 'individual',
    addressBook: body.addressBook ? JSON.stringify(body.addressBook) : null,
  });

  const customer = await db.select().from(customers).where(eq(customers.id, id)).get();
  return c.json({ success: true, data: customer }, 201);
});

customersRouter.put('/:id', async (c) => {
  const body = await c.req.json();
  const db = createDb(c.env.DB);
  const updates = { ...body, updatedAt: new Date().toISOString() };
  if (body.addressBook) updates.addressBook = JSON.stringify(body.addressBook);
  await db.update(customers).set(updates).where(eq(customers.id, c.req.param('id')));
  const customer = await db.select().from(customers).where(eq(customers.id, c.req.param('id'))).get();
  return c.json({ success: true, data: customer });
});

export { driversRouter, vehiclesRouter, customersRouter };
