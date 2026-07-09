'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader, DataTable } from '@/components/dashboard/kpi-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api, useAuthStore } from '@chasehorse/auth-client';
import { SHIPMENT_STATUS_LABELS } from '@chasehorse/shared';

export default function CustomerPortal() {
  return (
    <AuthGuard allowedRoles={['customer']}>
      <PortalContent />
    </AuthGuard>
  );
}

function PortalContent() {
  const { accessToken, user } = useAuthStore();
  api.setToken(accessToken);
  const [awb, setAwb] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    pickupAddress: '',
    deliveryAddress: '',
    pickupCity: '',
    deliveryCity: '',
    weight: '1',
    serviceType: 'standard',
    scheduledAt: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
  });

  const { data: historyData, refetch } = useQuery({
    queryKey: ['portal-shipments', user?.sub],
    queryFn: () =>
      api.get<{ success: boolean; data: Record<string, unknown>[] }>(
        `/api/shipments?customerId=${encodeURIComponent(user!.sub)}`,
      ),
    enabled: !!user?.sub,
  });

  const history = (historyData?.data ?? []).map((s) => ({
    ...s,
    status: SHIPMENT_STATUS_LABELS[s.status as string] ?? s.status,
  }));

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleBook = async () => {
    setLoading(true);
    setMessage('');
    try {
      const shipmentRes = await api.post<{ success: boolean; data: { id: string } }>('/api/shipments', {
        type: form.serviceType,
        weight: parseFloat(form.weight),
        customerId: user?.sub,
        sender: {
          name: user?.email ?? 'Customer',
          addressLine1: form.pickupAddress,
          city: form.pickupCity,
        },
        receiver: {
          name: 'Recipient',
          addressLine1: form.deliveryAddress,
          city: form.deliveryCity,
        },
      });

      await api.post('/api/pickups', {
        shipmentId: shipmentRes.data.id,
        scheduledAt: new Date(form.scheduledAt).toISOString(),
        address: {
          addressLine1: form.pickupAddress,
          city: form.pickupCity,
        },
      });

      setMessage('Shipment booked successfully!');
      refetch();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Book a Shipment" description="Schedule a pickup and delivery" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border">
          <CardHeader><CardTitle>New Shipment</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label>Pickup Address</Label><Input value={form.pickupAddress} onChange={(e) => update('pickupAddress', e.target.value)} placeholder="From address" /></div>
              <div><Label>Delivery Address</Label><Input value={form.deliveryAddress} onChange={(e) => update('deliveryAddress', e.target.value)} placeholder="To address" /></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label>Pickup City</Label><Input value={form.pickupCity} onChange={(e) => update('pickupCity', e.target.value)} placeholder="City" /></div>
              <div><Label>Delivery City</Label><Input value={form.deliveryCity} onChange={(e) => update('deliveryCity', e.target.value)} placeholder="City" /></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label>Weight (kg)</Label><Input type="number" value={form.weight} onChange={(e) => update('weight', e.target.value)} placeholder="1.5" /></div>
              <div><Label>Service Type</Label><Input value={form.serviceType} onChange={(e) => update('serviceType', e.target.value)} placeholder="Express" /></div>
            </div>
            <div><Label>Pickup Schedule</Label><Input type="datetime-local" value={form.scheduledAt} onChange={(e) => update('scheduledAt', e.target.value)} /></div>
            <Button className="w-full" onClick={handleBook} disabled={loading}>
              {loading ? 'Booking...' : 'Book Shipment'}
            </Button>
            {message && <p className="text-sm text-muted-foreground">{message}</p>}
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader><CardTitle>Quick Track</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>AWB Number</Label><Input value={awb} onChange={(e) => setAwb(e.target.value)} placeholder="Enter AWB number" /></div>
            <Button variant="outline" className="w-full" asChild>
              <a href={awb ? `/track?awb=${encodeURIComponent(awb)}` : '#'}>Track Parcel</a>
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">Shipment History</h2>
        <DataTable
          columns={[
            { key: 'awbNumber', label: 'AWB' },
            { key: 'type', label: 'Type' },
            { key: 'status', label: 'Status' },
            { key: 'totalAmount', label: 'Amount' },
          ]}
          data={history}
        />
      </div>
    </div>
  );
}
