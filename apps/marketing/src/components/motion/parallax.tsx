'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /** Total travel distance in pixels across the scroll range. Higher = stronger. */
  strength?: number;
}

/**
 * Subtle scroll-driven parallax. The inner layer is intentionally oversized so
 * the vertical drift never reveals an empty edge. Disabled under reduced motion.
 */
export function Parallax({ children, className, strength = 60 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-strength, strength]);

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      {reducedMotion ? (
        <div className="absolute inset-0">{children}</div>
      ) : (
        <motion.div style={{ y }} className="absolute -inset-y-[12%] inset-x-0">
          {children}
        </motion.div>
      )}
    </div>
  );
}
