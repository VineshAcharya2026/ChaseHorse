'use client';

import { X } from 'lucide-react';
import { MediaGrid } from './media-grid';
import type { CmsAsset } from '@/lib/cms-api';

interface AssetPickerProps {
  open: boolean;
  onClose: () => void;
  onPick: (asset: CmsAsset) => void;
  folder?: string;
}

export function AssetPicker({ open, onClose, onPick, folder = 'images' }: AssetPickerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-border bg-background shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h3 className="text-sm font-semibold">Select or upload an image</h3>
          <button onClick={onClose} className="rounded p-1 hover:bg-muted/60">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="overflow-y-auto p-5">
          <MediaGrid
            folder={folder}
            selectable
            onSelect={(asset) => {
              onPick(asset);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
}
