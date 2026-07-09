import Link from 'next/link';
import {
  ArrowRight,
  FileCheck,
  Network,
  Plane,
  Ship,
  Truck,
  Warehouse,
} from 'lucide-react';
import type { FeaturedService } from '@/types/content';

const ICONS = {
  truck: Truck,
  ship: Ship,
  plane: Plane,
  warehouse: Warehouse,
  'file-check': FileCheck,
  network: Network,
} as const;

export function ServicesShowcase({ services }: { services: FeaturedService[] }) {
  return (
    <section className="bg-white py-14">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2 lg:gap-12">
        <div className="lg:pr-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">What We Do</p>
          <h2 className="mt-4 text-3xl font-bold leading-tight text-navy md:text-4xl">
            Comprehensive Logistics Solutions to Power Your Business
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted">
            From freight forwarding to warehousing and customs clearance, we deliver integrated
            logistics solutions tailored to your business needs — powered by the ChaseHorse GELP
            platform.
          </p>
          <Link
            href="/services"
            className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand"
          >
            View All Services
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {services.map((service) => {
            const Icon = ICONS[service.icon];
            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group flex flex-col rounded-lg border border-border/80 bg-white p-5 transition hover:border-brand/25 hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <h3 className="mt-5 text-base font-bold text-navy">{service.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {service.description}
                </p>
                <span className="mt-5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 text-brand transition group-hover:bg-brand group-hover:text-white">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
