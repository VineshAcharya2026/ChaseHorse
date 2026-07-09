'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader } from '@/components/dashboard/kpi-card';
import { LiveMap } from '@/components/maps/live-map';
import { useDriverLocation } from '@/hooks/use-driver-location';
import { api, useAuthStore } from '@chasehorse/auth-client';

export default function DriverNavigationPage() {
  return (
    <AuthGuard allowedRoles={['driver']}>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-muted/40" />}>
        <NavigationContent />
      </Suspense>
    </AuthGuard>
  );
}

function NavigationContent() {
  const searchParams = useSearchParams();
  const shipmentId = searchParams.get('shipmentId') ?? undefined;
  const { accessToken, user } = useAuthStore();
  api.setToken(accessToken);

  const { data: driversData } = useQuery({
    queryKey: ['drivers', user?.sub],
    queryFn: () => api.get<{ success: boolean; data: Record<string, unknown>[] }>('/api/drivers'),
  });

  const driver = (driversData?.data ?? []).find((d) => d.userId === user?.sub);
  const driverId = driver?.id as string | undefined;

  const { location } = useDriverLocation({ driverId, shipmentId, enabled: !!driverId });

  const lat = location?.latitude ?? 12.9716;
  const lng = location?.longitude ?? 77.5946;

  return (
    <div>
      <PageHeader title="Navigation" description="Route to your next destination" />
      <LiveMap latitude={lat} longitude={lng} className="h-96 w-full" label="Driver location" />
      {location && (
        <p className="mt-2 text-sm text-muted-foreground">
          Location updating every 30s · {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
        </p>
      )}
    </div>
  );
}
