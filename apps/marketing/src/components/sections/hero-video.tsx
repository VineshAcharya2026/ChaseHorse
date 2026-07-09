'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useLeadForm } from '@/components/lead-form-provider';

const HERO_VIDEO =
  'https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_30fps.mp4';

interface HeroVideoProps {
  tagline: string;
  title: string;
  subtitle: string;
  body?: string;
}

export function HeroVideo({ tagline, title, subtitle, body }: HeroVideoProps) {
  const { openForm } = useLeadForm();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: 'power3.out' },
      );
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: 80 },
          { opacity: 1, y: 0, duration: 1.2, delay: 0.1, ease: 'power4.out' },
        );
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        poster="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=80"
      >
        <source src={HERO_VIDEO} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

      <div ref={contentRef} className="relative z-10 mx-auto max-w-5xl px-6 py-32 text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
          {tagline}
        </p>
        <h1
          ref={titleRef}
          className="text-balance text-5xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl"
        >
          {title}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80 md:text-xl">{subtitle}</p>
        {body && (
          <p className="mx-auto mt-4 max-w-xl text-sm tracking-widest text-white/60">{body}</p>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={openForm}
            className="group inline-flex min-w-[200px] items-center justify-center gap-2 rounded-full bg-brand px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-brand/90"
          >
            Let&apos;s Get Started
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </button>
          <Link
            href="/services"
            className="inline-flex min-w-[200px] items-center justify-center rounded-full border border-white/40 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            See Our Services
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce text-white/50">
        <ChevronDown className="h-6 w-6" />
      </div>
    </section>
  );
}
