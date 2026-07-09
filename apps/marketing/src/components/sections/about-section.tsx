import Image from 'next/image';
import Link from 'next/link';
import { GsapReveal } from '@/components/motion/gsap-reveal';
import { SectionLabel, SectionTitle } from './section-heading';
import { ArrowRight } from 'lucide-react';

export function AboutSection({
  title,
  body,
  image,
}: {
  title: string;
  body?: string;
  image: string;
}) {
  return (
    <section className="bg-background py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
        <GsapReveal>
          <SectionLabel>What We Do</SectionLabel>
          <SectionTitle className="mt-4">{title}</SectionTitle>
          {body && <p className="mt-6 text-lg leading-relaxed text-muted">{body}</p>}
          <Link
            href="/services"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand/90"
          >
            Explore Services <ArrowRight className="h-4 w-4" />
          </Link>
        </GsapReveal>
        <GsapReveal delay={0.2} y={40}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image src={image} alt="" fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
          </div>
        </GsapReveal>
      </div>
    </section>
  );
}
