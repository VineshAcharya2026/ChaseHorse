import type { FeaturedService } from '@/types/content';

/**
 * Locally hosted images (in /public/images) — guaranteed to load on the static
 * Cloudflare Pages export with no external hotlink dependency. Curated for a
 * cohesive, cinematic logistics aesthetic.
 */
const L = (name: string) => `/images/${name}.jpg`;

export const IMAGES = {
  home: {
    gelp: L('port-yard'),
    tier1: L('warehouse-scan'),
    digital: L('analytics'),
    fleet: L('trucks-highway'),
    feature: L('ship-sunset'),
    quickDeploy: L('packaging'),
    platformResources: L('warehouse-aisle'),
    esg: L('wind-turbines'),
    tier2: L('warehouse-worker'),
    tier3: L('port-topdown'),
    network: L('port-topdown'),
  },
  featured: {
    truck: L('truck-mountain'),
    ship: L('ship-msc'),
    plane: L('airplane'),
    warehouse: L('warehouse-aisle'),
    customs: L('containers'),
    supplyChain: L('ship-aerial'),
  },
  pages: {
    contact: L('team-meeting'),
    jobs: L('team-meeting'),
    courses: L('team-meeting'),
    merchandise: L('box-minimal'),
    services: L('port-yard'),
    tier1: L('warehouse-scan'),
    tier2: L('warehouse-worker'),
    tier3: L('port-topdown'),
  },
  products: {
    chGhost: L('travel-bag'),
    instinct: L('box-minimal'),
    logo: L('packaging'),
    dragon: L('industrial-night'),
  },
  insights: {
    supplyChain2024: L('port-yard'),
    technology: L('analytics'),
    sustainability: L('wind-turbines'),
  },
  tiers: {
    tier1: L('warehouse-scan'),
    tier2: L('warehouse-worker'),
    tier3: L('port-topdown'),
  },
  // Legacy flat keys for backward compatibility
  hero: L('port-hero'),
  logistics: L('port-yard'),
  warehouse: L('warehouse-aisle'),
  fleet: L('trucks-highway'),
  team: L('team-meeting'),
  digital: L('analytics'),
  tech: L('industrial-night'),
  optimize: L('analytics'),
  contact: L('team-meeting'),
  jobs: L('team-meeting'),
  shop: L('box-minimal'),
  product: L('packaging'),
} as const;

const SERVICE_HERO: Record<string, string> = {
  'digital-transformation': L('analytics'),
  'ch-deploy': L('warehouse-scan'),
  '8d-customer-complaints': L('support'),
  'merchandise-ppes': L('packaging'),
  'returns-management': L('last-mile'),
  'digital-advancement': L('analytics'),
  'optimization-tools': L('analytics'),
  'deploy-cdx-pro': L('last-mile'),
  'fleet-driver-management': L('trucks-highway'),
  'esg-sustainability': L('wind-turbines'),
  'customer-xperience-management': L('support'),
  'it-advanced-technologies': L('industrial-night'),
  'operational-advancement': L('warehouse-scan'),
  'fleet-operations': L('truck-mountain'),
  'scm-process': L('port-yard'),
  'sustainability-monitoring': L('mountains'),
  'compliance-governance': L('containers'),
};

const HOME_SLIDE_IMAGES: Record<string, string> = {
  gelp: L('port-hero'),
  tier1: L('warehouse-scan'),
  digital: L('analytics'),
  fleet: L('trucks-highway'),
  esg: L('wind-turbines'),
  tier2: L('ship-sunset'),
  tier3: L('port-topdown'),
};

const INFO_CARD_IMAGES: Record<string, string> = {
  'Quick Deploy': L('packaging'),
  'Platform Resources': L('warehouse-aisle'),
};

const PRODUCT_IMAGES: Record<string, string> = {
  'ch-ghost': IMAGES.products.chGhost,
  instinct: IMAGES.products.instinct,
  'chasehorse-logo': IMAGES.products.logo,
  dragon: IMAGES.products.dragon,
};

const INSIGHT_IMAGES: Record<string, string> = {
  'global-supply-chains-2024': IMAGES.insights.supplyChain2024,
  'technology-logistics': IMAGES.insights.technology,
  'sustainable-logistics': IMAGES.insights.sustainability,
};

/** Fallback used when a remote/broken source fails to load. */
export const FALLBACK_IMAGE = IMAGES.logistics;

/**
 * Normalizes an image source. Local paths pass through untouched; any leftover
 * external URL that fails is handled by the SafeImage onError fallback.
 */
export function imageUrl(src: string): string {
  return src;
}

export function getServiceHero(slug: string): string {
  return SERVICE_HERO[slug] ?? IMAGES.logistics;
}

export function getFeaturedServiceImage(icon: FeaturedService['icon']): string {
  const map: Record<FeaturedService['icon'], string> = {
    truck: IMAGES.featured.truck,
    ship: IMAGES.featured.ship,
    plane: IMAGES.featured.plane,
    warehouse: IMAGES.featured.warehouse,
    'file-check': IMAGES.featured.customs,
    network: IMAGES.featured.supplyChain,
  };
  return map[icon] ?? IMAGES.logistics;
}

export function getHomeSlideImage(id: string, fallback?: string): string {
  return HOME_SLIDE_IMAGES[id] ?? fallback ?? IMAGES.hero;
}

export function getInfoCardImage(title: string, fallback?: string): string {
  return INFO_CARD_IMAGES[title] ?? fallback ?? IMAGES.warehouse;
}

export function getProductImage(slug: string, fallback?: string): string {
  return PRODUCT_IMAGES[slug] ?? fallback ?? IMAGES.product;
}

export function getInsightImage(slug: string, fallback?: string): string {
  return INSIGHT_IMAGES[slug] ?? fallback ?? IMAGES.logistics;
}
