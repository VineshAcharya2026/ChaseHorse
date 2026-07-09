'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader, DataTable } from '@/components/dashboard/kpi-card';
import { api, useAuthStore } from '@chasehorse/auth-client';
import { Button } from '@/components/ui/button';

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-checkout')) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'razorpay-checkout';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CompanyBillingPage() {
  return (
    <AuthGuard allowedRoles={['company_admin']}>
      <BillingContent />
    </AuthGuard>
  );
}

function BillingContent() {
  const { accessToken } = useAuthStore();
  api.setToken(accessToken);
  const [payingId, setPayingId] = useState<string | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => api.get<{ success: boolean; data: Record<string, unknown>[] }>('/api/billing/invoices'),
  });

  const handlePay = async (invoice: Record<string, unknown>) => {
    const invoiceId = String(invoice.id);
    setPayingId(invoiceId);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) throw new Error('Failed to load Razorpay checkout');

      const orderRes = await api.post<{
        success: boolean;
        data: { orderId: string; amount: number; currency: string; keyId: string };
      }>('/api/billing/payments/razorpay/order', {
        invoiceId,
        amount: invoice.total as number,
      });

      const { orderId, amount, currency, keyId } = orderRes.data;

      const rzp = new window.Razorpay({
        key: keyId,
        amount,
        currency,
        order_id: orderId,
        name: 'ChaseHorse',
        description: `Invoice ${invoice.invoiceNumber}`,
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          await api.post('/api/billing/payments/razorpay/verify', {
            invoiceId,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
          });
          refetch();
        },
      });
      rzp.open();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setPayingId(null);
    }
  };

  const rows = data?.data ?? [];

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Billing" description="Invoices and payments" />
        <div className="h-32 animate-pulse rounded-xl bg-muted/40" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Billing" description="Invoices and payments" />
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Invoice</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Subtotal</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">GST</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Total</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={String(row.id)} className="border-b border-border/50 hover:bg-muted/40">
                <td className="px-4 py-3">{String(row.invoiceNumber ?? '-')}</td>
                <td className="px-4 py-3">{String(row.subtotal ?? '-')}</td>
                <td className="px-4 py-3">{String(row.gstAmount ?? '-')}</td>
                <td className="px-4 py-3">{String(row.total ?? '-')}</td>
                <td className="px-4 py-3">{String(row.paymentStatus ?? '-')}</td>
                <td className="px-4 py-3">
                  {row.paymentStatus === 'pending' && (
                    <Button size="sm" onClick={() => handlePay(row)} disabled={payingId === String(row.id)}>
                      {payingId === String(row.id) ? 'Loading...' : 'Pay with Razorpay'}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
