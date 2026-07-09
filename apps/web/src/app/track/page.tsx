'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { TrackShipment } from '@/components/track-shipment';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';

function TrackPageContent() {
  const searchParams = useSearchParams();
  const initialAwb = searchParams.get('awb') ?? '';
  const [query, setQuery] = useState(initialAwb);
  const [awb, setAwb] = useState(initialAwb);

  if (!awb) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="w-full max-w-md px-6 text-center">
          <Package className="mx-auto h-12 w-12 text-primary" />
          <h1 className="mt-4 text-xl font-semibold">Track Your Shipment</h1>
          <p className="mt-2 text-sm text-muted-foreground">Enter your AWB number to see live status</p>
          <form
            className="mt-6 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              setAwb(query.trim());
            }}
          >
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="AWB number"
              className="flex-1"
            />
            <Button type="submit">Track</Button>
          </form>
        </div>
      </div>
    );
  }

  return <TrackShipment awb={awb} />;
}

export default function TrackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="h-8 w-8 animate-pulse rounded-full bg-primary/20" />
        </div>
      }
    >
      <TrackPageContent />
    </Suspense>
  );
}
