'use client';

import { useQuery } from '@tanstack/react-query';
import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader } from '@/components/dashboard/kpi-card';
import { api, useAuthStore } from '@chasehorse/auth-client';

export default function AdminIntegrationsPage() {
  return (
    <AuthGuard allowedRoles={['super_admin']}>
      <IntegrationsContent />
    </AuthGuard>
  );
}

function IntegrationsContent() {
  const { accessToken } = useAuthStore();
  api.setToken(accessToken);

  const { data } = useQuery({
    queryKey: ['integration-providers'],
    queryFn: () => api.get<{ success: boolean; data: Record<string, { name: string; category: string; description: string }> }>('/api/integrations/providers'),
  });

  const providers = data?.data ? Object.entries(data.data) : [];

  return (
    <div>
      <PageHeader title="Integrations" description="CRM, ERP, and e-commerce connectors" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {providers.map(([key, provider]) => (
          <div key={key} className="rounded-xl border border-white/10 p-6">
            <span className="text-xs uppercase text-primary">{provider.category}</span>
            <h3 className="mt-1 font-semibold">{provider.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{provider.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
