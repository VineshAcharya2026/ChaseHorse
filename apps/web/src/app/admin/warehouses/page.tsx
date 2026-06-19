'use client';

import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader, EmptyState } from '@/components/dashboard/kpi-card';

export default function AdminWarehousesPage() {
  return (
    <AuthGuard allowedRoles={['super_admin']}>
      <div>
        <PageHeader title="Warehouses" />
        <EmptyState title="Warehouses" description="Platform warehouse overview." />
      </div>
    </AuthGuard>
  );
}
