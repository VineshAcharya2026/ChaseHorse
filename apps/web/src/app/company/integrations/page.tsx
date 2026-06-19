'use client';

import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader } from '@/components/dashboard/kpi-card';

export default function CompanyIntegrationsPage() {
  return (
    <AuthGuard allowedRoles={['company_admin']}>
      <div>
        <PageHeader title="Integrations" description="Connect CRM, ERP, and e-commerce platforms" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {['Salesforce', 'HubSpot', 'Shopify', 'Zoho CRM', 'SAP', 'WhatsApp Business'].map((name) => (
            <div key={name} className="rounded-xl border border-white/10 p-6 hover:border-primary/50 transition-colors cursor-pointer">
              <h3 className="font-semibold">{name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">Click to connect</p>
            </div>
          ))}
        </div>
      </div>
    </AuthGuard>
  );
}
