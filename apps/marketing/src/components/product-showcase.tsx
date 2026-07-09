'use client';

import Link from 'next/link';
import type { ProductContent } from '@/types/content';
import { getProductImage } from '@/lib/images';
import { LazyImage } from './ui/lazy-image';
import { GsapStagger } from '@/components/motion/gsap-reveal';

export function ProductShowcase({ products }: { products: ProductContent[] }) {
  return (
    <GsapStagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <Link key={product.slug} href={`/merchandise/${product.slug}`} className="group block">
          <div className="overflow-hidden rounded-[6px] border border-tesla-frameBorder bg-tesla-frame transition duration-500 hover:shadow-md">
            <LazyImage
              src={getProductImage(product.slug, product.image)}
              alt={product.name}
              fill
              sizes="(max-width:768px) 50vw, 25vw"
              wrapperClassName="relative aspect-square w-full overflow-hidden bg-tesla-cream"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="p-5 text-center">
              <h3 className="font-medium text-tesla-black">{product.name}</h3>
              <p className="mt-1 text-sm text-tesla-body">{product.price}</p>
            </div>
          </div>
        </Link>
      ))}
    </GsapStagger>
  );
}
