import type { Metadata } from 'next';
import { HeroSection } from '@/components/hero-section';
import { ContactForm } from '@/components/contact-form';
import { ScrollReveal } from '@/components/scroll-reveal';
import { getSiteContent } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Contact ChaseHorse — letsconnect@chasehorse.com | +91 7337369111 | Bangalore, India',
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string; product?: string }>;
}) {
  const content = getSiteContent();
  const params = await searchParams;
  const subject = params.subject ?? (params.product ? `Enquiry: ${params.product}` : '');

  return (
    <>
      <HeroSection
        title="Contact Us"
        subtitle={content.contact.sections[0]?.body}
        image="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&q=80"
        primaryCta={{ label: 'Email Us', href: 'mailto:letsconnect@chasehorse.com' }}
      />
      <section className="bg-background py-24">
        <div className="mx-auto grid max-w-6xl gap-16 px-6 lg:grid-cols-2">
          <ScrollReveal>
            <h2 className="text-3xl font-medium text-foreground">Send a Message</h2>
            <div className="mt-8">
              <ContactForm defaultSubject={subject} />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="text-3xl font-medium text-foreground">Come Visit Us</h2>
            <div className="mt-8 space-y-6 text-muted">
              <div>
                <p className="text-sm font-medium uppercase tracking-widest text-brand">Regional HQ</p>
                <p className="mt-2 text-lg text-foreground">Bangalore, India</p>
              </div>
              <div>
                <p className="text-sm font-medium uppercase tracking-widest text-brand">Direct Link</p>
                <a href="mailto:letsconnect@chasehorse.com" className="mt-2 block text-lg text-foreground hover:text-brand">
                  letsconnect@chasehorse.com
                </a>
              </div>
              <div>
                <p className="text-sm font-medium uppercase tracking-widest text-brand">Operations</p>
                <a href="tel:+917337369111" className="mt-2 block text-lg text-foreground hover:text-brand">
                  +91 7337369111
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
