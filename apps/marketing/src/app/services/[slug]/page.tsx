import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { HeroSection } from '@/components/hero-section';
import { ServiceModules } from '@/components/service-modules';
import { ScrollReveal } from '@/components/scroll-reveal';
import { getPage, getService } from '@/lib/content';

export async function generateStaticParams() {
  const { getSiteContent } = await import('@/lib/content');
  return getSiteContent().services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  const page = getPage(slug);
  return {
    title: service?.title ?? page?.title ?? 'Service',
    description: service?.description ?? page?.description,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  const page = getPage(slug);
  if (!service) notFound();

  const heroImage = page?.heroImage ?? 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=80';
  const textSection = page?.sections.find((s) => s.type === 'text');
  const modulesSection = page?.sections.find((s) => s.type === 'modules');
  const listSection = page?.sections.find((s) => s.type === 'list');

  return (
    <>
      <HeroSection
        title={service.title}
        subtitle={textSection?.subtitle ?? `Tier ${service.tier}`}
        image={heroImage}
        primaryCta={{ label: 'Contact Us', href: '/contact' }}
        secondaryCta={{ label: 'All Services', href: '/services' }}
      />

      {textSection?.body && (
        <section className="bg-background py-24">
          <div className="mx-auto max-w-3xl px-6">
            <ScrollReveal>
              <p className="text-xl leading-relaxed text-muted">{textSection.body}</p>
            </ScrollReveal>
          </div>
        </section>
      )}

      {modulesSection?.modules && <ServiceModules modules={modulesSection.modules} />}

      {listSection?.items && (
        <section className="bg-surface py-24">
          <div className="mx-auto max-w-3xl px-6">
            <ScrollReveal>
              <h2 className="text-3xl font-medium text-foreground">{listSection.title}</h2>
              <ul className="mt-8 space-y-4">
                {listSection.items.map((item) => (
                  <li key={item} className="flex gap-3 text-muted">
                    <span className="text-brand">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>
        </section>
      )}

      <section className="flex min-h-[40vh] flex-col items-center justify-center bg-background py-16 text-center">
        <ScrollReveal>
          <h2 className="text-3xl font-medium text-foreground">Ready to get started?</h2>
          <Link
            href={`/contact?subject=Enquiry: ${service.title}`}
            className="mt-8 inline-block rounded-sm bg-foreground px-10 py-3 text-sm font-medium text-background hover:opacity-90"
          >
            Contact Us
          </Link>
        </ScrollReveal>
      </section>
    </>
  );
}
