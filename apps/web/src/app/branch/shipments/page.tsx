'use client';

import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader, EmptyState } from '@/components/dashboard/kpi-card';

export default function BranchShipmentsPage() {
  return (
    <AuthGuard allowedRoles={['branch_manager']}>
      <div>
        <PageHeader title="Shipments" description="Branch shipment management" />
        <EmptyState title="Branch Shipments" description="Assign and track branch shipments." />
      </div>
    </AuthGuard>
  );
}
