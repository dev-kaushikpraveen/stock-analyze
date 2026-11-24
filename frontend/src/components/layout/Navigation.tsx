'use client';

import React from 'react';
import {
  Sparkles,
  Flame,
  BarChart3,
  TrendingUp,
  Cpu,
  Layers,
  History,
  Briefcase,
  Bot,
  GraduationCap,
  CreditCard,
  ShieldAlert,
} from 'lucide-react';

export type TerminalTab =
  | 'executive'
  | 'heatmap_nifty'
  | 'dashboard'
  | 'equity'
  | 'quant_ml'
  | 'options'
  | 'backtest'
  | 'portfolio'
  | 'copilot'
  | 'academy'
  | 'subscription'
  | 'admin';

interface NavigationProps {
  activeTab: TerminalTab;
  onTabChange: (tab: TerminalTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs: Array<{ id: TerminalTab; label: string; icon: React.ReactNode; badge?: string; highlight?: boolean }> = [
    {
      id: 'executive',
      label: 'Executive Terminal',
      icon: <Sparkles className="w-3.5 h-3.5" />,
      badge: 'Apple UI',
      highlight: true,
    },
    {
      id: 'heatmap_nifty',
      label: 'NIFTY Heatmap',
      icon: <Flame className="w-3.5 h-3.5" />,
      badge: 'Equilytics',
    },
    {
      id: 'dashboard',
      label: 'Market Overview',
      icon: <BarChart3 className="w-3.5 h-3.5" />,
    },
    {
      id: 'equity',
      label: 'Equity Deep Dive',
      icon: <TrendingUp className="w-3.5 h-3.5" />,
    },
    {
      id: 'quant_ml',
      label: 'Quant & ML Engine',
      icon: <Cpu className="w-3.5 h-3.5" />,
      badge: 'ARIMA 95%',
    },
    {
      id: 'options',
      label: 'Options & Derivatives',
      icon: <Layers className="w-3.5 h-3.5" />,
      badge: 'Greeks',
    },
    {
      id: 'backtest',
      label: 'Strategy Backtest',
      icon: <History className="w-3.5 h-3.5" />,
    },
    {
      id: 'portfolio',
      label: 'Portfolio & Stress Tests',
      icon: <Briefcase className="w-3.5 h-3.5" />,
      badge: 'What-If',
    },
    {
      id: 'copilot',
      label: 'AI Copilot & Screener',
      icon: <Bot className="w-3.5 h-3.5" />,
      badge: 'EN/हिन्दी',
    },
    {
      id: 'academy',
      label: 'Paper Trading & Academy',
      icon: <GraduationCap className="w-3.5 h-3.5" />,
      badge: '₹10L Virtual',
    },
    {
      id: 'subscription',
      label: 'Plans & Pricing',
      icon: <CreditCard className="w-3.5 h-3.5" />,
    },
    {
      id: 'admin',
      label: 'Admin & Security',
      icon: <ShieldAlert className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <nav className="w-full bg-[#1e293b]/90 border-b border-[#334155] px-3 overflow-x-auto scrollbar-none flex items-center space-x-1 select-none shadow-sm">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center space-x-1.5 py-2.5 px-3.5 border-b-2 text-xs font-medium whitespace-nowrap transition-all duration-150 ${
              isActive
                ? 'border-indigo-400 text-indigo-300 font-bold bg-indigo-500/15'
                : 'border-transparent text-slate-300 hover:text-white hover:border-slate-500'
            }`}
          >
            <span className={isActive ? 'text-indigo-400' : 'text-slate-400'}>{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.badge && (
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-semibold ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-[#0f172a] text-slate-300 border border-[#334155]'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
