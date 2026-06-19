import Link from 'next/link';
import { ScrollReveal } from './scroll-reveal';

interface JobListingProps {
  title: string;
  positions: string;
  description: string;
  location: string;
}

export function JobListing({ title, positions, description, location }: JobListingProps) {
  return (
    <ScrollReveal>
      <div className="border border-border bg-background p-8 md:p-12">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-medium text-foreground">{title}</h2>
            <p className="mt-2 text-brand">{positions}</p>
          </div>
          <Link
            href="/contact?subject=Job Application"
            className="rounded-sm bg-foreground px-6 py-2 text-sm font-medium text-background hover:opacity-90"
          >
            Apply Now
          </Link>
        </div>
        <p className="mt-6 text-lg leading-relaxed text-muted">{description}</p>
        <p className="mt-4 text-sm text-muted">{location}</p>
      </div>
    </ScrollReveal>
  );
}
