export interface ContentSection {
  type: 'hero' | 'text' | 'modules' | 'list' | 'stats' | 'cta' | 'faq';
  title?: string;
  subtitle?: string;
  body?: string;
  items?: string[];
  modules?: { number: string; title: string; body: string }[];
  stats?: { label: string; value: string }[];
  image?: string;
}

export interface PageContent {
  slug: string;
  title: string;
  description: string;
  heroImage?: string;
  sections: ContentSection[];
}

export interface ProductContent {
  slug: string;
  name: string;
  price: string;
  description: string;
  image: string;
  colors: string[];
  sizes: string[];
}

export interface CourseContent {
  slug: string;
  title: string;
  description: string;
  level: string;
  image?: string;
}

export interface TierService {
  slug: string;
  title: string;
  description: string;
  tier: 1 | 2 | 3;
}

export interface SiteContent {
  home: PageContent;
  contact: PageContent;
  jobs: PageContent;
  services: TierService[];
  products: ProductContent[];
  courses: CourseContent[];
  pages: Record<string, PageContent>;
}
