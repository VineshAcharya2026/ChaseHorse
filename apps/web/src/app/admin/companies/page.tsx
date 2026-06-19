'use client';

import { useQuery } from '@tanstack/react-query';
import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader, DataTable } from '@/components/dashboard/kpi-card';
import { api, useAuthStore } from '@chasehorse/auth-client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function ListPage({ title, endpoint, columns }: { title: string; endpoint: string; columns: { key: string; label: string }[] }) {
  const { accessToken } = useAuthStore();
  api.setToken(accessToken);

  const { data, isLoading } = useQuery({
    queryKey: [endpoint],
    queryFn: () => api.get<{ success: boolean; data: { items?: Record<string, unknown>[] } | Record<string, unknown>[] }>(endpoint),
  });

  const items = Array.isArray(data?.data) ? data.data : (data?.data?.items ?? []);

  return (
    <div>
      <PageHeader title={title} />
      {isLoading ? (
        <div className="h-32 animate-pulse rounded-xl bg-white/5" />
      ) : (
        <DataTable columns={columns} data={items as Record<string, unknown>[]} />
      )}
    </div>
  );
}

export default function AdminCompaniesPage() {
  return (
    <AuthGuard allowedRoles={['super_admin']}>
      <div>
        <div className="mb-4 flex items-center justify-between">
          <PageHeader title="Companies" description="Manage platform companies" />
          <Button asChild><Link href="/admin/companies/new">Add Company</Link></Button>
        </div>
        <ListPage title="" endpoint="/api/companies" columns={[
          { key: 'name', label: 'Name' },
          { key: 'status', label: 'Status' },
          { key: 'subscriptionTier', label: 'Plan' },
          { key: 'city', label: 'City' },
        ]} />
      </div>
    </AuthGuard>
  );
}
