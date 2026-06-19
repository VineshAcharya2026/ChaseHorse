'use client';

import { useQuery } from '@tanstack/react-query';
import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader, DataTable } from '@/components/dashboard/kpi-card';
import { api, useAuthStore } from '@chasehorse/auth-client';

export default function CompanyCustomersPage() {
  const { accessToken } = useAuthStore();
  api.setToken(accessToken);

  const { data, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: () => api.get<{ success: boolean; data: Record<string, unknown>[] }>('/api/customers'),
  });

  return (
    <AuthGuard allowedRoles={['company_admin']}>
      <div>
        <PageHeader title="Customers" />
        {isLoading ? <div className="h-32 animate-pulse rounded-xl bg-white/5" /> : (
          <DataTable columns={[
            { key: 'name', label: 'Name' }, { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' }, { key: 'type', label: 'Type' },
          ]} data={data?.data ?? []} />
        )}
      </div>
    </AuthGuard>
  );
}
