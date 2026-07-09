'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Quote } from 'lucide-react';
import type { Testimonial } from '@/types/content';

const AVATARS = [
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
];

export function TestimonialsGrid({ testimonials }: { testimonials: Testimonial[] }) {
  const [active, setActive] = useState(0);
  const visible = testimonials.slice(0, 3);

  return (
    <section className="bg-section-gray py-14">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:gap-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              Testimonials
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-navy md:text-4xl">
              Trusted by Businesses Worldwide
            </h2>
            <Link
              href="/contact"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand"
            >
              View All Testimonials
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {visible.map((t, i) => (
              <article
                key={t.name}
                className="flex flex-col rounded-lg border border-border bg-white p-6 shadow-sm"
              >
                <Quote className="h-8 w-8 text-brand/30" />
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                  <Image
                    src={AVATARS[i % AVATARS.length]}
                    alt={t.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-bold text-navy">{t.name}</p>
                    <p className="text-xs text-muted">
                      {t.role}, {t.company}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {visible.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                active === i ? 'w-6 bg-brand' : 'w-2 bg-border'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
