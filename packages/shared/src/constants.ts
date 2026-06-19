export const APP_NAME = 'ChaseHorse';
export const APP_TAGLINE = 'Move Faster. Deliver Smarter.';

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  COMPANY_ADMIN: 'company_admin',
  BRANCH_MANAGER: 'branch_manager',
  DRIVER: 'driver',
  CUSTOMER: 'customer',
  ENTERPRISE_USER: 'enterprise_user',
} as const;

export const SHIPMENT_STATUS_LABELS: Record<string, string> = {
  created: 'Created',
  assigned: 'Assigned',
  picked_up: 'Picked Up',
  warehouse: 'At Warehouse',
  in_transit: 'In Transit',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  failed_delivery: 'Failed Delivery',
  returned: 'Returned',
  cancelled: 'Cancelled',
};

export const VALID_SHIPMENT_TRANSITIONS: Record<string, string[]> = {
  created: ['assigned', 'cancelled'],
  assigned: ['picked_up', 'cancelled'],
  picked_up: ['warehouse', 'in_transit'],
  warehouse: ['in_transit'],
  in_transit: ['out_for_delivery', 'warehouse'],
  out_for_delivery: ['delivered', 'failed_delivery'],
  failed_delivery: ['out_for_delivery', 'returned'],
  delivered: [],
  returned: [],
  cancelled: [],
};

export const GST_RATE = 0.18;

export const PRICING_BASE_RATES: Record<string, number> = {
  standard: 50,
  express: 100,
  same_day: 150,
  next_day: 80,
  international: 500,
};

export const WEBHOOK_EVENTS = [
  'shipment.created',
  'shipment.assigned',
  'shipment.picked_up',
  'shipment.delivered',
  'shipment.returned',
  'pickup.scheduled',
  'invoice.generated',
] as const;

export const INTEGRATION_PROVIDERS = [
  'salesforce',
  'hubspot',
  'zoho',
  'dynamics365',
  'sap',
  'netsuite',
  'odoo',
  'shopify',
  'woocommerce',
  'magento',
  'whatsapp',
  'slack',
  'teams',
] as const;
