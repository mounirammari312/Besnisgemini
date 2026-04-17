import { useAppStore, type Currency } from '@/store/useAppStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number, fromCurrency: Currency = 'DZD') => {
  const { currency, exchangeRates } = useAppStore.getState();
  
  // Convert from DZD (base) to target currency
  const converted = amount * (exchangeRates[currency] || 1);
  
  const formatter = new Intl.NumberFormat(currency === 'DZD' ? 'ar-DZ' : (currency === 'EUR' ? 'fr-FR' : 'en-US'), {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: currency === 'DZD' ? 0 : 2,
    maximumFractionDigits: currency === 'DZD' ? 0 : 2,
  });

  return formatter.format(converted);
};
