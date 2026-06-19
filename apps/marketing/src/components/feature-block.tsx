import Image from 'next/image';
import Link from 'next/link';
import { ScrollReveal } from './scroll-reveal';
import { cn } from '@/lib/utils';
import { IMAGES } from '@/lib/images';

interface FeatureBlockProps {
  title: string;
  subtitle?: string;
  body?: string;
  items?: string[];
  image?: string;
  reverse?: boolean;
  variant?: 'default' | 'surface';
  cta?: { label: string; href: string };
}

export function FeatureBlock({
  title,
  subtitle,
  body,
  items,
  image,
  reverse,
  variant = 'default',
  cta,
}: FeatureBlockProps) {
  const bgImage = image ?? IMAGES.logistics;

  return (
    <section
      className={cn(
        'relative min-h-[85vh] overflow-hidden',
        variant === 'surface' ? 'bg-surface text-foreground' : 'bg-background text-foreground',
      )}
    >
      <div className={cn('grid min-h-[85vh] lg:grid-cols-2', reverse && 'lg:[direction:rtl]')}>
        <div className={cn('relative min-h-[40vh] lg:min-h-full', reverse && 'lg:[direction:ltr]')}>
          <Image src={bgImage} alt="" fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
        </div>
        <div
          className={cn(
            'flex flex-col justify-center px-8 py-16 lg:px-16 lg:py-24',
            reverse && 'lg:[direction:ltr]',
          )}
        >
          <ScrollReveal>
            {subtitle && (
              <p className="mb-3 text-sm font-medium uppercase tracking-widest text-brand">{subtitle}</p>
            )}
            <h2 className="text-balance text-4xl font-medium tracking-tight md:text-5xl">{title}</h2>
            {body && (
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">{body}</p>
            )}
            {items && items.length > 0 && (
              <ul className="mt-8 space-y-3">
                {items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm md:text-base">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
            {cta && (
              <Link
                href={cta.href}
                className="mt-10 inline-block rounded-sm bg-foreground px-8 py-3 text-sm font-medium text-background transition hover:opacity-90"
              >
                {cta.label}
              </Link>
            )}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
