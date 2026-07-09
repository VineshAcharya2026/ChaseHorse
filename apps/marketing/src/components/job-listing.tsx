'use client';

import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { GsapReveal } from '@/components/motion/gsap-reveal';
import { TeslaButton } from '@/components/ui/tesla-button';

interface JobListingProps {
  title: string;
  positions: string;
  description: string;
  location: string;
}

export function JobListing({ title, positions, description, location }: JobListingProps) {
  return (
    <GsapReveal>
      <article className="overflow-hidden rounded-md bg-tesla-gray">
        <div className="border-b border-white/50 px-8 py-8 md:px-10">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="text-sm font-medium text-tesla-muted">Open Role</p>
              <h2 className="mt-2 text-2xl font-medium text-tesla-black md:text-3xl">{title}</h2>
              <p className="mt-2 text-sm text-tesla-blue">{positions}</p>
            </div>
            <TeslaButton
              label="Apply Now"
              variant="dark"
              href="/contact?subject=Job Application"
              className="min-w-0 shrink-0"
            />
          </div>
        </div>
        <div className="px-8 py-8 md:px-10">
          <p className="text-[15px] leading-relaxed text-tesla-body">{description}</p>
          <p className="mt-6 flex items-center gap-2 text-sm text-tesla-body">
            <MapPin className="h-4 w-4 text-tesla-muted" />
            {location}
          </p>
        </div>
      </article>
    </GsapReveal>
  );
}
