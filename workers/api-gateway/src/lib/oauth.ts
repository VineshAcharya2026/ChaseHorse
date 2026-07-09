import type { Env } from '../types';

interface OAuthProfile {
  email: string;
  name: string;
  providerId: string;
}

export async function exchangeOAuthCode(
  provider: string,
  code: string,
  env: Env,
): Promise<OAuthProfile> {
  const redirectUri = `${env.FRONTEND_URL}/auth/callback/${provider}`;

  if (provider === 'google') {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: env.GOOGLE_CLIENT_ID ?? '',
        client_secret: env.GOOGLE_CLIENT_SECRET ?? '',
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });
    const tokens = (await tokenRes.json()) as { access_token?: string; error?: string };
    if (!tokens.access_token) throw new Error(tokens.error ?? 'Google token exchange failed');

    const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const profile = (await profileRes.json()) as { email: string; name: string; id: string };
    return { email: profile.email, name: profile.name, providerId: profile.id };
  }

  if (provider === 'microsoft') {
    const tokenRes = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: env.MICROSOFT_CLIENT_ID ?? '',
        client_secret: env.MICROSOFT_CLIENT_SECRET ?? '',
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });
    const tokens = (await tokenRes.json()) as { access_token?: string; error_description?: string };
    if (!tokens.access_token) throw new Error(tokens.error_description ?? 'Microsoft token exchange failed');

    const profileRes = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const profile = (await profileRes.json()) as {
      mail?: string;
      userPrincipalName?: string;
      displayName?: string;
      id: string;
    };
    const email = profile.mail ?? profile.userPrincipalName ?? '';
    return { email, name: profile.displayName ?? email, providerId: profile.id };
  }

  throw new Error(`Unsupported OAuth provider: ${provider}`);
}
