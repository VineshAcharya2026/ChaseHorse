'use client';

import { useEffect } from 'react';
import { api, refreshSession, useAuthStore } from '@chasehorse/auth-client';

const REFRESH_INTERVAL_MS = 10 * 60 * 1000;

export function AuthBootstrap() {
  useEffect(() => {
    const { accessToken, refreshToken, clearAuth } = useAuthStore.getState();

    if (accessToken) {
      api.setToken(accessToken);
    }

    if (!refreshToken) return;

    const refresh = async () => {
      try {
        await refreshSession();
      } catch {
        clearAuth();
        api.setToken(null);
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
          window.location.href = '/login';
        }
      }
    };

    const interval = window.setInterval(refresh, REFRESH_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, []);

  return null;
}
