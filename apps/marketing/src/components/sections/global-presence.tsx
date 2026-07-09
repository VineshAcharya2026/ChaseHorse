import { GsapReveal, GsapStagger } from '@/components/motion/gsap-reveal';
import { SectionLabel, SectionTitle } from './section-heading';
import { Globe } from 'lucide-react';

export function GlobalPresence({ regions }: { regions: string[] }) {
  return (
    <section className="border-y border-border bg-surface py-16">
      <div className="mx-auto max-w-7xl px-6">
        <GsapReveal className="flex flex-col items-center text-center md:flex-row md:justify-between md:text-left">
          <div>
            <SectionLabel>Our Global Presence</SectionLabel>
            <SectionTitle className="mt-2 text-2xl md:text-3xl">Serving Markets Worldwide</SectionTitle>
          </div>
          <GsapStagger className="mt-8 flex flex-wrap justify-center gap-4 md:mt-0" stagger={0.1}>
            {regions.map((region) => (
              <div
                key={region}
                className="flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground"
              >
                <Globe className="h-4 w-4 text-brand" />
                {region}
              </div>
            ))}
          </GsapStagger>
        </GsapReveal>
      </div>
    </section>
  );
}
