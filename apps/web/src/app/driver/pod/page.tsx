'use client';

import { useState } from 'react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader } from '@/components/dashboard/kpi-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function DriverPodPage() {
  const [method, setMethod] = useState<'otp' | 'signature' | 'photo'>('otp');
  const [otp, setOtp] = useState('');

  return (
    <AuthGuard allowedRoles={['driver']}>
      <div>
        <PageHeader title="Proof of Delivery" description="Confirm delivery completion" />
        <div className="mx-auto max-w-md space-y-6">
          <div className="flex gap-2">
            {(['otp', 'signature', 'photo'] as const).map((m) => (
              <Button key={m} variant={method === m ? 'default' : 'outline'} size="sm" onClick={() => setMethod(m)} className="capitalize">
                {m}
              </Button>
            ))}
          </div>
          {method === 'otp' && (
            <div className="space-y-2">
              <Label>Customer OTP</Label>
              <Input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 6-digit OTP" maxLength={6} />
            </div>
          )}
          {method === 'signature' && (
            <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-white/20">
              <p className="text-sm text-muted-foreground">Signature pad</p>
            </div>
          )}
          {method === 'photo' && (
            <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-white/20">
              <p className="text-sm text-muted-foreground">Take photo</p>
            </div>
          )}
          <Button className="w-full">Confirm Delivery</Button>
        </div>
      </div>
    </AuthGuard>
  );
}
