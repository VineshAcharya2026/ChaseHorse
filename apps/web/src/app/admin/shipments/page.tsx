'use client';

import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader, EmptyState } from '@/components/dashboard/kpi-card';

export default function AdminShipmentsPage() {
  return (
    <AuthGuard allowedRoles={['super_admin']}>
      <div>
        <PageHeader title="Shipments" />
        <EmptyState title="All Shipments" description="Cross-tenant shipment overview." />
      </div>
    </AuthGuard>
  );
}
