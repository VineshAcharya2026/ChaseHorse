import { cn } from '@/lib/utils';

export function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('text-xs font-semibold uppercase tracking-[0.2em] text-brand', className)}>
      {children}
    </p>
  );
}

export function SectionTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2 className={cn('text-3xl font-bold leading-tight text-navy md:text-4xl', className)}>
      {children}
    </h2>
  );
}

export function SectionTagline({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-10 flex items-center justify-center gap-4">
      <span className="hidden h-px flex-1 bg-border sm:block" />
      <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted">
        {children}
      </p>
      <span className="hidden h-px flex-1 bg-border sm:block" />
    </div>
  );
}
