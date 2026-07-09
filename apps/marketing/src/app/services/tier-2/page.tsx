import type { Metadata } from 'next';
import { HeroSection } from '@/components/hero-section';
import { PageSection } from '@/components/page-section';
import { TierServiceList } from '@/components/service-card-grid';
import { InnerCta } from '@/components/inner-cta';
import { getServicesByTier } from '@/lib/content';
import { IMAGES } from '@/lib/images';

export const metadata: Metadata = {
  title: 'Tier 2 Services',
  description: 'Strategic Growth — Digital Advancement, Optimization, Fleet Management, ESG, CX.',
};

export default function Tier2Page() {
  const services = getServicesByTier(2);

  return (
    <>
      <HeroSection
        title="Tier 2"
        tagline="Strategic Growth"
        subtitle="Scale operations — deployment in 48 hours."
        image={IMAGES.optimize}
      />
      <PageSection variant="white" title="Strategic & Growth Services" subtitle="Tier 2" reveal={false}>
        <TierServiceList services={services} />
      </PageSection>
      <InnerCta href="/contact?subject=Tier 2 Services Enquiry" />
    </>
  );
}
