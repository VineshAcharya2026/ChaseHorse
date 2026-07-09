'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';
import { IMAGES } from '@/lib/images';
import { ProductFrame } from '@/components/ui/product-frame';
import { TeslaButton } from '@/components/ui/tesla-button';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  tagline?: string;
  image?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  className?: string;
  children?: React.ReactNode;
}

export function HeroSection({
  title,
  subtitle,
  image,
  primaryCta,
  secondaryCta,
  className,
  children,
}: HeroSectionProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const bgImage = image ?? IMAGES.hero;

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    gsap.fromTo(el, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.1 });
  }, []);

  return (
    <section
      className={cn(
        'relative overflow-hidden bg-tesla-cream pt-24 sm:pt-28',
        className,
      )}
    >
      <div
        ref={contentRef}
        className="mx-auto w-full max-w-[1100px] px-6 pb-12 text-center"
      >
        <h1 className="tesla-hero-title">{title}</h1>
        {subtitle && <p className="mx-auto mt-3 max-w-2xl tesla-hero-subtitle">{subtitle}</p>}
        {children}
        {(primaryCta || secondaryCta) && (
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            {primaryCta && (
              <TeslaButton label={primaryCta.label} variant="primary" href={primaryCta.href} />
            )}
            {secondaryCta && (
              <TeslaButton label={secondaryCta.label} variant="secondary-dark" href={secondaryCta.href} />
            )}
          </div>
        )}
        <ProductFrame
          src={bgImage}
          alt={title}
          aspect="wide"
          priority
          className="mt-10"
        />
      </div>
    </section>
  );
}
