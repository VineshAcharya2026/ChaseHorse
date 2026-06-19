'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn, APP_URL } from '@/lib/utils';
import { SERVICE_NAV } from '@/lib/nav';
import { ThemeToggle } from './theme-toggle';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Jobs', href: '/jobs' },
  { label: 'Courses', href: '/courses' },
  { label: 'Merchandise', href: '/merchandise' },
  { label: 'Contact', href: '/contact' },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const tier1 = SERVICE_NAV.tier1;
  const tier2 = SERVICE_NAV.tier2;
  const tier3 = SERVICE_NAV.tier3;

  const onHero = !scrolled;
  const navLinkClass = onHero
    ? 'text-sm text-white/80 hover:text-white'
    : 'text-sm text-foreground/70 hover:text-foreground';

  return (
    <>
      <header
        className={cn(
          'fixed left-0 right-0 top-0 z-50 transition-all duration-300',
          scrolled ? 'bg-background/90 backdrop-blur-md shadow-sm' : 'bg-transparent',
        )}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <Link
            href="/"
            className={cn(
              'text-lg font-medium tracking-tight',
              onHero ? 'text-white' : 'text-foreground',
            )}
          >
            ChaseHorse
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.slice(0, 1).map((link) => (
              <Link key={link.href} href={link.href} className={navLinkClass}>
                {link.label}
              </Link>
            ))}
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button className={navLinkClass}>Services</button>
              {servicesOpen && (
                <div className="absolute left-1/2 top-full w-[720px] -translate-x-1/2 pt-2">
                  <div className="grid grid-cols-3 gap-6 border border-border bg-background/95 p-6 shadow-xl backdrop-blur-xl">
                    {[
                      { label: 'Tier 1', items: tier1, hub: '/services/tier-1' },
                      { label: 'Tier 2', items: tier2, hub: '/services/tier-2' },
                      { label: 'Tier 3', items: tier3, hub: '/services/tier-3' },
                    ].map((tier) => (
                      <div key={tier.label}>
                        <Link href={tier.hub} className="text-xs font-medium uppercase tracking-widest text-brand">
                          {tier.label}
                        </Link>
                        <ul className="mt-3 space-y-2">
                          {tier.items.map((s) => (
                            <li key={s.slug}>
                              <Link
                                href={`/services/${s.slug}`}
                                className="text-sm text-muted hover:text-foreground"
                              >
                                {s.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {NAV_LINKS.slice(1).map((link) => (
              <Link key={link.href} href={link.href} className={navLinkClass}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className={onHero ? 'text-white' : 'text-foreground'}>
              <ThemeToggle />
            </div>
            <Link
              href={`${APP_URL}/login`}
              className={cn(
                'hidden rounded-sm px-4 py-1.5 text-sm font-medium transition sm:block',
                onHero
                  ? 'bg-white text-black hover:bg-white/90'
                  : 'bg-foreground text-background hover:opacity-90',
              )}
            >
              Sign In
            </Link>
            <button
              className={cn('lg:hidden', onHero ? 'text-white' : 'text-foreground')}
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-background">
          <div className="flex h-14 items-center justify-between px-6">
            <span className="text-lg font-medium text-foreground">ChaseHorse</span>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X className="h-6 w-6 text-foreground" />
              </button>
            </div>
          </div>
          <nav className="flex flex-col gap-6 px-6 py-8">
            <Link href="/" onClick={() => setMobileOpen(false)} className="text-2xl font-medium text-foreground">
              Home
            </Link>
            <Link href="/services" onClick={() => setMobileOpen(false)} className="text-2xl font-medium text-foreground">
              Services
            </Link>
            {NAV_LINKS.slice(1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-2xl font-medium text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={`${APP_URL}/login`}
              className="mt-4 inline-block rounded-sm bg-foreground px-6 py-3 text-center text-sm font-medium text-background"
            >
              Sign In
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
