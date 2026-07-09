import type { ClientLogo } from '@/types/content';
import { GsapReveal } from '@/components/motion/gsap-reveal';
import { SectionLabel, SectionTitle } from './section-heading';

export function ClientMarquee({ clients }: { clients: ClientLogo[] }) {
  const doubled = [...clients, ...clients];

  return (
    <section className="border-y border-border bg-background py-16">
      <div className="mx-auto max-w-7xl px-6">
        <GsapReveal className="mb-10 text-center">
          <SectionLabel>Our Clients</SectionLabel>
          <SectionTitle className="mt-4 text-2xl md:text-3xl">Trusted Across Industries</SectionTitle>
        </GsapReveal>
      </div>

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-background to-transparent" />
        <div className="animate-marquee flex w-max gap-12">
          {doubled.map((client, i) => (
            <div
              key={`${client.name}-${i}`}
              className="flex h-16 min-w-[160px] items-center justify-center rounded-xl border border-border bg-surface px-8 text-sm font-semibold tracking-wide text-muted"
            >
              {client.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
