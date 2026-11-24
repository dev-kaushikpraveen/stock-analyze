'use client';

import React, { useState, useEffect } from 'react';
import { UserPortfolio, WhatIfSimulationResult, ExplainLossResult } from '@/types';
import { api } from '@/services/api';
import { formatCurrency, formatPct, getChangeColor, getChangeBg } from '@/lib/utils';
import {
  Briefcase,
  AlertTriangle,
  Shield,
  Zap,
  TrendingDown,
  TrendingUp,
  HelpCircle,
  X,
  ArrowRight,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface PortfolioStressTabProps {
  onSelectStock: (symbol: string) => void;
}

export const PortfolioStressTab: React.FC<PortfolioStressTabProps> = ({ onSelectStock }) => {
  const [portfolio, setPortfolio] = useState<UserPortfolio | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // What-If State
  const [selectedScenario, setSelectedScenario] = useState<string>('crude_oil_surge');
  const [whatIfResult, setWhatIfResult] = useState<WhatIfSimulationResult | null>(null);
  const [simulating, setSimulating] = useState<boolean>(false);

  // Explain Loss Modal
  const [lossModalOpen, setLossModalOpen] = useState<boolean>(false);
  const [lossResult, setLossResult] = useState<ExplainLossResult | null>(null);
  const [loadingLoss, setLoadingLoss] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    async function loadPortfolio() {
      setLoading(true);
      try {
        const portRes = await api.getPortfolio();
        if (isMounted) {
          setPortfolio(portRes);
          // Auto run default simulation
          const simRes = await api.runWhatIf('crude_oil_surge', portRes.holdings);
          setWhatIfResult(simRes);
        }
      } catch (err) {
        console.error('Failed to load portfolio:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadPortfolio();
    return () => {
      isMounted = false;
    };
  }, []);

  const runSimulation = async (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    setSimulating(true);
    try {
      const res = await api.runWhatIf(scenarioId, portfolio?.holdings);
      setWhatIfResult(res);
    } catch (err) {
      console.error('Simulation failed:', err);
    } finally {
      setSimulating(false);
    }
  };

  const handleExplainLoss = async (symbol: string, purchasePrice: number, currentPrice: number) => {
    setLossModalOpen(true);
    setLoadingLoss(true);
    try {
      const res = await api.explainLoss(symbol, purchasePrice, currentPrice);
      setLossResult(res);
    } catch (err) {
      console.error('Failed to explain loss:', err);
    } finally {
      setLoadingLoss(false);
    }
  };

  const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#6366f1'];

  return (
    <div className="space-y-5">
      {/* 1. Portfolio Header Stats Strip */}
      {portfolio && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="bg-surface/90 border border-surface-border rounded-lg p-3.5">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Total Portfolio Value</span>
            <span className="text-xl font-mono font-black text-white block">
              ₹{portfolio.current_portfolio_value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Invested: ₹{portfolio.total_investment.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
          </div>

          <div className="bg-surface/90 border border-surface-border rounded-lg p-3.5">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Total Unrealized P&L</span>
            <span
              className={`text-xl font-mono font-black block ${
                portfolio.unrealized_total_pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {portfolio.unrealized_total_pnl >= 0 ? '+' : ''}₹
              {portfolio.unrealized_total_pnl.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
            <span className={`text-[10px] font-mono font-bold ${getChangeColor(portfolio.unrealized_total_pnl_pct)}`}>
              {formatPct(portfolio.unrealized_total_pnl_pct)}
            </span>
          </div>

          <div className="bg-surface/90 border border-surface-border rounded-lg p-3.5">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Today's P&L</span>
            <span
              className={`text-xl font-mono font-black block ${
                portfolio.today_pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {portfolio.today_pnl >= 0 ? '+' : ''}₹{portfolio.today_pnl.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
            <span className={`text-[10px] font-mono font-bold ${getChangeColor(portfolio.today_pnl_pct)}`}>
              {formatPct(portfolio.today_pnl_pct)}
            </span>
          </div>

          <div className="bg-surface/90 border border-surface-border rounded-lg p-3.5">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Portfolio Beta</span>
            <span className="text-xl font-mono font-black text-cyan-400 block">
              {portfolio.beta.toFixed(2)}
            </span>
            <span className="text-[10px] font-mono text-slate-400">Systemic Market Sensitivity</span>
          </div>

          <div className="bg-surface/90 border border-surface-border rounded-lg p-3.5">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Active Holdings</span>
            <span className="text-xl font-mono font-black text-brand-purple block">
              {portfolio.holdings.length} Positions
            </span>
            <span className="text-[10px] font-mono text-slate-400">NSE Bluechips & Leaders</span>
          </div>
        </div>
      )}

      {/* 2. Macro What-If Scenario Stress Simulator */}
      <div className="bg-surface/90 border border-surface-border rounded-lg p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4 pb-3 border-b border-surface-border">
          <div>
            <h3 className="text-sm font-semibold text-slate-200 flex items-center">
              <Zap className="w-4 h-4 mr-2 text-brand-amber" />
              Macroeconomic Shock & Stress Testing Simulator
            </h3>
            <p className="text-[11px] font-mono text-slate-400">
              Monte-Carlo systemic contagion modeling across rates, crude oil, and currency shocks
            </p>
          </div>

          {/* Scenario Selector Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto text-xs font-mono">
            {[
              { id: 'crude_oil_surge', label: 'Crude Oil Spike ($110/bbl)' },
              { id: 'rbi_rate_hike', label: 'RBI Rate Hike (+50 bps)' },
              { id: 'us_tech_recession', label: 'US Tech Slowdown (-15%)' },
              { id: 'rupee_depreciation', label: 'Rupee Drop (₹88.5/USD)' },
            ].map((sc) => (
              <button
                key={sc.id}
                onClick={() => runSimulation(sc.id)}
                className={`px-3 py-1.5 rounded border transition-colors whitespace-nowrap ${
                  selectedScenario === sc.id
                    ? 'bg-brand-purple text-white border-brand-purple font-semibold shadow-md shadow-purple-500/20'
                    : 'text-slate-400 border-surface-border hover:text-white'
                }`}
              >
                {sc.label}
              </button>
            ))}
          </div>
        </div>

        {whatIfResult && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Impact Verdict */}
            <div className="bg-surface-elevated/70 p-4 rounded-lg border border-surface-border flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                  Simulated Scenario Outcome
                </span>
                <h4 className="text-base font-bold text-white mb-2">{whatIfResult.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {whatIfResult.description}
                </p>

                <div className="p-3 rounded-lg bg-surface border border-surface-border space-y-2 mb-3">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Projected Portfolio Impact:</span>
                    <span
                      className={`font-bold ${
                        whatIfResult.net_pnl_impact >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {whatIfResult.net_pnl_impact >= 0 ? '+' : ''}₹
                      {whatIfResult.net_pnl_impact.toLocaleString('en-IN', { maximumFractionDigits: 0 })} (
                      {formatPct(whatIfResult.net_pnl_pct)})
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Stress Value:</span>
                    <span className="text-white font-bold">
                      ₹{whatIfResult.projected_portfolio_value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-brand-purple/10 border border-brand-purple/20 text-xs">
                  <span className="text-[10px] font-mono uppercase font-bold text-brand-purple block mb-1">
                    Risk Verdict:
                  </span>
                  <p className="text-slate-200">{whatIfResult.risk_verdict}</p>
                </div>
              </div>

              {/* Hedging recommendations */}
              <div className="mt-4 pt-3 border-t border-surface-border text-xs text-slate-300 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                  Recommended Protective Hedges:
                </span>
                {whatIfResult.hedging_recommendations?.map((h, i) => (
                  <div key={i} className="flex items-center space-x-1.5 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Holdings Shock Impact Table */}
            <div className="lg:col-span-2 overflow-x-auto">
              <span className="text-xs font-mono uppercase font-bold text-slate-300 block mb-2">
                Position-Level Stress Attribution:
              </span>
              <table className="w-full text-xs font-mono text-left">
                <thead>
                  <tr className="border-b border-surface-border text-[10px] text-slate-400 uppercase">
                    <th className="py-2 px-3">Position</th>
                    <th className="py-2 px-3">Sector</th>
                    <th className="py-2 px-3">Current Price</th>
                    <th className="py-2 px-3">Shock Price</th>
                    <th className="py-2 px-3">Impact Value</th>
                    <th className="py-2 px-3 text-right">Stress %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border/40">
                  {whatIfResult.holdings_impact?.map((h) => {
                    const isDrop = h.change_pct < 0;
                    return (
                      <tr key={h.symbol} className="hover:bg-surface-elevated/60 transition-colors">
                        <td className="py-2 px-3 font-bold text-white">{h.symbol}</td>
                        <td className="py-2 px-3 text-slate-400">{h.sector}</td>
                        <td className="py-2 px-3 text-slate-300">₹{h.price_before.toFixed(2)}</td>
                        <td className="py-2 px-3 text-white font-semibold">₹{h.price_shocked.toFixed(2)}</td>
                        <td className={`py-2 px-3 font-semibold ${isDrop ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {h.value_change >= 0 ? '+' : ''}₹{h.value_change.toFixed(0)}
                        </td>
                        <td className={`py-2 px-3 text-right font-bold ${isDrop ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {formatPct(h.change_pct)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 3. Portfolio Holdings Table with "Explain Loss" Action */}
      <div className="bg-surface/90 border border-surface-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-surface-border">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center">
            <Briefcase className="w-4 h-4 mr-2 text-brand-purple" />
            Active Portfolio Positions & Post-Mortem Diagnostics
          </h3>
          <span className="text-xs font-mono text-slate-400">Click &quot;Explain Loss&quot; for Underperforming Stocks</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono text-left select-none">
            <thead>
              <tr className="border-b border-surface-border text-[10px] text-slate-400 uppercase">
                <th className="py-2 px-3">Ticker</th>
                <th className="py-2 px-3">Sector</th>
                <th className="py-2 px-3">Qty</th>
                <th className="py-2 px-3">Avg Cost</th>
                <th className="py-2 px-3">Current LTP</th>
                <th className="py-2 px-3">Current Value</th>
                <th className="py-2 px-3">Unrealized P&L</th>
                <th className="py-2 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/40">
              {portfolio?.holdings?.map((h) => {
                const isLoss = h.unrealized_pnl < 0;
                return (
                  <tr key={h.symbol} className="hover:bg-surface-elevated/60 transition-colors">
                    <td className="py-2.5 px-3">
                      <button
                        onClick={() => onSelectStock(h.symbol)}
                        className="font-bold text-white hover:text-brand-purple transition-colors"
                      >
                        {h.symbol}
                      </button>
                      <span className="text-[10px] text-slate-400 block">{h.company_name}</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">{h.sector}</td>
                    <td className="py-2.5 px-3 text-slate-300">{h.quantity}</td>
                    <td className="py-2.5 px-3 text-slate-300">₹{h.purchase_price.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-white font-semibold">₹{h.current_price.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-white font-semibold">
                      ₹{h.current_value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="py-2.5 px-3 font-bold">
                      <span className={isLoss ? 'text-rose-400' : 'text-emerald-400'}>
                        {h.unrealized_pnl >= 0 ? '+' : ''}₹
                        {h.unrealized_pnl.toLocaleString('en-IN', { maximumFractionDigits: 0 })} (
                        {formatPct(h.pnl_pct)})
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {isLoss ? (
                        <button
                          onClick={() => handleExplainLoss(h.symbol, h.purchase_price, h.current_price)}
                          className="px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 text-[11px] font-semibold transition-colors flex items-center space-x-1 ml-auto"
                        >
                          <HelpCircle className="w-3 h-3" />
                          <span>Explain Loss</span>
                        </button>
                      ) : (
                        <span className="text-slate-500 text-[10px] font-mono">In Profit</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Explain My Loss Modal */}
      {lossModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e121b] border border-surface-border rounded-xl max-w-lg w-full p-5 shadow-2xl relative">
            <button
              onClick={() => setLossModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Explain My Loss Attribution: {lossResult?.symbol || 'Analyzing...'}
                </h3>
                <p className="text-[10px] font-mono text-slate-400">
                  Factor Decomposition & Recovery Analytics
                </p>
              </div>
            </div>

            {loadingLoss ? (
              <div className="py-12 text-center text-xs font-mono text-slate-400">
                Running forensic attribution on drawdown...
              </div>
            ) : (
              lossResult && (
                <div className="space-y-4 text-xs font-mono">
                  <div className="p-3 bg-surface rounded-lg border border-surface-border flex justify-between items-center">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Entry Price vs Current</span>
                      <span className="text-white font-bold">
                        ₹{lossResult.purchase_price} → ₹{lossResult.current_price}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 text-[10px] block">Drawdown</span>
                      <span className="text-rose-400 font-bold text-sm">
                        -{lossResult.total_drawdown_pct.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  {/* Factor Breakdown */}
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block mb-1.5 font-bold">
                      Root Cause Attribution Breakdown:
                    </span>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center p-1.5 rounded bg-surface-elevated">
                        <span className="text-slate-300">Macro Market Beta:</span>
                        <span className="text-white font-semibold">
                          {lossResult.attribution_breakdown?.macro_market_factor_pct || 22}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-1.5 rounded bg-surface-elevated">
                        <span className="text-slate-300">Sectoral Headwind:</span>
                        <span className="text-white font-semibold">
                          {lossResult.attribution_breakdown?.sectoral_headwind_factor_pct || 48}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-1.5 rounded bg-surface-elevated">
                        <span className="text-slate-300">Company Fundamentals:</span>
                        <span className="text-white font-semibold">
                          {lossResult.attribution_breakdown?.company_fundamentals_factor_pct || 15}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-1.5 rounded bg-surface-elevated">
                        <span className="text-slate-300">Valuation Multiple Compression:</span>
                        <span className="text-white font-semibold">
                          {lossResult.attribution_breakdown?.sentiment_valuation_compression_pct || 15}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Verdict */}
                  <div className="p-3 bg-brand-purple/10 border border-brand-purple/20 rounded-lg">
                    <span className="text-[10px] uppercase font-bold text-brand-purple block mb-1">
                      Algorithmic Verdict:
                    </span>
                    <p className="text-slate-200 font-sans leading-relaxed text-xs">
                      {lossResult.verdict}
                    </p>
                  </div>

                  {/* Actionable recommendations */}
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block mb-1 font-bold">
                      Institutional Playbook:
                    </span>
                    <div className="space-y-1 font-sans text-slate-300 text-xs">
                      {lossResult.actionable_guidance?.map((g, i) => (
                        <div key={i} className="flex items-start space-x-1.5">
                          <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{g}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Historical Recovery Probability */}
                  <div className="pt-2 border-t border-surface-border text-center text-[11px] text-slate-400">
                    Probability of recovering to cost basis within 12 months:{' '}
                    <strong className="text-emerald-400">
                      {lossResult.historical_drawdowns_recovery_stats?.probability_of_new_high_12m
                        ? `${(lossResult.historical_drawdowns_recovery_stats.probability_of_new_high_12m * 100).toFixed(0)}%`
                        : '82%'}
                    </strong>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};
