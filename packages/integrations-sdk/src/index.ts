export * from './base';
export { createConnector, CustomWebhookConnector, ZohoConnector } from './connectors';

export const CONNECTOR_METADATA: Record<
  string,
  { name: string; category: string; description: string }
> = {
  salesforce: { name: 'Salesforce', category: 'crm', description: 'Sync customers and orders' },
  hubspot: { name: 'HubSpot', category: 'crm', description: 'CRM integration' },
  zoho: { name: 'Zoho CRM', category: 'crm', description: 'Zoho CRM sync' },
  custom_webhook: { name: 'Custom Webhook', category: 'custom', description: 'POST events to your ERP' },
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
