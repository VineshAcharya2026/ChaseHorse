import type { Metadata } from 'next';
import { HeroSection } from '@/components/hero-section';
import { JobListing } from '@/components/job-listing';
import { getSiteContent } from '@/lib/content';

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
        subtitle="Build great products to solve your business problems."
        image="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920&q=80"
      />
      <section className="bg-background py-24">
        <div className="mx-auto max-w-4xl px-6">
          <JobListing
            title="On-Field Logiworkx Lead"
            positions="10 open positions"
            description={content.jobs.sections[0]?.body ?? ''}
            location="PAN India — Chasehorse"
          />
        </div>
      </section>
    </>
  );
}
