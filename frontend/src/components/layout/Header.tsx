'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  Search,
  Cpu,
  Clock,
  Sparkles,
  Sun,
  Moon,
  Laptop,
} from 'lucide-react';

interface HeaderProps {
  activeMarket: 'ALL' | 'IN' | 'US';
  onMarketChange: (market: 'ALL' | 'IN' | 'US') => void;
  onSearchClick: () => void;
  currentTheme?: 'slate' | 'light' | 'navy';
  onThemeChange?: (theme: 'slate' | 'light' | 'navy') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeMarket,
  onMarketChange,
  onSearchClick,
  currentTheme = 'slate',
  onThemeChange,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full bg-[#1e293b]/95 backdrop-blur-md border-b border-[#334155] sticky top-0 z-50 px-4 py-2.5 flex items-center justify-between shadow-md">
      {/* Brand & Status */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2.5">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center font-black text-lg text-white shadow-lg shadow-indigo-500/30">
              N
            </div>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold tracking-wider text-base text-white">NEXORA</span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
                PRO TERMINAL
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-tight hidden sm:block">
              Institutional Financial & Quant Intelligence Suite
            </p>
          </div>
        </div>

        {/* Latency & Engine Badge */}
        <div className="hidden lg:flex items-center space-x-3 pl-4 border-l border-[#334155] text-[11px] font-mono text-slate-300">
          <span className="flex items-center text-emerald-400 font-semibold">
            <Activity className="w-3.5 h-3.5 mr-1" /> Core Engine: Live
          </span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center text-cyan-400 font-semibold">
            <Cpu className="w-3.5 h-3.5 mr-1" /> ARIMA 95% + Greeks
          </span>
        </div>
      </div>

      {/* Search, Market, Theme & Clock Actions */}
      <div className="flex items-center space-x-3">
        {/* Search button */}
        <button
          onClick={onSearchClick}
          className="flex items-center space-x-2 px-3 py-1.5 text-xs text-slate-300 bg-[#0f172a] rounded-lg border border-[#334155] hover:border-indigo-500 transition-colors w-40 sm:w-60 shadow-inner"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="truncate">Search tickers, NLP screens...</span>
          <kbd className="hidden sm:inline-block ml-auto text-[10px] bg-[#1e293b] px-1.5 py-0.5 rounded text-slate-300 font-mono border border-[#334155]">
            ⌘K
          </kbd>
        </button>

        {/* Market Filter */}
        <div className="flex items-center bg-[#0f172a] border border-[#334155] rounded-lg p-0.5 text-xs font-mono">
          <button
            onClick={() => onMarketChange('ALL')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeMarket === 'ALL'
                ? 'bg-indigo-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            GLOBAL
          </button>
          <button
            onClick={() => onMarketChange('IN')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeMarket === 'IN'
                ? 'bg-indigo-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🇮🇳 NSE/BSE
          </button>
          <button
            onClick={() => onMarketChange('US')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeMarket === 'US'
                ? 'bg-indigo-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🇺🇸 US
          </button>
        </div>

        {/* Theme Switcher Toggle */}
        {onThemeChange && (
          <div className="hidden sm:flex items-center bg-[#0f172a] border border-[#334155] rounded-lg p-0.5 text-xs font-mono">
            <button
              onClick={() => onThemeChange('slate')}
              title="Institutional Slate (Professional Dark)"
              className={`px-2 py-1 rounded-md transition-all flex items-center space-x-1 ${
                currentTheme === 'slate'
                  ? 'bg-slate-700 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-[10px]">Slate</span>
            </button>
            <button
              onClick={() => onThemeChange('light')}
              title="Wall Street Day (Clean Light Mode)"
              className={`px-2 py-1 rounded-md transition-all flex items-center space-x-1 ${
                currentTheme === 'light'
                  ? 'bg-white text-slate-900 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-[10px]">Light</span>
            </button>
            <button
              onClick={() => onThemeChange('navy')}
              title="Midnight Navy (Financial Blue)"
              className={`px-2 py-1 rounded-md transition-all flex items-center space-x-1 ${
                currentTheme === 'navy'
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-[10px]">Navy</span>
            </button>
          </div>
        )}

        {/* Real-time Clock */}
        <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 text-xs font-mono bg-[#0f172a] rounded-lg border border-[#334155] text-slate-200 shadow-inner">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>{timeStr || '10:55:00'} IST</span>
        </div>
      </div>
    </header>
  );
};
