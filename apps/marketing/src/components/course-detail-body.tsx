'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import type { CourseContent } from '@/types/content';
import { TeslaButton } from '@/components/ui/tesla-button';

export function CourseDetailBody({ course }: { course: CourseContent }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.fromTo(el, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
  }, []);

  return (
    <section className="bg-white py-14 md:py-20">
      <div ref={ref} className="mx-auto max-w-3xl px-6">
        <div className="rounded-md bg-tesla-gray p-8 md:p-10">
          <p className="text-[15px] leading-relaxed text-tesla-body">{course.description}</p>
          <p className="mt-6 text-sm font-medium text-tesla-muted">Level: {course.level}</p>
        </div>
        <div className="mt-8">
          <TeslaButton
            label="Request Enrollment"
            variant="dark"
            href={`/contact?subject=Course Enquiry: ${course.title}`}
          />
        </div>
      </div>
    </section>
  );
}
