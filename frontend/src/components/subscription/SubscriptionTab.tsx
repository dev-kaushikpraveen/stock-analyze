'use client';

import React, { useState } from 'react';
import {
  Shield,
  Zap,
  Sparkles,
  Check,
  X,
  CreditCard,
  Lock,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

export const SubscriptionTab: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'ANNUAL'>('ANNUAL');
  const [currentTier, setCurrentTier] = useState<'FREE' | 'PRO' | 'ELITE'>('PRO');

  const tiers = [
    {
      id: 'FREE',
      name: 'Free Starter',
      priceMonthly: '₹0',
      priceAnnual: '₹0',
      badge: 'Basic Access',
      features: [
        'Real-time Market Overview & Indices',
        'Top Gainers & Losers',
        'Daily Financial News Wire',
        'Basic Candlestick Charts (SMA 20)',
        'Up to 3 Watchlist items',
        '10 AI Copilot Queries / day',
      ],
      notIncluded: [
        'Forensic Financial X-Ray (Altman Z, Beneish M)',
        '15-Day ARIMA & LSTM Price Trajectories',
        'Options Greeks & Multi-Leg Payoffs',
        'Algorithmic Backtesting Lab',
        'Macro What-If Stress Testing',
      ],
      btnText: 'Current Plan',
    },
    {
      id: 'PRO',
      name: 'Quant Pro',
      priceMonthly: '₹2,499/mo',
      priceAnnual: '₹1,999/mo',
      badge: 'Most Popular',
      popular: true,
      features: [
        'Everything in Free, plus:',
        'Institutional Forensic X-Ray (Altman, Piotroski, Beneish)',
        '15-Day ARIMA/Holt-Winters Price Trajectory with 95% CI',
        'Market Regime Classification (Trend & Volatility Gauges)',
        'Live Options Chain with Black-Scholes Greeks',
        'Multi-Leg Strategy Payoff Simulator',
        'Unlimited Bilingual AI Copilot Queries',
        'Natural Language Screener Translation',
      ],
      notIncluded: [
        'Multi-Factor Algorithmic Backtesting Engine',
        'Macroeconomic Systemic Shock Simulator',
      ],
      btnText: 'Active Plan',
    },
    {
      id: 'ELITE',
      name: 'Institutional Elite',
      priceMonthly: '₹6,999/mo',
      priceAnnual: '₹5,499/mo',
      badge: 'Full Arsenal',
      features: [
        'Everything in Pro, plus:',
        'Algorithmic Strategy Backtesting with Slippage & Brokerage',
        'What-If Macroeconomic Stress Testing (Crude $110, RBI Hike)',
        'Explain My Loss Factor Attribution',
        'Smart Money Institutional Flow Tracking',
        'Market DNA Radar & Archetype Classification',
        'Dedicated High-Frequency WebSockets & Priority Compute',
        '1-on-1 Quant Architect Onboarding',
      ],
      notIncluded: [],
      btnText: 'Upgrade to Elite',
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2 py-4">
        <span className="text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full bg-brand-purple/20 text-brand-purple border border-brand-purple/30 font-semibold">
          Transparent Tiered Monetization
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Unlock Institutional Financial Superpowers
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Choose the quantitative intelligence tier that fits your investment philosophy and institutional execution needs.
        </p>

        {/* Billing Switch */}
        <div className="flex items-center justify-center space-x-2 pt-3">
          <span className={`text-xs font-mono ${billingCycle === 'MONTHLY' ? 'text-white font-bold' : 'text-slate-400'}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle((prev) => (prev === 'MONTHLY' ? 'ANNUAL' : 'MONTHLY'))}
            className="w-12 h-6 rounded-full bg-[#1e2638] p-1 flex items-center transition-colors border border-white/10"
          >
            <div
              className={`w-4 h-4 rounded-full bg-brand-purple transition-transform duration-200 ${
                billingCycle === 'ANNUAL' ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-xs font-mono flex items-center ${billingCycle === 'ANNUAL' ? 'text-white font-bold' : 'text-slate-400'}`}>
            Annual <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-semibold">Save 20%</span>
          </span>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((tier) => {
          const isCurrent = currentTier === tier.id;
          return (
            <div
              key={tier.id}
              className={`rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 relative ${
                tier.popular
                  ? 'bg-gradient-to-b from-[#181635] via-[#0d101c] to-[#080a12] border-2 border-brand-purple shadow-2xl shadow-purple-900/40'
                  : 'bg-[#0b0f19] border border-[#1e2638] shadow-lg'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-brand-purple text-white text-[10px] font-mono font-bold uppercase tracking-wider shadow-md shadow-purple-500/30">
                  {tier.badge}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-bold text-white">{tier.name}</h3>
                  {!tier.popular && (
                    <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-[#151b2c]">
                      {tier.badge}
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <span className="text-3xl font-extrabold text-white font-mono">
                    {billingCycle === 'ANNUAL' ? tier.priceAnnual : tier.priceMonthly}
                  </span>
                  {tier.id !== 'FREE' && (
                    <span className="text-xs text-slate-400 font-mono block mt-0.5">
                      {billingCycle === 'ANNUAL' ? 'billed annually' : 'billed monthly'}
                    </span>
                  )}
                </div>

                {/* Features List */}
                <div className="space-y-2.5 pt-3 border-t border-white/10 text-xs">
                  {tier.features.map((feat, i) => (
                    <div key={i} className="flex items-start text-slate-200">
                      <Check className="w-4 h-4 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                  {tier.notIncluded.map((feat, i) => (
                    <div key={i} className="flex items-start text-slate-500">
                      <X className="w-4 h-4 text-slate-600 mr-2 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/5">
                <button
                  onClick={() => setCurrentTier(tier.id as any)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                    isCurrent
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                      : tier.popular
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/30'
                      : 'bg-[#151b2c] hover:bg-[#1f2840] text-slate-200 hover:text-white border border-white/10'
                  }`}
                >
                  {isCurrent ? '✓ Active Plan' : tier.btnText}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
