export interface IntegrationOrder {
  externalId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  pickupAddress: Record<string, string>;
  deliveryAddress: Record<string, string>;
  weight: number;
  description?: string;
}

export interface IntegrationConnector {
  provider: string;
  pullOrders(): Promise<IntegrationOrder[]>;
  pushStatus(shipmentId: string, status: string, trackingUrl: string): Promise<void>;
  pushPOD(shipmentId: string, podData: Record<string, unknown>): Promise<void>;
  pushInvoice(shipmentId: string, invoiceData: Record<string, unknown>): Promise<void>;
}

export class BaseConnector implements IntegrationConnector {
  constructor(
    public provider: string,
    protected config: Record<string, unknown>,
  ) {}

  async pullOrders(): Promise<IntegrationOrder[]> {
    return [];
  }

  async pushStatus(_shipmentId: string, _status: string, _trackingUrl: string): Promise<void> {}

  async pushPOD(_shipmentId: string, _podData: Record<string, unknown>): Promise<void> {}

  async pushInvoice(_shipmentId: string, _invoiceData: Record<string, unknown>): Promise<void> {}
}

export function createConnector(
  provider: string,
  config: Record<string, unknown>,
): IntegrationConnector {
  return new BaseConnector(provider, config);
}

export const CONNECTOR_METADATA: Record<
  string,
  { name: string; category: string; description: string }
> = {
  salesforce: { name: 'Salesforce', category: 'crm', description: 'Sync customers and orders' },
  hubspot: { name: 'HubSpot', category: 'crm', description: 'CRM integration' },
  zoho: { name: 'Zoho CRM', category: 'crm', description: 'Zoho CRM sync' },
  dynamics365: { name: 'Dynamics 365', category: 'crm', description: 'Microsoft Dynamics' },
  sap: { name: 'SAP', category: 'erp', description: 'SAP ERP integration' },
  netsuite: { name: 'NetSuite', category: 'erp', description: 'Oracle NetSuite' },
  odoo: { name: 'Odoo', category: 'erp', description: 'Odoo ERP sync' },
  shopify: { name: 'Shopify', category: 'ecommerce', description: 'Shopify orders' },
  woocommerce: { name: 'WooCommerce', category: 'ecommerce', description: 'WooCommerce sync' },
  magento: { name: 'Magento', category: 'ecommerce', description: 'Magento integration' },
  whatsapp: { name: 'WhatsApp Business', category: 'communication', description: 'WhatsApp API' },
  slack: { name: 'Slack', category: 'communication', description: 'Slack notifications' },
  teams: { name: 'Microsoft Teams', category: 'communication', description: 'Teams integration' },
};
