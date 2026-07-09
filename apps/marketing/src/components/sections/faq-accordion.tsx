'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import type { FaqItem } from '@/types/content';
import { GsapReveal } from '@/components/motion/gsap-reveal';
import { SectionLabel, SectionTitle } from './section-heading';

function FaqItemRow({ item, open, onToggle }: { item: FaqItem; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-base font-medium text-foreground md:text-lg">{item.question}</span>
        <span className="shrink-0 rounded-full border border-border p-1">
          {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-muted leading-relaxed">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <GsapReveal className="text-center">
          <SectionLabel>FAQs</SectionLabel>
          <SectionTitle className="mt-4">Frequently Asked Questions</SectionTitle>
          <p className="mt-4 text-muted">
            Everything you need to know about ChaseHorse GELP and our logistics platform.
          </p>
        </GsapReveal>

        <GsapReveal className="mt-12">
          {faqs.map((item, i) => (
            <FaqItemRow
              key={item.question}
              item={item}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </GsapReveal>
      </div>
    </section>
  );
}
