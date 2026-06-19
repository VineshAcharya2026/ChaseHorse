'use client';

import { useQuery } from '@tanstack/react-query';
import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader, DataTable } from '@/components/dashboard/kpi-card';
import { api, useAuthStore } from '@chasehorse/auth-client';
import { SHIPMENT_STATUS_LABELS } from '@chasehorse/shared';

export default function CompanyShipmentsPage() {
  const { accessToken } = useAuthStore();
  api.setToken(accessToken);

  const { data, isLoading } = useQuery({
    queryKey: ['shipments'],
    queryFn: () => api.get<{ success: boolean; data: Record<string, unknown>[] }>('/api/shipments'),
  });

  const rows = (data?.data ?? []).map((s) => ({
    ...s,
    status: SHIPMENT_STATUS_LABELS[s.status as string] ?? s.status,
  }));

  return (
    <AuthGuard allowedRoles={['company_admin']}>
      <div>
        <PageHeader title="Shipments" description="Manage all shipments" />
        {isLoading ? <div className="h-32 animate-pulse rounded-xl bg-white/5" /> : (
          <DataTable columns={[
            { key: 'awbNumber', label: 'AWB' }, { key: 'type', label: 'Type' },
            { key: 'status', label: 'Status' }, { key: 'weight', label: 'Weight (kg)' },
            { key: 'totalAmount', label: 'Amount' },
          ]} data={rows} />
        )}
      </div>
    </AuthGuard>
  );
}
