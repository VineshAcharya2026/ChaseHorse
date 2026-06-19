'use client';

import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader, EmptyState } from '@/components/dashboard/kpi-card';

export default function BranchDriversPage() {
  return (
    <AuthGuard allowedRoles={['branch_manager']}>
      <div>
        <PageHeader title="Drivers" description="Branch driver allocation" />
        <EmptyState title="Branch Drivers" description="Manage drivers assigned to this branch." />
      </div>
    </AuthGuard>
  );
}
