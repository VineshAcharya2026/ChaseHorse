'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GsapReveal } from '@/components/motion/gsap-reveal';
import { SectionLabel, SectionTitle } from './section-heading';

gsap.registerPlugin(ScrollTrigger);

interface Stat {
  label: string;
  value: string;
}

function AnimatedStat({ value, label }: Stat) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const numeric = parseInt(value.replace(/\D/g, ''), 10);
    const suffix = value.replace(/[0-9]/g, '');
    if (isNaN(numeric)) {
      setDisplay(value);
      return;
    }

    const obj = { val: 0 };
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        val: numeric,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
        onUpdate: () => setDisplay(`${Math.round(obj.val)}${suffix}`),
      });
    }, ref);

    return () => ctx.revert();
  }, [value]);

  return (
    <div className="text-center">
      <p ref={ref} className="text-5xl font-bold text-foreground md:text-7xl">
        {display}
      </p>
      <p className="mt-2 text-sm text-muted">{label}</p>
    </div>
  );
}

export function StatsCounter({
  title,
  subtitle,
  stats,
  body,
}: {
  title: string;
  subtitle: string;
  stats: Stat[];
  body?: string;
}) {
  return (
    <section className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <GsapReveal>
          <SectionLabel>{subtitle}</SectionLabel>
          <SectionTitle className="mt-4">{title}</SectionTitle>
        </GsapReveal>

        <div className="mt-16 grid grid-cols-2 gap-12 md:grid-cols-4">
          {stats.map((stat) => (
            <AnimatedStat key={stat.label} {...stat} />
          ))}
        </div>

        {body && (
          <GsapReveal className="mt-16">
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted">{body}</p>
          </GsapReveal>
        )}
      </div>
    </section>
  );
}
