import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { HeroSection } from '@/components/hero-section';
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
        subtitle={course.level}
        image={course.image}
        primaryCta={{ label: 'Enquire Now', href: `/contact?subject=Course Enquiry: ${course.title}` }}
      />
      <section className="bg-background py-24">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-lg leading-relaxed text-muted">{course.description}</p>
          <Link
            href={`/contact?subject=Course Enquiry: ${course.title}`}
            className="mt-10 inline-block rounded-sm bg-foreground px-8 py-3 text-sm font-medium text-background hover:opacity-90"
          >
            Request Enrollment
          </Link>
        </div>
      </section>
    </>
  );
}
