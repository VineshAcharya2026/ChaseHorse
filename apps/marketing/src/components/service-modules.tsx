'use client';

import { Check } from 'lucide-react';
import { GsapStagger } from '@/components/motion/gsap-reveal';
import { GsapReveal } from '@/components/motion/gsap-reveal';

interface ServiceModulesProps {
  modules: { number: string; title: string; body: string }[];
}

export function ServiceModules({ modules }: ServiceModulesProps) {
  return (
    <section className="bg-white py-14 md:py-20">
      <div className="mx-auto max-w-[1400px] px-6">
        <GsapStagger className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod) => (
            <article key={mod.number} className="tesla-card p-8">
              <span className="text-3xl font-medium text-tesla-muted/40">{mod.number}</span>
              <h3 className="mt-3 text-lg font-medium text-tesla-black">{mod.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-tesla-body">{mod.body}</p>
            </article>
          ))}
        </GsapStagger>
      </div>
    </section>
  );
}

export function ServiceFeatureList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="bg-tesla-gray py-14 md:py-20">
      <div className="mx-auto max-w-3xl px-6">
        <GsapReveal>
          <h2 className="tesla-section-title">{title}</h2>
        </GsapReveal>
        <GsapStagger className="mt-8 space-y-3">
          {items.map((item) => (
            <li
              key={item}
              className="flex list-none gap-3 rounded-md bg-white p-5 text-sm text-tesla-body"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-tesla-blue">
                <Check className="h-4 w-4" strokeWidth={2.5} />
              </span>
              {item}
            </li>
          ))}
        </GsapStagger>
      </div>
    </section>
  );
}
