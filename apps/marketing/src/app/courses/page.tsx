import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { HeroSection } from '@/components/hero-section';
import { ScrollReveal } from '@/components/scroll-reveal';
import { getSiteContent } from '@/lib/content';

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
        subtitle="On-job technology training for a future-prepared manpower matrix."
        image="https://images.unsplash.com/photo-1553413077-190dd305871c?w=1920&q=80"
      />
      <section className="bg-background py-24">
        <div className="mx-auto max-w-5xl px-6">
          <ScrollReveal>
            <h2 className="text-3xl font-medium text-foreground">All Courses</h2>
          </ScrollReveal>
          <div className="mt-12 grid gap-8">
            {courses.map((course, i) => (
              <ScrollReveal key={course.slug} delay={i * 0.1}>
                <Link
                  href={`/courses/${course.slug}`}
                  className="group flex flex-col gap-6 border border-border bg-surface p-6 transition hover:border-brand/30 hover:shadow-md md:flex-row"
                >
                  {course.image && (
                    <div className="relative h-48 w-full shrink-0 overflow-hidden md:h-40 md:w-64">
                      <Image src={course.image} alt="" fill className="object-cover" />
                    </div>
                  )}
                  <div>
                    <span className="text-xs font-medium uppercase tracking-widest text-brand">
                      {course.level}
                    </span>
                    <h3 className="mt-2 text-2xl font-medium text-foreground group-hover:underline">{course.title}</h3>
                    <p className="mt-2 text-muted">{course.description}</p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
