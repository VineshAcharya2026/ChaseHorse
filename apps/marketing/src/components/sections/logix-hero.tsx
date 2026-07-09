'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { useLeadForm } from '@/components/lead-form-provider';
import { LOGISTICS_VIDEOS } from '@/lib/videos';

export function LogixHero() {
  const { openForm } = useLeadForm();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;

    const tryPlay = () => {
      void video.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    };

    tryPlay();
    video.addEventListener('loadeddata', tryPlay);
    video.addEventListener('canplay', tryPlay);

    return () => {
      video.removeEventListener('loadeddata', tryPlay);
      video.removeEventListener('canplay', tryPlay);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  return (
    <section className="relative h-[min(88vh,780px)] min-h-[520px] overflow-hidden">
      <video
        ref={videoRef}
        src={LOGISTICS_VIDEOS.hero}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full scale-105 object-cover"
        poster={LOGISTICS_VIDEOS.heroPoster}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy/92 via-navy/55 to-navy/15" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 pb-14 pt-24">
        <div className="max-w-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/65">
            Global Logistics, Endless Possibilities.
          </p>
          <h1 className="mt-4 text-[2rem] font-bold leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-5xl">
            Connecting the World.{' '}
            <span className="bg-gradient-to-r from-sky-300 via-brand to-blue-200 bg-clip-text text-transparent">
              Delivering Excellence.
            </span>
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/72 sm:text-base">
            End-to-end logistics and supply chain solutions that connect businesses to the world.
            Faster. Smarter. More Reliable.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/services"
              className="group inline-flex items-center gap-2 rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand/25 transition hover:bg-brand/90"
            >
              Explore Solutions
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <button
              type="button"
              onClick={openForm}
              className="group inline-flex items-center gap-2 rounded-md border border-white/35 bg-white/8 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15"
            >
              Get a Quote
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-6 z-10 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/25 px-2 py-1.5 backdrop-blur-md">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? 'Pause video' : 'Play video'}
          className="flex h-7 w-7 items-center justify-center rounded-full text-white/75 transition hover:bg-white/10 hover:text-white"
        >
          {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </button>
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? 'Unmute' : 'Mute'}
          className="flex h-7 w-7 items-center justify-center rounded-full text-white/75 transition hover:bg-white/10 hover:text-white"
        >
          {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
        </button>
      </div>
    </section>
  );
}
