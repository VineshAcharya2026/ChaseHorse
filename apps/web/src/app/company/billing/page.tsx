'use client';

import { useQuery } from '@tanstack/react-query';
import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader, DataTable } from '@/components/dashboard/kpi-card';
import { api, useAuthStore } from '@chasehorse/auth-client';

export default function CompanyBillingPage() {
  const { accessToken } = useAuthStore();
  api.setToken(accessToken);

  const { data, isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => api.get<{ success: boolean; data: Record<string, unknown>[] }>('/api/billing/invoices'),
  });

  return (
    <AuthGuard allowedRoles={['company_admin']}>
      <div>
        <PageHeader title="Billing" description="Invoices and payments" />
        {isLoading ? <div className="h-32 animate-pulse rounded-xl bg-white/5" /> : (
          <DataTable columns={[
            { key: 'invoiceNumber', label: 'Invoice' }, { key: 'subtotal', label: 'Subtotal' },
            { key: 'gstAmount', label: 'GST' }, { key: 'total', label: 'Total' },
            { key: 'paymentStatus', label: 'Status' },
          ]} data={data?.data ?? []} />
        )}
      </div>
    </AuthGuard>
  );
}
