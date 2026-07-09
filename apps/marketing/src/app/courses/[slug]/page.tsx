import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HeroSection } from '@/components/hero-section';
import { CourseDetailBody } from '@/components/course-detail-body';
import { InnerCta } from '@/components/inner-cta';
import { getCourse } from '@/lib/content';

export async function generateStaticParams() {
  const { getSiteContent } = await import('@/lib/content');
  return getSiteContent().courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourse(slug);
  return { title: course?.title ?? 'Course', description: course?.description };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  return (
    <>
      <HeroSection
        title={course.title}
        tagline={course.level}
        subtitle="Professional logistics training"
        image={course.image}
        primaryCta={{ label: 'Enquire Now', href: `/contact?subject=Course Enquiry: ${course.title}` }}
      />
      <CourseDetailBody course={course} />
      <InnerCta
        title="Questions about this course?"
        href={`/contact?subject=Course Enquiry: ${encodeURIComponent(course.title)}`}
        buttonLabel="Talk to Us"
      />
    </>
  );
}
