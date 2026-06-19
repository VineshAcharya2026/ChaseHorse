'use client';

import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader, EmptyState } from '@/components/dashboard/kpi-card';

export default function AdminCustomersPage() {
  return (
    <AuthGuard allowedRoles={['super_admin']}>
      <div>
        <PageHeader title="Customers" />
        <EmptyState title="Customers" description="Platform-wide customer list." />
      </div>
    </AuthGuard>
  );
}
