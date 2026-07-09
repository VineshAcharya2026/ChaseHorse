'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TeslaButton } from '@/components/ui/tesla-button';
import { useLeadForm } from './lead-form-provider';

gsap.registerPlugin(ScrollTrigger);

export function InnerCta({
  title = 'Ready to transform your logistics?',
  description = 'Talk to our team and discover how ChaseHorse GELP can scale your operations.',
  href = '/contact',
  buttonLabel = 'Get in Touch',
  useLeadForm: openLeadForm = false,
}: {
  title?: string;
  description?: string;
  href?: string;
  buttonLabel?: string;
  useLeadForm?: boolean;
}) {
  const { openForm } = useLeadForm();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
      },
    );
  }, []);

  return (
    <section className="bg-tesla-black px-6 py-16 md:py-20">
      <div ref={ref} className="mx-auto flex max-w-[1400px] flex-col items-center text-center">
        <h2 className="text-2xl font-medium text-white md:text-[32px]">{title}</h2>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/70">{description}</p>
        <div className="mt-8">
          {openLeadForm ? (
            <TeslaButton label={buttonLabel} variant="primary" action="quote" />
          ) : (
            <TeslaButton label={buttonLabel} variant="primary" href={href} />
          )}
        </div>
      </div>
    </section>
  );
}
