import { cn } from '@/lib/utils';
import { GsapReveal } from '@/components/motion/gsap-reveal';

const VARIANTS = {
  white: 'bg-white text-tesla-black',
  gray: 'bg-tesla-gray text-tesla-black',
  dark: 'bg-tesla-black text-white',
} as const;

export function PageSection({
  children,
  variant = 'white',
  className,
  containerClassName,
  title,
  subtitle,
  reveal = true,
}: {
  children: React.ReactNode;
  variant?: keyof typeof VARIANTS;
  className?: string;
  containerClassName?: string;
  title?: string;
  subtitle?: string;
  reveal?: boolean;
}) {
  const header =
    title || subtitle ? (
      <div className="mb-10 max-w-2xl">
        {subtitle && <p className="tesla-body">{subtitle}</p>}
        {title && (
          <h2
            className={cn(
              'tesla-section-title',
              subtitle && 'mt-2',
              variant === 'dark' && 'text-white',
            )}
          >
            {title}
          </h2>
        )}
      </div>
    ) : null;

  const body = (
    <div className={cn('mx-auto max-w-[1400px] px-6', containerClassName)}>
      {header}
      {children}
    </div>
  );

  return (
    <section className={cn('py-14 md:py-20', VARIANTS[variant], className)}>
      {reveal ? <GsapReveal>{body}</GsapReveal> : body}
    </section>
  );
}
