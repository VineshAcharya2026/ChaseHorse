'use client';

import { useQuery } from '@tanstack/react-query';
import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader, DataTable } from '@/components/dashboard/kpi-card';
import { api, useAuthStore } from '@chasehorse/auth-client';

export default function AdminAuditPage() {
  return (
    <AuthGuard allowedRoles={['super_admin']}>
      <AuditContent />
    </AuthGuard>
  );
}

function AuditContent() {
  const { accessToken } = useAuthStore();
  api.setToken(accessToken);

  const { data, isLoading } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: () => api.get<{ success: boolean; data: { items: Record<string, unknown>[] } }>('/api/audit'),
  });

  return (
    <div>
      <PageHeader title="Audit Logs" description="Track every action on the platform" />
      {isLoading ? (
        <div className="h-32 animate-pulse rounded-xl bg-white/5" />
      ) : (
        <DataTable
          columns={[
            { key: 'action', label: 'Action' },
            { key: 'resource', label: 'Resource' },
            { key: 'actorId', label: 'Actor' },
            { key: 'ip', label: 'IP' },
            { key: 'createdAt', label: 'Time' },
          ]}
          data={data?.data?.items ?? []}
        />
      )}
    </div>
  );
}
