'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader } from '@/components/dashboard/kpi-card';
import { api, useAuthStore } from '@chasehorse/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function BranchWarehousePage() {
  return (
    <AuthGuard allowedRoles={['branch_manager']}>
      <WarehouseContent />
    </AuthGuard>
  );
}

function WarehouseContent() {
  const { accessToken } = useAuthStore();
  api.setToken(accessToken);
  const [awb, setAwb] = useState('');
  const [message, setMessage] = useState('');

  const { data: warehousesData } = useQuery({
    queryKey: ['warehouses'],
    queryFn: () => api.get<{ success: boolean; data: Record<string, unknown>[] }>('/api/warehouses'),
  });

  const warehouseId = warehousesData?.data?.[0]?.id as string | undefined;

  const { data: dashboardData, refetch } = useQuery({
    queryKey: ['warehouse-dashboard', warehouseId],
    queryFn: () =>
      api.get<{ success: boolean; data: { parcelCount: number; utilization: number; delayedParcels: number } }>(
        `/api/warehouses/${warehouseId}/dashboard`,
      ),
    enabled: !!warehouseId,
  });

  const dashboard = dashboardData?.data;

  const handleScan = async (scanType: 'inbound' | 'sort' | 'outbound') => {
    if (!warehouseId || !awb.trim()) {
      setMessage('Enter AWB/shipment ID');
      return;
    }
    setMessage('');
    try {
      await api.post(`/api/warehouses/${warehouseId}/scan`, {
        shipmentId: awb.trim(),
        scanType,
      });
      setMessage(`${scanType} scan recorded`);
      setAwb('');
      refetch();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Scan failed');
    }
  };

  return (
    <div>
      <PageHeader title="Warehouse" description="Inbound, sorting, and outbound operations" />
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border p-6 text-center">
          <p className="text-3xl font-semibold">{dashboard?.parcelCount ?? '—'}</p>
          <p className="text-sm text-muted-foreground">Parcels in warehouse</p>
        </div>
        <div className="rounded-xl border border-border p-6 text-center">
          <p className="text-3xl font-semibold">{dashboard?.utilization != null ? `${dashboard.utilization}%` : '—'}</p>
          <p className="text-sm text-muted-foreground">Capacity utilized</p>
        </div>
        <div className="rounded-xl border border-border p-6 text-center">
          <p className="text-3xl font-semibold">{dashboard?.delayedParcels ?? '—'}</p>
          <p className="text-sm text-muted-foreground">Delayed parcels</p>
        </div>
      </div>
      <div className="mt-6 space-y-4">
        <div><Label>Scan AWB / Shipment ID</Label><Input value={awb} onChange={(e) => setAwb(e.target.value)} placeholder="Enter shipment ID or AWB" /></div>
        <div className="flex gap-4">
          <Button onClick={() => handleScan('inbound')}>Inbound Scan</Button>
          <Button variant="outline" onClick={() => handleScan('sort')}>Sort Parcels</Button>
          <Button variant="outline" onClick={() => handleScan('outbound')}>Outbound Scan</Button>
        </div>
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
      </div>
    </div>
  );
}
