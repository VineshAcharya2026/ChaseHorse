'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useLeadForm } from '@/components/lead-form-provider';
import { cn } from '@/lib/utils';

const SERVICES = [
  'Tier 1 — Core Business Services',
  'Tier 2 — Strategic & Growth',
  'Tier 3 — Advanced Technology',
  'Fleet & Driver Management',
  'Digital Transformation',
  'Warehouse Training',
  'Other',
];

const TIMELINES = ['Immediate', '1–3 Months', '3–6 Months', 'Not Sure'];

export function LeadFormModal() {
  const { open, closeForm } = useLeadForm();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    service: '',
    timeline: '',
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });

  const reset = () => {
    setStep(0);
    setDone(false);
    setSubmitting(false);
    setForm({ service: '', timeline: '', name: '', email: '', phone: '', company: '', message: '' });
  };

  const handleClose = () => {
    closeForm();
    setTimeout(reset, 300);
  };

  const handleSubmit = () => {
    setSubmitting(true);
    const subject = encodeURIComponent(`ChaseHorse Enquiry: ${form.service}`);
    const body = encodeURIComponent(
      `Service: ${form.service}\nTimeline: ${form.timeline}\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nCompany: ${form.company}\n\n${form.message}`,
    );
    window.location.href = `mailto:letsconnect@chasehorse.com?subject=${subject}&body=${body}`;
    setTimeout(() => {
      setSubmitting(false);
      setDone(true);
    }, 1200);
  };

  const canNext =
    (step === 0 && form.service) ||
    (step === 1 && form.timeline) ||
    (step === 2 && form.name && form.email);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative w-full max-w-lg rounded-md bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-4 top-4 p-2 text-tesla-muted transition hover:text-tesla-black"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {done ? (
              <div className="py-8 text-center">
                <p className="text-2xl font-medium text-tesla-black">Thank you!</p>
                <p className="mt-2 text-tesla-body">
                  Your email client should open. We typically respond within 1–2 business days.
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn-tesla-dark mt-6 min-w-0"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-medium text-tesla-black">
                  {step === 0 && 'What service interests you?'}
                  {step === 1 && 'What is your timeline?'}
                  {step === 2 && 'Tell us about yourself'}
                  {step === 3 && 'Anything else to add?'}
                </h2>

                <div className="mt-6 flex gap-2">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={cn(
                        'h-0.5 flex-1 transition-colors duration-300',
                        i <= step ? 'bg-tesla-blue' : 'bg-tesla-gray',
                      )}
                    />
                  ))}
                </div>

                <div className="mt-8 min-h-[200px]">
                  {step === 0 && (
                    <div className="grid gap-2">
                      {SERVICES.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setForm({ ...form, service: s })}
                          className={cn(
                            'rounded-sm border px-4 py-3 text-left text-sm transition',
                            form.service === s
                              ? 'border-tesla-blue bg-tesla-blue/5 text-tesla-black'
                              : 'border-tesla-gray hover:border-tesla-blue/40',
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}

                  {step === 1 && (
                    <div className="grid grid-cols-2 gap-3">
                      {TIMELINES.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setForm({ ...form, timeline: t })}
                          className={cn(
                            'rounded-sm border px-4 py-4 text-sm font-medium transition',
                            form.timeline === t
                              ? 'border-tesla-blue bg-tesla-blue/5 text-tesla-black'
                              : 'border-tesla-gray hover:border-tesla-blue/40',
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-4">
                      {(['name', 'email', 'phone', 'company'] as const).map((field) => (
                        <input
                          key={field}
                          placeholder={`${field === 'name' ? 'Full name' : field.charAt(0).toUpperCase() + field.slice(1)}${field === 'name' || field === 'email' ? ' *' : ''}`}
                          type={field === 'email' ? 'email' : 'text'}
                          value={form[field]}
                          onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                          className="input-line"
                        />
                      ))}
                    </div>
                  )}

                  {step === 3 && (
                    <textarea
                      placeholder="Tell us about your project..."
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="input-line resize-none"
                    />
                  )}
                </div>

                <div className="mt-6 flex justify-between">
                  {step > 0 ? (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="inline-flex items-center gap-2 text-sm text-tesla-body hover:text-tesla-black"
                    >
                      <ArrowLeft className="h-4 w-4" /> Back
                    </button>
                  ) : (
                    <span />
                  )}

                  {step < 3 ? (
                    <button
                      type="button"
                      disabled={!canNext}
                      onClick={() => setStep(step + 1)}
                      className="btn-tesla-dark inline-flex min-w-0 items-center gap-2 disabled:opacity-40"
                    >
                      Next <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={handleSubmit}
                      className="btn-tesla-dark inline-flex min-w-0 items-center gap-2 disabled:opacity-60"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                        </>
                      ) : (
                        'Submit'
                      )}
                    </button>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
