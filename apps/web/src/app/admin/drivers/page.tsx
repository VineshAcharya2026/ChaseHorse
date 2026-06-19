'use client';

import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader, EmptyState } from '@/components/dashboard/kpi-card';

const pages = ['drivers', 'customers', 'shipments', 'warehouses', 'billing', 'integrations', 'settings'];

function GenericAdminPage({ title }: { title: string }) {
  return (
    <AuthGuard allowedRoles={['super_admin']}>
      <div>
        <PageHeader title={title} />
        <EmptyState title={`${title} module`} description="Connect API to load live data." />
      </div>
    </AuthGuard>
  );
}

export default function AdminDriversPage() {
  return <GenericAdminPage title="Drivers" />;
}
