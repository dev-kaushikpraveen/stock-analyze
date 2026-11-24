'use client';

import React, { useState, useEffect } from 'react';
import { EquityStock, BacktestResult } from '@/types';
import { api } from '@/services/api';
import { formatCurrency, formatPct, getChangeColor, getChangeBg } from '@/lib/utils';
import {
  History,
  Play,
  RotateCcw,
  Sliders,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  Award,
  CheckCircle,
  XCircle,
  ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

interface BacktestingLabTabProps {
  stocks: EquityStock[];
}

export const BacktestingLabTab: React.FC<BacktestingLabTabProps> = ({ stocks }) => {
  const [strategyType, setStrategyType] = useState<string>('sma_cross');
  const [symbol, setSymbol] = useState<string>('RELIANCE');
  const [initialCapital, setInitialCapital] = useState<number>(100000);
  const [stopLossPct, setStopLossPct] = useState<number>(3.0);
  const [takeProfitPct, setTakeProfitPct] = useState<number>(8.0);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<BacktestResult | null>(null);

  const executeBacktest = async () => {
    setLoading(true);
    try {
      const res = await api.runBacktest({
        strategy_type: strategyType,
        symbol: symbol,
        initial_capital: initialCapital,
        stop_loss_pct: stopLossPct / 100,
        take_profit_pct: takeProfitPct / 100,
      });
      setResult(res);
    } catch (err) {
      console.error('Failed to run backtest:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeBacktest();
  }, []);

  return (
    <div className="space-y-5">
      {/* 1. Strategy Parameters & Controls */}
      <div className="bg-surface/90 border border-surface-border rounded-lg p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                Strategy Algorithm
              </label>
              <select
                value={strategyType}
                onChange={(e) => setStrategyType(e.target.value)}
                className="bg-surface-elevated text-white border border-surface-border rounded px-3 py-1.5 font-mono text-xs focus:outline-none focus:border-brand-purple"
              >
                <option value="sma_cross">Dual Moving Average Crossover (SMA 10/30)</option>
                <option value="rsi_reversion">RSI Mean Reversion (14-Day Oversold/Overbought)</option>
                <option value="supertrend_momentum">Supertrend Trend-Following Momentum</option>
                <option value="breakout_channel">Donchian 20-Day Range Breakout</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                Target Ticker
              </label>
              <select
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="bg-surface-elevated text-white border border-surface-border rounded px-3 py-1.5 font-mono text-xs focus:outline-none focus:border-brand-purple"
              >
                {stocks.map((s) => (
                  <option key={s.symbol} value={s.symbol}>
                    {s.symbol} ({s.market})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                Initial Capital (₹)
              </label>
              <input
                type="number"
                value={initialCapital}
                onChange={(e) => setInitialCapital(Number(e.target.value))}
                className="bg-surface-elevated text-white border border-surface-border rounded px-3 py-1.5 font-mono text-xs w-28 focus:outline-none focus:border-brand-purple"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                Stop Loss (%)
              </label>
              <input
                type="number"
                step="0.5"
                value={stopLossPct}
                onChange={(e) => setStopLossPct(Number(e.target.value))}
                className="bg-surface-elevated text-white border border-surface-border rounded px-3 py-1.5 font-mono text-xs w-20 focus:outline-none focus:border-brand-purple"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                Target Profit (%)
              </label>
              <input
                type="number"
                step="0.5"
                value={takeProfitPct}
                onChange={(e) => setTakeProfitPct(Number(e.target.value))}
                className="bg-surface-elevated text-white border border-surface-border rounded px-3 py-1.5 font-mono text-xs w-20 focus:outline-none focus:border-brand-purple"
              />
            </div>
          </div>

          <button
            onClick={executeBacktest}
            disabled={loading}
            className="flex items-center justify-center space-x-2 px-5 py-2 rounded-lg bg-gradient-to-r from-brand-purple to-brand-violet text-white font-mono text-xs font-bold hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20 disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{loading ? 'Simulating Engine...' : 'Run Backtest'}</span>
          </button>
        </div>
      </div>

      {/* 2. Institutional Performance Metrics */}
      {result && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-surface/90 border border-surface-border rounded-lg p-3">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Total Return</span>
            <span
              className={`text-lg font-mono font-bold block ${
                result.total_return_pct >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {formatPct(result.total_return_pct)}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              vs Bench: {formatPct(result.benchmark_return_pct)}
            </span>
          </div>

          <div className="bg-surface/90 border border-surface-border rounded-lg p-3">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Final Capital</span>
            <span className="text-lg font-mono font-bold text-white block">
              ₹{result.final_equity.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">
              Net P&L: ₹{result.net_profit.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
          </div>

          <div className="bg-surface/90 border border-surface-border rounded-lg p-3">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Sharpe Ratio</span>
            <span className="text-lg font-mono font-bold text-cyan-400 block">
              {result.sharpe_ratio.toFixed(2)}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Sortino: {result.sortino_ratio.toFixed(2)}
            </span>
          </div>

          <div className="bg-surface/90 border border-surface-border rounded-lg p-3">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Max Drawdown</span>
            <span className="text-lg font-mono font-bold text-rose-400 block">
              -{result.max_drawdown_pct.toFixed(2)}%
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Peak to Trough</span>
          </div>

          <div className="bg-surface/90 border border-surface-border rounded-lg p-3">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Win Rate</span>
            <span className="text-lg font-mono font-bold text-emerald-400 block">
              {result.win_rate_pct.toFixed(1)}%
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {result.winning_trades}W / {result.losing_trades}L
            </span>
          </div>

          <div className="bg-surface/90 border border-surface-border rounded-lg p-3">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Profit Factor</span>
            <span className="text-lg font-mono font-bold text-brand-purple block">
              {result.profit_factor.toFixed(2)}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Total Trades: {result.total_trades}
            </span>
          </div>
        </div>
      )}

      {/* 3. Equity Curve vs Benchmark Chart */}
      <div className="bg-surface/90 border border-surface-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-brand-purple" />
            Cumulative Equity Growth vs Buy & Hold Benchmark
          </h3>
          <div className="flex items-center space-x-3 text-xs font-mono">
            <span className="flex items-center text-purple-400">
              <span className="w-2.5 h-0.5 bg-purple-400 mr-1.5" /> Strategy Curve
            </span>
            <span className="flex items-center text-slate-400">
              <span className="w-2.5 h-0.5 bg-slate-500 mr-1.5" /> Buy & Hold Benchmark
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={result?.equity_curve || []}>
              <defs>
                <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
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
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0e121b',
                  borderColor: '#1e2638',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                }}
                formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'Portfolio']}
              />
              <Area type="monotone" dataKey="equity" stroke="#8b5cf6" strokeWidth={2} fill="url(#eqGrad)" />
              <Line type="monotone" dataKey="benchmark_equity" stroke="#64748b" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Sequential Trade Execution Log */}
      <div className="bg-surface/90 border border-surface-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-surface-border">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center">
            <History className="w-4 h-4 mr-2 text-brand-cyan" />
            Bar-by-Bar Trade Execution Log (Zero Look-Ahead Bias)
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Slippage: 0.05% • Brokerage: 0.03% Deducted
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono text-left select-none">
            <thead>
              <tr className="border-b border-surface-border text-[10px] text-slate-400 uppercase">
                <th className="py-2 px-3">Entry Date</th>
                <th className="py-2 px-3">Entry Price</th>
                <th className="py-2 px-3">Exit Date</th>
                <th className="py-2 px-3">Exit Price</th>
                <th className="py-2 px-3">Holding Period</th>
                <th className="py-2 px-3">Exit Reason</th>
                <th className="py-2 px-3 text-right">Net P&L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/40">
              {result?.trade_log?.map((t, i) => {
                const isWin = t.pnl_pct >= 0;
                return (
                  <tr key={i} className="hover:bg-surface-elevated/60 transition-colors">
                    <td className="py-2 px-3 text-slate-300">{t.entry_date}</td>
                    <td className="py-2 px-3 text-white font-semibold">₹{t.entry_price.toFixed(2)}</td>
                    <td className="py-2 px-3 text-slate-300">{t.exit_date}</td>
                    <td className="py-2 px-3 text-white font-semibold">₹{t.exit_price.toFixed(2)}</td>
                    <td className="py-2 px-3 text-slate-400">{t.holding_bars} Days</td>
                    <td className="py-2 px-3">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          t.exit_reason.includes('Take Profit')
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : t.exit_reason.includes('Stop Loss')
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        }`}
                      >
                        {t.exit_reason}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right font-bold">
                      <span className={isWin ? 'text-emerald-400' : 'text-rose-400'}>
                        {formatPct(t.pnl_pct)} (₹{t.pnl_amount.toFixed(0)})
                      </span>
                    </td>
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
