'use client';

import { useQuery } from '@tanstack/react-query';
import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader, DataTable } from '@/components/dashboard/kpi-card';
import { api, useAuthStore } from '@chasehorse/auth-client';

function ResourceList({ title, endpoint, columns }: { title: string; endpoint: string; columns: { key: string; label: string }[] }) {
  const { accessToken } = useAuthStore();
  api.setToken(accessToken);

  const { data, isLoading } = useQuery({
    queryKey: [endpoint],
    queryFn: () => api.get<{ success: boolean; data: Record<string, unknown>[] }>(endpoint),
  });

  return (
    <AuthGuard allowedRoles={['company_admin']}>
      <div>
        <PageHeader title={title} />
        {isLoading ? (
          <div className="h-32 animate-pulse rounded-xl bg-white/5" />
        ) : (
          <DataTable columns={columns} data={data?.data ?? []} />
        )}
      </div>
    </AuthGuard>
  );
}

export default function BranchesPage() {
  return <ResourceList title="Branches" endpoint="/api/branches" columns={[
    { key: 'name', label: 'Name' }, { key: 'city', label: 'City' }, { key: 'state', label: 'State' }, { key: 'phone', label: 'Phone' },
  ]} />;
}
