import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'ar' | 'fr';
export type Currency = 'DZD' | 'EUR' | 'USD';

interface AppState {
  language: Language;
  currency: Currency;
  setLanguage: (lang: Language) => void;
  setCurrency: (curr: Currency) => void;
  exchangeRates: Record<Currency, number>;
  setExchangeRates: (rates: Record<Currency, number>) => void;
  setExchangeRate: (curr: Currency, rate: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'ar',
      currency: 'DZD',
      exchangeRates: {
        DZD: 1,
        EUR: 0.0068,
        USD: 0.0074,
      },
      setLanguage: (language) => {
        set({ language });
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = language;
      },
      setCurrency: (currency) => set({ currency }),
      setExchangeRates: (exchangeRates) => set({ exchangeRates }),
      setExchangeRate: (curr, rate) => set(state => ({
        exchangeRates: { ...state.exchangeRates, [curr]: rate }
      })),
    }),
    {
      name: 'businfo-settings',
    }
  )
);
