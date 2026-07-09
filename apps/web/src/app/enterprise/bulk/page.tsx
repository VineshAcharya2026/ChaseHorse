'use client';

import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader } from '@/components/dashboard/kpi-card';
import { Button } from '@/components/ui/button';

export default function EnterpriseBulkPage() {
  return (
    <AuthGuard allowedRoles={['enterprise_user']}>
      <div>
        <PageHeader title="Bulk Upload" description="Create multiple shipments via CSV" />
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">Drag and drop CSV file or click to upload</p>
          <Button className="mt-4">Upload CSV</Button>
          <p className="mt-4 text-xs text-muted-foreground">Columns: sender, receiver, weight, type</p>
        </div>
      </div>
    </AuthGuard>
  );
}
