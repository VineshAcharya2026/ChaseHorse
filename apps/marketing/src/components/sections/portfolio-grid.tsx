'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { TierService } from '@/types/content';
import { getServiceHero, IMAGES } from '@/lib/images';
import { GsapReveal, GsapStagger } from '@/components/motion/gsap-reveal';
import { SectionLabel, SectionTitle } from './section-heading';
import { ArrowUpRight } from 'lucide-react';

const FILTERS = ['All', 'Tier 1', 'Tier 2', 'Tier 3'] as const;

export function PortfolioGrid({ services }: { services: TierService[] }) {
  const [filter, setFilter] = useState<string>('All');

  const filtered =
    filter === 'All' ? services : services.filter((s) => s.tier === parseInt(filter.replace('Tier ', ''), 10));

  const tierFallback: Record<number, string> = {
    1: IMAGES.tiers.tier1,
    2: IMAGES.tiers.tier2,
    3: IMAGES.tiers.tier3,
  };

  return (
    <section className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <GsapReveal>
          <SectionLabel>Our Work</SectionLabel>
          <SectionTitle className="mt-4">Crafting Logistics Breakthroughs</SectionTitle>
        </GsapReveal>

        <div className="mt-8 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                filter === f
                  ? 'bg-brand text-white'
                  : 'border border-border text-muted hover:border-brand/40 hover:text-foreground'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <GsapStagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {filtered.slice(0, 9).map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group overflow-hidden rounded-2xl border border-border bg-surface transition hover:border-brand/40 hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={getServiceHero(service.slug) || tierFallback[service.tier]}
                  alt={service.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-3 left-3 rounded-full bg-brand/90 px-3 py-1 text-xs font-semibold text-white">
                  Tier {service.tier}
                </span>
              </div>
              <div className="flex items-start justify-between p-5">
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-brand">{service.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted">{service.description}</p>
                </div>
                <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted transition group-hover:text-brand" />
              </div>
            </Link>
          ))}
        </GsapStagger>

        <GsapReveal className="mt-10 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full border border-border px-8 py-3 text-sm font-semibold transition hover:border-brand hover:text-brand"
          >
            View All Services <ArrowUpRight className="h-4 w-4" />
          </Link>
        </GsapReveal>
      </div>
    </section>
  );
}
