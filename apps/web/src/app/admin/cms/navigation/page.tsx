'use client';

import { Plus, Trash2 } from 'lucide-react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader } from '@/components/dashboard/kpi-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { SaveBar } from '@/components/cms/save-bar';
import { useSiteDraft } from '@/lib/use-site-draft';

const DEFAULT_HEADER = [
  { label: 'Services', href: '/services' },
  { label: 'Solutions', href: '/services/tier-2' },
  { label: 'Shop', href: '/merchandise' },
  { label: 'Discover', href: '/courses' },
  { label: 'Contact', href: '/contact' },
];

export default function CmsNavigationPage() {
  return (
    <AuthGuard allowedRoles={['super_admin']}>
      <NavigationEditor />
    </AuthGuard>
  );
}

function NavigationEditor() {
  const { draft, update, reset, save, loading, saving, saved, dirty } = useSiteDraft();

  if (loading || !draft) {
    return <div className="h-64 animate-pulse rounded-xl bg-muted/40" />;
  }

  const header: { label: string; href: string }[] = draft.navigation?.header ?? DEFAULT_HEADER;

  const setHeader = (next: { label: string; href: string }[]) =>
    update((d) => {
      d.navigation = { ...(d.navigation ?? {}), header: next };
      return d;
    });

  return (
    <div className="pb-24">
      <PageHeader
        title="Navigation"
        description="Manage the links shown in the marketing site header."
      />

      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Header Links</CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setHeader([...header, { label: 'New link', href: '/' }])}
          >
            <Plus className="mr-1 h-4 w-4" /> Add link
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {header.map((link, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_auto] items-end gap-3">
              <div>
                <Label>Label</Label>
                <Input
                  value={link.label}
                  onChange={(e) => {
                    const next = [...header];
                    next[i] = { ...next[i], label: e.target.value };
                    setHeader(next);
                  }}
                />
              </div>
              <div>
                <Label>Link (href)</Label>
                <Input
                  value={link.href}
                  onChange={(e) => {
                    const next = [...header];
                    next[i] = { ...next[i], href: e.target.value };
                    setHeader(next);
                  }}
                />
              </div>
              <Button
                size="icon"
                variant="outline"
                onClick={() => setHeader(header.filter((_, idx) => idx !== i))}
                aria-label="Remove link"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <SaveBar dirty={dirty} saving={saving} saved={saved} onSave={save} onReset={reset} />
    </div>
  );
}
