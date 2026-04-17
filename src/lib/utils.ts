import { useAppStore, type Currency } from '@/store/useAppStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number, fromCurrency: Currency = 'DZD') => {
  const { currency, exchangeRates } = useAppStore.getState();
  
  // Convert to DZD first if needed (simplified assuming stored in DZD)
  const baseAmount = amount; 
  const converted = baseAmount * (exchangeRates[currency] || 1);
  
  const formatter = new Intl.NumberFormat(currency === 'DZD' ? 'ar-DZ' : 'fr-FR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: currency === 'DZD' ? 0 : 2,
    maximumFractionDigits: currency === 'DZD' ? 0 : 2,
  });

  return formatter.format(converted);
};
