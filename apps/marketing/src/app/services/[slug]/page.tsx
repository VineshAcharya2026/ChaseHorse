import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HeroSection } from '@/components/hero-section';
import { ServiceModules, ServiceFeatureList } from '@/components/service-modules';
import { PageSection } from '@/components/page-section';
import { InnerCta } from '@/components/inner-cta';
import { getPage, getService } from '@/lib/content';
import { getServiceHero } from '@/lib/images';

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

  const heroImage = getServiceHero(slug);
  const textSection = page?.sections.find((s) => s.type === 'text');
  const modulesSection = page?.sections.find((s) => s.type === 'modules');
  const listSection = page?.sections.find((s) => s.type === 'list');

  return (
    <>
      <HeroSection
        title={service.title}
        tagline={`Tier ${service.tier}`}
        subtitle={textSection?.subtitle ?? service.description}
        image={heroImage}
        primaryCta={{ label: 'Contact Us', href: '/contact' }}
        secondaryCta={{ label: 'All Services', href: '/services' }}
      />

      {textSection?.body && (
        <PageSection variant="gray" reveal={false}>
          <p className="mx-auto max-w-3xl text-center text-[15px] leading-relaxed text-tesla-body md:text-lg">
            {textSection.body}
          </p>
        </PageSection>
      )}

      {modulesSection?.modules && <ServiceModules modules={modulesSection.modules} />}

      {listSection?.items && (
        <ServiceFeatureList title={listSection.title ?? 'Key Benefits'} items={listSection.items} />
      )}

      <InnerCta
        title={`Ready to deploy ${service.title}?`}
        href={`/contact?subject=Enquiry: ${encodeURIComponent(service.title)}`}
      />
    </>
  );
}
