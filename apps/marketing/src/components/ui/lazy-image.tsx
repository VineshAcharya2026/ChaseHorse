'use client';

import Image, { type ImageProps } from 'next/image';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { IMAGES } from '@/lib/images';

type LazyImageProps = Omit<ImageProps, 'placeholder'> & {
  wrapperClassName?: string;
  fallbackSrc?: string;
  fit?: 'cover' | 'contain';
  framed?: boolean;
};

/** Reliable image for static export — always visible, no opacity-gated reveal. */
export function LazyImage({
  className,
  wrapperClassName,
  fallbackSrc = IMAGES.logistics,
  fit = 'cover',
  framed = false,
  alt,
  src,
  ...props
}: LazyImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        framed && 'product-frame',
        wrapperClassName,
      )}
    >
      <Image
        {...props}
        src={imgSrc}
        alt={alt}
        unoptimized
        onError={() => {
          if (imgSrc !== fallbackSrc) setImgSrc(fallbackSrc);
        }}
        className={cn(fit === 'contain' ? 'object-contain' : 'object-cover', className)}
      />
    </div>
  );
}
