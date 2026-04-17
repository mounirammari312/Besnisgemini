import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'ar' | 'fr';
type Currency = 'DZD' | 'EUR' | 'USD';

interface AppState {
  language: Language;
  currency: Currency;
  setLanguage: (lang: Language) => void;
  setCurrency: (curr: Currency) => void;
  exchangeRates: Record<Currency, number>;
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
    }),
    {
      name: 'businfo-settings',
    }
  )
);
