'use client';

import { useEffect, useRef } from 'react';
import { LOGISTICS_SHOWCASE } from '@/lib/videos';

function AutoPlayVideo({
  src,
  poster,
  title,
}: {
  src: string;
  poster: string;
  title: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.35 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={title}
      className="h-full w-full object-cover"
    />
  );
}

export function LogisticsVideos() {
  return (
    <section className="relative z-20 border-b border-border bg-white px-6 py-8 shadow-[0_-8px_30px_rgba(12,31,61,0.06)]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">
              Operations in Motion
            </p>
            <h2 className="mt-1 text-lg font-bold text-navy sm:text-xl">
              Logistics excellence, live
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {LOGISTICS_SHOWCASE.map((item) => (
            <article
              key={item.id}
              className="group overflow-hidden rounded-lg border border-border/80 bg-white shadow-sm"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-navy">
                <AutoPlayVideo src={item.src} poster={item.poster} title={item.title} />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-transparent opacity-80" />
                <p className="pointer-events-none absolute bottom-2 left-2 right-2 text-[11px] font-semibold text-white drop-shadow-sm">
                  {item.title}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
