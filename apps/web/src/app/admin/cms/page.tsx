'use client';

import Link from 'next/link';
import { Images, LayoutTemplate, Menu, FileJson, ArrowRight } from 'lucide-react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader } from '@/components/dashboard/kpi-card';
import { Card, CardContent } from '@/components/ui/card';

const MODULES = [
  {
    href: '/admin/cms/media',
    icon: Images,
    title: 'Media Library',
    description: 'Upload, organise, replace and delete images used across the marketing site.',
  },
  {
    href: '/admin/cms/homepage',
    icon: LayoutTemplate,
    title: 'Homepage',
    description: 'Edit hero slides, the feature section and info cards — text and images.',
  },
  {
    href: '/admin/cms/navigation',
    icon: Menu,
    title: 'Navigation',
    description: 'Manage the header and footer links shown across the public site.',
  },
  {
    href: '/admin/cms/content',
    icon: FileJson,
    title: 'Advanced Content',
    description: 'Edit the full site content payload as JSON for services, products and pages.',
  },
];

export default function CmsHomePage() {
  return (
    <AuthGuard allowedRoles={['super_admin']}>
      <div>
        <PageHeader
          title="Website CMS"
          description="Manage everything on the public marketing site. Changes go live within about a minute."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {MODULES.map((m) => {
            const Icon = m.icon;
            return (
              <Link key={m.href} href={m.href}>
                <Card className="group h-full border-border transition-colors hover:border-primary/50">
                  <CardContent className="flex items-start gap-4 p-5">
                    <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{m.title}</h3>
                        <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{m.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </AuthGuard>
  );
}
