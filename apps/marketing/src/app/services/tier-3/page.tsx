import type { Metadata } from 'next';
import { HeroSection } from '@/components/hero-section';
import { PageSection } from '@/components/page-section';
import { TierServiceList } from '@/components/service-card-grid';
import { InnerCta } from '@/components/inner-cta';
import { getServicesByTier } from '@/lib/content';
import { IMAGES } from '@/lib/images';

export const metadata: Metadata = {
  title: 'Tier 3 Services',
  description: 'Advanced Technology — IT, Fleet Operations, SCM, Compliance, Sustainability.',
};

export default function Tier3Page() {
  const services = getServicesByTier(3);

  return (
    <>
      <HeroSection
        title="Tier 3"
        tagline="Advanced Technology"
        subtitle="Enterprise-grade IT, SCM, and compliance at scale."
        image={IMAGES.tech}
      />
      <PageSection variant="white" title="Advanced Technology Services" subtitle="Tier 3" reveal={false}>
        <TierServiceList services={services} />
      </PageSection>
      <InnerCta href="/contact?subject=Tier 3 Services Enquiry" />
    </>
  );
}
