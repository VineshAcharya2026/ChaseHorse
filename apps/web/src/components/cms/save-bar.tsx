'use client';

import { Button } from '@/components/ui/button';

interface SaveBarProps {
  dirty: boolean;
  saving: boolean;
  saved: boolean;
  onSave: () => void;
  onReset?: () => void;
}

export function SaveBar({ dirty, saving, saved, onSave, onReset }: SaveBarProps) {
  return (
    <div className="sticky bottom-0 z-20 mt-6 flex items-center justify-between gap-3 rounded-xl border border-border bg-card/95 px-4 py-3 backdrop-blur">
      <p className="text-sm text-muted-foreground">
        {saving
          ? 'Saving...'
          : saved
            ? 'Saved. Live site updates within ~60 seconds.'
            : dirty
              ? 'You have unsaved changes.'
              : 'All changes saved.'}
      </p>
      <div className="flex gap-2">
        {onReset && (
          <Button variant="outline" size="sm" onClick={onReset} disabled={!dirty || saving}>
            Reset
          </Button>
        )}
        <Button size="sm" onClick={onSave} disabled={!dirty || saving}>
          {saving ? 'Saving...' : 'Save & Publish'}
        </Button>
      </div>
    </div>
  );
}
