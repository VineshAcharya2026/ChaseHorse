'use client';

import { useState } from 'react';
import { api } from '@chasehorse/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ShipmentFormProps {
  onSuccess?: () => void;
}

export function ShipmentForm({ onSuccess }: ShipmentFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    type: 'standard',
    weight: '1',
    senderName: '',
    senderAddress: '',
    senderCity: '',
    senderPhone: '',
    receiverName: '',
    receiverAddress: '',
    receiverCity: '',
    receiverPhone: '',
    description: '',
  });

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/api/shipments', {
        type: form.type,
        weight: parseFloat(form.weight),
        description: form.description,
        sender: {
          name: form.senderName,
          addressLine1: form.senderAddress,
          city: form.senderCity,
          phone: form.senderPhone,
        },
        receiver: {
          name: form.receiverName,
          addressLine1: form.receiverAddress,
          city: form.receiverCity,
          phone: form.receiverPhone,
        },
      });
      setForm({
        type: 'standard',
        weight: '1',
        senderName: '',
        senderAddress: '',
        senderCity: '',
        senderPhone: '',
        receiverName: '',
        receiverAddress: '',
        receiverCity: '',
        receiverPhone: '',
        description: '',
      });
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create shipment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Create Shipment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Service Type</Label>
              <Input value={form.type} onChange={(e) => update('type', e.target.value)} placeholder="standard" />
            </div>
            <div>
              <Label>Weight (kg)</Label>
              <Input type="number" step="0.1" value={form.weight} onChange={(e) => update('weight', e.target.value)} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-3">
              <p className="text-sm font-medium">Sender</p>
              <Input value={form.senderName} onChange={(e) => update('senderName', e.target.value)} placeholder="Name" required />
              <Input value={form.senderAddress} onChange={(e) => update('senderAddress', e.target.value)} placeholder="Address" required />
              <Input value={form.senderCity} onChange={(e) => update('senderCity', e.target.value)} placeholder="City" required />
              <Input value={form.senderPhone} onChange={(e) => update('senderPhone', e.target.value)} placeholder="Phone" />
            </div>
            <div className="space-y-3">
              <p className="text-sm font-medium">Receiver</p>
              <Input value={form.receiverName} onChange={(e) => update('receiverName', e.target.value)} placeholder="Name" required />
              <Input value={form.receiverAddress} onChange={(e) => update('receiverAddress', e.target.value)} placeholder="Address" required />
              <Input value={form.receiverCity} onChange={(e) => update('receiverCity', e.target.value)} placeholder="City" required />
              <Input value={form.receiverPhone} onChange={(e) => update('receiverPhone', e.target.value)} placeholder="Phone" />
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Input value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Package contents" />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Shipment'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
