'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api, useAuthStore } from '@chasehorse/auth-client';
import { ROLE_ROUTES } from '@chasehorse/core';
import type { UserRole } from '@chasehorse/shared';

export default function OAuthCallbackClient({ provider }: { provider: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    if (!code || !state) {
      setError('Missing OAuth parameters');
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8787';

    fetch(`${apiUrl}/api/auth/oauth/${provider}/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, state }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.success) throw new Error(res.error ?? 'OAuth failed');
        api.setToken(res.data.accessToken);
        setAuth(res.data.user, res.data.accessToken, res.data.refreshToken ?? null);
        const route = ROLE_ROUTES[res.data.user.role as UserRole] ?? '/portal';
        router.replace(route);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'OAuth failed');
      });
  }, [provider, router, searchParams, setAuth]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="text-center">
          <p className="text-destructive">{error}</p>
          <a href="/login" className="mt-4 inline-block text-sm text-primary hover:underline">
            Back to login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-pulse rounded-full bg-primary/20" />
    </div>
  );
}
