import type { SiteContent } from '@/types/content';
import siteData from '@content/site.json';

export function getSiteContent(): SiteContent {
  return siteData as SiteContent;
}

export function getPage(slug: string) {
  const content = getSiteContent();
  return content.pages[slug] ?? null;
}

export function getService(slug: string) {
  return getSiteContent().services.find((s) => s.slug === slug);
}

export function getProduct(slug: string) {
  return getSiteContent().products.find((p) => p.slug === slug);
}

export function getCourse(slug: string) {
  return getSiteContent().courses.find((c) => c.slug === slug);
}

export function getServicesByTier(tier: 1 | 2 | 3) {
  return getSiteContent().services.filter((s) => s.tier === tier);
}
