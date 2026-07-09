'use client';

import type { InfoCard } from '@/types/content';
import { getInfoCardImage } from '@/lib/images';
import { TeslaButton } from '@/components/ui/tesla-button';
import { LazyImage } from '@/components/ui/lazy-image';
import { Reveal } from '@/components/motion/reveal';

export function InfoCards({ cards }: { cards: InfoCard[] }) {
  return (
    <section className="bg-tesla-cream p-3 sm:p-4">
      <div className="grid items-stretch gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <article
            key={card.title}
            className="flex h-full flex-col overflow-hidden rounded-[6px] bg-tesla-cream-deep p-6 md:p-8"
          >
            <Reveal className="pb-2 pt-4 text-center">
              <h3 className="text-[28px] font-medium leading-tight text-tesla-black">{card.title}</h3>
              <p className="mx-auto mt-3 max-w-sm text-[15px] leading-[1.6] text-[#5c5e62]">
                {card.description}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                {card.ctas.map((cta) => (
                  <TeslaButton
                    key={cta.label}
                    label={cta.label}
                    variant={cta.variant === 'outline' ? 'secondary-dark' : 'dark'}
                    action={cta.action}
                    href={cta.href}
                    compact
                  />
                ))}
              </div>
            </Reveal>
            <div className="relative mt-8">
              <LazyImage
                src={getInfoCardImage(card.title, card.image)}
                fallbackSrc={getInfoCardImage(card.title)}
                alt={card.title}
                fill
                framed
                wrapperClassName="relative aspect-[16/10] w-full"
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
