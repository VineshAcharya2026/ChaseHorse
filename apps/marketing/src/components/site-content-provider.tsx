'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { SiteContent } from '@/types/content';

export interface SiteNavigation {
  header?: { label: string; href: string }[];
}

export type RuntimeSiteContent = SiteContent & { navigation?: SiteNavigation };

const SiteContentContext = createContext<RuntimeSiteContent | null>(null);

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

/**
 * Hydrates with the build-time bundled content for instant first paint, then
 * fetches the live CMS payload and swaps it in. The CMS is the source of truth
 * at runtime; the bundle is the offline/SSR fallback.
 */
export function SiteContentProvider({
  initial,
  children,
}: {
  initial: RuntimeSiteContent;
  children: ReactNode;
}) {
  const [content, setContent] = useState<RuntimeSiteContent>(initial);

  useEffect(() => {
    if (!API_URL) return;
    let active = true;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/cms/public/site`);
        if (!res.ok) return;
        const json = (await res.json()) as { success: boolean; data: RuntimeSiteContent | null };
        if (active && json.data) {
          setContent(json.data);
          // Content (and image heights) may have changed — recompute scroll positions.
          const [{ ScrollTrigger }] = await Promise.all([import('gsap/ScrollTrigger')]);
          requestAnimationFrame(() => ScrollTrigger.refresh());
        }
      } catch {
        // Keep bundled content on any failure.
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return <SiteContentContext.Provider value={content}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent(): RuntimeSiteContent {
  const ctx = useContext(SiteContentContext);
  if (!ctx) {
    throw new Error('useSiteContent must be used within SiteContentProvider');
  }
  return ctx;
}
