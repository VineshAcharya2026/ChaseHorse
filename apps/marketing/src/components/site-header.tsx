'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Globe, Menu, User, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { APP_URL } from '@/lib/utils';
import { BrandLogo } from '@/components/brand-logo';
import { useSiteContent } from '@/components/site-content-provider';

const DEFAULT_NAV_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Solutions', href: '/services/tier-2' },
  { label: 'Shop', href: '/merchandise' },
  { label: 'Discover', href: '/courses' },
  { label: 'Contact', href: '/contact' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const content = useSiteContent();
  const NAV_LINKS = content.navigation?.header?.length
    ? content.navigation.header
    : DEFAULT_NAV_LINKS;
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHome = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  const solidHeader = !isHome || scrolled;
  const lightNav = false;

  const navLinkClass = lightNav
    ? 'text-white hover:text-white/80'
    : 'text-[#393c41] hover:text-tesla-black';

  const iconClass = lightNav
    ? 'text-white hover:text-white/80'
    : 'text-[#393c41] hover:text-tesla-black';

  return (
    <>
      <header
        className={cn(
          'fixed left-0 right-0 top-0 z-50 transition-all duration-300',
          solidHeader ? 'bg-white py-0' : 'bg-transparent',
        )}
      >
        <div className="relative mx-auto flex h-[56px] max-w-[100%] items-center px-6">
          <Link href="/" className="absolute left-6 z-10">
            <BrandLogo variant={lightNav ? 'light' : 'dark'} minimal />
          </Link>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn('text-[14px] font-medium transition-colors', navLinkClass)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="absolute right-6 flex items-center gap-5">
            <button
              type="button"
              className={cn('hidden md:block', iconClass)}
              aria-label="Language"
            >
              <Globe className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <a
              href={`${APP_URL}/login`}
              className={cn('hidden md:block', iconClass)}
              aria-label="Account"
            >
              <User className="h-5 w-5" strokeWidth={1.5} />
            </a>
            <button
              className={cn('lg:hidden', iconClass)}
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-white">
          <div className="flex h-14 items-center justify-between px-6">
            <BrandLogo variant="dark" minimal />
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <X className="h-6 w-6 text-tesla-black" />
            </button>
          </div>
          <nav className="flex flex-col px-6 py-4">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="border-b border-[#f4f4f4] py-4 text-[17px] font-medium text-tesla-black"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
