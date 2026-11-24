'use client';

import React, { useState, useEffect } from 'react';
import { OptionsChainData, StrategyPayoffResult, StrategyPayoffLeg } from '@/types';
import { api } from '@/services/api';
import { formatCurrency, formatPct, getChangeColor } from '@/lib/utils';
import {
  Layers,
  Zap,
  Target,
  ArrowRight,
  Plus,
  Trash2,
  Sliders,
  Sparkles,
  BarChart2,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from 'recharts';

export const OptionsLabTab: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('NIFTY 50');
  const [chainData, setChainData] = useState<OptionsChainData | null>(null);
  const [loadingChain, setLoadingChain] = useState<boolean>(true);

  // Strategy payoff state
  const [activeStrategyPreset, setActiveStrategyPreset] = useState<string>('Bull Call Spread');
  const [payoffResult, setPayoffResult] = useState<StrategyPayoffResult | null>(null);
  const [legs, setLegs] = useState<StrategyPayoffLeg[]>([
    { type: 'call', strike: 24700, premium: 180.0, action: 'buy', qty: 1 },
    { type: 'call', strike: 24900, premium: 75.0, action: 'sell', qty: 1 },
  ]);

  // Load Chain
  useEffect(() => {
    let isMounted = true;
    async function loadChain() {
      setLoadingChain(true);
      try {
        const res = await api.getOptionsChain(selectedSymbol);
        if (isMounted) setChainData(res);
      } catch (err) {
        console.error('Failed to load options chain:', err);
      } finally {
        if (isMounted) setLoadingChain(false);
      }
    }
    loadChain();
    return () => {
      isMounted = false;
    };
  }, [selectedSymbol]);

  // Load Payoff
  const recalculatePayoff = async (stratName: string, customLegs: StrategyPayoffLeg[]) => {
    try {
      const spot = chainData?.spot_price || 24750;
      const res = await api.calculatePayoff(stratName, spot, customLegs);
      setPayoffResult(res);
    } catch (err) {
      console.error('Failed to calculate payoff:', err);
    }
  };

  useEffect(() => {
    if (chainData) {
      recalculatePayoff(activeStrategyPreset, legs);
    }
  }, [chainData, activeStrategyPreset, legs]);

  // Preset switch
  const applyPreset = (preset: string) => {
    setActiveStrategyPreset(preset);
    const spot = chainData?.spot_price || 24750;
    const base = Math.round(spot / 50) * 50;

    let newLegs: StrategyPayoffLeg[] = [];
    if (preset === 'Bull Call Spread') {
      newLegs = [
        { type: 'call', strike: base - 50, premium: 160.0, action: 'buy', qty: 1 },
        { type: 'call', strike: base + 150, premium: 55.0, action: 'sell', qty: 1 },
      ];
    } else if (preset === 'Bear Put Spread') {
      newLegs = [
        { type: 'put', strike: base + 50, premium: 175.0, action: 'buy', qty: 1 },
        { type: 'put', strike: base - 150, premium: 60.0, action: 'sell', qty: 1 },
      ];
    } else if (preset === 'Long Straddle') {
      newLegs = [
        { type: 'call', strike: base, premium: 135.0, action: 'buy', qty: 1 },
        { type: 'put', strike: base, premium: 130.0, action: 'buy', qty: 1 },
      ];
    } else if (preset === 'Iron Condor') {
      newLegs = [
        { type: 'put', strike: base - 200, premium: 35.0, action: 'buy', qty: 1 },
        { type: 'put', strike: base - 100, premium: 80.0, action: 'sell', qty: 1 },
        { type: 'call', strike: base + 100, premium: 85.0, action: 'sell', qty: 1 },
        { type: 'call', strike: base + 200, premium: 38.0, action: 'buy', qty: 1 },
      ];
    }
    setLegs(newLegs);
  };

  return (
    <div className="space-y-5">
      {/* 1. Header & Max Pain / PCR Summary Strip */}
      <div className="bg-surface/90 border border-surface-border rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <select
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
              className="bg-surface-elevated text-white border border-surface-border rounded-md px-3 py-1.5 font-mono font-bold text-sm focus:outline-none focus:border-brand-purple"
            >
              <option value="NIFTY 50">NIFTY 50 (Weekly Expiry)</option>
              <option value="NIFTY BANK">NIFTY BANK (Weekly Expiry)</option>
              <option value="RELIANCE">RELIANCE (Monthly Expiry)</option>
            </select>
            <span className="text-xs font-mono text-slate-400">
              Underlying Spot: <strong className="text-white">{chainData?.spot_price?.toFixed(2) || '24,752.15'}</strong>
            </span>
          </div>

          {chainData?.max_pain && (
            <div className="flex items-center space-x-4 text-xs font-mono">
              <div className="bg-surface-elevated px-3 py-1.5 rounded border border-surface-border flex items-center space-x-2">
                <Target className="w-3.5 h-3.5 text-brand-purple" />
                <span className="text-slate-400">Max Pain Strike:</span>
                <span className="font-bold text-white">{chainData.max_pain.max_pain_strike}</span>
              </div>
              <div className="bg-surface-elevated px-3 py-1.5 rounded border border-surface-border flex items-center space-x-2">
                <span className="text-slate-400">PCR:</span>
                <span className="font-bold text-emerald-400">{chainData.max_pain.pcr_ratio.toFixed(2)}</span>
                <span className="text-[10px] text-slate-400">({chainData.max_pain.sentiment})</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Interactive Strategy Payoff Simulator */}
      <div className="bg-surface/90 border border-surface-border rounded-lg p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4 pb-3 border-b border-surface-border">
          <div>
            <h3 className="text-sm font-semibold text-slate-200 flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-brand-cyan" />
              Multi-Leg Options Strategy Payoff Simulator
            </h3>
            <p className="text-[11px] font-mono text-slate-400">
              Interactive terminal P&L at expiry with Black-Scholes Greek attribution
            </p>
          </div>

          {/* Strategy Presets */}
          <div className="flex items-center space-x-1.5 overflow-x-auto text-xs font-mono">
            {['Bull Call Spread', 'Bear Put Spread', 'Long Straddle', 'Iron Condor'].map((p) => (
              <button
                key={p}
                onClick={() => applyPreset(p)}
                className={`px-2.5 py-1 rounded border transition-colors ${
                  activeStrategyPreset === p
                    ? 'bg-brand-purple text-white border-brand-purple font-semibold'
                    : 'text-slate-400 border-surface-border hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Payoff Curve Chart */}
          <div className="lg:col-span-2">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={payoffResult?.payoff_curve || []}>
                  <defs>
                    <linearGradient id="payoffGreen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="price" stroke="#475569" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <YAxis
                    orientation="right"
                    stroke="#475569"
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    tickFormatter={(v) => `₹${v}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0e121b',
                      borderColor: '#1e2638',
                      fontSize: '11px',
                      fontFamily: 'monospace',
                    }}
                    formatter={(val: any) => [`₹${Number(val).toFixed(2)}`, 'P&L']}
                  />
                  <ReferenceLine y={0} stroke="#64748b" strokeDasharray="3 3" />
                  {chainData && <ReferenceLine x={chainData.spot_price} stroke="#a855f7" strokeDasharray="2 2" label="Current Spot" />}
                  <Area type="monotone" dataKey="pnl" stroke="#10b981" strokeWidth={2} fill="url(#payoffGreen)" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Strategy KPIs & Legs details */}
          <div className="space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-surface-elevated p-2.5 rounded border border-surface-border">
                  <span className="text-[10px] text-slate-400 uppercase block">Max Profit</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    {payoffResult?.max_profit ? `₹${payoffResult.max_profit}` : 'Unlimited'}
                  </span>
                </div>
                <div className="bg-surface-elevated p-2.5 rounded border border-surface-border">
                  <span className="text-[10px] text-slate-400 uppercase block">Max Loss</span>
                  <span className="font-bold text-rose-400 text-sm">
                    {payoffResult?.max_loss ? `₹${payoffResult.max_loss}` : 'Unlimited'}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded bg-surface-elevated/60 border border-surface-border text-xs font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Net Premium Cost:</span>
                  <span className="text-white font-semibold">
                    ₹{payoffResult?.net_premium_debit_credit?.toFixed(2) || '0.00'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Risk-to-Reward:</span>
                  <span className="text-cyan-400 font-semibold">{payoffResult?.risk_reward_ratio || '1:1.8'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Breakeven Points:</span>
                  <span className="text-brand-purple font-semibold">
                    {payoffResult?.breakeven_points?.join(', ') || '24,805'}
                  </span>
                </div>
              </div>

              {/* Legs Table */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Active Legs:</span>
                {legs.map((leg, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 rounded bg-surface-elevated text-xs font-mono"
                  >
                    <span className={`font-bold uppercase ${leg.action === 'buy' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {leg.action}
                    </span>
                    <span className="text-white font-bold">{leg.strike} {leg.type.toUpperCase()}</span>
                    <span className="text-slate-400">Prem: ₹{leg.premium}</span>
                    <span className="text-slate-300">Qty: {leg.qty}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Real-Time Options Chain Grid with Greeks */}
      <div className="bg-surface/90 border border-surface-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-surface-border">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center">
            <Layers className="w-4 h-4 mr-2 text-brand-purple" />
            Live Options Chain & Full Greeks Table
          </h3>
          <span className="text-xs font-mono text-slate-400">Delta • Gamma • Theta • Vega (Black-Scholes Engine)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono text-left select-none">
            <thead>
              <tr className="border-b border-surface-border text-[10px] text-slate-400 uppercase bg-surface-elevated">
                <th colSpan={5} className="py-2 text-center text-cyan-400 border-r border-surface-border">
                  CALL OPTIONS
                </th>
                <th className="py-2 text-center text-white font-bold px-3">STRIKE</th>
                <th colSpan={5} className="py-2 text-center text-rose-400 border-l border-surface-border">
                  PUT OPTIONS
                </th>
              </tr>
              <tr className="border-b border-surface-border/60 text-[10px] text-slate-400 uppercase">
                <th className="py-1 px-2">Delta</th>
                <th className="py-1 px-2">Theta</th>
                <th className="py-1 px-2">IV%</th>
                <th className="py-1 px-2">OI</th>
                <th className="py-1 px-2 text-right border-r border-surface-border">LTP (₹)</th>

                <th className="py-1 px-3 text-center text-brand-purple font-bold">STRIKE</th>

                <th className="py-1 px-2 border-l border-surface-border">LTP (₹)</th>
                <th className="py-1 px-2">OI</th>
                <th className="py-1 px-2">IV%</th>
                <th className="py-1 px-2">Theta</th>
                <th className="py-1 px-2 text-right">Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/40">
              {chainData?.chain?.map((row) => {
                const isATM = Math.abs((chainData.spot_price || 24750) - row.strike) < 30;
                return (
                  <tr
                    key={row.strike}
                    className={`hover:bg-surface-elevated/70 transition-colors ${
                      isATM ? 'bg-brand-purple/10 border-y border-brand-purple/40 font-semibold' : ''
                    }`}
                  >
                    {/* Call Greeks & LTP */}
                    <td className="py-1.5 px-2 text-slate-400">{row.call.delta.toFixed(2)}</td>
                    <td className="py-1.5 px-2 text-slate-400">{row.call.theta.toFixed(1)}</td>
                    <td className="py-1.5 px-2 text-cyan-400">{row.call.iv.toFixed(1)}%</td>
                    <td className="py-1.5 px-2 text-slate-300">{(row.call.oi / 1000).toFixed(0)}k</td>
                    <td className="py-1.5 px-2 text-right font-bold text-white border-r border-surface-border">
                      {row.call.ltp.toFixed(1)}
                    </td>

                    {/* Strike */}
                    <td className={`py-1.5 px-3 text-center font-bold ${isATM ? 'text-brand-purple font-black' : 'text-slate-100'}`}>
                      {row.strike} {isATM ? '•' : ''}
                    </td>

                    {/* Put Greeks & LTP */}
                    <td className="py-1.5 px-2 font-bold text-white border-l border-surface-border">
                      {row.put.ltp.toFixed(1)}
                    </td>
                    <td className="py-1.5 px-2 text-slate-300">{(row.put.oi / 1000).toFixed(0)}k</td>
                    <td className="py-1.5 px-2 text-rose-400">{row.put.iv.toFixed(1)}%</td>
                    <td className="py-1.5 px-2 text-slate-400">{row.put.theta.toFixed(1)}</td>
                    <td className="py-1.5 px-2 text-right text-slate-400">{row.put.delta.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
