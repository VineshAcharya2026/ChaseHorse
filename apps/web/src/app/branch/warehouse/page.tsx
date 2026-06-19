'use client';

import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader } from '@/components/dashboard/kpi-card';
import { Button } from '@/components/ui/button';

export default function BranchWarehousePage() {
  return (
    <AuthGuard allowedRoles={['branch_manager']}>
      <div>
        <PageHeader title="Warehouse" description="Inbound, sorting, and outbound operations" />
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 p-6 text-center">
            <p className="text-3xl font-semibold">156</p>
            <p className="text-sm text-muted-foreground">Parcels in warehouse</p>
          </div>
          <div className="rounded-xl border border-white/10 p-6 text-center">
            <p className="text-3xl font-semibold">72%</p>
            <p className="text-sm text-muted-foreground">Capacity utilized</p>
          </div>
          <div className="rounded-xl border border-white/10 p-6 text-center">
            <p className="text-3xl font-semibold">3</p>
            <p className="text-sm text-muted-foreground">Delayed parcels</p>
          </div>
        </div>
        <div className="mt-6 flex gap-4">
          <Button>Inbound Scan</Button>
          <Button variant="outline">Sort Parcels</Button>
          <Button variant="outline">Outbound Scan</Button>
        </div>
      </div>
    </AuthGuard>
  );
}
