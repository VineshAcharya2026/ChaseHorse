import { cn } from '@/lib/utils';

export function BrandLogo({
  className,
  variant = 'light',
  minimal = false,
}: {
  className?: string;
  variant?: 'light' | 'dark';
  minimal?: boolean;
}) {
  const textColor = variant === 'light' ? 'text-white' : 'text-tesla-black';

  if (minimal) {
    return (
      <span
        className={cn(
          'text-[17px] font-medium uppercase tracking-[0.15em]',
          textColor,
          className,
        )}
      >
        ChaseHorse
      </span>
    );
  }

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor">
          <path d="M4 18h16v2H4v-2zm2-4h12l1-8H5l1 8zm3-10h6l1 4H8l1-4z" />
        </svg>
      </div>
      <div className={cn('leading-tight', textColor)}>
        <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] opacity-80">
          ChaseHorse
        </span>
        <span className="block text-sm font-bold uppercase tracking-wide">Logistics</span>
      </div>
    </div>
  );
}
