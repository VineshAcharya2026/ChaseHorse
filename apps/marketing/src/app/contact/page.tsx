import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { HeroSection } from '@/components/hero-section';
import { ContactForm } from '@/components/contact-form';
import { PageSection } from '@/components/page-section';
import { InnerCta } from '@/components/inner-cta';
import { GsapReveal } from '@/components/motion/gsap-reveal';
import { getSiteContent } from '@/lib/content';
import { IMAGES } from '@/lib/images';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Contact ChaseHorse — letsconnect@chasehorse.com | +91 7337369111 | Bangalore, India',
};

const CONTACT_ITEMS = [
  { icon: MapPin, label: 'Regional HQ', value: 'Bangalore, India', href: undefined },
  { icon: Mail, label: 'Direct Link', value: 'letsconnect@chasehorse.com', href: 'mailto:letsconnect@chasehorse.com' },
  { icon: Phone, label: 'Operations', value: '+91 7337369111', href: 'tel:+917337369111' },
] as const;

export default function ContactPage() {
  const content = getSiteContent();

  return (
    <>
      <HeroSection
        title="Contact Us"
        subtitle={content.contact.sections[0]?.body}
        image={IMAGES.contact}
        primaryCta={{ label: 'Email Us', href: 'mailto:letsconnect@chasehorse.com' }}
      />
      <PageSection variant="gray" reveal={false}>
        <div className="grid gap-12 lg:grid-cols-2">
          <GsapReveal>
            <h2 className="tesla-section-title">We&apos;d love to hear from you</h2>
            <div className="mt-8 rounded-md bg-white p-8">
              <Suspense fallback={<div className="h-64 animate-pulse rounded-md bg-tesla-gray" />}>
                <ContactForm />
              </Suspense>
            </div>
          </GsapReveal>
          <GsapReveal delay={0.1}>
            <h2 className="tesla-section-title">Come say hello</h2>
            <div className="mt-8 space-y-4">
              {CONTACT_ITEMS.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex gap-4 rounded-md bg-white p-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center text-tesla-black">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-tesla-muted">{label}</p>
                    {href ? (
                      <a href={href} className="mt-1 block text-base text-tesla-black hover:text-tesla-blue">
                        {value}
                      </a>
                    ) : (
                      <p className="mt-1 text-base text-tesla-black">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </GsapReveal>
        </div>
      </PageSection>
      <InnerCta useLeadForm buttonLabel="Request a Quote" />
    </>
  );
}
