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

export default function CompanyCustomersPage() {
  return (
    <AuthGuard allowedRoles={['company_admin']}>
      <CustomersContent />
    </AuthGuard>
  );
}

function CustomersContent() {
  const { accessToken } = useAuthStore();
  api.setToken(accessToken);
  const [form, setForm] = useState({ name: '', email: '', phone: '', type: 'individual' });
  const [loading, setLoading] = useState(false);

  const { data, refetch, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: () => api.get<{ success: boolean; data: Record<string, unknown>[] }>('/api/customers'),
  });

  const handleCreate = async () => {
    setLoading(true);
    try {
      await api.post('/api/customers', form);
      setForm({ name: '', email: '', phone: '', type: 'individual' });
      refetch();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Customers" />
      <Card className="mb-6 border-border">
        <CardHeader><CardTitle>Add Customer</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><Label>Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div className="flex items-end"><Button onClick={handleCreate} disabled={loading}>{loading ? 'Adding...' : 'Add Customer'}</Button></div>
        </CardContent>
      </Card>
      {isLoading ? <div className="h-32 animate-pulse rounded-xl bg-muted/40" /> : (
        <DataTable columns={[
          { key: 'name', label: 'Name' }, { key: 'email', label: 'Email' },
          { key: 'phone', label: 'Phone' }, { key: 'type', label: 'Type' },
        ]} data={data?.data ?? []} />
      )}
    </div>
  );
}
