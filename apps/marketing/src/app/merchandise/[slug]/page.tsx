import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductDetail } from '@/components/product-detail';
import { InnerCta } from '@/components/inner-cta';
import { getProduct } from '@/lib/content';

export async function generateStaticParams() {
  const { getSiteContent } = await import('@/lib/content');
  return getSiteContent().products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  return { title: product?.name ?? 'Product', description: product?.description };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  return (
    <>
      <ProductDetail product={product} />
      <InnerCta
        title="Need help choosing?"
        href={`/contact?product=${product.slug}&subject=Merchandise Enquiry: ${encodeURIComponent(product.name)}`}
        buttonLabel="Contact Sales"
      />
    </>
  );
}
