'use client';

import type { HomeFeature, HomepageStat } from '@/types/content';
import { ProductFrame } from '@/components/ui/product-frame';
import { Reveal, RevealItem, RevealStagger } from '@/components/motion/reveal';
import { TeslaButton } from '@/components/ui/tesla-button';

export function FeatureSplit({
  feature,
  stats,
}: {
  feature: HomeFeature;
  stats: HomepageStat[];
}) {
  const featureStats = feature.statLabels
    .map((label) => stats.find((s) => s.label === label))
    .filter(Boolean) as HomepageStat[];

  return (
    <section className="bg-tesla-cream">
      <div className="grid min-h-[100svh] lg:items-stretch lg:grid-cols-2">
        <Reveal className="flex flex-col justify-center px-8 py-16 lg:px-[72px] lg:py-24">
          <h2 className="text-[32px] font-medium leading-tight tracking-[-0.01em] text-tesla-black lg:text-[40px]">
            {feature.title}
          </h2>
          <p className="mt-5 max-w-lg text-[15px] leading-[1.6] text-[#5c5e62]">{feature.description}</p>

          <RevealStagger className="mt-10 grid grid-cols-2 gap-10">
            {featureStats.map((stat) => (
              <RevealItem key={stat.label}>
                <p className="text-[32px] font-medium leading-none text-tesla-black lg:text-[40px]">
                  {stat.value}
                </p>
                <p className="mt-2 text-[14px] text-[#5c5e62]">{stat.label}</p>
              </RevealItem>
            ))}
          </RevealStagger>

          <div className="tesla-cta-row mt-10 max-w-[640px]">
            <TeslaButton
              label={feature.primaryCta.label}
              variant="dark"
              action={feature.primaryCta.action}
              href={feature.primaryCta.href}
              compact
            />
            <TeslaButton
              label={feature.secondaryCta.label}
              variant="secondary-dark"
              href={feature.secondaryCta.href}
              compact
            />
          </div>
        </Reveal>

        <div className="flex items-center justify-center px-8 py-12 lg:px-16 lg:py-24">
          <Reveal direction="fadeIn" className="w-full max-w-xl">
            <ProductFrame src={feature.image} alt={feature.title} aspect="product" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
