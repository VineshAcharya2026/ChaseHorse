'use client';

import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader, EmptyState } from '@/components/dashboard/kpi-card';

export default function AdminBillingPage() {
  return (
    <AuthGuard allowedRoles={['super_admin']}>
      <div>
        <PageHeader title="Billing" description="Subscription and revenue management" />
        <EmptyState title="Billing" description="Manage company subscriptions and platform billing." />
      </div>
    </AuthGuard>
  );
}
