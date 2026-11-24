import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, market: 'IN' | 'US' = 'IN', compact: boolean = false): string {
  if (value === undefined || value === null || isNaN(value)) return '—';
  
  const isINR = market === 'IN';
  const prefix = isINR ? '₹' : '$';

  if (compact) {
    if (Math.abs(value) >= 10000000 && isINR) {
      return `${prefix}${(value / 10000000).toFixed(2)} Cr`;
    }
    if (Math.abs(value) >= 100000 && isINR) {
      return `${prefix}${(value / 100000).toFixed(2)} L`;
    }
    if (Math.abs(value) >= 1000000000 && !isINR) {
      return `${prefix}${(value / 1000000000).toFixed(2)} B`;
    }
    if (Math.abs(value) >= 1000000 && !isINR) {
      return `${prefix}${(value / 1000000).toFixed(2)} M`;
    }
    if (Math.abs(value) >= 1000) {
      return `${prefix}${(value / 1000).toFixed(1)}k`;
    }
  }

  return `${prefix}${value.toLocaleString(isINR ? 'en-IN' : 'en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatPct(value: number, withSign: boolean = true): string {
  if (value === undefined || value === null || isNaN(value)) return '0.00%';
  const sign = withSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function formatNumber(value: number, decimals: number = 2): string {
  if (value === undefined || value === null || isNaN(value)) return '—';
  return value.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function getSentimentColor(sentiment: string | undefined): string {
  if (!sentiment) return 'text-slate-400';
  const s = sentiment.toLowerCase();
  if (s.includes('bull') || s.includes('safe') || s.includes('strong buy') || s.includes('high') || s.includes('growth')) {
    return 'text-emerald-400';
  }
  if (s.includes('bear') || s.includes('distress') || s.includes('sell') || s.includes('weak') || s.includes('risk')) {
    return 'text-rose-400';
  }
  return 'text-amber-400';
}

export function getChangeColor(val: number): string {
  if (val > 0) return 'text-emerald-400';
  if (val < 0) return 'text-rose-400';
  return 'text-slate-400';
}

export function getChangeBg(val: number): string {
  if (val > 0) return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
  if (val < 0) return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
  return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
}
