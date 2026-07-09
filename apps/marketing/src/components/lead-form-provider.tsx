'use client';

import { createContext, useContext, useState, useCallback } from 'react';

interface LeadFormContextValue {
  open: boolean;
  openForm: () => void;
  closeForm: () => void;
}

const LeadFormContext = createContext<LeadFormContextValue | null>(null);

export function LeadFormProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const openForm = useCallback(() => setOpen(true), []);
  const closeForm = useCallback(() => setOpen(false), []);

  return (
    <LeadFormContext.Provider value={{ open, openForm, closeForm }}>
      {children}
    </LeadFormContext.Provider>
  );
}

export function useLeadForm() {
  const ctx = useContext(LeadFormContext);
  if (!ctx) {
    return { open: false, openForm: () => {}, closeForm: () => {} };
  }
  return ctx;
}
