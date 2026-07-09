'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { GsapReveal } from '@/components/motion/gsap-reveal';
import { GsapStagger } from '@/components/motion/gsap-reveal';

interface TierGridProps {
  tiers: {
    tier: number;
    title: string;
    subtitle: string;
    items: string[];
    href: string;
  }[];
}

export function TierGrid({ tiers }: TierGridProps) {
  return (
    <section className="bg-tesla-gray px-4 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto max-w-[1400px]">
        <GsapReveal className="mb-10 text-center">
          <h2 className="tesla-section-title">Our Service Categories</h2>
          <p className="mx-auto mt-3 max-w-xl tesla-body">
            Three tiers of logistics excellence — from rapid deployment to advanced technology.
          </p>
        </GsapReveal>
        <GsapStagger className="grid gap-4 md:grid-cols-3">
          {tiers.map((tier) => (
            <article key={tier.tier} className="tesla-card flex h-full flex-col p-8 md:p-10">
              <span className="text-sm font-medium text-tesla-muted">Tier {tier.tier}</span>
              <h3 className="mt-3 text-xl font-medium text-tesla-black md:text-2xl">{tier.title}</h3>
              <p className="mt-2 tesla-body">{tier.subtitle}</p>
              <ul className="mt-6 flex-1 space-y-2 border-t border-white/60 pt-6">
                {tier.items.slice(0, 5).map((item) => (
                  <li key={item} className="text-sm text-tesla-body">
                    {item}
                  </li>
                ))}
              </ul>
              <Link href={tier.href} className="tesla-link mt-8 inline-flex items-center gap-1.5">
                Learn More
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
            </article>
          ))}
        </GsapStagger>
      </div>
    </section>
  );
}
