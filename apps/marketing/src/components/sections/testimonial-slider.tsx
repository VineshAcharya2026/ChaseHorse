'use client';

import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import type { Testimonial } from '@/types/content';
import { GsapReveal } from '@/components/motion/gsap-reveal';
import { SectionLabel, SectionTitle } from './section-heading';
import { Quote } from 'lucide-react';

export function TestimonialSlider({ testimonials }: { testimonials: Testimonial[] }) {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start' }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);

  return (
    <section className="overflow-hidden bg-surface py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <GsapReveal className="text-center">
          <SectionLabel>Client Testimonials</SectionLabel>
          <SectionTitle className="mt-4">The Results Speak</SectionTitle>
        </GsapReveal>

        <div className="mt-12 overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="min-w-0 flex-[0_0_100%] rounded-2xl border border-border bg-background p-8 md:flex-[0_0_50%] lg:flex-[0_0_33%]"
              >
                <Quote className="h-8 w-8 text-brand/40" />
                <p className="mt-4 text-base leading-relaxed text-foreground">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-6 border-t border-border pt-4">
                  <p className="font-semibold text-foreground">{t.name}</p>
                  <p className="text-sm text-muted">
                    {t.role}, {t.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
