'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface ContactFormProps {
  defaultSubject?: string;
}

export function ContactForm({ defaultSubject = '' }: ContactFormProps) {
  const searchParams = useSearchParams();
  const [submitted, setSubmitted] = useState(false);

  const subjectFromUrl =
    searchParams.get('subject') ??
    (searchParams.get('product') ? `Enquiry: ${searchParams.get('product')}` : '');
  const initialSubject = subjectFromUrl || defaultSubject;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const subject = encodeURIComponent(String(data.get('subject') ?? 'ChaseHorse Enquiry'));
    const body = encodeURIComponent(
      `Name: ${data.get('name')}\nPhone: ${data.get('phone')}\nCompany: ${data.get('company')}\n\n${data.get('message')}`,
    );
    window.location.href = `mailto:letsconnect@chasehorse.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  const inputClass =
    'w-full border-b border-border bg-transparent py-2 text-foreground outline-none focus:border-brand';

  if (submitted) {
    return (
      <p className="rounded-sm border border-border bg-surface p-6 text-center text-muted">
        Thank you. Your email client should open — we typically respond within 1–2 business days.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-muted">Name *</label>
          <input name="name" required className={inputClass} />
        </div>
        <div>
          <label className="mb-2 block text-sm text-muted">Phone</label>
          <input name="phone" type="tel" className={inputClass} />
        </div>
      </div>
      <div>
        <label className="mb-2 block text-sm text-muted">Email *</label>
        <input name="email" type="email" required className={inputClass} />
      </div>
      <div>
        <label className="mb-2 block text-sm text-muted">Company</label>
        <input name="company" className={inputClass} />
      </div>
      <div>
        <label className="mb-2 block text-sm text-muted">Subject *</label>
        <input name="subject" required defaultValue={initialSubject} className={inputClass} />
      </div>
      <div>
        <label className="mb-2 block text-sm text-muted">Message *</label>
        <textarea name="message" required rows={5} className={inputClass} />
      </div>
      <button
        type="submit"
        className="w-full rounded-sm bg-foreground py-3 text-sm font-medium text-background transition hover:opacity-90 sm:w-auto sm:px-12"
      >
        Send Message
      </button>
    </form>
  );
}
