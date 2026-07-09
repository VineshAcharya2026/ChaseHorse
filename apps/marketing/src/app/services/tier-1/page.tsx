import type { Metadata } from 'next';
import { HeroSection } from '@/components/hero-section';
import { PageSection } from '@/components/page-section';
import { TierServiceList } from '@/components/service-card-grid';
import { InnerCta } from '@/components/inner-cta';
import { getServicesByTier } from '@/lib/content';
import { IMAGES } from '@/lib/images';

export const metadata: Metadata = {
  title: 'Tier 1 Services',
  description: 'Core Business Services — Digital Transformation, CH Deploy, 8D Complaints, PPEs, Returns.',
};

export default function Tier1Page() {
  const services = getServicesByTier(1);

  return (
    <>
      <HeroSection
        title="Tier 1"
        tagline="Core Business"
        subtitle="Digital foundation — strategy deployment in 24 hours."
        image={IMAGES.digital}
      />
      <PageSection variant="white" title="Core Business Services" subtitle="Tier 1" reveal={false}>
        <TierServiceList services={services} />
      </PageSection>
      <InnerCta href="/contact?subject=Tier 1 Services Enquiry" />
    </>
  );
}
