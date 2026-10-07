import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export interface TryOnStatus {
  mode: string;
  configured: boolean;
  provider: string | null;
  paymentRequired?: boolean;
  priceInr?: number;
  currency?: string;
  paymentConfigured?: boolean;
  paymentProvider?: string;
  generationAvailable: boolean;
  creditLedgerAvailable: boolean;
  topUpAvailable: boolean;
  requirements: string[];
}

const DEFAULT_STATUS: TryOnStatus = {
  mode: 'runware-flux',
  configured: false,
  provider: null,
  paymentRequired: true,
  priceInr: 20,
  currency: 'INR',
  paymentConfigured: false,
  paymentProvider: 'payu',
  generationAvailable: false,
  creditLedgerAvailable: false,
  topUpAvailable: false,
  requirements: ['RUNWARE_API_KEY required', 'PayU payment configuration and persistent credit storage required'],
};

const TryOnStatusContext = createContext<TryOnStatus>(DEFAULT_STATUS);

export function TryOnStatusProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState(DEFAULT_STATUS);
  useEffect(() => {
    let active = true;
    fetch('/api/try-on/status', { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) throw new Error('Try-On status unavailable');
        return response.json() as Promise<TryOnStatus>;
      })
      .then((data) => { if (active) setStatus({ ...DEFAULT_STATUS, ...data }); })
      .catch(() => {
        if (active) setStatus({ ...DEFAULT_STATUS, requirements: ['Try-On service status is unavailable. No photo will be sent and no generation can start.'] });
      });
    return () => { active = false; };
  }, []);
  return <TryOnStatusContext.Provider value={status}>{children}</TryOnStatusContext.Provider>;
}

export function useTryOnStatus() {
  return useContext(TryOnStatusContext);
}

export function useTryOnAvailable() {
  return useTryOnStatus().generationAvailable === true;
}
