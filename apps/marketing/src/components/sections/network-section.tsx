import Image from 'next/image';
import { Check } from 'lucide-react';

export function NetworkSection({
  bullets,
  stats,
}: {
  bullets: string[];
  stats: { value: string; label: string }[];
}) {
  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              Global Reach, Local Expertise
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-navy md:text-4xl">
              A Worldwide Network That Delivers
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted">
              With operations spanning India, UAE, Saudi Arabia, and Singapore, ChaseHorse connects
              your business to markets worldwide through a strategically positioned logistics
              network.
            </p>
            <ul className="mt-8 space-y-4">
              {bullets.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <span className="text-sm font-medium text-navy">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-section-gray">
            <Image
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&q=80&auto=format"
              alt="Global logistics network map"
              fill
              className="object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-navy/10" />
            {[
              { top: '28%', left: '22%' },
              { top: '35%', left: '48%' },
              { top: '42%', left: '72%' },
              { top: '55%', left: '30%' },
              { top: '62%', left: '58%' },
              { top: '48%', left: '85%' },
            ].map((pos, i) => (
              <span
                key={i}
                className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand shadow-[0_0_0_6px_rgba(0,102,204,0.25)]"
                style={{ top: pos.top, left: pos.left }}
              />
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 border-t border-border pt-10 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-navy">{stat.value}</p>
              <p className="mt-1 text-sm text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
