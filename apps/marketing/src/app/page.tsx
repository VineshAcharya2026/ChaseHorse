import { HeroSection } from '@/components/hero-section';
import { FeatureBlock } from '@/components/feature-block';
import { TierGrid } from '@/components/tier-grid';
import { ScrollReveal } from '@/components/scroll-reveal';
import Link from 'next/link';
import { getSiteContent, getServicesByTier } from '@/lib/content';
import { IMAGES } from '@/lib/images';

export default function HomePage() {
  const content = getSiteContent();
  const tier1 = getServicesByTier(1).map((s) => s.title);
  const tier2 = getServicesByTier(2).map((s) => s.title);
  const tier3 = getServicesByTier(3).map((s) => s.title);

  return (
    <>
      <HeroSection
        tagline="Logistics & Supply Chain Solutions"
        title="Chasehorse"
        subtitle="Growth Enabler Logiworkx Platform [ GELP ]"
        image={content.home.heroImage ?? IMAGES.hero}
        primaryCta={{ label: 'Explore Services', href: '/services' }}
        secondaryCta={{ label: 'Contact Us', href: '/contact' }}
      >
        <p className="mt-8 text-sm font-medium tracking-widest text-white/70 md:text-base">
          Human Interface + Technology + ESG-Sustainability + Market
        </p>
      </HeroSection>

      <FeatureBlock
        title="Who We Are"
        body={content.home.sections[1]?.body}
        image={IMAGES.team}
        cta={{ label: 'Learn More', href: '/services' }}
      />

      <section className="relative flex min-h-[70vh] flex-col items-center justify-center bg-surface px-6 py-24 text-center">
        <ScrollReveal>
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-brand">
            Why ChaseHorse G.E.L.P?
          </p>
          <h2 className="mt-6 text-balance text-4xl font-medium tracking-tight text-foreground md:text-6xl">
            Thunderspeed In Onboarding
          </h2>
          <p className="mt-4 text-muted">
            Value Creation . Futuristic . Practical . One Transparent Platform
          </p>
        </ScrollReveal>
        <div className="mt-16 grid w-full max-w-3xl grid-cols-2 gap-12">
          <ScrollReveal delay={0.1}>
            <p className="text-6xl font-medium text-foreground md:text-8xl">24h</p>
            <p className="mt-2 text-sm text-muted">Tier 1 Strategy Deployment</p>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-6xl font-medium text-foreground md:text-8xl">48h</p>
            <p className="mt-2 text-sm text-muted">Tier 2 Operations Scale</p>
          </ScrollReveal>
        </div>
        <ScrollReveal delay={0.3}>
          <p className="mx-auto mt-16 max-w-3xl text-lg leading-relaxed text-muted">
            {content.home.sections[2]?.body}
          </p>
        </ScrollReveal>
      </section>

      <FeatureBlock
        subtitle="Tier 1 → Core Business Services"
        title="Digital Foundation"
        items={tier1}
        image={IMAGES.digital}
        cta={{ label: 'Explore Tier 1', href: '/services/tier-1' }}
      />

      <FeatureBlock
        subtitle="Tier 2 → Strategic & Growth Services"
        title="Scale Operations"
        items={tier2}
        image={IMAGES.optimize}
        reverse
        variant="surface"
        cta={{ label: 'Explore Tier 2', href: '/services/tier-2' }}
      />

      <FeatureBlock
        subtitle="Tier 3 → Advanced Operations"
        title="Enterprise Technology"
        items={tier3}
        image={IMAGES.tech}
        cta={{ label: 'Explore Tier 3', href: '/services/tier-3' }}
      />

      <TierGrid
        tiers={[
          {
            tier: 1,
            title: 'Core Business Services',
            subtitle: 'Foundation for digital logistics',
            items: tier1.slice(0, 5),
            href: '/services/tier-1',
          },
          {
            tier: 2,
            title: 'Strategic & Growth',
            subtitle: 'Scale and optimize operations',
            items: tier2.slice(0, 6),
            href: '/services/tier-2',
          },
          {
            tier: 3,
            title: 'Advanced Technology',
            subtitle: 'Enterprise-grade operations',
            items: tier3.slice(0, 6),
            href: '/services/tier-3',
          },
        ]}
      />

      <section className="flex min-h-[60vh] flex-col items-center justify-center bg-background px-6 py-24 text-center">
        <ScrollReveal>
          <h2 className="text-balance text-4xl font-medium tracking-tight text-foreground md:text-5xl">
            Establish Uncompromising Control Over Your Fleet
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-muted">
            Discover how ChaseHorse can optimize visibility, tighten compliance, and elevate utilization across your logistics network.
          </p>
          <Link
            href="/contact"
            className="mt-10 inline-block rounded-sm bg-foreground px-10 py-3 text-sm font-medium text-background hover:opacity-90"
          >
            Contact Us
          </Link>
        </ScrollReveal>
      </section>
    </>
  );
}
