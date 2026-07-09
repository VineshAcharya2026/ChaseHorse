'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader, DataTable } from '@/components/dashboard/kpi-card';
import { api, useAuthStore } from '@chasehorse/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function VehiclesPage() {
  return (
    <AuthGuard allowedRoles={['company_admin']}>
      <VehiclesContent />
    </AuthGuard>
  );
}

function VehiclesContent() {
  const { accessToken } = useAuthStore();
  api.setToken(accessToken);
  const [form, setForm] = useState({ type: 'van', registrationNumber: '', model: '', insuranceExpiry: '' });
  const [loading, setLoading] = useState(false);

  const { data, refetch, isLoading } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => api.get<{ success: boolean; data: Record<string, unknown>[] }>('/api/vehicles'),
  });

  const handleCreate = async () => {
    setLoading(true);
    try {
      await api.post('/api/vehicles', form);
      setForm({ type: 'van', registrationNumber: '', model: '', insuranceExpiry: '' });
      refetch();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Vehicles" description="Fleet management" />
      <Card className="mb-6 border-border">
        <CardHeader><CardTitle>Add Vehicle</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div><Label>Type</Label><Input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="van" /></div>
          <div><Label>Registration</Label><Input value={form.registrationNumber} onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })} /></div>
          <div><Label>Model</Label><Input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} /></div>
          <div><Label>Insurance Expiry</Label><Input type="date" value={form.insuranceExpiry} onChange={(e) => setForm({ ...form, insuranceExpiry: e.target.value })} /></div>
          <div className="flex items-end"><Button onClick={handleCreate} disabled={loading}>{loading ? 'Adding...' : 'Add Vehicle'}</Button></div>
        </CardContent>
      </Card>
      {isLoading ? <div className="h-32 animate-pulse rounded-xl bg-muted/40" /> : (
        <DataTable columns={[
          { key: 'registrationNumber', label: 'Registration' },
          { key: 'type', label: 'Type' }, { key: 'model', label: 'Model' },
          { key: 'insuranceExpiry', label: 'Insurance Expiry' },
        ]} data={data?.data ?? []} />
      )}
    </div>
  );
}
