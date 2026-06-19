'use client';

import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader } from '@/components/dashboard/kpi-card';

export default function DriverProfilePage() {
  return (
    <AuthGuard allowedRoles={['driver']}>
      <div>
        <PageHeader title="Profile" description="Your driver profile and stats" />
        <div className="rounded-xl border border-white/10 p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div><p className="text-sm text-muted-foreground">Rating</p><p className="text-2xl font-semibold">4.8</p></div>
            <div><p className="text-sm text-muted-foreground">Total Deliveries</p><p className="text-2xl font-semibold">1,250</p></div>
            <div><p className="text-sm text-muted-foreground">Status</p><p className="text-2xl font-semibold text-primary">Active</p></div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
