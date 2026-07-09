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
