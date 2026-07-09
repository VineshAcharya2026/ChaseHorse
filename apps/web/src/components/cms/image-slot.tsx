'use client';

import { useState } from 'react';
import { ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AssetPicker } from './asset-picker';
import type { CmsAsset } from '@/lib/cms-api';

interface ImageSlotProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
}

export function ImageSlot({ label, value, onChange }: ImageSlotProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
      <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md border border-border bg-muted/40">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt={label} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <ImageIcon className="h-5 w-5" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{label}</p>
        <p className="truncate text-xs text-muted-foreground" title={value}>
          {value || 'No image set'}
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        Change
      </Button>
      <AssetPicker
        open={open}
        onClose={() => setOpen(false)}
        onPick={(asset: CmsAsset) => onChange(asset.url)}
      />
    </div>
  );
}
