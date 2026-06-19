import { DurableObject } from 'cloudflare:workers';
import { eq } from 'drizzle-orm';
import { createDb, driverLocations, drivers } from '@chasehorse/database';
import { haversineDistance, estimateEtaMinutes } from '@chasehorse/core';

interface LocationUpdate {
  driverId: string;
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
}

interface TrackingState {
  shipmentId: string;
  driverId: string;
  destinationLat: number;
  destinationLng: number;
  currentLat: number;
  currentLng: number;
  eta: number;
  status: string;
}

export class TrackingRoom extends DurableObject {
  private sessions: Set<WebSocket> = new Set();
  private state: TrackingState | null = null;

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/ws') {
      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);
      this.handleSession(server);
      return new Response(null, { status: 101, webSocket: client });
    }

    if (request.method === 'POST' && url.pathname === '/location') {
      const update = (await request.json()) as LocationUpdate;
      await this.updateLocation(update);
      return Response.json({ success: true });
    }

    if (request.method === 'GET' && url.pathname === '/status') {
      return Response.json({ success: true, data: this.state });
    }

    if (request.method === 'POST' && url.pathname === '/init') {
      this.state = (await request.json()) as TrackingState;
      return Response.json({ success: true });
    }

    return new Response('Not found', { status: 404 });
  }

  private handleSession(ws: WebSocket) {
    ws.accept();
    this.sessions.add(ws);

    if (this.state) {
      ws.send(JSON.stringify({ type: 'state', data: this.state }));
    }

    ws.addEventListener('close', () => this.sessions.delete(ws));
    ws.addEventListener('message', async (event) => {
      try {
        const data = JSON.parse(event.data as string) as LocationUpdate;
        await this.updateLocation(data);
      } catch {
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid message' }));
      }
    });
  }

  private async updateLocation(update: LocationUpdate) {
    const env = this.env as { DB: D1Database };
    const db = createDb(env.DB);

    await db.insert(driverLocations).values({
      id: crypto.randomUUID(),
      driverId: update.driverId,
      latitude: update.latitude,
      longitude: update.longitude,
      heading: update.heading,
      speed: update.speed,
    });

    if (this.state) {
      this.state.currentLat = update.latitude;
      this.state.currentLng = update.longitude;
      const distance = haversineDistance(
        update.latitude,
        update.longitude,
        this.state.destinationLat,
        this.state.destinationLng,
      );
      this.state.eta = estimateEtaMinutes(distance);
    }

    const message = JSON.stringify({
      type: 'location',
      data: { ...update, state: this.state },
    });

    for (const session of this.sessions) {
      try {
        session.send(message);
      } catch {
        this.sessions.delete(session);
      }
    }
  }
}
