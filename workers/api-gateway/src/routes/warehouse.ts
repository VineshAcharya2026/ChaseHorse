import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { createDb, warehouses, warehouseParcels, shipments } from '@chasehorse/database';
import { generateId } from '../lib/auth';
import { authMiddleware, requireRoles } from '../middleware/auth';
import type { Env, Variables } from '../types';

const warehouseRouter = new Hono<{ Bindings: Env; Variables: Variables }>();
warehouseRouter.use('*', authMiddleware);

warehouseRouter.get('/', async (c) => {
  const db = createDb(c.env.DB);
  const companyId = c.req.query('companyId') ?? c.get('companyId');
  const items = await db.select().from(warehouses).where(eq(warehouses.companyId, companyId!)).all();
  return c.json({ success: true, data: items });
});

warehouseRouter.post('/', requireRoles('super_admin', 'company_admin'), async (c) => {
  const body = await c.req.json();
  const db = createDb(c.env.DB);
  const id = generateId();
  const companyId = body.companyId ?? c.get('companyId');

  await db.insert(warehouses).values({
    id,
    companyId,
    branchId: body.branchId,
    name: body.name,
    address: body.address,
    capacity: body.capacity ?? 1000,
    currentCount: 0,
  });

  const warehouse = await db.select().from(warehouses).where(eq(warehouses.id, id)).get();
  return c.json({ success: true, data: warehouse }, 201);
});

warehouseRouter.get('/:id/dashboard', async (c) => {
  const db = createDb(c.env.DB);
  const warehouseId = c.req.param('id');
  const warehouse = await db.select().from(warehouses).where(eq(warehouses.id, warehouseId)).get();
  if (!warehouse) return c.json({ success: false, error: 'Not found' }, 404);

  const parcels = await db
    .select()
    .from(warehouseParcels)
    .where(eq(warehouseParcels.warehouseId, warehouseId))
    .all();

  return c.json({
    success: true,
    data: {
      warehouse,
      parcelCount: parcels.length,
      capacity: warehouse.capacity,
      utilization: Math.round((parcels.length / warehouse.capacity) * 100),
      delayedParcels: 0,
    },
  });
});

warehouseRouter.post('/:id/scan', requireRoles('branch_manager', 'company_admin'), async (c) => {
  const body = await c.req.json<{
    shipmentId: string;
    scanType: 'inbound' | 'sort' | 'outbound';
    shelfLocation?: string;
  }>();
  const db = createDb(c.env.DB);
  const warehouseId = c.req.param('id');

  await db.insert(warehouseParcels).values({
    id: generateId(),
    warehouseId,
    shipmentId: body.shipmentId,
    shelfLocation: body.shelfLocation,
    scanType: body.scanType,
    scannedBy: c.get('userId'),
  });

  if (body.scanType === 'inbound') {
    await db
      .update(shipments)
      .set({ status: 'warehouse', updatedAt: new Date().toISOString() })
      .where(eq(shipments.id, body.shipmentId));

    const warehouse = await db.select().from(warehouses).where(eq(warehouses.id, warehouseId)).get();
    if (warehouse) {
      await db
        .update(warehouses)
        .set({ currentCount: (warehouse.currentCount ?? 0) + 1, updatedAt: new Date().toISOString() })
        .where(eq(warehouses.id, warehouseId));
    }
  }

  if (body.scanType === 'outbound') {
    await db
      .update(shipments)
      .set({ status: 'in_transit', updatedAt: new Date().toISOString() })
      .where(eq(shipments.id, body.shipmentId));
  }

  return c.json({ success: true, message: `Scan ${body.scanType} recorded` });
});

export { warehouseRouter };
