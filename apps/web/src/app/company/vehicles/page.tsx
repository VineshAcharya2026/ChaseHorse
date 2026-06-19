'use client';

import { useQuery } from '@tanstack/react-query';
import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader, DataTable } from '@/components/dashboard/kpi-card';
import { api, useAuthStore } from '@chasehorse/auth-client';

export default function VehiclesPage() {
  const { accessToken } = useAuthStore();
  api.setToken(accessToken);

  const { data, isLoading } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => api.get<{ success: boolean; data: Record<string, unknown>[] }>('/api/vehicles'),
  });

  return (
    <AuthGuard allowedRoles={['company_admin']}>
      <div>
        <PageHeader title="Vehicles" description="Fleet management" />
        {isLoading ? <div className="h-32 animate-pulse rounded-xl bg-white/5" /> : (
          <DataTable columns={[
            { key: 'registrationNumber', label: 'Registration' },
            { key: 'type', label: 'Type' }, { key: 'model', label: 'Model' },
            { key: 'insuranceExpiry', label: 'Insurance Expiry' },
          ]} data={data?.data ?? []} />
        )}
      </div>
    </AuthGuard>
  );
}
