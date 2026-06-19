import Link from 'next/link';
import { ScrollReveal } from './scroll-reveal';

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
    <section className="bg-surface py-24">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <h2 className="text-center text-4xl font-medium tracking-tight text-foreground md:text-5xl">
            Our Service Categories
          </h2>
        </ScrollReveal>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {tiers.map((tier, i) => (
            <ScrollReveal key={tier.tier} delay={i * 0.1}>
              <div className="group flex h-full flex-col border border-border bg-background p-8 transition hover:border-brand/30 hover:shadow-lg">
                <p className="text-sm font-medium uppercase tracking-widest text-brand">
                  Tier {tier.tier}
                </p>
                <h3 className="mt-4 text-2xl font-medium text-foreground">{tier.title}</h3>
                <p className="mt-2 text-sm text-muted">{tier.subtitle}</p>
                <ul className="mt-6 flex-1 space-y-2">
                  {tier.items.map((item) => (
                    <li key={item} className="text-sm text-muted">
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.href}
                  className="mt-8 text-sm font-medium text-foreground underline-offset-4 hover:underline"
                >
                  Explore More
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
