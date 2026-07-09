'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { TierService } from '@/types/content';
import { getServiceHero } from '@/lib/images';
import { LazyImage } from '@/components/ui/lazy-image';
import { GsapStagger } from '@/components/motion/gsap-reveal';

export function ServiceCardGrid({ services }: { services: TierService[] }) {
  return (
    <GsapStagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <Link
          key={service.slug}
          href={`/services/${service.slug}`}
          className="group block overflow-hidden rounded-md bg-tesla-gray transition duration-500 hover:shadow-lg"
        >
          <div className="relative aspect-[16/10] overflow-hidden">
            <LazyImage
              src={getServiceHero(service.slug)}
              alt={service.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              wrapperClassName="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
              className="object-cover"
            />
          </div>
          <div className="p-6">
            <span className="text-xs font-medium text-tesla-muted">Tier {service.tier}</span>
            <h3 className="mt-2 text-lg font-medium text-tesla-black">{service.title}</h3>
            <p className="mt-2 line-clamp-2 text-sm text-tesla-body">{service.description}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-tesla-blue">
              Learn more <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </Link>
      ))}
    </GsapStagger>
  );
}

export function TierServiceList({ services }: { services: TierService[] }) {
  return (
    <GsapStagger className="divide-y divide-tesla-gray rounded-md bg-white">
      {services.map((service) => (
        <Link
          key={service.slug}
          href={`/services/${service.slug}`}
          className="group flex flex-col gap-2 px-6 py-6 transition hover:bg-tesla-gray md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h2 className="text-lg font-medium text-tesla-black">{service.title}</h2>
            <p className="mt-1 text-sm text-tesla-body">{service.description}</p>
          </div>
          <ArrowRight className="hidden h-5 w-5 shrink-0 text-tesla-black transition group-hover:translate-x-1 md:block" />
        </Link>
      ))}
    </GsapStagger>
  );
}
