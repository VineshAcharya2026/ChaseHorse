'use client';

import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader, EmptyState } from '@/components/dashboard/kpi-card';

export default function PortalInvoicesPage() {
  return (
    <AuthGuard allowedRoles={['customer']}>
      <div>
        <PageHeader title="Invoices" description="Download your shipment invoices" />
        <EmptyState title="No invoices" description="Your invoices will appear here." />
      </div>
    </AuthGuard>
  );
}
