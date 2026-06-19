import type { Metadata } from 'next';
import Link from 'next/link';
import { HeroSection } from '@/components/hero-section';
import { ScrollReveal } from '@/components/scroll-reveal';
import { getServicesByTier } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Tier 2 Services',
  description: 'Strategic & Growth Services — Digital Advancement, Fleet Management, ESG, CX.',
};

import { IMAGES } from '@/lib/images';

export default function Tier2Page() {
  const services = getServicesByTier(2);

  return (
    <>
      <HeroSection title="Tier 2" subtitle="Strategic & Growth Services" image={IMAGES.optimize} />
      <section className="bg-background py-24">
        <div className="mx-auto max-w-5xl px-6">
          {services.map((service, i) => (
            <ScrollReveal key={service.slug} delay={i * 0.05}>
              <Link href={`/services/${service.slug}`} className="group block border-t border-border py-8">
                <h2 className="text-2xl font-medium text-foreground group-hover:text-brand">{service.title}</h2>
                <p className="mt-2 text-muted">{service.description}</p>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </>
  );
}
