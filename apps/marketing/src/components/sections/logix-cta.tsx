'use client';

import { useLeadForm } from '@/components/lead-form-provider';
import { BrandLogo } from '@/components/brand-logo';
import { LOGISTICS_VIDEOS } from '@/lib/videos';

export function LogixCta() {
  const { openForm } = useLeadForm();

  return (
    <section className="relative overflow-hidden py-16">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        src={LOGISTICS_VIDEOS.featured}
        className="absolute inset-0 h-full w-full scale-105 object-cover"
        poster={LOGISTICS_VIDEOS.featuredPoster}
      />
      <div className="absolute inset-0 bg-navy/85" />

      <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
        <div className="flex justify-center">
          <BrandLogo variant="light" />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl">
          Ready to Simplify Your Logistics?
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/70 sm:text-base">
          Let&apos;s build a smarter, faster and more efficient supply chain together.
        </p>
        <button
          type="button"
          onClick={openForm}
          className="mt-7 rounded-md bg-white px-7 py-3 text-sm font-semibold text-navy shadow-lg transition hover:bg-white/92"
        >
          Get a Free Quote
        </button>
      </div>
    </section>
  );
}
