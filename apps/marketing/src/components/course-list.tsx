'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { CourseContent } from '@/types/content';
import { IMAGES } from '@/lib/images';
import { LazyImage } from './ui/lazy-image';
import { GsapStagger } from '@/components/motion/gsap-reveal';

export function CourseList({ courses }: { courses: CourseContent[] }) {
  return (
    <GsapStagger className="grid gap-4">
      {courses.map((course) => (
        <Link
          key={course.slug}
          href={`/courses/${course.slug}`}
          className="group flex flex-col overflow-hidden rounded-md bg-tesla-gray transition duration-500 hover:shadow-lg md:flex-row"
        >
          <LazyImage
            src={course.image ?? IMAGES.pages.courses}
            alt={course.title}
            fill
            sizes="(max-width:768px) 100vw, 320px"
            wrapperClassName="relative h-48 w-full shrink-0 overflow-hidden md:h-52 md:w-80"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="flex flex-col justify-center p-8">
            <span className="text-xs font-medium text-tesla-muted">{course.level}</span>
            <h3 className="mt-2 text-xl font-medium text-tesla-black">{course.title}</h3>
            <p className="mt-2 line-clamp-2 text-sm text-tesla-body">{course.description}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-tesla-blue">
              View course <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </Link>
      ))}
    </GsapStagger>
  );
}
