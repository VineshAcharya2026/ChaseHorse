import type { Metadata } from 'next';
import { HeroSection } from '@/components/hero-section';
import { TierGrid } from '@/components/tier-grid';
import { PageSection } from '@/components/page-section';
import { ServiceCardGrid } from '@/components/service-card-grid';
import { InnerCta } from '@/components/inner-cta';
import { getServicesByTier } from '@/lib/content';
import { IMAGES } from '@/lib/images';

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
        tagline="What We Do"
        subtitle="Growth Enabler Logiworkx Platform — three tiers of logistics excellence."
        image={IMAGES.logistics}
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
      <PageSection variant="white" title="All Services" subtitle="Full Catalogue" reveal={false}>
        <ServiceCardGrid services={[...tier1, ...tier2, ...tier3]} />
      </PageSection>
      <InnerCta
        title="Need a custom logistics solution?"
        description="Our team will map the right GELP tier and modules for your operations."
        useLeadForm
        buttonLabel="Get a Quote"
      />
    </>
  );
}
