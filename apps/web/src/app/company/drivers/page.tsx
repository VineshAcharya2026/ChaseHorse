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

export default function CompanyDriversPage() {
  return (
    <AuthGuard allowedRoles={['company_admin']}>
      <DriversContent />
    </AuthGuard>
  );
}

function DriversContent() {
  const { accessToken } = useAuthStore();
  api.setToken(accessToken);
  const [form, setForm] = useState({ name: '', email: '', phone: '', licenseNumber: '' });
  const [loading, setLoading] = useState(false);

  const { data, refetch, isLoading } = useQuery({
    queryKey: ['drivers'],
    queryFn: () => api.get<{ success: boolean; data: Record<string, unknown>[] }>('/api/drivers'),
  });

  const handleCreate = async () => {
    setLoading(true);
    try {
      await api.post('/api/drivers', form);
      setForm({ name: '', email: '', phone: '', licenseNumber: '' });
      refetch();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Drivers" description="Manage your delivery fleet" />
      <Card className="mb-6 border-border">
        <CardHeader><CardTitle>Add Driver</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><Label>Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div><Label>License</Label><Input value={form.licenseNumber} onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })} /></div>
          <div className="flex items-end"><Button onClick={handleCreate} disabled={loading}>{loading ? 'Adding...' : 'Add Driver'}</Button></div>
        </CardContent>
      </Card>
      {isLoading ? <div className="h-32 animate-pulse rounded-xl bg-muted/40" /> : (
        <DataTable columns={[
          { key: 'name', label: 'Name' }, { key: 'phone', label: 'Phone' },
          { key: 'status', label: 'Status' }, { key: 'rating', label: 'Rating' },
          { key: 'totalDeliveries', label: 'Deliveries' },
        ]} data={data?.data ?? []} />
      )}
    </div>
  );
}
