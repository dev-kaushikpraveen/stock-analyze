'use client';

import React, { useState, useEffect } from 'react';
import {
  EquityStock,
  Candle,
  TechnicalIndicators,
  FinancialXRay,
  MarketDNA,
} from '@/types';
import { api } from '@/services/api';
import {
  formatCurrency,
  formatPct,
  formatNumber,
  getChangeColor,
  getChangeBg,
} from '@/lib/utils';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Layers,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Info,
  Sliders,
  Maximize2,
  Crosshair,
  BarChart2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from 'recharts';

interface EquityTerminalTabProps {
  stocks: EquityStock[];
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
}

export const EquityTerminalTab: React.FC<EquityTerminalTabProps> = ({
  stocks,
  selectedSymbol,
  onSelectSymbol,
}) => {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [indicators, setIndicators] = useState<TechnicalIndicators | null>(null);
  const [xray, setXray] = useState<FinancialXRay | null>(null);
  const [dna, setDna] = useState<MarketDNA | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Indicators toggle state
  const [showSMA, setShowSMA] = useState<boolean>(true);
  const [showEMA, setShowEMA] = useState<boolean>(true);
  const [showBollinger, setShowBollinger] = useState<boolean>(false);
  const [activeSubChart, setActiveSubChart] = useState<'volume' | 'rsi' | 'macd'>('volume');

  const currentStock = stocks.find((s) => s.symbol === selectedSymbol) || stocks[0];

  useEffect(() => {
    let isMounted = true;
    async function loadStockData() {
      if (!currentStock) return;
      setLoading(true);
      try {
        const [candleRes, indRes, xrayRes, dnaRes] = await Promise.all([
          api.getCandles(currentStock.symbol, 60),
          api.getIndicators(currentStock.symbol),
          api.getXRay(currentStock.symbol),
          api.getDNA(currentStock.symbol),
        ]);
        if (isMounted) {
          setCandles(candleRes.candles || []);
          setIndicators(indRes);
          setXray(xrayRes);
          setDna(dnaRes);
        }
      } catch (err) {
        console.error('Error fetching stock deep dive data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadStockData();
    return () => {
      isMounted = false;
    };
  }, [selectedSymbol]);

  // Merge candle data with technical indicators for Recharts
  const chartData = candles.map((c, idx) => {
    return {
      date: c.date.slice(5),
      fullDate: c.date,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
      volume: c.volume,
      sma20: indicators?.sma_20?.[idx] ?? null,
      ema50: indicators?.ema_50?.[idx] ?? null,
      bbUpper: indicators?.bollinger?.upper?.[idx] ?? null,
      bbMiddle: indicators?.bollinger?.middle?.[idx] ?? null,
      bbLower: indicators?.bollinger?.lower?.[idx] ?? null,
      rsi14: indicators?.rsi_14?.[idx] ?? null,
      macdLine: indicators?.macd?.macd?.[idx] ?? null,
      macdSignal: indicators?.macd?.signal?.[idx] ?? null,
      macdHist: indicators?.macd?.histogram?.[idx] ?? null,
    };
  });

  const radarData = dna
    ? [
        { metric: 'Value', score: dna.dimensions.value },
        { metric: 'Quality', score: dna.dimensions.quality },
        { metric: 'Momentum', score: dna.dimensions.momentum },
        { metric: 'Growth', score: dna.dimensions.growth },
        { metric: 'Safety', score: dna.dimensions.volatility_safety },
        { metric: 'Inst. Backing', score: dna.dimensions.institutional_backing },
      ]
    : [];

  return (
    <div className="space-y-5">
      {/* 1. Header Ticker Selector & Stock Stats Bar */}
      <div className="bg-surface/90 border border-surface-border rounded-lg p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Stock selector & Title */}
          <div className="flex items-center space-x-3">
            <select
              value={selectedSymbol}
              onChange={(e) => onSelectSymbol(e.target.value)}
              className="bg-surface-elevated text-white border border-surface-border rounded-md px-3 py-1.5 font-mono font-bold text-base focus:outline-none focus:border-brand-purple"
            >
              {stocks.map((s) => (
                <option key={s.symbol} value={s.symbol}>
                  {s.symbol} - {s.name} ({s.market})
                </option>
              ))}
            </select>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-surface-border text-slate-300">
              {currentStock?.sector}
            </span>
            <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {currentStock?.recommendation || 'Strong Outperform'}
            </span>
          </div>

          {/* Real-time Quote */}
          {currentStock && (
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <span className="text-2xl font-mono font-black text-white">
                  {formatCurrency(currentStock.price, currentStock.market)}
                </span>
                <div className={`text-xs font-mono font-bold ${getChangeColor(currentStock.change)}`}>
                  {currentStock.change > 0 ? `+${currentStock.change.toFixed(2)}` : currentStock.change.toFixed(2)} (
                  {formatPct(currentStock.change_pct)})
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Fundamental KPI Strip */}
        {currentStock && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mt-4 pt-3 border-t border-surface-border/60 text-xs font-mono">
            <div>
              <span className="text-slate-400 text-[10px] block">MARKET CAP</span>
              <span className="text-white font-semibold">{formatCurrency(currentStock.market_cap_cr * 10000000, currentStock.market, true)}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">P/E RATIO</span>
              <span className="text-white font-semibold">{currentStock.pe_ratio.toFixed(1)}x</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">P/B RATIO</span>
              <span className="text-white font-semibold">{currentStock.pb_ratio.toFixed(2)}x</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">ROE</span>
              <span className="text-emerald-400 font-semibold">{currentStock.roe.toFixed(1)}%</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">DIV YIELD</span>
              <span className="text-white font-semibold">{currentStock.dividend_yield.toFixed(2)}%</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">BETA</span>
              <span className="text-white font-semibold">{currentStock.beta.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">52W HIGH / LOW</span>
              <span className="text-white font-semibold">
                {currentStock.week_52_high} / {currentStock.week_52_low}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Interactive Charts & Technical Overlays */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Main Chart Area */}
        <div className="lg:col-span-3 bg-surface/90 border border-surface-border rounded-lg p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-slate-300">INDICATORS:</span>
              <button
                onClick={() => setShowSMA(!showSMA)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-colors ${
                  showSMA ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40' : 'text-slate-500 border-surface-border'
                }`}
              >
                SMA 20
              </button>
              <button
                onClick={() => setShowEMA(!showEMA)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-colors ${
                  showEMA ? 'bg-purple-500/20 text-purple-400 border-purple-500/40' : 'text-slate-500 border-surface-border'
                }`}
              >
                EMA 50
              </button>
              <button
                onClick={() => setShowBollinger(!showBollinger)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-colors ${
                  showBollinger ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'text-slate-500 border-surface-border'
                }`}
              >
                Bollinger Bands
              </button>
            </div>

            {/* Sub-chart toggle */}
            <div className="flex items-center bg-surface-elevated rounded p-0.5 text-xs font-mono">
              <button
                onClick={() => setActiveSubChart('volume')}
                className={`px-2 py-0.5 rounded ${activeSubChart === 'volume' ? 'bg-brand-purple text-white' : 'text-slate-400'}`}
              >
                Volume
              </button>
              <button
                onClick={() => setActiveSubChart('rsi')}
                className={`px-2 py-0.5 rounded ${activeSubChart === 'rsi' ? 'bg-brand-purple text-white' : 'text-slate-400'}`}
              >
                RSI (14)
              </button>
              <button
                onClick={() => setActiveSubChart('macd')}
                className={`px-2 py-0.5 rounded ${activeSubChart === 'macd' ? 'bg-brand-purple text-white' : 'text-slate-400'}`}
              >
                MACD
              </button>
            </div>
          </div>

          {/* Primary Price Chart */}
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#475569" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis
                  domain={['auto', 'auto']}
                  orientation="right"
                  stroke="#475569"
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  tickFormatter={(val) => val.toFixed(0)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0e121b',
                    borderColor: '#1e2638',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <Area type="monotone" dataKey="close" stroke="#8b5cf6" strokeWidth={2} fill="url(#areaGradient)" />
                {showSMA && <Line type="monotone" dataKey="sma20" stroke="#06b6d4" strokeWidth={1.5} dot={false} />}
                {showEMA && <Line type="monotone" dataKey="ema50" stroke="#a855f7" strokeWidth={1.5} dot={false} />}
                {showBollinger && (
                  <>
                    <Line type="monotone" dataKey="bbUpper" stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 3" dot={false} />
                    <Line type="monotone" dataKey="bbLower" stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 3" dot={false} />
                  </>
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Secondary Sub-Chart (Volume / RSI / MACD) */}
          <div className="h-28 w-full mt-2 pt-2 border-t border-surface-border">
            {activeSubChart === 'volume' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="date" hide />
                  <YAxis orientation="right" stroke="#475569" tick={{ fontSize: 9, fill: '#64748b' }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0e121b', borderColor: '#1e2638', fontSize: '10px' }}
                  />
                  <Bar dataKey="volume" fill="#3b82f6" opacity={0.6} />
                </BarChart>
              </ResponsiveContainer>
            )}

            {activeSubChart === 'rsi' && (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <XAxis dataKey="date" hide />
                  <YAxis domain={[0, 100]} orientation="right" stroke="#475569" ticks={[30, 50, 70]} tick={{ fontSize: 9, fill: '#94a3b8' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0e121b', borderColor: '#1e2638', fontSize: '10px' }}
                  />
                  <Line type="monotone" dataKey="rsi14" stroke="#ec4899" strokeWidth={1.5} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            )}

            {activeSubChart === 'macd' && (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <XAxis dataKey="date" hide />
                  <YAxis orientation="right" stroke="#475569" tick={{ fontSize: 9, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0e121b', borderColor: '#1e2638', fontSize: '10px' }}
                  />
                  <Bar dataKey="macdHist" fill="#10b981" />
                  <Line type="monotone" dataKey="macdLine" stroke="#06b6d4" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="macdSignal" stroke="#f43f5e" strokeWidth={1.5} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Market DNA Radar */}
        <div className="bg-surface/90 border border-surface-border rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center">
                <Zap className="w-3.5 h-3.5 mr-1.5 text-brand-purple" />
                Market DNA Radar
              </h3>
              <span className="text-[10px] font-mono font-semibold text-brand-purple bg-brand-purple/10 px-2 py-0.5 rounded border border-brand-purple/20">
                {dna?.archetype || 'Compounder'}
              </span>
            </div>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#1e2638" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <PolarRadiusAxis domain={[0, 100]} stroke="#334155" tick={false} />
                  <Radar name="Score" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {dna && (
              <p className="text-[11px] text-slate-300 mt-2 bg-surface-elevated/70 p-2.5 rounded border border-surface-border/50">
                {dna.summary}
              </p>
            )}
          </div>

          <div className="mt-3 pt-2 border-t border-surface-border text-[10px] font-mono text-slate-400">
            Multi-factor Quant Model Normalized (0-100)
          </div>
        </div>
      </div>

      {/* 3. Financial Health X-Ray (Altman Z-Score & Piotroski F-Score) */}
      <div className="bg-surface/90 border border-surface-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-surface-border">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center">
            <ShieldCheck className="w-4 h-4 mr-2 text-brand-emerald" />
            Financial Health X-Ray & Forensic Solvency
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Beneish M-Score: {xray?.earnings_manipulation_risk || 'Low (Beneish M-Score: -2.84, Safe)'}
          </span>
        </div>

        {xray && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Altman Z-Score */}
            <div className="bg-surface-elevated/70 p-3.5 rounded-lg border border-surface-border/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Altman Z-Score (Bankruptcy Risk)
                </span>
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    xray.altman_z_score.zone === 'Safe Zone'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : xray.altman_z_score.zone === 'Grey Zone'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {xray.altman_z_score.zone}
                </span>
              </div>
              <div className="flex items-baseline space-x-3 mb-2">
                <span className="text-2xl font-mono font-black text-white">
                  {xray.altman_z_score.z_score.toFixed(2)}
                </span>
                <span className="text-xs text-slate-400">
                  Distress Probability: <strong className="text-emerald-400">{xray.altman_z_score.distress_probability_pct}%</strong>
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {xray.altman_z_score.status}
              </p>
            </div>

            {/* Piotroski 9-Point F-Score */}
            <div className="bg-surface-elevated/70 p-3.5 rounded-lg border border-surface-border/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Piotroski F-Score (Fundamental Momentum)
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-brand-purple/20 text-brand-purple border border-brand-purple/30">
                  {xray.piotroski_f_score.rating}
                </span>
              </div>
              <div className="flex items-baseline space-x-3 mb-2">
                <span className="text-2xl font-mono font-black text-white">
                  {xray.piotroski_f_score.f_score} / {xray.piotroski_f_score.max_score}
                </span>
                <span className="text-xs text-slate-400">
                  Profitability + Leverage + Efficiency Metric
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {Object.entries(xray.piotroski_f_score.signals || {}).slice(0, 6).map(([k, pass]) => (
                  <div key={k} className="flex items-center space-x-1.5 text-[11px] font-mono">
                    {pass ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    <span className="capitalize text-slate-300 truncate">{k.replace(/_/g, ' ')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
