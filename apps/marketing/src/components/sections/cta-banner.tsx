'use client';

import { ArrowRight } from 'lucide-react';
import { useLeadForm } from '@/components/lead-form-provider';
import { GsapReveal } from '@/components/motion/gsap-reveal';

export function CtaBanner() {
  const { openForm } = useLeadForm();

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=80)',
        }}
      />
      <div className="absolute inset-0 bg-brand/90" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <GsapReveal>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/70">Catch the Success</p>
          <h2 className="mt-4 text-balance text-4xl font-bold tracking-tight text-white md:text-5xl">
            Our Team is Here to Help You Scale
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-white/80">
            Build great logistics operations with ChaseHorse GELP — rapid onboarding, transparent platform, enterprise-grade technology.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={openForm}
              className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-brand transition hover:bg-white/90"
            >
              Start A Project
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </button>
            <a
              href="mailto:letsconnect@chasehorse.com"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Get A Quote
            </a>
          </div>
        </GsapReveal>
      </div>
    </section>
  );
}
