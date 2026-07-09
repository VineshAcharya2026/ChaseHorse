'use client';

import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader } from '@/components/dashboard/kpi-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageSlot } from '@/components/cms/image-slot';
import { SaveBar } from '@/components/cms/save-bar';
import { useSiteDraft } from '@/lib/use-site-draft';

export default function CmsHomepagePage() {
  return (
    <AuthGuard allowedRoles={['super_admin']}>
      <HomepageEditor />
    </AuthGuard>
  );
}

function HomepageEditor() {
  const { draft, update, reset, save, loading, saving, saved, dirty } = useSiteDraft();

  if (loading || !draft) {
    return <div className="h-64 animate-pulse rounded-xl bg-muted/40" />;
  }

  const home = draft.home ?? {};
  const heroSlides: any[] = home.heroSlides ?? [];
  const infoCards: any[] = home.infoCards ?? [];
  const feature = home.feature ?? {};

  return (
    <div className="pb-24">
      <PageHeader
        title="Homepage"
        description="Edit the hero carousel, feature section and info cards shown on the homepage."
      />

      <Card className="mb-6 border-border">
        <CardHeader>
          <CardTitle>Hero Slides</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {heroSlides.map((slide, i) => (
            <div key={slide.id ?? i} className="space-y-3 rounded-lg border border-border/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Slide {i + 1}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={slide.title ?? ''}
                    onChange={(e) =>
                      update((d) => {
                        d.home.heroSlides[i].title = e.target.value;
                        return d;
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Subtitle</Label>
                  <Input
                    value={slide.subtitle ?? ''}
                    onChange={(e) =>
                      update((d) => {
                        d.home.heroSlides[i].subtitle = e.target.value;
                        return d;
                      })
                    }
                  />
                </div>
              </div>
              <ImageSlot
                label="Slide image"
                value={slide.image}
                onChange={(url) =>
                  update((d) => {
                    d.home.heroSlides[i].image = url;
                    return d;
                  })
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mb-6 border-border">
        <CardHeader>
          <CardTitle>Feature Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Title</Label>
            <Input
              value={feature.title ?? ''}
              onChange={(e) =>
                update((d) => {
                  d.home.feature.title = e.target.value;
                  return d;
                })
              }
            />
          </div>
          <div>
            <Label>Description</Label>
            <Input
              value={feature.description ?? ''}
              onChange={(e) =>
                update((d) => {
                  d.home.feature.description = e.target.value;
                  return d;
                })
              }
            />
          </div>
          <ImageSlot
            label="Feature image"
            value={feature.image}
            onChange={(url) =>
              update((d) => {
                d.home.feature.image = url;
                return d;
              })
            }
          />
        </CardContent>
      </Card>

      <Card className="mb-6 border-border">
        <CardHeader>
          <CardTitle>Info Cards</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {infoCards.map((card, i) => (
            <div key={i} className="space-y-3 rounded-lg border border-border/60 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={card.title ?? ''}
                    onChange={(e) =>
                      update((d) => {
                        d.home.infoCards[i].title = e.target.value;
                        return d;
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    value={card.description ?? ''}
                    onChange={(e) =>
                      update((d) => {
                        d.home.infoCards[i].description = e.target.value;
                        return d;
                      })
                    }
                  />
                </div>
              </div>
              <ImageSlot
                label="Card image"
                value={card.image}
                onChange={(url) =>
                  update((d) => {
                    d.home.infoCards[i].image = url;
                    return d;
                  })
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <SaveBar dirty={dirty} saving={saving} saved={saved} onSave={save} onReset={reset} />
    </div>
  );
}
