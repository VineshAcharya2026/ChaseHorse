'use client';

import { useQuery } from '@tanstack/react-query';
import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader, DataTable } from '@/components/dashboard/kpi-card';
import { api, useAuthStore } from '@chasehorse/auth-client';

export default function CompanyDriversPage() {
  const { accessToken } = useAuthStore();
  api.setToken(accessToken);

  const { data, isLoading } = useQuery({
    queryKey: ['drivers'],
    queryFn: () => api.get<{ success: boolean; data: Record<string, unknown>[] }>('/api/drivers'),
  });

  return (
    <AuthGuard allowedRoles={['company_admin']}>
      <div>
        <PageHeader title="Drivers" description="Manage your delivery fleet" />
        {isLoading ? <div className="h-32 animate-pulse rounded-xl bg-white/5" /> : (
          <DataTable columns={[
            { key: 'name', label: 'Name' }, { key: 'phone', label: 'Phone' },
            { key: 'status', label: 'Status' }, { key: 'rating', label: 'Rating' },
            { key: 'totalDeliveries', label: 'Deliveries' },
          ]} data={data?.data ?? []} />
        )}
      </div>
    </AuthGuard>
  );
}
