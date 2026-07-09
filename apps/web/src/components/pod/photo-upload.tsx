'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, X } from 'lucide-react';

const MAX_PHOTOS = 3;
const MAX_WIDTH = 1280;
const QUALITY = 0.7;

async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, MAX_WIDTH / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas unavailable'));
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', QUALITY));
    };
    img.onerror = reject;
    img.src = url;
  });
}

interface PhotoUploadProps {
  onChange: (photos: string[]) => void;
  className?: string;
}

export function PhotoUpload({ onChange, className }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<string[]>([]);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const remaining = MAX_PHOTOS - photos.length;
    const toAdd = Array.from(files).slice(0, remaining);
    const compressed = await Promise.all(toAdd.map(compressImage));
    const next = [...photos, ...compressed].slice(0, MAX_PHOTOS);
    setPhotos(next);
    onChange(next);
  };

  const remove = (index: number) => {
    const next = photos.filter((_, i) => i !== index);
    setPhotos(next);
    onChange(next);
  };

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <div className="grid grid-cols-3 gap-3">
        {photos.map((photo, i) => (
          <div key={i} className="relative aspect-square overflow-hidden rounded-lg border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo} alt={`POD photo ${i + 1}`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute right-1 top-1 rounded-full bg-background/80 p-1"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        {photos.length < MAX_PHOTOS && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex aspect-square flex-col items-center justify-center rounded-lg border border-dashed border-border text-muted-foreground hover:border-primary/50"
          >
            <Camera className="h-6 w-6" />
            <span className="mt-1 text-xs">Add photo</span>
          </button>
        )}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {photos.length}/{MAX_PHOTOS} photos (compressed)
      </p>
    </div>
  );
}
