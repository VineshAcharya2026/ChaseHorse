'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@chasehorse/auth-client';

interface DriverLocation {
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
}

interface UseDriverLocationOptions {
  driverId?: string;
  shipmentId?: string;
  enabled?: boolean;
}

export function useDriverLocation(options: UseDriverLocationOptions = {}) {
  const { accessToken } = useAuthStore();
  const [location, setLocation] = useState<DriverLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const enabled = options.enabled ?? true;

  useEffect(() => {
    if (!enabled || !accessToken) return;
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8787';

    const postLocation = (latitude: number, longitude: number, heading?: number, speed?: number) => {
      setLocation({ latitude, longitude, heading, speed });
      fetch(`${apiUrl}/api/tracking/location`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          driverId: options.driverId,
          latitude,
          longitude,
          heading,
          speed,
          shipmentId: options.shipmentId,
        }),
      }).catch(() => {});
    };

    const update = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          postLocation(
            pos.coords.latitude,
            pos.coords.longitude,
            pos.coords.heading ?? undefined,
            pos.coords.speed ?? undefined,
          ),
        (err) => setError(err.message),
        { enableHighAccuracy: true, maximumAge: 10000 },
      );
    };

    update();
    const intervalId = setInterval(update, 30000);
    return () => clearInterval(intervalId);
  }, [accessToken, options.driverId, options.shipmentId, enabled]);

  return { location, error };
}
