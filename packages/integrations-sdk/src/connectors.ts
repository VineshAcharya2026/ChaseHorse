import { BaseConnector, type IntegrationConnector, type IntegrationOrder } from './base';

export class CustomWebhookConnector extends BaseConnector {
  async pushStatus(shipmentId: string, status: string, trackingUrl: string): Promise<void> {
    const url = this.config.webhookUrl as string;
    const authHeader = this.config.authHeader as string | undefined;
    if (!url) return;
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: JSON.stringify({ shipmentId, status, trackingUrl, source: 'chasehorse' }),
    });
  }
}

export class ZohoConnector extends BaseConnector {
  private async getAccessToken(): Promise<string> {
    const refreshToken = this.config.refreshToken as string;
    const clientId = this.config.clientId as string;
    const clientSecret = this.config.clientSecret as string;
    const res = await fetch('https://accounts.zoho.in/oauth/v2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'refresh_token',
      }),
    });
    const data = (await res.json()) as { access_token?: string };
    if (!data.access_token) throw new Error('Zoho token refresh failed');
    return data.access_token;
  }

  async pushStatus(shipmentId: string, status: string, trackingUrl: string): Promise<void> {
    const accessToken = await this.getAccessToken();
    const dealId = this.config.dealId as string | undefined;
    if (!dealId) {
      await fetch(this.config.webhookUrl as string, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shipmentId, status, trackingUrl }),
      }).catch(() => undefined);
      return;
    }
    await fetch(`https://www.zohoapis.in/crm/v2/Deals/${dealId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: [{ Description: `Status: ${status}. Track: ${trackingUrl}` }] }),
    });
  }

  async pullOrders(): Promise<IntegrationOrder[]> {
    return [];
  }
}

export function createConnector(
  provider: string,
  config: Record<string, unknown>,
): IntegrationConnector {
  if (provider === 'zoho') return new ZohoConnector(provider, config);
  if (provider === 'custom_webhook') return new CustomWebhookConnector(provider, config);
  return new BaseConnector(provider, config);
}
