'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { IMAGES } from '@/lib/images';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  tagline?: string;
  image?: string;
  dark?: boolean;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  className?: string;
  children?: React.ReactNode;
}

export function HeroSection({
  title,
  subtitle,
  tagline,
  image,
  dark = true,
  primaryCta,
  secondaryCta,
  className,
  children,
}: HeroSectionProps) {
  const [imgError, setImgError] = useState(false);
  const bgImage = image ?? IMAGES.hero;

  return (
    <section
      className={cn(
        'relative flex min-h-screen flex-col items-center justify-center overflow-hidden',
        className,
      )}
    >
      {!imgError && (
        <Image
          src={bgImage}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
          onError={() => setImgError(true)}
        />
      )}
      {imgError && <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-black" />}
      <div
        className={cn(
          'absolute inset-0',
          dark ? 'bg-black/50' : 'bg-white/60',
        )}
      />
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        {tagline && (
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-white/80">
            {tagline}
          </p>
        )}
        <h1 className="text-balance text-5xl font-medium tracking-tight text-white md:text-7xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80 md:text-xl">{subtitle}</p>
        )}
        {children}
        {(primaryCta || secondaryCta) && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {primaryCta && (
              <Link
                href={primaryCta.href}
                className="min-w-[200px] rounded-sm bg-white px-8 py-3 text-sm font-medium text-black transition hover:bg-white/90"
              >
                {primaryCta.label}
              </Link>
            )}
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className="min-w-[200px] rounded-sm border border-white/80 bg-black/30 px-8 py-3 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/10"
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
