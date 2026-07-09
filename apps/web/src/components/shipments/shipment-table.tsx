'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@chasehorse/auth-client';
import { SHIPMENT_STATUS_LABELS, VALID_SHIPMENT_TRANSITIONS } from '@chasehorse/shared';
import { EmptyState } from '@/components/dashboard/kpi-card';

interface ShipmentTableProps {
  refreshKey?: number;
}

export function ShipmentTable({ refreshKey }: ShipmentTableProps) {
  const { data: shipmentsData, refetch, isLoading } = useQuery({
    queryKey: ['shipments', refreshKey],
    queryFn: () => api.get<{ success: boolean; data: Record<string, unknown>[] }>('/api/shipments'),
  });

  const { data: driversData } = useQuery({
    queryKey: ['drivers'],
    queryFn: () => api.get<{ success: boolean; data: Record<string, unknown>[] }>('/api/drivers'),
  });

  const shipments = shipmentsData?.data ?? [];
  const drivers = driversData?.data ?? [];

  const assignDriver = async (shipmentId: string, driverId: string) => {
    await api.post(`/api/shipments/${shipmentId}/assign`, { driverId });
    refetch();
  };

  const updateStatus = async (shipmentId: string, status: string) => {
    await api.patch(`/api/shipments/${shipmentId}/status`, { status });
    refetch();
  };

  if (isLoading) {
    return <div className="h-32 animate-pulse rounded-xl bg-muted/40" />;
  }

  if (shipments.length === 0) {
    return <EmptyState title="No shipments" description="Create your first shipment above." />;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">AWB</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Weight</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Amount</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Assign Driver</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Update Status</th>
          </tr>
        </thead>
        <tbody>
          {shipments.map((row) => {
            const status = String(row.status ?? '');
            const transitions = VALID_SHIPMENT_TRANSITIONS[status] ?? [];
            return (
              <tr key={String(row.id)} className="border-b border-border/50 hover:bg-muted/40">
                <td className="px-4 py-3">{String(row.awbNumber ?? '-')}</td>
                <td className="px-4 py-3">{String(row.type ?? '-')}</td>
                <td className="px-4 py-3">{SHIPMENT_STATUS_LABELS[status] ?? status}</td>
                <td className="px-4 py-3">{String(row.weight ?? '-')}</td>
                <td className="px-4 py-3">{String(row.totalAmount ?? '-')}</td>
                <td className="px-4 py-3">
                  <select
                    className="rounded-md border border-input bg-background px-2 py-1 text-xs"
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value) assignDriver(String(row.id), e.target.value);
                    }}
                  >
                    <option value="">Select driver</option>
                    {drivers.map((d) => (
                      <option key={String(d.id)} value={String(d.id)}>
                        {String(d.name)}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  {transitions.length > 0 ? (
                    <select
                      className="rounded-md border border-input bg-background px-2 py-1 text-xs"
                      defaultValue=""
                      onChange={(e) => {
                        if (e.target.value) updateStatus(String(row.id), e.target.value);
                      }}
                    >
                      <option value="">Change status</option>
                      {transitions.map((t) => (
                        <option key={t} value={t}>
                          {SHIPMENT_STATUS_LABELS[t] ?? t}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
