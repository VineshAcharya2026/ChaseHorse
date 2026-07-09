'use client';

import { cn } from '@/lib/utils';

interface CarouselDotsProps {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
  className?: string;
  light?: boolean;
}

export function CarouselDots({
  count,
  activeIndex,
  onSelect,
  className,
  light = true,
}: CarouselDotsProps) {
  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          type="button"
          aria-label={`Go to slide ${index + 1}`}
          onClick={() => onSelect(index)}
          className={cn(
            'h-2 w-2 rounded-full transition-all duration-300',
            index === activeIndex
              ? light
                ? 'bg-white'
                : 'bg-tesla-black'
              : light
                ? 'bg-white/50'
                : 'bg-tesla-black/30',
          )}
        />
      ))}
    </div>
  );
}
