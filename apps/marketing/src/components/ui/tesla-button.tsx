'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useLeadForm } from '@/components/lead-form-provider';

type TeslaButtonVariant = 'primary' | 'secondary' | 'secondary-dark' | 'dark' | 'outline';

interface TeslaButtonProps {
  label: string;
  variant?: TeslaButtonVariant;
  href?: string;
  action?: 'quote' | 'link';
  className?: string;
  fullWidth?: boolean;
  compact?: boolean;
}

const variantClasses: Record<TeslaButtonVariant, string> = {
  primary: 'btn-tesla-primary',
  secondary: 'btn-tesla-secondary',
  'secondary-dark': 'btn-tesla-secondary-dark',
  dark: 'btn-tesla-dark',
  outline: 'btn-tesla-outline',
};

export function TeslaButton({
  label,
  variant = 'primary',
  href,
  action = 'link',
  className,
  fullWidth,
  compact,
}: TeslaButtonProps) {
  const { openForm } = useLeadForm();
  const classes = cn(
    variantClasses[variant],
    fullWidth && 'w-full min-w-0 max-w-none flex-1',
    compact && 'min-w-[200px] sm:min-w-[256px]',
    className,
  );

  if (action === 'quote') {
    return (
      <button type="button" onClick={openForm} className={classes}>
        {label}
      </button>
    );
  }

  if (href) {
    return (
      <Link href={href} className={classes}>
        {label}
      </Link>
    );
  }

  return (
    <button type="button" className={classes}>
      {label}
    </button>
  );
}
