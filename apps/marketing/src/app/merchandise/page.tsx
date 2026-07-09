import type { Metadata } from 'next';
import { HeroSection } from '@/components/hero-section';
import { ProductShowcase } from '@/components/product-showcase';
import { PageSection } from '@/components/page-section';
import { InnerCta } from '@/components/inner-cta';
import { getSiteContent } from '@/lib/content';
import { IMAGES } from '@/lib/images';

export const metadata: Metadata = {
  title: 'Merchandise',
  description: 'ChaseHorse official merchandise — apparel and branded gear.',
};

export default function MerchandisePage() {
  const products = getSiteContent().products;

  return (
    <>
      <HeroSection
        title="Merchandise"
        tagline="Official Store"
        subtitle="Official ChaseHorse apparel and branded gear."
        image={IMAGES.shop}
      />
      <PageSection variant="white" title="Shop Collection" subtitle="ChaseHorse Gear" reveal={false}>
        <ProductShowcase products={products} />
      </PageSection>
      <InnerCta
        title="Bulk orders for your team?"
        href="/contact?subject=Merchandise Bulk Order"
        buttonLabel="Enquire Now"
      />
    </>
  );
}
