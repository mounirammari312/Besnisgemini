import { useAppStore } from '@/store/useAppStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number) => {
  const { currency, exchangeRates } = useAppStore.getState();
  const converted = amount * (exchangeRates[currency] || 1);
  
  const formatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: currency === 'DZD' ? 0 : 2,
    maximumFractionDigits: currency === 'DZD' ? 0 : 2,
  });

  return formatter.format(converted);
};
