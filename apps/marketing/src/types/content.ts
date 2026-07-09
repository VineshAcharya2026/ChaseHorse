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

export interface HeroSlideCta {
  label: string;
  action: 'quote' | 'link';
  href?: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image?: string;
  primaryCta: HeroSlideCta;
  secondaryCta: { label: string; href: string };
}

export interface HomeFeature {
  title: string;
  description: string;
  statLabels: string[];
  primaryCta: { label: string; action: 'quote' | 'link'; href?: string };
  secondaryCta: { label: string; href: string };
  image: string;
}

export interface InfoCard {
  title: string;
  description: string;
  image: string;
  ctas: { label: string; href: string; variant?: 'primary' | 'secondary' | 'dark' | 'outline'; action?: 'quote' | 'link' }[];
}

export interface ProductSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  primaryCta: { label: string; action: 'quote' | 'link'; href?: string };
  secondaryCta: { label: string; href: string };
}

export interface HomePageContent extends PageContent {
  heroSlides: HeroSlide[];
  feature: HomeFeature;
  infoCards: InfoCard[];
  secondarySlides: ProductSlide[];
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
  home: HomePageContent;
  contact: PageContent;
  jobs: PageContent;
  services: TierService[];
  products: ProductContent[];
  courses: CourseContent[];
  pages: Record<string, PageContent>;
  testimonials: Testimonial[];
  clients: ClientLogo[];
  faqs: FaqItem[];
  servicePillars: ServicePillar[];
  globalPresence: string[];
  homepageStats: HomepageStat[];
  networkStats: { value: string; label: string }[];
  networkBullets: string[];
  featuredServices: FeaturedService[];
  insights: InsightArticle[];
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
}

export interface ClientLogo {
  name: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ServicePillar {
  title: string;
  subtitle: string;
  items: { title: string; slug: string; href: string }[];
}

export interface HomepageStat {
  value: string;
  label: string;
  icon: 'globe' | 'package' | 'users' | 'warehouse' | 'headset';
}

export interface FeaturedService {
  slug: string;
  title: string;
  description: string;
  icon: 'truck' | 'ship' | 'plane' | 'warehouse' | 'file-check' | 'network';
}

export interface InsightArticle {
  slug: string;
  title: string;
  date: string;
  image: string;
}
