'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { IMAGES } from '@/lib/images';

type AspectPreset = 'hero' | 'product' | 'square' | 'wide';

const aspectClass: Record<AspectPreset, string> = {
  hero: 'aspect-[16/9]',
  product: 'aspect-[4/3]',
  square: 'aspect-square',
  wide: 'aspect-[21/9]',
};

interface ProductFrameProps {
  src?: string;
  alt?: string;
  aspect?: AspectPreset;
  fit?: 'cover' | 'contain';
  priority?: boolean;
  className?: string;
  children?: ReactNode;
}

/**
 * Tesla Shop-style contained product shot: cream/white inner surface, a subtle
 * warm border and rounded corners. The image is always rendered (no opacity
 * gate) so it can never disappear behind an animation.
 */
export function ProductFrame({
  src,
  alt = '',
  aspect = 'hero',
  fit = 'cover',
  priority = false,
  className,
  children,
}: ProductFrameProps) {
  const [imgSrc, setImgSrc] = useState(src || IMAGES.logistics);

  useEffect(() => {
    setImgSrc(src || IMAGES.logistics);
  }, [src]);

  return (
    <div className={cn('product-frame relative', aspectClass[aspect], className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onError={() => {
          if (imgSrc !== IMAGES.logistics) setImgSrc(IMAGES.logistics);
        }}
        className={cn('h-full w-full', fit === 'contain' ? 'object-contain p-6' : 'object-cover')}
      />
      {children}
    </div>
  );
}
