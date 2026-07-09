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

export default function BranchesPage() {
  return (
    <AuthGuard allowedRoles={['company_admin']}>
      <BranchesContent />
    </AuthGuard>
  );
}

function BranchesContent() {
  const { accessToken } = useAuthStore();
  api.setToken(accessToken);
  const [form, setForm] = useState({ name: '', address: '', city: '', state: '', pincode: '', phone: '' });
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { data, refetch, isLoading } = useQuery({
    queryKey: ['branches'],
    queryFn: () => api.get<{ success: boolean; data: Record<string, unknown>[] }>('/api/branches'),
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/api/branches/${editId}`, form);
        setEditId(null);
      } else {
        await api.post('/api/branches', form);
      }
      setForm({ name: '', address: '', city: '', state: '', pincode: '', phone: '' });
      refetch();
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (branch: Record<string, unknown>) => {
    setEditId(String(branch.id));
    setForm({
      name: String(branch.name ?? ''),
      address: String(branch.address ?? ''),
      city: String(branch.city ?? ''),
      state: String(branch.state ?? ''),
      pincode: String(branch.pincode ?? ''),
      phone: String(branch.phone ?? ''),
    });
  };

  return (
    <div>
      <PageHeader title="Branches" />
      <Card className="mb-6 border-border">
        <CardHeader><CardTitle>{editId ? 'Edit Branch' : 'Add Branch'}</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><Label>Address</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
          <div><Label>City</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
          <div><Label>State</Label><Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} /></div>
          <div><Label>Pincode</Label><Input value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} /></div>
          <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div className="flex items-end gap-2">
            <Button onClick={handleSubmit} disabled={loading}>{loading ? 'Saving...' : editId ? 'Update' : 'Add Branch'}</Button>
            {editId && <Button variant="outline" onClick={() => { setEditId(null); setForm({ name: '', address: '', city: '', state: '', pincode: '', phone: '' }); }}>Cancel</Button>}
          </div>
        </CardContent>
      </Card>
      {isLoading ? <div className="h-32 animate-pulse rounded-xl bg-muted/40" /> : (
        <div className="space-y-2">
          <DataTable columns={[
            { key: 'name', label: 'Name' }, { key: 'city', label: 'City' },
            { key: 'state', label: 'State' }, { key: 'phone', label: 'Phone' },
          ]} data={data?.data ?? []} />
          <div className="flex flex-wrap gap-2">
            {(data?.data ?? []).map((b) => (
              <Button key={String(b.id)} variant="outline" size="sm" onClick={() => startEdit(b)}>
                Edit {String(b.name)}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
