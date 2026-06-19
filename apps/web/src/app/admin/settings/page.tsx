'use client';

import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader, EmptyState } from '@/components/dashboard/kpi-card';

export default function AdminSettingsPage() {
  return (
    <AuthGuard allowedRoles={['super_admin']}>
      <div>
        <PageHeader title="Settings" description="Platform configuration" />
        <EmptyState title="System Settings" description="Configure global platform settings." />
      </div>
    </AuthGuard>
  );
}
