'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { api, useAuthStore } from '@chasehorse/auth-client';
import { getContent, saveContent } from '@/lib/cms-api';
import seed from '@/lib/cms-seed.json';

export type SiteDraft = Record<string, any>;

/**
 * Loads the editable site content from the CMS, falling back to the bundled
 * seed snapshot when the CMS has no row yet. Tracks dirty state and saving.
 */
export function useSiteDraft() {
  const { accessToken } = useAuthStore();
  api.setToken(accessToken);

  const [draft, setDraft] = useState<SiteDraft | null>(null);
  const original = useRef<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await getContent<SiteDraft>();
        const payload = res.data ?? (seed as SiteDraft);
        if (!active) return;
        original.current = JSON.stringify(payload);
        setDraft(payload);
      } catch {
        if (!active) return;
        original.current = JSON.stringify(seed);
        setDraft(seed as SiteDraft);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const dirty = draft ? JSON.stringify(draft) !== original.current : false;

  const update = useCallback((updater: (prev: SiteDraft) => SiteDraft) => {
    setSaved(false);
    setDraft((prev) => (prev ? updater(structuredClone(prev)) : prev));
  }, []);

  const reset = useCallback(() => {
    setDraft(original.current ? JSON.parse(original.current) : null);
    setSaved(false);
  }, []);

  const save = useCallback(async () => {
    if (!draft) return;
    setSaving(true);
    try {
      await saveContent(draft);
      original.current = JSON.stringify(draft);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }, [draft]);

  return { draft, setDraft, update, reset, save, loading, saving, saved, dirty };
}
