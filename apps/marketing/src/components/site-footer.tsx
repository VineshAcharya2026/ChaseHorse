import Link from 'next/link';
import { APP_URL } from '@/lib/utils';

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface py-16">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-4">
        <div>
          <p className="text-lg font-medium text-foreground">ChaseHorse</p>
          <p className="mt-2 text-sm text-muted">
            Intelligent platform frameworks for enterprise scale.
          </p>
        </div>
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-muted">Services</p>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li><Link href="/services/tier-1" className="hover:text-foreground">Tier 1</Link></li>
            <li><Link href="/services/tier-2" className="hover:text-foreground">Tier 2</Link></li>
            <li><Link href="/services/tier-3" className="hover:text-foreground">Tier 3</Link></li>
            <li><Link href="/services" className="hover:text-foreground">All Services</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-muted">Company</p>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li><Link href="/jobs" className="hover:text-foreground">Jobs</Link></li>
            <li><Link href="/courses" className="hover:text-foreground">Courses</Link></li>
            <li><Link href="/merchandise" className="hover:text-foreground">Merchandise</Link></li>
            <li><Link href={`${APP_URL}/login`} className="hover:text-foreground">Platform Login</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-muted">Contact</p>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>
              <a href="mailto:letsconnect@chasehorse.com" className="hover:text-foreground">
                letsconnect@chasehorse.com
              </a>
            </li>
            <li>
              <a href="tel:+917337369111" className="hover:text-foreground">
                +91 7337369111
              </a>
            </li>
            <li>Bangalore, India</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-7xl border-t border-border px-6 pt-8 text-center text-sm text-muted">
        © {new Date().getFullYear()} CHASEHORSE LogiworkX. All Rights Reserved.
      </div>
    </footer>
  );
}
