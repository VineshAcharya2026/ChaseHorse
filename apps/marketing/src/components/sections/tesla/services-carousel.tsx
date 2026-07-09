'use client';

import { useCallback, useEffect, useRef } from 'react';
import gsap from 'gsap';
import type { ProductSlide } from '@/types/content';
import { getHomeSlideImage } from '@/lib/images';
import { cn } from '@/lib/utils';
import { FullBleedCarousel } from './full-bleed-carousel';
import { TeslaHeroContent } from './tesla-hero-content';
import { ProductFrame } from '@/components/ui/product-frame';

export function ServicesCarousel({ slides }: { slides: ProductSlide[] }) {
  const overlayRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const resolvedSlides = slides.map((slide) => ({
    ...slide,
    image: getHomeSlideImage(slide.id, slide.image),
    primaryCta: { ...slide.primaryCta, label: 'Order Now' },
    secondaryCta: slide.secondaryCta,
  }));

  const animateSlide = useCallback((index: number) => {
    overlayRefs.current.forEach((el, i) => {
      if (i === index) {
        gsap.fromTo(el, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
      }
    });
  }, []);

  useEffect(() => {
    animateSlide(0);
  }, [animateSlide]);

  return (
    <FullBleedCarousel
      slides={resolvedSlides}
      mode="showcase"
      onSlideChange={animateSlide}
      renderOverlay={(slide, index, isActive) => (
        <div
          ref={(el) => {
            if (el) overlayRefs.current.set(index, el);
          }}
          className={cn(
            'relative z-10 mx-auto flex h-full min-h-[inherit] max-w-5xl flex-col items-center justify-center gap-7 px-4 pb-16 pt-[80px] transition-opacity duration-500',
            isActive ? 'opacity-100' : 'opacity-50',
          )}
        >
          <TeslaHeroContent
            title={slide.title}
            subtitle={slide.subtitle}
            primaryCta={slide.primaryCta}
            secondaryCta={slide.secondaryCta}
          />
          <ProductFrame
            src={slide.image}
            alt={slide.title}
            aspect="hero"
            className="w-full max-w-3xl"
          />
        </div>
      )}
    />
  );
}
