const TEMPLATES: Record<string, { subject: string; body: string; sms?: string }> = {
  'shipment.created': {
    subject: 'Shipment {{awb}} created',
    body: 'Your shipment {{awb}} has been created. Track at {{trackUrl}}',
    sms: 'ChaseHorse: Shipment {{awb}} created. Track: {{trackUrl}}',
  },
  'shipment.out_for_delivery': {
    subject: 'Shipment {{awb}} out for delivery',
    body: 'Your shipment {{awb}} is out for delivery today.',
    sms: 'ChaseHorse: {{awb}} is out for delivery.',
  },
  'shipment.delivered': {
    subject: 'Shipment {{awb}} delivered',
    body: 'Your shipment {{awb}} has been delivered successfully.',
    sms: 'ChaseHorse: {{awb}} delivered.',
  },
  'pickup.scheduled': {
    subject: 'Pickup scheduled',
    body: 'Your pickup is scheduled for {{slot}}.',
    sms: 'ChaseHorse: Pickup scheduled {{slot}}.',
  },
  otp: {
    subject: 'Your ChaseHorse OTP',
    body: 'Your OTP is {{otp}}. Valid for 10 minutes.',
    sms: 'ChaseHorse OTP: {{otp}}. Valid 10 min.',
  },
  'invoice.generated': {
    subject: 'Invoice {{invoiceNumber}}',
    body: 'Invoice {{invoiceNumber}} for ₹{{amount}} is ready.',
    sms: 'ChaseHorse: Invoice {{invoiceNumber}} ₹{{amount}}.',
  },
};

function interpolate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? '');
}

export function renderTemplate(
  event: string,
  vars: Record<string, string>,
): { subject: string; body: string; sms?: string } {
  const tpl = TEMPLATES[event] ?? {
    subject: `ChaseHorse: ${event}`,
    body: JSON.stringify(vars),
    sms: `ChaseHorse: ${event}`,
  };
  return {
    subject: interpolate(tpl.subject, vars),
    body: interpolate(tpl.body, vars),
    sms: tpl.sms ? interpolate(tpl.sms, vars) : undefined,
  };
}

export { TEMPLATES };
