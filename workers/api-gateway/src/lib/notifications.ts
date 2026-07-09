import type { Env } from '../types';
import { renderTemplate } from '@chasehorse/shared';

export async function sendSms(env: Env, to: string, body: string): Promise<boolean> {
  if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN || !env.TWILIO_PHONE_NUMBER) {
    console.log(`[SMS dev] to=${to}: ${body}`);
    return false;
  }
  const url = `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`;
  const auth = btoa(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`);
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ To: to, From: env.TWILIO_PHONE_NUMBER, Body: body }),
  });
  return res.ok;
}

export async function sendEmail(env: Env, to: string, subject: string, body: string): Promise<boolean> {
  if (!env.SENDGRID_API_KEY) {
    console.log(`[Email dev] to=${to} subject=${subject}: ${body}`);
    return false;
  }
  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: env.SENDGRID_FROM_EMAIL ?? 'noreply@chasehorse.com', name: 'ChaseHorse' },
      subject,
      content: [{ type: 'text/plain', value: body }],
    }),
  });
  return res.ok;
}

export async function dispatchNotification(
  env: Env,
  event: string,
  recipient: { email?: string; phone?: string },
  vars: Record<string, string>,
) {
  const { subject, body, sms } = renderTemplate(event, vars);
  if (recipient.email) await sendEmail(env, recipient.email, subject, body);
  if (recipient.phone && sms) await sendSms(env, recipient.phone, sms);
}
