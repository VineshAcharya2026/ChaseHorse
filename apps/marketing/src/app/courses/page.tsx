import type { Metadata } from 'next';
import { HeroSection } from '@/components/hero-section';
import { CourseList } from '@/components/course-list';
import { PageSection } from '@/components/page-section';
import { InnerCta } from '@/components/inner-cta';
import { getSiteContent } from '@/lib/content';
import { IMAGES } from '@/lib/images';

export const metadata: Metadata = {
  title: 'Courses',
  description: 'ChaseHorse training courses — Warehouse Basics and more.',
};

export default function CoursesPage() {
  const courses = getSiteContent().courses;

  return (
    <>
      <HeroSection
        title="Courses"
        tagline="Training & Development"
        subtitle="On-job technology training for a future-prepared manpower matrix."
        image={IMAGES.warehouse}
      />
      <PageSection variant="white" title="All Courses" subtitle="Learn with ChaseHorse" reveal={false}>
        <CourseList courses={courses} />
      </PageSection>
      <InnerCta
        title="Train your team on GELP"
        description="Custom warehouse and logistics training programs for your workforce."
        href="/contact?subject=Course Enquiry"
      />
    </>
  );
}
