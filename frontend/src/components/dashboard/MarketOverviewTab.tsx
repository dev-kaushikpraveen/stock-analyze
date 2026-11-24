'use client';

import React, { useState } from 'react';
import {
  MarketIndex,
  MarketBreadth,
  SectorBreadth,
  EquityStock,
  InstitutionalData,
  MarketNewsItem,
} from '@/types';
import {
  formatCurrency,
  formatPct,
  formatNumber,
  getChangeColor,
  getChangeBg,
  getSentimentColor,
} from '@/lib/utils';
import {
  TrendingUp,
  TrendingDown,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Globe,
  Flame,
  Newspaper,
  ChevronRight,
  Filter,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';

interface MarketOverviewTabProps {
  indices: MarketIndex[];
  breadth: MarketBreadth | null;
  sectors: SectorBreadth[];
  stocks: EquityStock[];
  topGainers: EquityStock[];
  topLosers: EquityStock[];
  institutional: InstitutionalData | null;
  news: MarketNewsItem[];
  onSelectStock: (symbol: string) => void;
}

export const MarketOverviewTab: React.FC<MarketOverviewTabProps> = ({
  indices,
  breadth,
  sectors,
  stocks,
  topGainers,
  topLosers,
  institutional,
  news,
  onSelectStock,
}) => {
  const [newsFilter, setNewsFilter] = useState<string>('ALL');

  const filteredNews = newsFilter === 'ALL'
    ? news
    : news.filter((n) => n.category.toUpperCase() === newsFilter.toUpperCase());

  return (
    <div className="space-y-6">
      {/* 1. Top Major Indices Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center">
            <Globe className="w-4 h-4 mr-2 text-brand-purple" />
            Benchmark Equities & Volatility Indices
          </h2>
          <span className="text-xs font-mono text-slate-400">Live Streaming • Tick by Tick</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {indices.map((idx) => {
            const isUp = idx.change >= 0;
            const sparkData = (idx.sparkline || [idx.value, idx.value]).map((v, i) => ({
              idx: i,
              val: v,
            }));

            return (
              <div
                key={idx.symbol}
                className="bg-surface/90 border border-surface-border rounded-lg p-3.5 hover:border-brand-purple/50 transition-all duration-200 relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-xs font-bold font-mono text-slate-100">{idx.symbol}</span>
                    <span className="ml-1.5 text-[10px] font-mono text-slate-400 uppercase">
                      {idx.exchange}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full ${getChangeBg(
                      idx.change
                    )}`}
                  >
                    {formatPct(idx.change_pct)}
                  </span>
                </div>

                <div className="flex items-baseline justify-between mb-2">
                  <div className="text-lg font-mono font-bold text-white tracking-tight">
                    {idx.value.toLocaleString(idx.exchange === 'NSE' || idx.exchange === 'BSE' ? 'en-IN' : 'en-US', {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                  <div className={`text-xs font-mono font-semibold ${getChangeColor(idx.change)}`}>
                    {idx.change > 0 ? `+${idx.change.toFixed(2)}` : idx.change.toFixed(2)}
                  </div>
                </div>

                {/* Sparkline mini chart */}
                <div className="h-9 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sparkData}>
                      <defs>
                        <linearGradient id={`grad-${idx.symbol}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={isUp ? '#10b981' : '#f43f5e'} stopOpacity={0.4} />
                          <stop offset="100%" stopColor={isUp ? '#10b981' : '#f43f5e'} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="val"
                        stroke={isUp ? '#10b981' : '#f43f5e'}
                        strokeWidth={1.5}
                        fill={`url(#grad-${idx.symbol})`}
                        isAnimationActive={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Day Range Bar */}
                <div className="mt-2 pt-2 border-t border-surface-border/50 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>L: {idx.low.toLocaleString()}</span>
                  <span>H: {idx.high.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Market Breadth & Sector Breadth Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Market Breadth Card */}
        <div className="bg-surface/90 border border-surface-border rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center">
                <Layers className="w-4 h-4 mr-2 text-brand-cyan" />
                Market Breadth & Internals
              </h3>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {breadth?.sentiment || 'Bullish Bias'}
              </span>
            </div>

            {breadth && (
              <div className="space-y-4">
                {/* Advances vs Declines Progress Bar */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-emerald-400 font-semibold">
                      Advances: {breadth.advances} ({((breadth.advances / (breadth.advances + breadth.declines + breadth.unchanged)) * 100).toFixed(0)}%)
                    </span>
                    <span className="text-rose-400 font-semibold">
                      Declines: {breadth.declines} ({((breadth.declines / (breadth.advances + breadth.declines + breadth.unchanged)) * 100).toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-surface-elevated rounded-full overflow-hidden flex">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-500"
                      style={{
                        width: `${(breadth.advances / (breadth.advances + breadth.declines + breadth.unchanged)) * 100}%`,
                      }}
                    />
                    <div
                      className="bg-slate-600 h-full transition-all duration-500"
                      style={{
                        width: `${(breadth.unchanged / (breadth.advances + breadth.declines + breadth.unchanged)) * 100}%`,
                      }}
                    />
                    <div
                      className="bg-rose-500 h-full transition-all duration-500"
                      style={{
                        width: `${(breadth.declines / (breadth.advances + breadth.declines + breadth.unchanged)) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Key Internals Grid */}
                <div className="grid grid-cols-3 gap-2.5 pt-2">
                  <div className="bg-surface-elevated/80 border border-surface-border/50 p-2.5 rounded">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">A/D Ratio</span>
                    <span className="text-base font-mono font-bold text-white">
                      {breadth.advance_decline_ratio.toFixed(2)}
                    </span>
                  </div>
                  <div className="bg-surface-elevated/80 border border-surface-border/50 p-2.5 rounded">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">52W Highs</span>
                    <span className="text-base font-mono font-bold text-emerald-400">
                      +{breadth.new_highs}
                    </span>
                  </div>
                  <div className="bg-surface-elevated/80 border border-surface-border/50 p-2.5 rounded">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">52W Lows</span>
                    <span className="text-base font-mono font-bold text-rose-400">
                      -{breadth.new_lows}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-surface-border text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Market Regime: Expansionary</span>
            <span className="text-emerald-400">Vol Index (VIX): 12.8 (-4.2%)</span>
          </div>
        </div>

        {/* Sector Performance Heatmap */}
        <div className="lg:col-span-2 bg-surface/90 border border-surface-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center">
              <Flame className="w-4 h-4 mr-2 text-brand-amber" />
              Sector Performance Heatmap
            </h3>
            <span className="text-xs font-mono text-slate-400">Weighted Relative Return</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {sectors.map((s) => {
              const isUp = s.change_pct >= 0;
              return (
                <div
                  key={s.sector}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    isUp
                      ? 'bg-emerald-950/20 border-emerald-500/20 hover:border-emerald-500/50'
                      : 'bg-rose-950/20 border-rose-500/20 hover:border-rose-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-200 truncate">{s.sector}</span>
                    {isUp ? (
                      <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
                    )}
                  </div>
                  <div className="text-base font-mono font-bold text-white mb-1.5">
                    {formatPct(s.change_pct)}
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span className="text-emerald-400">{s.advances} Adv</span>
                    <span className="text-rose-400">{s.declines} Dec</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Top Gainers & Losers + Institutional Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Top Gainers & Losers Dual Card */}
        <div className="lg:col-span-2 bg-surface/90 border border-surface-border rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Gainers */}
            <div>
              <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-surface-border">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center">
                  <TrendingUp className="w-3.5 h-3.5 mr-1.5" /> Top Gainers
                </span>
                <span className="text-[10px] font-mono text-slate-400">High Momentum</span>
              </div>
              <div className="space-y-1.5">
                {topGainers.map((stk) => (
                  <div
                    key={stk.symbol}
                    onClick={() => onSelectStock(stk.symbol)}
                    className="flex items-center justify-between p-2 rounded hover:bg-surface-elevated cursor-pointer transition-colors border border-transparent hover:border-surface-border"
                  >
                    <div>
                      <span className="font-mono font-bold text-xs text-slate-100">{stk.symbol}</span>
                      <p className="text-[10px] text-slate-400 truncate max-w-[140px]">{stk.name}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xs font-semibold text-white block">
                        {formatCurrency(stk.price, stk.market)}
                      </span>
                      <span className="font-mono text-[11px] font-semibold text-emerald-400">
                        {formatPct(stk.change_pct)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Losers */}
            <div>
              <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-surface-border">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center">
                  <TrendingDown className="w-3.5 h-3.5 mr-1.5" /> Top Decliners
                </span>
                <span className="text-[10px] font-mono text-slate-400">Oversold Scan</span>
              </div>
              <div className="space-y-1.5">
                {topLosers.map((stk) => (
                  <div
                    key={stk.symbol}
                    onClick={() => onSelectStock(stk.symbol)}
                    className="flex items-center justify-between p-2 rounded hover:bg-surface-elevated cursor-pointer transition-colors border border-transparent hover:border-surface-border"
                  >
                    <div>
                      <span className="font-mono font-bold text-xs text-slate-100">{stk.symbol}</span>
                      <p className="text-[10px] text-slate-400 truncate max-w-[140px]">{stk.name}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xs font-semibold text-white block">
                        {formatCurrency(stk.price, stk.market)}
                      </span>
                      <span className="font-mono text-[11px] font-semibold text-rose-400">
                        {formatPct(stk.change_pct)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Institutional FII & DII Net Flows */}
        <div className="bg-surface/90 border border-surface-border rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center">
                <ShieldCheck className="w-4 h-4 mr-2 text-brand-purple" />
                Institutional Flow (FII / DII)
              </h3>
              <span className="text-[10px] font-mono text-slate-400">NSE Daily Cash + F&O</span>
            </div>

            {institutional && (
              <div className="space-y-3.5">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-surface-elevated p-2.5 rounded border border-surface-border">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">FII Net Cash</span>
                    <span
                      className={`text-base font-mono font-bold ${
                        institutional.fii_net_crores >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {institutional.fii_net_crores >= 0 ? '+' : ''}
                      ₹{institutional.fii_net_crores.toLocaleString()} Cr
                    </span>
                  </div>
                  <div className="bg-surface-elevated p-2.5 rounded border border-surface-border">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">DII Net Cash</span>
                    <span
                      className={`text-base font-mono font-bold ${
                        institutional.dii_net_crores >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {institutional.dii_net_crores >= 0 ? '+' : ''}
                      ₹{institutional.dii_net_crores.toLocaleString()} Cr
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-surface-elevated/60 rounded border border-surface-border/50 text-xs">
                  <div className="flex justify-between font-mono mb-1">
                    <span className="text-slate-400">F&O Client Index Long Ratio:</span>
                    <span className="font-bold text-cyan-400">
                      {institutional.retail_client_pcr ? `${(institutional.retail_client_pcr * 55).toFixed(1)}%` : '62.4%'}
                    </span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-400">Smart Money Bias:</span>
                    <span className="font-bold text-emerald-400">{institutional.fii_derivative_sentiment || 'Bullish Accumulation'}</span>
                  </div>
                </div>

                {/* Top Inflows Sector */}
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                    Institutional Sector Inflow Leaders
                  </span>
                  <div className="space-y-1">
                    {(institutional.top_fii_inflows_sectors || [
                      { sector: 'Private Banking', flow_cr: 1420 },
                      { sector: 'Automobile', flow_cr: 890 },
                      { sector: 'Energy & Renewables', flow_cr: 640 },
                    ]).map((flow) => (
                      <div
                        key={flow.sector}
                        className="flex justify-between text-xs font-mono py-1 px-1.5 rounded bg-surface-elevated/40"
                      >
                        <span className="text-slate-300">{flow.sector}</span>
                        <span className="text-emerald-400 font-semibold">+₹{flow.flow_cr} Cr</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-3 pt-2 border-t border-surface-border/60 text-[10px] font-mono text-slate-500 text-right">
            Updated at Market Close • Clearing Corp Verified
          </div>
        </div>
      </div>

      {/* 4. Real-time Market News Feed */}
      <div className="bg-surface/90 border border-surface-border rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center">
            <Newspaper className="w-4 h-4 mr-2 text-brand-cyan" />
            Institutional Intelligence Wire & Catalyst Feed
          </h3>
          {/* Category Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto text-[11px] font-mono">
            {['ALL', 'BREAKING', 'MACRO', 'EARNINGS', 'COMMODITIES'].map((cat) => (
              <button
                key={cat}
                onClick={() => setNewsFilter(cat)}
                className={`px-2 py-0.5 rounded border transition-colors ${
                  newsFilter === cat
                    ? 'bg-brand-purple/20 text-brand-purple border-brand-purple/40 font-semibold'
                    : 'text-slate-400 border-surface-border hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredNews.slice(0, 6).map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-lg bg-surface-elevated/60 border border-surface-border/60 hover:border-brand-purple/40 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5 text-[10px] font-mono">
                  <span className="text-brand-purple font-semibold uppercase">{item.source}</span>
                  <span className={`px-1.5 py-0.5 rounded ${
                    item.sentiment === 'Bullish'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : item.sentiment === 'Bearish'
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                  }`}>
                    {item.sentiment}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-slate-100 line-clamp-2 mb-1.5">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 mb-2">
                  {item.summary}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-surface-border/40 text-[10px] font-mono text-slate-400">
                <span>{item.time}</span>
                <div className="flex items-center space-x-1">
                  {item.impact_symbols?.map((sym) => (
                    <button
                      key={sym}
                      onClick={() => onSelectStock(sym)}
                      className="px-1.5 py-0.5 rounded bg-surface border border-surface-border hover:border-brand-purple text-brand-purple font-bold"
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
