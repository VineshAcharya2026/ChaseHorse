'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader } from '@/components/dashboard/kpi-card';
import { Button } from '@/components/ui/button';
import { useDriverLocation } from '@/hooks/use-driver-location';
import { api, useAuthStore } from '@chasehorse/auth-client';
import { SHIPMENT_STATUS_LABELS } from '@chasehorse/shared';
import { Package, MapPin, Clock } from 'lucide-react';

export default function DriverDashboard() {
  return (
    <AuthGuard allowedRoles={['driver']}>
      <DriverContent />
    </AuthGuard>
  );
}

function DriverContent() {
  const { accessToken, user } = useAuthStore();
  api.setToken(accessToken);

  const { data: driversData } = useQuery({
    queryKey: ['drivers', user?.sub],
    queryFn: () => api.get<{ success: boolean; data: Record<string, unknown>[] }>('/api/drivers'),
  });

  const driver = (driversData?.data ?? []).find((d) => d.userId === user?.sub);
  const driverId = driver?.id as string | undefined;

  useDriverLocation({ driverId, enabled: !!driverId });

  const { data, isLoading } = useQuery({
    queryKey: ['driver-shipments', driverId],
    queryFn: () =>
      api.get<{ success: boolean; data: Record<string, unknown>[] }>(
        `/api/shipments?driverId=${encodeURIComponent(driverId!)}`,
      ),
    enabled: !!driverId,
  });

  const tasks = data?.data ?? [];

  return (
    <div>
      <PageHeader title="My Tasks" description="Today's pickups and deliveries" />
      {isLoading ? (
        <div className="h-32 animate-pulse rounded-xl bg-muted/40" />
      ) : tasks.length === 0 ? (
        <p className="text-sm text-muted-foreground">No assigned tasks.</p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => {
            const receiver = typeof task.receiver === 'string' ? JSON.parse(task.receiver) : task.receiver;
            const address = receiver?.addressLine1 ?? 'Address unavailable';
            const status = String(task.status ?? '');
            return (
              <div key={String(task.id)} className="rounded-xl border border-border p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-primary" />
                      <span className="font-medium">{String(task.awbNumber)}</span>
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                        {String(task.type)}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {address}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" /> {SHIPMENT_STATUS_LABELS[status] ?? status}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/driver/navigation?shipmentId=${task.id}`}>Navigate</Link>
                    </Button>
                    {status === 'out_for_delivery' && (
                      <Button size="sm" asChild>
                        <Link href={`/driver/pod?shipmentId=${task.id}`}>POD</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
