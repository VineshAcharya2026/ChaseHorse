'use client';

import { useState } from 'react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader } from '@/components/dashboard/kpi-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CustomerPortal() {
  return (
    <AuthGuard allowedRoles={['customer']}>
      <PortalContent />
    </AuthGuard>
  );
}

function PortalContent() {
  const [awb, setAwb] = useState('');

  return (
    <div>
      <PageHeader title="Book a Shipment" description="Schedule a pickup and delivery" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-white/10">
          <CardHeader><CardTitle>New Shipment</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label>Pickup Address</Label><Input placeholder="From address" /></div>
              <div><Label>Delivery Address</Label><Input placeholder="To address" /></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label>Weight (kg)</Label><Input type="number" placeholder="1.5" /></div>
              <div><Label>Service Type</Label><Input placeholder="Express" /></div>
            </div>
            <Button className="w-full">Book Shipment</Button>
          </CardContent>
        </Card>
        <Card className="border-white/10">
          <CardHeader><CardTitle>Quick Track</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>AWB Number</Label><Input value={awb} onChange={(e) => setAwb(e.target.value)} placeholder="Enter AWB number" /></div>
            <Button variant="outline" className="w-full" asChild>
              <a href={awb ? `/track/${awb}` : '#'}>Track Parcel</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
