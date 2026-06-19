'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader } from '@/components/dashboard/kpi-card';
import { api, useAuthStore } from '@chasehorse/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CompanySupportPage() {
  return (
    <AuthGuard allowedRoles={['company_admin']}>
      <SupportContent />
    </AuthGuard>
  );
}

function SupportContent() {
  const { accessToken } = useAuthStore();
  api.setToken(accessToken);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const { data, refetch } = useQuery({
    queryKey: ['support-tickets'],
    queryFn: () => api.get<{ success: boolean; data: Record<string, unknown>[] }>('/api/support/tickets'),
  });

  const handleSubmit = async () => {
    await api.post('/api/support/tickets', { subject, description, priority: 'medium' });
    setSubject('');
    setDescription('');
    refetch();
  };

  return (
    <div>
      <PageHeader title="Support Center" description="Tickets and chat support" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-white/10">
          <CardHeader><CardTitle>Create Ticket</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Subject</Label><Input value={subject} onChange={(e) => setSubject(e.target.value)} /></div>
            <div><Label>Description</Label><Input value={description} onChange={(e) => setDescription(e.target.value)} /></div>
            <Button onClick={handleSubmit}>Submit Ticket</Button>
          </CardContent>
        </Card>
        <div>
          <h3 className="mb-4 font-semibold">Your Tickets</h3>
          {(data?.data ?? []).map((ticket) => (
            <div key={ticket.id as string} className="mb-3 rounded-lg border border-white/10 p-4">
              <p className="font-medium">{ticket.subject as string}</p>
              <p className="text-sm text-muted-foreground">{ticket.status as string} · {ticket.priority as string}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
