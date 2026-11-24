'use client';

import React from 'react';
import { MarketIndex } from '@/types';
import { formatPct, getChangeColor } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface TickerTapeProps {
  indices: MarketIndex[];
}

export const TickerTape: React.FC<TickerTapeProps> = ({ indices }) => {
  // Double array for continuous seamless infinite loop
  const tickerItems = [...indices, ...indices, ...indices];

  return (
    <div className="w-full bg-[#1e293b] border-y border-[#334155] overflow-hidden py-2 select-none relative z-10 shadow-inner">
      <div className="flex w-max animate-marquee space-x-6 text-xs font-mono">
        {tickerItems.map((idx, index) => {
          const isUp = idx.change >= 0;
          return (
            <div key={`${idx.symbol}-${index}`} className="flex items-center space-x-2">
              <span className="font-bold text-slate-100">{idx.symbol}</span>
              <span className="text-slate-300 font-medium">
                {idx.value.toLocaleString(idx.exchange === 'NSE' || idx.exchange === 'BSE' ? 'en-IN' : 'en-US', {
                  minimumFractionDigits: 2,
                })}
              </span>
              <span
                className={`flex items-center font-bold px-1 rounded ${
                  isUp
                    ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/20'
                    : 'text-rose-400 bg-rose-950/40 border border-rose-500/20'
                }`}
              >
                {isUp ? (
                  <ArrowUpRight className="w-3 h-3 mr-0.5 inline" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 mr-0.5 inline" />
                )}
                {formatPct(idx.change_pct)}
              </span>
              <span className="text-slate-600">|</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
