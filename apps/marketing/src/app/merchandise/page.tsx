import type { Metadata } from 'next';
import { HeroSection } from '@/components/hero-section';
import { ProductShowcase } from '@/components/product-showcase';
import { getSiteContent } from '@/lib/content';

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
        subtitle="Official ChaseHorse apparel and branded gear."
        image="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80"
      />
      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-6">
          <ProductShowcase products={products} />
        </div>
      </section>
    </>
  );
}
