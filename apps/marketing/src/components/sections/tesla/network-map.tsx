'use client';

import { Zap, Plug } from 'lucide-react';
import { IMAGES } from '@/lib/images';
import { TeslaButton } from '@/components/ui/tesla-button';
import { LazyImage } from '@/components/ui/lazy-image';
import { Reveal, RevealItem, RevealStagger } from '@/components/motion/reveal';

const MAP_DOTS = [
  { top: '30%', left: '18%' },
  { top: '38%', left: '42%' },
  { top: '45%', left: '68%' },
  { top: '58%', left: '28%' },
  { top: '52%', left: '82%' },
  { top: '65%', left: '55%' },
];

export function NetworkMap({
  stats,
  bullets,
}: {
  stats: { value: string; label: string }[];
  bullets: string[];
}) {
  const primaryStats = stats.slice(0, 2);

  return (
    <section className="bg-tesla-cream">
      <div className="mx-auto max-w-[1200px] px-8 pt-14 md:pt-20">
        <Reveal direction="fadeIn">
          <div className="product-frame relative aspect-[2/1] w-full min-h-[240px] sm:min-h-[320px]">
            <LazyImage
              src={IMAGES.home.network}
              fallbackSrc={IMAGES.logistics}
              alt="Global logistics network"
              fill
              wrapperClassName="absolute inset-0"
              className="object-cover"
              sizes="100vw"
            />
            {MAP_DOTS.map((pos, i) => (
              <span
                key={i}
                className="absolute z-10 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e82127] shadow-[0_0_0_4px_rgba(232,33,39,0.25)]"
                style={{ top: pos.top, left: pos.left }}
              />
            ))}
          </div>
        </Reveal>
      </div>

      <div className="mx-auto grid max-w-[1200px] gap-12 px-8 py-14 md:grid-cols-2 md:items-start md:py-20">
        <Reveal>
          <h2 className="text-[28px] font-medium leading-tight text-tesla-black md:text-[32px]">
            Find Your Hub
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-[1.6] text-[#5c5e62]">
            {bullets[0] ?? 'Strategic Global Network'} — ChaseHorse connects your business to
            markets worldwide through a strategically positioned logistics network.
          </p>
          <div className="tesla-cta-row mt-8 max-w-[520px]">
            <TeslaButton label="View Network" variant="dark" href="/services" compact />
            <TeslaButton label="Learn More" variant="secondary-dark" href="/contact" compact />
          </div>
        </Reveal>

        <RevealStagger className="space-y-8">
          {primaryStats.map((stat, i) => (
            <RevealItem key={stat.label} className="flex items-baseline gap-4">
              <div className="text-tesla-black">
                {i === 0 ? <Zap className="h-6 w-6" strokeWidth={1.5} /> : <Plug className="h-6 w-6" strokeWidth={1.5} />}
              </div>
              <div>
                <p className="text-[32px] font-medium leading-none text-tesla-black">{stat.value}</p>
                <p className="mt-1 text-[14px] text-[#5c5e62]">{stat.label}</p>
              </div>
            </RevealItem>
          ))}
          <RevealItem className="grid grid-cols-2 gap-6 border-t border-[#e8e8e8] pt-6">
            {stats.slice(2).map((stat) => (
              <div key={stat.label}>
                <p className="text-[24px] font-medium text-tesla-black">{stat.value}</p>
                <p className="mt-1 text-[13px] text-[#5c5e62]">{stat.label}</p>
              </div>
            ))}
          </RevealItem>
        </RevealStagger>
      </div>
    </section>
  );
}
