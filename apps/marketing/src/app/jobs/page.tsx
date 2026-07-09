import type { Metadata } from 'next';
import { HeroSection } from '@/components/hero-section';
import { JobListing } from '@/components/job-listing';
import { PageSection } from '@/components/page-section';
import { InnerCta } from '@/components/inner-cta';
import { getSiteContent } from '@/lib/content';
import { IMAGES } from '@/lib/images';

export const metadata: Metadata = {
  title: 'Jobs',
  description: 'Join ChaseHorse — On-Field Logiworkx Lead positions across PAN India.',
};

export default function JobsPage() {
  const content = getSiteContent();

  return (
    <>
      <HeroSection
        title="Our Job Opportunities"
        tagline="Careers"
        subtitle="Join a team building the future of logistics technology."
        image={IMAGES.jobs}
      />
      <PageSection variant="gray" reveal={false}>
        <JobListing
          title="On-Field Logiworkx Lead"
          positions="10 open positions"
          description={content.jobs.sections[0]?.body ?? ''}
          location="PAN India — ChaseHorse"
        />
      </PageSection>
      <InnerCta
        title="Don't see the right role?"
        description="Send us your profile — we're always looking for logistics talent."
        href="/contact?subject=Job Application"
        buttonLabel="Send Application"
      />
    </>
  );
}
