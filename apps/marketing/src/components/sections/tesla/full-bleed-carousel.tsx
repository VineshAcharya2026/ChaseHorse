'use client';

import { useCallback, useEffect, useState, type ReactNode } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { cn } from '@/lib/utils';
import { CarouselDots } from '@/components/ui/carousel-dots';

export interface FullBleedSlide {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  primaryCta?: { label: string; action: 'quote' | 'link'; href?: string };
  secondaryCta?: { label: string; href: string };
}

interface FullBleedCarouselProps {
  slides: FullBleedSlide[];
  className?: string;
  mode?: 'hero' | 'showcase';
  showArrows?: boolean;
  autoplayDelay?: number;
  onSlideChange?: (index: number) => void;
  renderOverlay?: (slide: FullBleedSlide, index: number, isActive: boolean) => ReactNode;
}

export function FullBleedCarousel({
  slides,
  className,
  mode = 'hero',
  autoplayDelay = 7000,
  onSlideChange,
  renderOverlay,
}: FullBleedCarouselProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const isShowcase = mode === 'showcase';

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: isShowcase ? 'center' : 'start',
      duration: reducedMotion ? 0 : 35,
      containScroll: false,
    },
    reducedMotion ? [] : [Autoplay({ delay: autoplayDelay, stopOnInteraction: true })],
  );
  const [activeIndex, setActiveIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    setActiveIndex(index);
    onSlideChange?.(index);
  }, [emblaApi, onSlideChange]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  if (slides.length === 0) return null;

  return (
    <section className={cn('tesla-section-snap relative overflow-hidden bg-tesla-cream', className)}>
      <div ref={emblaRef} className="h-full min-h-[inherit] overflow-hidden">
        <div className="flex h-full min-h-[inherit]">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={cn(
                'relative h-full min-h-[inherit] min-w-0',
                isShowcase ? 'flex-[0_0_100%] sm:flex-[0_0_86%]' : 'flex-[0_0_100%]',
              )}
            >
              {renderOverlay?.(slide, index, index === activeIndex)}
            </div>
          ))}
        </div>
      </div>

      {slides.length > 1 && (
        <CarouselDots
          count={slides.length}
          activeIndex={activeIndex}
          onSelect={(i) => emblaApi?.scrollTo(i)}
          className="absolute bottom-[40px] left-0 right-0 z-20"
        />
      )}
    </section>
  );
}
