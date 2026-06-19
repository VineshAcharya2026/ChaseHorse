import Image from 'next/image';
import Link from 'next/link';
import type { ProductContent } from '@/types/content';
import { ScrollReveal } from './scroll-reveal';

export function ProductShowcase({ products }: { products: ProductContent[] }) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product, i) => (
        <ScrollReveal key={product.slug} delay={i * 0.08}>
          <Link href={`/merchandise/${product.slug}`} className="group block">
            <div className="relative aspect-square overflow-hidden bg-surface">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width:768px) 50vw, 25vw"
              />
            </div>
            <h3 className="mt-4 text-lg font-medium text-foreground">{product.name}</h3>
            <p className="text-sm text-muted">{product.price}</p>
          </Link>
        </ScrollReveal>
      ))}
    </div>
  );
}
