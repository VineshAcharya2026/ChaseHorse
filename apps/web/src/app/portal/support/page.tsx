'use client';

import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader } from '@/components/dashboard/kpi-card';

export default function PortalSupportPage() {
  return (
    <AuthGuard allowedRoles={['customer']}>
      <div>
        <PageHeader title="Support" description="Get help with your shipments" />
        <div className="rounded-xl border border-white/10 p-6">
          <p className="text-muted-foreground">Chat support available 9 AM – 9 PM IST</p>
          <div className="mt-4 h-64 rounded-lg bg-white/5 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Live chat embed (Intercom/Crisp)</p>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
