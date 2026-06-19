import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { HeroSection } from '@/components/hero-section';
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
      <section className="grid min-h-screen lg:grid-cols-2">
        <div className="relative min-h-[50vh] lg:min-h-screen">
          <Image src={product.image} alt={product.name} fill className="object-cover" priority />
        </div>
        <div className="flex flex-col justify-center bg-background px-8 py-16 lg:px-16">
          <h1 className="text-4xl font-medium tracking-tight text-foreground md:text-5xl">{product.name}</h1>
          <p className="mt-4 text-2xl text-foreground">{product.price}</p>
          <p className="mt-6 text-muted">{product.description}</p>
          <div className="mt-8">
            <p className="text-sm text-muted">Colors: {product.colors.join(', ')}</p>
            <p className="mt-2 text-sm text-muted">Sizes: {product.sizes.join(', ')}</p>
          </div>
          <Link
            href={`/contact?product=${product.slug}&subject=Merchandise Enquiry: ${product.name}`}
            className="mt-10 inline-block w-full rounded-sm bg-foreground py-3 text-center text-sm font-medium text-background hover:opacity-90 sm:w-auto sm:px-12"
          >
            Enquire Now
          </Link>
        </div>
      </section>
    </>
  );
}
