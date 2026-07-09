import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { InsightArticle } from '@/types/content';

export function InsightsNews({ articles }: { articles: InsightArticle[] }) {
  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              Insights &amp; News
            </p>
            <h2 className="mt-4 text-3xl font-bold text-navy md:text-4xl">
              Stay Updated with Logistics Insights
            </h2>
          </div>
          <Link
            href="/courses"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-brand"
          >
            View All Articles
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href="/courses"
              className="group overflow-hidden rounded-lg border border-border bg-white transition hover:shadow-md"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <p className="text-xs font-medium text-muted">{article.date}</p>
                <h3 className="mt-2 text-base font-bold leading-snug text-navy group-hover:text-brand">
                  {article.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
