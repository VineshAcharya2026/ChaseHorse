import Link from 'next/link';
import { APP_NAME, APP_TAGLINE } from '@chasehorse/shared';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { ArrowRight, Package, Truck, BarChart3, Shield } from 'lucide-react';

const MARKETING_URL = process.env.NEXT_PUBLIC_MARKETING_URL ?? 'https://chasehorse-marketing-8ic.pages.dev';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <span className="text-lg font-semibold tracking-tight">{APP_NAME}</span>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a href={MARKETING_URL} className="text-sm text-muted-foreground hover:text-foreground">
              Website
            </a>
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
              Sign in
            </Link>
            <Button asChild>
              <Link href="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-16 text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          {APP_TAGLINE}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          The operating system for logistics companies. Manage shipments, drivers, customers,
          vehicles, warehouses, and enterprise integrations from a single platform.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/login">
              Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/track?awb=demo">Track a Parcel</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-24 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Package, title: 'Shipment Management', desc: 'Full lifecycle tracking from pickup to delivery' },
          { icon: Truck, title: 'Fleet & Drivers', desc: 'Real-time GPS tracking and driver management' },
          { icon: BarChart3, title: 'Analytics', desc: 'Enterprise-grade dashboards and reporting' },
          { icon: Shield, title: 'Enterprise Security', desc: 'RBAC, MFA, audit logs, and compliance ready' },
        ].map((feature) => (
          <div key={feature.title} className="rounded-xl border border-border p-6">
            <feature.icon className="h-8 w-8 text-primary" />
            <h3 className="mt-4 font-semibold">{feature.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{feature.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
