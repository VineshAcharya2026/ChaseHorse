'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { SHIPMENT_STATUS_LABELS } from '@chasehorse/shared';
import { Package, MapPin, Truck, Clock } from 'lucide-react';

interface TrackingData {
  shipment: {
    awbNumber: string;
    status: string;
    type: string;
    sender: Record<string, string>;
    receiver: Record<string, string>;
  };
  events: Array<{ status: string; notes: string; createdAt: string }>;
  driver: { name: string; phone: string } | null;
}

export default function TrackPage() {
  const params = useParams();
  const awb = params.id as string;
  const [data, setData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8787';
    fetch(`${apiUrl}/api/shipments/track/${awb}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setData(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [awb]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-pulse rounded-full bg-primary/20" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Package className="mx-auto h-12 w-12 text-muted-foreground" />
          <h1 className="mt-4 text-xl font-semibold">Shipment not found</h1>
          <p className="mt-2 text-muted-foreground">AWB: {awb}</p>
        </div>
      </div>
    );
  }

  const statusLabel = SHIPMENT_STATUS_LABELS[data.shipment.status] ?? data.shipment.status;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-white/10">
        <div className="mx-auto flex h-16 max-w-4xl items-center px-6">
          <span className="text-lg font-semibold">ChaseHorse Tracking</span>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-8">
          <p className="text-sm text-muted-foreground">AWB Number</p>
          <h1 className="text-2xl font-semibold">{data.shipment.awbNumber}</h1>
          <span className="mt-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
            {statusLabel}
          </span>
        </div>

        <div className="mb-8 flex h-64 items-center justify-center rounded-xl border border-white/10 bg-white/5">
          <p className="text-muted-foreground">Live map — driver location & route</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 p-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" /> From
            </div>
            <p className="mt-2 font-medium">{data.shipment.sender.name}</p>
            <p className="text-sm text-muted-foreground">
              {data.shipment.sender.addressLine1}, {data.shipment.sender.city}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 p-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" /> To
            </div>
            <p className="mt-2 font-medium">{data.shipment.receiver.name}</p>
            <p className="text-sm text-muted-foreground">
              {data.shipment.receiver.addressLine1}, {data.shipment.receiver.city}
            </p>
          </div>
        </div>

        {data.driver && (
          <div className="mt-6 rounded-xl border border-white/10 p-6">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">{data.driver.name}</p>
                <p className="text-sm text-muted-foreground">Delivery Executive</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8">
          <h2 className="mb-4 font-semibold">Delivery Timeline</h2>
          <div className="space-y-4">
            {data.events.map((event, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  {i < data.events.length - 1 && <div className="w-px flex-1 bg-white/10" />}
                </div>
                <div className="pb-4">
                  <p className="font-medium">{SHIPMENT_STATUS_LABELS[event.status] ?? event.status}</p>
                  {event.notes && <p className="text-sm text-muted-foreground">{event.notes}</p>}
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" /> {event.createdAt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
