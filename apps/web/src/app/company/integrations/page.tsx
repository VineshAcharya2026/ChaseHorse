'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader } from '@/components/dashboard/kpi-card';
import { api, useAuthStore } from '@chasehorse/auth-client';
import { INTEGRATION_PROVIDERS } from '@chasehorse/shared';
import { Button } from '@/components/ui/button';

export default function CompanyIntegrationsPage() {
  return (
    <AuthGuard allowedRoles={['company_admin']}>
      <IntegrationsContent />
    </AuthGuard>
  );
}

function IntegrationsContent() {
  const { accessToken } = useAuthStore();
  api.setToken(accessToken);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const { data: connectedData, refetch } = useQuery({
    queryKey: ['integrations'],
    queryFn: () => api.get<{ success: boolean; data: Record<string, unknown>[] }>('/api/integrations'),
  });

  const connected = connectedData?.data ?? [];

  const handleConnect = async (provider: string) => {
    await api.post('/api/integrations', { provider });
    refetch();
  };

  const handleSync = async (id: string) => {
    setSyncingId(id);
    try {
      await api.post(`/api/integrations/${id}/sync`, {});
      refetch();
    } finally {
      setSyncingId(null);
    }
  };

  const isConnected = (provider: string) =>
    connected.some((c) => c.provider === provider);

  const getIntegration = (provider: string) =>
    connected.find((c) => c.provider === provider);

  return (
    <div>
      <PageHeader title="Integrations" description="Connect CRM, ERP, and e-commerce platforms" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {INTEGRATION_PROVIDERS.map((provider) => {
          const integration = getIntegration(provider);
          const connectedFlag = isConnected(provider);
          return (
            <div key={provider} className="rounded-xl border border-border p-6 transition-colors hover:border-primary/50">
              <h3 className="font-semibold capitalize">{provider.replace('_', ' ')}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {connectedFlag ? `Status: ${String(integration?.status ?? 'active')}` : 'Not connected'}
              </p>
              <div className="mt-4 flex gap-2">
                {!connectedFlag ? (
                  <Button size="sm" onClick={() => handleConnect(provider)}>Connect</Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSync(String(integration!.id))}
                    disabled={syncingId === String(integration!.id)}
                  >
                    {syncingId === String(integration!.id) ? 'Syncing...' : 'Sync Now'}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
