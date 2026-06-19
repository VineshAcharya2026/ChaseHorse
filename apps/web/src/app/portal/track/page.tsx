'use client';

import { useState } from 'react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader } from '@/components/dashboard/kpi-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function PortalTrackPage() {
  const [awb, setAwb] = useState('');

  return (
    <AuthGuard allowedRoles={['customer']}>
      <div>
        <PageHeader title="Track Parcel" />
        <div className="mx-auto max-w-md space-y-4">
          <div><Label>AWB Number</Label><Input value={awb} onChange={(e) => setAwb(e.target.value)} /></div>
          <Button className="w-full" asChild><a href={awb ? `/track/${awb}` : '#'}>Track</a></Button>
        </div>
      </div>
    </AuthGuard>
  );
}
