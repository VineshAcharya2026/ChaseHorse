import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { createDb, shipments, drivers } from '@chasehorse/database';
import { haversineDistance, estimateEtaMinutes } from '@chasehorse/core';
import { authMiddleware } from '../middleware/auth';
import type { Env, Variables } from '../types';

const trackingRouter = new Hono<{ Bindings: Env; Variables: Variables }>();

trackingRouter.post('/location', authMiddleware, async (c) => {
  const body = await c.req.json<{
    driverId: string;
    latitude: number;
    longitude: number;
    heading?: number;
    speed?: number;
    shipmentId?: string;
  }>();

  if (body.shipmentId) {
    const id = c.env.TRACKING.idFromName(body.shipmentId);
    const stub = c.env.TRACKING.get(id);
    await stub.fetch(
      new Request('http://internal/location', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    );
  }

  return c.json({ success: true, message: 'Location updated' });
});

trackingRouter.get('/shipment/:id', async (c) => {
  const shipmentId = c.req.param('id');
  const id = c.env.TRACKING.idFromName(shipmentId);
  const stub = c.env.TRACKING.get(id);
  const res = await stub.fetch(new Request('http://internal/status'));
  const data = await res.json();
  return c.json(data);
});

trackingRouter.post('/shipment/:id/init', authMiddleware, async (c) => {
  const shipmentId = c.req.param('id');
  const db = createDb(c.env.DB);

  const shipment = await db.select().from(shipments).where(eq(shipments.id, shipmentId)).get();
  if (!shipment || !shipment.driverId) {
    return c.json({ success: false, error: 'Shipment or driver not found' }, 404);
  }

  const receiver = JSON.parse(shipment.receiver) as { latitude?: number; longitude?: number };
  const driver = await db.select().from(drivers).where(eq(drivers.id, shipment.driverId)).get();

  const id = c.env.TRACKING.idFromName(shipmentId);
  const stub = c.env.TRACKING.get(id);

  await stub.fetch(
    new Request('http://internal/init', {
      method: 'POST',
      body: JSON.stringify({
        shipmentId,
        driverId: shipment.driverId,
        destinationLat: receiver.latitude ?? 12.9716,
        destinationLng: receiver.longitude ?? 77.5946,
        currentLat: 12.9352,
        currentLng: 77.6245,
        eta: 30,
        status: shipment.status,
        driverName: driver?.name,
      }),
    }),
  );

  return c.json({ success: true, message: 'Tracking initialized' });
});

trackingRouter.get('/shipment/:id/eta', async (c) => {
  const db = createDb(c.env.DB);
  const shipment = await db.select().from(shipments).where(eq(shipments.id, c.req.param('id'))).get();
  if (!shipment) return c.json({ success: false, error: 'Not found' }, 404);

  const receiver = JSON.parse(shipment.receiver) as { latitude?: number; longitude?: number };
  const distance = haversineDistance(12.9352, 77.6245, receiver.latitude ?? 12.9716, receiver.longitude ?? 77.5946);
  const eta = estimateEtaMinutes(distance);

  return c.json({ success: true, data: { distanceKm: Math.round(distance * 10) / 10, etaMinutes: eta } });
});

trackingRouter.get('/shipment/:id/ws', async (c) => {
  const shipmentId = c.req.param('id');
  const id = c.env.TRACKING.idFromName(shipmentId);
  const stub = c.env.TRACKING.get(id);
  return stub.fetch(new Request('http://internal/ws', { headers: c.req.raw.headers }));
});

export { trackingRouter };
