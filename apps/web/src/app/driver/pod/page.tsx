'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader } from '@/components/dashboard/kpi-card';
import { SignaturePad } from '@/components/pod/signature-pad';
import { PhotoUpload } from '@/components/pod/photo-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api, useAuthStore } from '@chasehorse/auth-client';

export default function DriverPodPage() {
  return (
    <AuthGuard allowedRoles={['driver']}>
      <Suspense fallback={<div className="h-32 animate-pulse rounded-xl bg-muted/40" />}>
        <PodContent />
      </Suspense>
    </AuthGuard>
  );
}

function PodContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shipmentId = searchParams.get('shipmentId') ?? '';
  const { accessToken } = useAuthStore();
  api.setToken(accessToken);

  const [method, setMethod] = useState<'otp' | 'signature' | 'photo'>('otp');
  const [otp, setOtp] = useState('');
  const [signature, setSignature] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!shipmentId) {
      setError('Missing shipment ID');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/api/pod', {
        shipmentId,
        method,
        otp: method === 'otp' ? otp : undefined,
        signatureData: method === 'signature' ? signature : undefined,
        photoData: method === 'photo' ? photos[0] : undefined,
      });
      router.push('/driver');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit POD');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Proof of Delivery" description="Confirm delivery completion" />
      <div className="mx-auto max-w-md space-y-6">
        <div className="flex gap-2">
          {(['otp', 'signature', 'photo'] as const).map((m) => (
            <Button
              key={m}
              variant={method === m ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMethod(m)}
              className="capitalize"
            >
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
        {method === 'signature' && <SignaturePad onChange={setSignature} />}
        {method === 'photo' && <PhotoUpload onChange={setPhotos} />}
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button className="w-full" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Submitting...' : 'Confirm Delivery'}
        </Button>
      </div>
    </div>
  );
}
