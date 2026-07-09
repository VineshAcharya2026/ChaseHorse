'use client';

import { useQuery } from '@tanstack/react-query';
import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader, DataTable } from '@/components/dashboard/kpi-card';
import { api, useAuthStore } from '@chasehorse/auth-client';

export default function AdminWarehousesPage() {
  return (
    <AuthGuard allowedRoles={['super_admin']}>
      <WarehousesContent />
    </AuthGuard>
  );
}

function WarehousesContent() {
  const { accessToken } = useAuthStore();
  api.setToken(accessToken);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-warehouses'],
    queryFn: () => api.get<{ success: boolean; data: Record<string, unknown>[] }>('/api/warehouses'),
  });

  return (
    <div>
      <PageHeader title="Warehouses" description="Platform warehouse overview" />
      {isLoading ? (
        <div className="h-32 animate-pulse rounded-xl bg-muted/40" />
      ) : (
        <DataTable
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'address', label: 'Address' },
            { key: 'capacity', label: 'Capacity' },
            { key: 'currentCount', label: 'Current Count' },
          ]}
          data={data?.data ?? []}
        />
      )}
    </div>
  );
}
