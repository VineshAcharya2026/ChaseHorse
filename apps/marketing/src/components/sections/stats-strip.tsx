import { Globe, Headphones, Package, Users, Warehouse } from 'lucide-react';
import type { HomepageStat } from '@/types/content';
import { SectionTagline } from './section-heading';

const ICONS = {
  globe: Globe,
  package: Package,
  users: Users,
  warehouse: Warehouse,
  headset: Headphones,
} as const;

export function StatsStrip({ stats }: { stats: HomepageStat[] }) {
  return (
    <section className="border-y border-border bg-section-gray py-12">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTagline>Driven by Trust, Delivered with Impact.</SectionTagline>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5 lg:gap-6">
          {stats.map((stat) => {
            const Icon = ICONS[stat.icon];
            return (
              <div key={stat.label} className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <p className="mt-4 text-3xl font-bold text-navy">{stat.value}</p>
                <p className="mt-1 text-sm text-muted">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
