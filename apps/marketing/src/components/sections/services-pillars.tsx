'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { ServicePillar } from '@/types/content';
import { GsapReveal, GsapStagger } from '@/components/motion/gsap-reveal';
import { SectionLabel, SectionTitle } from './section-heading';

export function ServicesPillars({ pillars }: { pillars: ServicePillar[] }) {
  return (
    <section className="bg-surface py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <GsapReveal className="text-center">
          <SectionLabel>Our Services</SectionLabel>
          <SectionTitle className="mt-4">GELP Service Categories</SectionTitle>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            Three tiers of logistics excellence — from digital foundation to enterprise-grade operations.
          </p>
        </GsapReveal>

        <GsapStagger className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4" stagger={0.12}>
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="group flex flex-col rounded-2xl border border-border bg-background p-6 transition duration-300 hover:border-brand/40 hover:shadow-lg"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-brand">{pillar.subtitle}</p>
              <h3 className="mt-3 text-xl font-semibold text-foreground">{pillar.title}</h3>
              <ul className="mt-4 flex-1 space-y-2">
                {pillar.items.slice(0, 4).map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={item.href}
                      className="group/link flex items-center justify-between text-sm text-muted transition hover:text-brand"
                    >
                      {item.title}
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover/link:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
              {pillar.items.length > 4 && (
                <p className="mt-2 text-xs text-muted">+{pillar.items.length - 4} more</p>
              )}
            </div>
          ))}
        </GsapStagger>
      </div>
    </section>
  );
}
