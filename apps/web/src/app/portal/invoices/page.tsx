'use client';

import { useQuery } from '@tanstack/react-query';
import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader, DataTable } from '@/components/dashboard/kpi-card';
import { api, useAuthStore } from '@chasehorse/auth-client';

export default function PortalInvoicesPage() {
  return (
    <AuthGuard allowedRoles={['customer']}>
      <InvoicesContent />
    </AuthGuard>
  );
}

function InvoicesContent() {
  const { accessToken, user } = useAuthStore();
  api.setToken(accessToken);

  const { data, isLoading } = useQuery({
    queryKey: ['portal-invoices', user?.sub],
    queryFn: () =>
      api.get<{ success: boolean; data: Record<string, unknown>[] }>(
        `/api/billing/invoices?customerId=${encodeURIComponent(user!.sub)}`,
      ),
    enabled: !!user?.sub,
  });

  return (
    <div>
      <PageHeader title="Invoices" description="Download your shipment invoices" />
      {isLoading ? (
        <div className="h-32 animate-pulse rounded-xl bg-muted/40" />
      ) : (
        <DataTable
          columns={[
            { key: 'invoiceNumber', label: 'Invoice' },
            { key: 'subtotal', label: 'Subtotal' },
            { key: 'gstAmount', label: 'GST' },
            { key: 'total', label: 'Total' },
            { key: 'paymentStatus', label: 'Status' },
          ]}
          data={data?.data ?? []}
        />
      )}
    </div>
  );
}
