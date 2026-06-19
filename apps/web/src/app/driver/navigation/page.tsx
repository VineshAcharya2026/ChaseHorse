'use client';

import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader } from '@/components/dashboard/kpi-card';

export default function DriverNavigationPage() {
  return (
    <AuthGuard allowedRoles={['driver']}>
      <div>
        <PageHeader title="Navigation" description="Route to your next destination" />
        <div className="flex h-96 items-center justify-center rounded-xl border border-white/10 bg-white/5">
          <p className="text-muted-foreground">Map integration — Google Maps / Mapbox</p>
        </div>
      </div>
    </AuthGuard>
  );
}
