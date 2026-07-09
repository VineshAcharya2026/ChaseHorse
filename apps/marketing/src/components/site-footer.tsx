'use client';

import Link from 'next/link';

const FOOTER_LINKS = [
  { label: 'Privacy & Legal', href: '/contact' },
  { label: 'Vehicle Recalls', href: '/contact' },
  { label: 'Contact', href: '/contact' },
  { label: 'News', href: '/courses' },
  { label: 'Get Updates', href: '/contact' },
  { label: 'Locations', href: '/contact' },
];

export function SiteFooter() {
  return (
    <footer className="bg-white px-6 py-6">
      <div className="mx-auto flex max-w-[100%] flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center text-[12px] text-[#5c5e62]">
        <span>ChaseHorse © {new Date().getFullYear()}</span>
        {FOOTER_LINKS.map((link) => (
          <Link key={link.label} href={link.href} className="transition hover:text-tesla-black">
            {link.label}
          </Link>
        ))}
      </div>
    </footer>
  );
}
