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

export default function AdminCompaniesPage() {
  return (
    <AuthGuard allowedRoles={['super_admin']}>
      <CompaniesContent />
    </AuthGuard>
  );
}

function CompaniesContent() {
  const { accessToken } = useAuthStore();
  api.setToken(accessToken);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', city: '', state: '', phone: '', email: '', status: 'active' });
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const startEdit = async (id: string) => {
    setEditId(id);
    const res = await api.get<{ success: boolean; data: Record<string, unknown> }>(`/api/companies/${id}`);
    const c = res.data;
    setForm({
      name: String(c.name ?? ''),
      city: String(c.city ?? ''),
      state: String(c.state ?? ''),
      phone: String(c.phone ?? ''),
      email: String(c.email ?? ''),
      status: String(c.status ?? 'active'),
    });
  };

  const handleUpdate = async () => {
    if (!editId) return;
    setLoading(true);
    try {
      await api.put(`/api/companies/${editId}`, form);
      setEditId(null);
      setRefreshKey((k) => k + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Companies" description="Manage platform companies" />
      {editId && (
        <Card className="mb-6 border-border">
          <CardHeader><CardTitle>Edit Company</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>City</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
            <div><Label>State</Label><Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} /></div>
            <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div><Label>Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div><Label>Status</Label><Input value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} /></div>
            <div className="flex items-end gap-2">
              <Button onClick={handleUpdate} disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
              <Button variant="outline" onClick={() => setEditId(null)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}
      <CompaniesList refreshKey={refreshKey} onEdit={startEdit} />
    </div>
  );
}

function CompaniesList({ refreshKey, onEdit }: { refreshKey: number; onEdit: (id: string) => void }) {
  const { accessToken } = useAuthStore();
  api.setToken(accessToken);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-companies', refreshKey],
    queryFn: () => api.get<{ success: boolean; data: { items: Record<string, unknown>[] } }>('/api/companies'),
  });

  if (isLoading) return <div className="h-32 animate-pulse rounded-xl bg-muted/40" />;

  const items = data?.data?.items ?? [];

  return (
    <div>
      <DataTable columns={[
        { key: 'name', label: 'Name' },
        { key: 'status', label: 'Status' },
        { key: 'subscriptionTier', label: 'Plan' },
        { key: 'city', label: 'City' },
      ]} data={items} />
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((c) => (
          <Button key={String(c.id)} variant="outline" size="sm" onClick={() => onEdit(String(c.id))}>
            Edit {String(c.name)}
          </Button>
        ))}
      </div>
    </div>
  );
}
