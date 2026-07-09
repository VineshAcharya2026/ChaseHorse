'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TeslaButton } from '@/components/ui/tesla-button';

interface TeslaHeroContentProps {
  title: string;
  subtitle?: string;
  primaryCta?: { label: string; action?: 'quote' | 'link'; href?: string };
  secondaryCta?: { label: string; href: string };
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

export function TeslaHeroContent({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  className,
  titleClassName,
  subtitleClassName,
}: TeslaHeroContentProps) {
  return (
    <motion.div
      className={cn('flex flex-col items-center px-6 text-center', className)}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <h1 className={cn('tesla-hero-title', titleClassName)}>{title}</h1>
      {subtitle && <p className={cn('tesla-hero-subtitle', subtitleClassName)}>{subtitle}</p>}
      {(primaryCta || secondaryCta) && (
        <div className="tesla-cta-row mt-6">
          {primaryCta && (
            <TeslaButton
              label={primaryCta.label}
              variant="primary"
              action={primaryCta.action ?? 'link'}
              href={primaryCta.href}
              compact
            />
          )}
          {secondaryCta && (
            <TeslaButton label={secondaryCta.label} variant="secondary" href={secondaryCta.href} compact />
          )}
        </div>
      )}
    </motion.div>
  );
}
