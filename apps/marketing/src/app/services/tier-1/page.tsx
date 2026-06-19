import type { Metadata } from 'next';
import Link from 'next/link';
import { HeroSection } from '@/components/hero-section';
import { ScrollReveal } from '@/components/scroll-reveal';
import { getServicesByTier } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Tier 1 Services',
  description: 'Core Business Services — Digital Transformation, CH Deploy, 8D Complaints, PPEs, Returns.',
};

export default function Tier1Page() {
  const services = getServicesByTier(1);

  return (
    <>
      <HeroSection title="Tier 1" subtitle="Core Business Services" image="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80" />
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
