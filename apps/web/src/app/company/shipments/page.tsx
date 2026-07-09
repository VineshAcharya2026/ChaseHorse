'use client';

import { useState } from 'react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader } from '@/components/dashboard/kpi-card';
import { ShipmentForm } from '@/components/shipments/shipment-form';
import { ShipmentTable } from '@/components/shipments/shipment-table';
import { api, useAuthStore } from '@chasehorse/auth-client';

export default function CompanyShipmentsPage() {
  const { accessToken } = useAuthStore();
  api.setToken(accessToken);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <AuthGuard allowedRoles={['company_admin']}>
      <div>
        <PageHeader title="Shipments" description="Manage all shipments" />
        <div className="mb-6">
          <ShipmentForm onSuccess={() => setRefreshKey((k) => k + 1)} />
        </div>
        <ShipmentTable refreshKey={refreshKey} />
      </div>
    </AuthGuard>
  );
}
