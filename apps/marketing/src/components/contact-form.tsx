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

  if (submitted) {
    return (
      <div className="rounded-md bg-tesla-gray p-8 text-center">
        <p className="font-medium text-tesla-black">Thank you for reaching out!</p>
        <p className="mt-2 text-sm text-tesla-body">
          Your email client should open — we typically respond within 1–2 business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-tesla-black">Name *</label>
          <input name="name" required className="input-line" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-tesla-black">Phone</label>
          <input name="phone" type="tel" className="input-line" />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-tesla-black">Email *</label>
        <input name="email" type="email" required className="input-line" />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-tesla-black">Company</label>
        <input name="company" className="input-line" />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-tesla-black">Subject *</label>
        <input name="subject" required defaultValue={initialSubject} className="input-line" />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-tesla-black">Message *</label>
        <textarea name="message" required rows={5} className="input-line resize-none" />
      </div>
      <button type="submit" className="btn-tesla-dark min-w-0 w-full sm:w-auto">
        Send Message
      </button>
    </form>
  );
}
