'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader } from '@/components/dashboard/kpi-card';
import { api, useAuthStore } from '@chasehorse/auth-client';
import { WEBHOOK_EVENTS } from '@chasehorse/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function WebhooksPage() {
  return (
    <AuthGuard allowedRoles={['enterprise_user', 'company_admin']}>
      <WebhooksContent />
    </AuthGuard>
  );
}

function WebhooksContent() {
  const { accessToken } = useAuthStore();
  api.setToken(accessToken);
  const [url, setUrl] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>(['shipment.delivered']);
  const [newSecret, setNewSecret] = useState('');

  const { data, refetch } = useQuery({
    queryKey: ['webhooks'],
    queryFn: () => api.get<{ success: boolean; data: Record<string, unknown>[] }>('/api/webhooks'),
  });

  const toggleEvent = (event: string) => {
    setSelectedEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event],
    );
  };

  const handleCreate = async () => {
    const res = await api.post<{ success: boolean; data: { secret: string } }>('/api/webhooks', {
      url,
      events: selectedEvents,
    });
    setNewSecret(res.data.secret);
    setUrl('');
    refetch();
  };

  return (
    <div>
      <PageHeader title="Webhooks" description="Manage outbound event subscriptions" />
      <div className="mb-6 space-y-4 rounded-xl border border-border p-6">
        <div><Label>Endpoint URL</Label><Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/webhooks" /></div>
        <div>
          <Label>Events</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {WEBHOOK_EVENTS.map((event) => (
              <Button
                key={event}
                size="sm"
                variant={selectedEvents.includes(event) ? 'default' : 'outline'}
                onClick={() => toggleEvent(event)}
              >
                {event}
              </Button>
            ))}
          </div>
        </div>
        <Button onClick={handleCreate} disabled={!url}>Create Webhook</Button>
        {newSecret && (
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
            <p className="text-sm font-medium">Webhook secret (copy now):</p>
            <code className="mt-2 block text-sm">{newSecret}</code>
          </div>
        )}
      </div>
      {(data?.data ?? []).map((hook) => (
        <div key={hook.id as string} className="mb-3 rounded-lg border border-border p-4">
          <p className="font-medium">{hook.url as string}</p>
          <p className="text-sm text-muted-foreground">
            Events: {JSON.parse(String(hook.events ?? '[]')).join(', ')}
          </p>
          <p className="text-xs text-muted-foreground">
            {hook.enabled ? 'Enabled' : 'Disabled'}
          </p>
        </div>
      ))}
    </div>
  );
}
