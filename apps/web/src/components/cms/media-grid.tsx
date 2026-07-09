'use client';

import { useCallback, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Upload, Trash2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  listAssets,
  uploadAsset,
  deleteAsset,
  type CmsAsset,
} from '@/lib/cms-api';

interface MediaGridProps {
  folder?: string;
  selectable?: boolean;
  onSelect?: (asset: CmsAsset) => void;
}

export function MediaGrid({ folder = 'images', selectable = false, onSelect }: MediaGridProps) {
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['cms-assets', folder],
    queryFn: () => listAssets(folder),
  });

  const handleUpload = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      setUploading(true);
      try {
        for (const file of Array.from(files)) {
          await uploadAsset(file, folder);
        }
        await queryClient.invalidateQueries({ queryKey: ['cms-assets', folder] });
      } finally {
        setUploading(false);
        if (fileRef.current) fileRef.current.value = '';
      }
    },
    [folder, queryClient],
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this asset? Any page using it will fall back to a placeholder.')) return;
    await deleteAsset(id);
    await queryClient.invalidateQueries({ queryKey: ['cms-assets', folder] });
  };

  const copyUrl = async (asset: CmsAsset) => {
    await navigator.clipboard.writeText(asset.url);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const items = data?.items ?? [];

  return (
    <div>
      <div
        className="mb-4 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-8 text-center"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleUpload(e.dataTransfer.files);
        }}
      >
        <Upload className="h-6 w-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Drag &amp; drop images here, or
        </p>
        <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Choose files'}
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-video animate-pulse rounded-lg bg-muted/40" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">No assets uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((asset) => (
            <div
              key={asset.id}
              className="group relative overflow-hidden rounded-lg border border-border bg-card"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset.url}
                alt={asset.altText ?? asset.filename}
                className="aspect-video w-full object-cover"
              />
              <div className="flex items-center justify-between gap-1 p-2">
                <span className="truncate text-xs text-muted-foreground" title={asset.filename}>
                  {asset.filename}
                </span>
                <div className="flex shrink-0 gap-1">
                  <button
                    onClick={() => copyUrl(asset)}
                    className="rounded p-1 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    title="Copy URL"
                  >
                    {copiedId === asset.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    onClick={() => handleDelete(asset.id)}
                    className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              {selectable && (
                <button
                  onClick={() => onSelect?.(asset)}
                  className="absolute inset-0 flex items-center justify-center bg-black/60 text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  Select
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
