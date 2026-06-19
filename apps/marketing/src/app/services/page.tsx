import type { Metadata } from 'next';
import Link from 'next/link';
import { HeroSection } from '@/components/hero-section';
import { TierGrid } from '@/components/tier-grid';
import { ScrollReveal } from '@/components/scroll-reveal';
import { getSiteContent, getServicesByTier } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Services',
  description: 'ChaseHorse GELP service tiers — Core, Strategic, and Advanced operations.',
};

export default function ServicesPage() {
  const tier1 = getServicesByTier(1);
  const tier2 = getServicesByTier(2);
  const tier3 = getServicesByTier(3);

  return (
    <>
      <HeroSection
        title="Our Services"
        subtitle="Growth Enabler Logiworkx Platform — three tiers of logistics excellence."
        image="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=80"
        primaryCta={{ label: 'Contact Us', href: '/contact' }}
      />
      <TierGrid
        tiers={[
          {
            tier: 1,
            title: 'Core Business Services',
            subtitle: 'Digital foundation and deployment',
            items: tier1.map((s) => s.title),
            href: '/services/tier-1',
          },
          {
            tier: 2,
            title: 'Strategic & Growth',
            subtitle: 'Optimization and fleet management',
            items: tier2.map((s) => s.title),
            href: '/services/tier-2',
          },
          {
            tier: 3,
            title: 'Advanced Technology',
            subtitle: 'IT, SCM, and compliance',
            items: tier3.map((s) => s.title),
            href: '/services/tier-3',
          },
        ]}
      />
      <section className="bg-background py-24">
        <div className="mx-auto max-w-5xl px-6">
          <ScrollReveal>
            <h2 className="text-3xl font-medium text-foreground">All Services</h2>
          </ScrollReveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {[...tier1, ...tier2, ...tier3].map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="border border-border bg-surface p-6 transition hover:border-brand/30 hover:shadow-md"
              >
                <span className="text-xs text-brand">Tier {service.tier}</span>
                <h3 className="mt-2 font-medium text-foreground">{service.title}</h3>
                <p className="mt-1 text-sm text-muted">{service.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
