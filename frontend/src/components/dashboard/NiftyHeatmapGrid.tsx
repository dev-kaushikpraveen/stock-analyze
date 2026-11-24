'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Flame,
  Globe,
  Clock,
  Maximize2,
  Filter,
} from 'lucide-react';
import { formatCurrency, formatPct } from '@/lib/utils';

interface NiftyHeatmapGridProps {
  onSelectStock: (symbol: string) => void;
}

export const NiftyHeatmapGrid: React.FC<NiftyHeatmapGridProps> = ({ onSelectStock }) => {
  const [selectedUniverse, setSelectedUniverse] = useState<'NIFTY 50' | 'BANK NIFTY' | 'NIFTY IT'>('NIFTY 50');

  // NIFTY 50 constituent performance blocks (Matching Image 1 exactly)
  const heatmapTiles = [
    { symbol: 'RELIANCE', name: 'Reliance Industries', change: 1.62, price: 2948.40, mcap: 'Large' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', change: 1.28, price: 1678.45, mcap: 'Large' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', change: 1.45, price: 1236.50, mcap: 'Large' },
    { symbol: 'TCS', name: 'Tata Consultancy Services', change: -0.45, price: 3912.10, mcap: 'Large' },
    { symbol: 'INFY', name: 'Infosys Ltd', change: -0.32, price: 1592.80, mcap: 'Large' },
    { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', change: 0.88, price: 2420.10, mcap: 'Large' },
    { symbol: 'ITC', name: 'ITC Ltd', change: 0.35, price: 432.25, mcap: 'Large' },
    { symbol: 'SBIN', name: 'State Bank of India', change: 1.05, price: 812.60, mcap: 'Large' },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel', change: 0.74, price: 1350.20, mcap: 'Large' },
    { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', change: 1.10, price: 1740.30, mcap: 'Large' },
    { symbol: 'LT', name: 'Larsen & Toubro', change: 0.92, price: 3610.50, mcap: 'Large' },
    { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd', change: 1.63, price: 7462.30, mcap: 'Large' },
    { symbol: 'ASIANPAINT', name: 'Asian Paints', change: 0.43, price: 2840.10, mcap: 'Mid' },
    { symbol: 'MARUTI', name: 'Maruti Suzuki', change: -0.25, price: 12585.00, mcap: 'Large' },
    { symbol: 'TITAN', name: 'Titan Company', change: 0.18, price: 3410.20, mcap: 'Mid' },
    { symbol: 'AXISBANK', name: 'Axis Bank Ltd', change: 0.89, price: 1180.50, mcap: 'Large' },
    { symbol: 'SUNPHARMA', name: 'Sun Pharma', change: -0.35, price: 1742.30, mcap: 'Mid' },
    { symbol: 'ULTRACEMCO', name: 'UltraTech Cement', change: 0.28, price: 10450.00, mcap: 'Mid' },
    { symbol: 'NTPC', name: 'NTPC Ltd', change: 0.49, price: 365.10, mcap: 'Mid' },
    { symbol: 'POWERGRID', name: 'Power Grid Corp', change: 0.22, price: 310.40, mcap: 'Mid' },
    { symbol: 'M&M', name: 'Mahindra & Mahindra', change: 1.12, price: 2890.00, mcap: 'Mid' },
    { symbol: 'TATASTEEL', name: 'Tata Steel', change: -0.65, price: 165.40, mcap: 'Mid' },
    { symbol: 'WIPRO', name: 'Wipro Ltd', change: -0.24, price: 498.60, mcap: 'Mid' },
    { symbol: 'HCLTECH', name: 'HCL Technologies', change: -0.15, price: 1620.00, mcap: 'Mid' },
    { symbol: 'NESTLEIND', name: 'Nestle India', change: 1.13, price: 2512.70, mcap: 'Mid' },
  ];

  // Professional high-contrast heatmap colors
  const getTileBg = (change: number) => {
    if (change >= 1.5) return 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 shadow-sm';
    if (change >= 0.8) return 'bg-emerald-700/90 hover:bg-emerald-600 text-emerald-50 border-emerald-500/50';
    if (change > 0) return 'bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 border-emerald-600/40';
    if (change <= -1.0) return 'bg-rose-600 hover:bg-rose-500 text-white border-rose-400 shadow-sm';
    if (change < 0) return 'bg-rose-700/90 hover:bg-rose-600 text-rose-50 border-rose-500/50';
    return 'bg-slate-700 text-slate-200 border-slate-600';
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Ribbon matching Image 1 Top Ticker Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* NIFTY 50 */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-3.5 shadow-md">
          <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">NIFTY 50</span>
          <div className="text-base font-mono font-extrabold text-white mt-0.5">24,752.15</div>
          <span className="text-[11px] font-mono font-bold text-emerald-400 flex items-center mt-0.5">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +180.45 (0.73%)
          </span>
          <div className="w-full h-1.5 bg-slate-700 rounded-full mt-2.5 overflow-hidden">
            <div className="w-[73%] h-full bg-emerald-500" />
          </div>
        </div>

        {/* SENSEX */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-3.5 shadow-md">
          <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">SENSEX</span>
          <div className="text-base font-mono font-extrabold text-white mt-0.5">81,193.72</div>
          <span className="text-[11px] font-mono font-bold text-emerald-400 flex items-center mt-0.5">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +620.18 (0.77%)
          </span>
          <div className="w-full h-1.5 bg-slate-700 rounded-full mt-2.5 overflow-hidden">
            <div className="w-[77%] h-full bg-emerald-500" />
          </div>
        </div>

        {/* NIFTY BANK */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-3.5 shadow-md">
          <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">NIFTY BANK</span>
          <div className="text-base font-mono font-extrabold text-white mt-0.5">55,168.90</div>
          <span className="text-[11px] font-mono font-bold text-emerald-400 flex items-center mt-0.5">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +512.35 (0.94%)
          </span>
          <div className="w-full h-1.5 bg-slate-700 rounded-full mt-2.5 overflow-hidden">
            <div className="w-[94%] h-full bg-emerald-500" />
          </div>
        </div>

        {/* NIFTY IT */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-3.5 shadow-md">
          <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">NIFTY IT</span>
          <div className="text-base font-mono font-extrabold text-white mt-0.5">37,865.40</div>
          <span className="text-[11px] font-mono font-bold text-rose-400 flex items-center mt-0.5">
            <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" /> -120.60 (0.32%)
          </span>
          <div className="w-full h-1.5 bg-slate-700 rounded-full mt-2.5 overflow-hidden">
            <div className="w-[32%] h-full bg-rose-500" />
          </div>
        </div>

        {/* ADVANCES (Image 1) */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-3.5 shadow-md">
          <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">ADVANCES</span>
          <div className="text-base font-mono font-extrabold text-emerald-400 mt-0.5">1,682</div>
          <span className="text-[11px] font-mono font-bold text-emerald-300 flex items-center mt-0.5">
            65% of Universe
          </span>
          <div className="w-full h-1.5 bg-slate-700 rounded-full mt-2.5 overflow-hidden">
            <div className="w-[65%] h-full bg-emerald-500" />
          </div>
        </div>

        {/* DECLINES (Image 1) */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-3.5 shadow-md">
          <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">DECLINES</span>
          <div className="text-base font-mono font-extrabold text-rose-400 mt-0.5">894</div>
          <span className="text-[11px] font-mono font-bold text-rose-300 flex items-center mt-0.5">
            35% of Universe
          </span>
          <div className="w-full h-1.5 bg-slate-700 rounded-full mt-2.5 overflow-hidden">
            <div className="w-[35%] h-full bg-rose-500" />
          </div>
        </div>
      </div>

      {/* 2. Main Heatmap Grid & Side Panels (Exact Image 1 Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Heatmap Area (8 Columns) */}
        <div className="lg:col-span-8 bg-[#1e293b] border border-[#334155] rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-[#334155]">
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
                <Flame className="w-4 h-4 mr-1.5 text-amber-400" /> Market Heatmap
              </h2>
              <span className="text-[10px] font-mono text-slate-400">ⓘ</span>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={selectedUniverse}
                onChange={(e) => setSelectedUniverse(e.target.value as any)}
                className="bg-[#0f172a] border border-[#334155] text-xs font-mono rounded-lg px-2.5 py-1.5 text-slate-200 outline-none"
              >
                <option value="NIFTY 50">NIFTY 50</option>
                <option value="BANK NIFTY">BANK NIFTY</option>
                <option value="NIFTY IT">NIFTY IT</option>
              </select>
              <button className="text-slate-300 hover:text-white p-1.5 rounded-lg bg-[#0f172a] border border-[#334155]">
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Heatmap Matrix Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
            {heatmapTiles.map((tile) => (
              <div
                key={tile.symbol}
                onClick={() => onSelectStock(tile.symbol)}
                className={`p-3 rounded-xl border transition-all duration-150 cursor-pointer flex flex-col justify-between ${getTileBg(
                  tile.change
                )}`}
              >
                <div className="font-mono font-black text-xs tracking-tight">{tile.symbol}</div>
                <div className="mt-2 text-right">
                  <div className="font-mono font-black text-xs flex items-center justify-end">
                    {tile.change >= 0 ? '▲' : '▼'} {Math.abs(tile.change).toFixed(2)}%
                  </div>
                  <div className="text-[10px] font-mono font-medium opacity-90">
                    ₹{tile.price.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Heatmap Legend Bar (-2% to +2%) */}
          <div className="mt-4 pt-3 border-t border-[#334155] flex items-center justify-between text-[11px] font-mono text-slate-300">
            <div className="flex items-center space-x-2">
              <span className="text-rose-400 font-bold">-2%</span>
              <div className="w-28 h-2.5 rounded-full bg-gradient-to-r from-rose-600 via-slate-600 to-emerald-600 shadow-inner" />
              <span className="text-emerald-400 font-bold">+2%</span>
            </div>
            <span>Showing 50 of 50 constituents • Real-time tick weighted</span>
          </div>
        </div>

        {/* Top Gainers & Losers Tables (4 Columns, matching Image 1) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Top Gainers Table */}
          <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#334155]">
              <span className="text-xs font-bold text-white uppercase flex items-center">
                Top Gainers <span className="ml-1 text-slate-400 text-[10px]">ⓘ</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-400 hover:underline cursor-pointer font-bold">
                View all
              </span>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              {[
                { s: 'BAJFINANCE', p: 7462.30, ch: 118.90, pct: 1.63 },
                { s: 'RELIANCE', p: 2948.40, ch: 46.80, pct: 1.62 },
                { s: 'ICICIBANK', p: 1236.50, ch: 17.60, pct: 1.45 },
                { s: 'HDFCBANK', p: 1678.45, ch: 21.20, pct: 1.28 },
                { s: 'NESTLEIND', p: 2512.70, ch: 28.10, pct: 1.13 },
              ].map((item) => (
                <div
                  key={item.s}
                  onClick={() => onSelectStock(item.s)}
                  className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-[#0f172a] hover:bg-[#283548] border border-[#334155] cursor-pointer transition-colors"
                >
                  <span className="font-bold text-slate-100">{item.s}</span>
                  <div className="text-right">
                    <span className="text-white mr-2">₹{item.p.toLocaleString()}</span>
                    <span className="text-emerald-400 font-bold">+{item.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Losers Table */}
          <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#334155]">
              <span className="text-xs font-bold text-white uppercase flex items-center">
                Top Losers <span className="ml-1 text-slate-400 text-[10px]">ⓘ</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-400 hover:underline cursor-pointer font-bold">
                View all
              </span>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              {[
                { s: 'TCS', p: 3912.10, ch: -17.70, pct: -0.45 },
                { s: 'INFY', p: 1592.80, ch: -5.10, pct: -0.32 },
                { s: 'SUNPHARMA', p: 1742.30, ch: -6.10, pct: -0.35 },
                { s: 'MARUTI', p: 12585.00, ch: -31.50, pct: -0.25 },
                { s: 'WIPRO', p: 498.60, ch: -1.20, pct: -0.24 },
              ].map((item) => (
                <div
                  key={item.s}
                  onClick={() => onSelectStock(item.s)}
                  className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-[#0f172a] hover:bg-[#283548] border border-[#334155] cursor-pointer transition-colors"
                >
                  <span className="font-bold text-slate-100">{item.s}</span>
                  <div className="text-right">
                    <span className="text-white mr-2">₹{item.p.toLocaleString()}</span>
                    <span className="text-rose-400 font-bold">{item.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 3. Bottom Row: Sector Breadth Donut & Progress Bars (Image 1 Bottom Left) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6 bg-[#1e293b] border border-[#334155] rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#334155]">
            <span className="text-xs font-bold text-white uppercase flex items-center">
              Sector Breadth <span className="ml-1 text-slate-400 text-[10px]">ⓘ</span>
            </span>
            <span className="text-[10px] font-mono text-cyan-400 hover:underline cursor-pointer font-bold">
              View all
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Donut representation 65% Advancing */}
            <div className="md:col-span-4 flex flex-col items-center justify-center">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-28 h-28 transform -rotate-90">
                  <circle cx="56" cy="56" r="42" stroke="#334155" strokeWidth="10" fill="none" />
                  <circle
                    cx="56"
                    cy="56"
                    r="42"
                    stroke="#10b981"
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray="264"
                    strokeDashoffset={264 * (1 - 0.65)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-lg font-mono font-extrabold text-white block">65%</span>
                  <span className="text-[10px] font-mono text-emerald-300 font-bold">Advancing</span>
                </div>
              </div>
            </div>

            {/* Sector Breakdown Progress Bars */}
            <div className="md:col-span-8 space-y-2 text-xs font-mono">
              {[
                { sector: 'Nifty Bank', adv: 11, dec: 3, neu: 1, ratio: 79 },
                { sector: 'Nifty IT', adv: 5, dec: 6, neu: 0, ratio: 45 },
                { sector: 'Nifty FMCG', adv: 8, dec: 2, neu: 2, ratio: 73 },
                { sector: 'Nifty Pharma', adv: 7, dec: 3, neu: 1, ratio: 64 },
                { sector: 'Nifty Auto', adv: 5, dec: 4, neu: 2, ratio: 50 },
                { sector: 'Nifty Metal', adv: 4, dec: 5, neu: 1, ratio: 44 },
              ].map((s) => (
                <div key={s.sector} className="flex items-center justify-between">
                  <span className="text-slate-200 w-24 truncate font-medium">{s.sector}</span>
                  <div className="flex-1 mx-3 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${s.ratio >= 50 ? 'bg-emerald-400' : 'bg-rose-400'}`}
                      style={{ width: `${s.ratio}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-white w-10 text-right">{s.ratio}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Indices Table (Image 1 Bottom Center) */}
        <div className="lg:col-span-6 bg-[#1e293b] border border-[#334155] rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#334155]">
            <span className="text-xs font-bold text-white uppercase flex items-center">
              Indices Overview <span className="ml-1 text-slate-400 text-[10px]">ⓘ</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1.5" />
              Market Open • 21 May 2026, 10:24 AM IST
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            {[
              { name: 'NIFTY 50', val: '24,752.15', ch: '+180.45', pct: '+0.73%' },
              { name: 'SENSEX', val: '81,193.72', ch: '+620.18', pct: '+0.77%' },
              { name: 'NIFTY BANK', val: '55,168.90', ch: '+512.35', pct: '+0.94%' },
              { name: 'NIFTY IT', val: '37,865.40', ch: '-120.60', pct: '-0.32%' },
              { name: 'NIFTY MIDCAP 100', val: '57,482.30', ch: '+210.85', pct: '+0.37%' },
              { name: 'NIFTY SMALLCAP 100', val: '18,765.40', ch: '+65.30', pct: '+0.35%' },
            ].map((idx) => {
              const isUp = idx.pct.startsWith('+');
              return (
                <div
                  key={idx.name}
                  className="flex items-center justify-between py-2 px-3 rounded-xl bg-[#0f172a] border border-[#334155]"
                >
                  <span className="font-bold text-slate-100">{idx.name}</span>
                  <span className="text-white font-mono font-medium">{idx.val}</span>
                  <span className={`font-mono font-bold ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {idx.ch} ({idx.pct})
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
