'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader } from '@/components/dashboard/kpi-card';
import { api, useAuthStore } from '@chasehorse/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ApiKeysPage() {
  return (
    <AuthGuard allowedRoles={['enterprise_user', 'company_admin']}>
      <ApiKeysContent />
    </AuthGuard>
  );
}

function ApiKeysContent() {
  const { accessToken } = useAuthStore();
  api.setToken(accessToken);
  const [name, setName] = useState('');
  const [newKey, setNewKey] = useState('');

  const { data, refetch } = useQuery({
    queryKey: ['api-keys'],
    queryFn: () => api.get<{ success: boolean; data: Record<string, unknown>[] }>('/api/api-keys'),
  });

  const handleCreate = async () => {
    const res = await api.post<{ success: boolean; data: { key: string } }>('/api/api-keys', { name });
    setNewKey(res.data.key);
    setName('');
    refetch();
  };

  return (
    <div>
      <PageHeader title="API Keys" description="Manage REST API access keys" />
      <div className="mb-6 flex gap-4">
        <div className="flex-1"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Production API Key" /></div>
        <Button className="mt-6" onClick={handleCreate}>Generate Key</Button>
      </div>
      {newKey && (
        <div className="mb-6 rounded-lg border border-primary/30 bg-primary/5 p-4">
          <p className="text-sm font-medium">New API Key (copy now — shown once):</p>
          <code className="mt-2 block text-sm">{newKey}</code>
        </div>
      )}
      {(data?.data ?? []).map((key) => (
        <div key={key.id as string} className="mb-2 rounded-lg border border-border p-4 flex justify-between">
          <div>
            <p className="font-medium">{key.name as string}</p>
            <p className="text-sm text-muted-foreground">{key.keyPrefix as string}...</p>
          </div>
          <p className="text-xs text-muted-foreground">{key.lastUsedAt ? `Last used: ${key.lastUsedAt}` : 'Never used'}</p>
        </div>
      ))}
    </div>
  );
}
