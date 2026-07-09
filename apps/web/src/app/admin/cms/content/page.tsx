'use client';

import { useEffect, useState } from 'react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader } from '@/components/dashboard/kpi-card';
import { SaveBar } from '@/components/cms/save-bar';
import { useSiteDraft } from '@/lib/use-site-draft';

export default function CmsContentPage() {
  return (
    <AuthGuard allowedRoles={['super_admin']}>
      <ContentEditor />
    </AuthGuard>
  );
}

function ContentEditor() {
  const { draft, setDraft, reset, save, loading, saving, saved, dirty } = useSiteDraft();
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (draft) setText(JSON.stringify(draft, null, 2));
  }, [draft]);

  if (loading || !draft) {
    return <div className="h-64 animate-pulse rounded-xl bg-muted/40" />;
  }

  const onChange = (value: string) => {
    setText(value);
    try {
      const parsed = JSON.parse(value);
      setError(null);
      setDraft(parsed);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="pb-24">
      <PageHeader
        title="Advanced Content"
        description="Edit the entire site content payload as JSON. Use with care — invalid JSON cannot be saved."
      />
      {error && (
        <p className="mb-3 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Invalid JSON: {error}
        </p>
      )}
      <textarea
        value={text}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className="h-[65vh] w-full rounded-xl border border-border bg-card p-4 font-mono text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-ring"
      />
      <SaveBar
        dirty={dirty && !error}
        saving={saving}
        saved={saved}
        onSave={save}
        onReset={() => {
          reset();
          setError(null);
        }}
      />
    </div>
  );
}
