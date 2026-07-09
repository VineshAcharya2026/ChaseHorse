'use client';

import { useQuery } from '@tanstack/react-query';
import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader, DataTable } from '@/components/dashboard/kpi-card';
import { api, useAuthStore } from '@chasehorse/auth-client';
import { Button } from '@/components/ui/button';

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

  const handleExport = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8787';
    const res = await fetch(`${apiUrl}/api/audit/export`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audit-logs.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <PageHeader title="Audit Logs" description="Track every action on the platform" />
        <Button variant="outline" onClick={handleExport}>Export CSV</Button>
      </div>
      {isLoading ? (
        <div className="h-32 animate-pulse rounded-xl bg-muted/40" />
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
