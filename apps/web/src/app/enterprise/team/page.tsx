'use client';

import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader, EmptyState } from '@/components/dashboard/kpi-card';

export default function EnterpriseTeamPage() {
  return (
    <AuthGuard allowedRoles={['enterprise_user']}>
      <div>
        <PageHeader title="Team" description="Manage enterprise team access" />
        <EmptyState title="Team Members" description="Invite team members with role-based access." />
      </div>
    </AuthGuard>
  );
}
