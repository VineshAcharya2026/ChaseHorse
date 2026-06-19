'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@chasehorse/shared';
import { login, api, useAuthStore } from '@chasehorse/auth-client';
import { ROLE_ROUTES } from '@chasehorse/core';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { APP_NAME, APP_TAGLINE } from '@chasehorse/shared';
import type { UserRole } from '@chasehorse/shared';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'email' | 'otp'>('email');

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    setError('');
    try {
      const result = await login(data.email, data.password);
      api.setToken(result.accessToken);
      setAuth(result.user, result.accessToken);
      const route = ROLE_ROUTES[result.user.role as UserRole] ?? '/portal';
      router.push(route);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-semibold tracking-tight">{APP_NAME}</Link>
          <p className="mt-2 text-sm text-muted-foreground">{APP_TAGLINE}</p>
        </div>

        <Card className="border-white/10">
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
            <CardDescription>Enter your credentials to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex gap-2">
              <Button variant={mode === 'email' ? 'default' : 'outline'} size="sm" onClick={() => setMode('email')}>
                Email
              </Button>
              <Button variant={mode === 'otp' ? 'default' : 'outline'} size="sm" onClick={() => setMode('otp')}>
                Mobile OTP
              </Button>
            </div>

            {mode === 'email' ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@company.com" {...register('email')} />
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" {...register('password')} />
                  {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign in'}
                </Button>
              </form>
            ) : (
              <OtpLogin onSuccess={(user, token) => {
                api.setToken(token);
                setAuth({ ...user, role: user.role as UserRole }, token);
                router.push(ROLE_ROUTES[user.role as UserRole] ?? '/portal');
              }} />
            )}

            <div className="mt-6">
              <p className="mb-3 text-center text-xs text-muted-foreground">Or continue with</p>
              <div className="grid grid-cols-3 gap-2">
                {['google', 'microsoft', 'linkedin'].map((provider) => (
                  <Button key={provider} variant="outline" size="sm" className="capitalize" asChild>
                    <a href={`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8787'}/api/auth/oauth/${provider}`}>
                      {provider}
                    </a>
                  </Button>
                ))}
              </div>
            </div>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              Demo: superadmin@chasehorse.com / Password123!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function OtpLogin({ onSuccess }: { onSuccess: (user: { sub: string; email: string; role: string }, token: string) => void }) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async () => {
    setLoading(true);
    try {
      const { requestOtp } = await import('@chasehorse/auth-client');
      await requestOtp(phone);
      setStep('otp');
    } catch {
      alert('Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const { verifyOtp } = await import('@chasehorse/auth-client');
      const result = await verifyOtp(phone, otp);
      onSuccess(result.user, result.accessToken);
    } catch {
      alert('Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {step === 'phone' ? (
        <>
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+919876543210" />
          </div>
          <Button className="w-full" onClick={handleRequestOtp} disabled={loading || phone.length < 10}>
            Send OTP
          </Button>
        </>
      ) : (
        <>
          <div className="space-y-2">
            <Label>Enter OTP</Label>
            <Input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="6-digit code" maxLength={6} />
          </div>
          <Button className="w-full" onClick={handleVerifyOtp} disabled={loading || otp.length !== 6}>
            Verify & Sign in
          </Button>
        </>
      )}
    </div>
  );
}
