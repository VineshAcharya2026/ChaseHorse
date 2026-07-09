'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import type { ProductContent } from '@/types/content';
import { getProductImage } from '@/lib/images';
import { LazyImage } from './ui/lazy-image';
import { TeslaButton } from '@/components/ui/tesla-button';

export function ProductDetail({ product }: { product: ProductContent }) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    gsap.fromTo(el, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
  }, []);

  return (
    <section className="grid lg:min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="relative min-h-[45vh] lg:min-h-full">
        <LazyImage
          src={getProductImage(product.slug, product.image)}
          alt={product.name}
          fill
          priority
          sizes="(max-width:1024px) 100vw, 50vw"
          wrapperClassName="relative min-h-[45vh] lg:absolute lg:inset-0 lg:min-h-full"
          className="object-cover"
        />
      </div>
      <div
        ref={contentRef}
        className="flex flex-col justify-center bg-white px-8 py-12 lg:px-16 lg:py-20"
      >
        <p className="text-sm font-medium text-tesla-muted">Merchandise</p>
        <h1 className="mt-3 text-3xl font-medium text-tesla-black md:text-[40px]">{product.name}</h1>
        <p className="mt-3 text-xl text-tesla-body">{product.price}</p>
        <p className="mt-6 text-[15px] leading-relaxed text-tesla-body">{product.description}</p>
        <div className="mt-8 space-y-2 text-sm text-tesla-body">
          <p>
            <span className="font-medium text-tesla-black">Colors:</span> {product.colors.join(', ')}
          </p>
          <p>
            <span className="font-medium text-tesla-black">Sizes:</span> {product.sizes.join(', ')}
          </p>
        </div>
        <div className="mt-10">
          <TeslaButton
            label="Enquire Now"
            variant="dark"
            href={`/contact?product=${product.slug}&subject=Merchandise Enquiry: ${product.name}`}
          />
        </div>
      </div>
    </section>
  );
}
