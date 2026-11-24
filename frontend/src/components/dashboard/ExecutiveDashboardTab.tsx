'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  Zap,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  Layers,
  PieChart as PieIcon,
  Activity,
  CheckCircle2,
  Clock,
  ChevronRight,
  Flame,
  Award,
  BarChart2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

interface ExecutiveDashboardTabProps {
  onSelectStock: (symbol: string) => void;
  onNavigateToTab: (tabId: string) => void;
}

export const ExecutiveDashboardTab: React.FC<ExecutiveDashboardTabProps> = ({
  onSelectStock,
  onNavigateToTab,
}) => {
  const [timeRange, setTimeRange] = useState<'1W' | '1M' | '3M' | '6M' | '1YR' | '3YR'>('6M');
  const [profitFilter, setProfitFilter] = useState<'Yearly' | 'Monthly' | 'Quarterly'>('Yearly');

  // Profit multi-layer stacked data (Matches Image 2)
  const profitHistory = [
    { year: '2019', stocks: 2100, bonds: 900, mutualFunds: 678, total: 3678.78 },
    { year: '2020', stocks: 2600, bonds: 1100, mutualFunds: 734, total: 4434.54 },
    { year: '2021', stocks: 2150, bonds: 850, mutualFunds: 637, total: 3637.43 },
    { year: '2022', stocks: 2900, bonds: 1150, mutualFunds: 776, total: 4826.94 },
    { year: '2023', stocks: 3300, bonds: 1250, mutualFunds: 882, total: 5432.12 },
    { year: '2024', stocks: 2750, bonds: 1050, mutualFunds: 787, total: 4587.73 },
    { year: '2025', stocks: 4600, bonds: 1650, mutualFunds: 1171, total: 7421.42 },
  ];

  // Performance comparison data vs S&P 500 / 60/40 benchmark
  const performanceCurve = [
    { label: 'Jan', nexoraFund: 1.2, sp500: 0.5, benchmark6040: 0.2 },
    { label: 'Feb', nexoraFund: 4.8, sp500: 1.8, benchmark6040: 0.8 },
    { label: 'Mar', nexoraFund: 2.1, sp500: -1.2, benchmark6040: -0.4 },
    { label: 'Apr', nexoraFund: 6.4, sp500: 2.4, benchmark6040: 1.1 },
    { label: 'May', nexoraFund: 5.2, sp500: 3.1, benchmark6040: 1.9 },
    { label: 'Jun', nexoraFund: 8.6, sp500: 4.5, benchmark6040: 2.4 },
  ];

  // AI Growth Stocks Watchlist (Matches Image 2)
  const growthStocks = [
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 870.76, change: 9.72, color: '#ef4444' },
    { symbol: 'MSFT', name: 'Microsoft', price: 463.23, change: 5.34, color: '#3b82f6' },
    { symbol: 'NVDA', name: 'Nvidia Corp.', price: 434.76, change: 4.45, color: '#10b981' },
    { symbol: 'AAPL', name: 'Apple Inc.', price: 757.43, change: 4.10, color: '#06b6d4' },
    { symbol: 'SHOP', name: 'Shopify Inc.', price: 435.53, change: 3.24, color: '#8b5cf6' },
  ];

  // Concentric Exposure Breakdown (Matches Image 2)
  const sectorExposures = [
    { name: 'Treasuries, 7-10 yr', weight: '+37.98%', up: true },
    { name: 'Information Technology', weight: '+35.27%', up: true },
    { name: 'Treasuries, 20+ yr', weight: '+29.18%', up: true },
    { name: 'Consumer Discretionary', weight: '+22.12%', up: true },
    { name: 'Financials', weight: '-16.90%', up: false },
    { name: 'Communication Sector', weight: '-13.08%', up: false },
    { name: 'Healthcare', weight: '+11.79%', up: true },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Ribbon */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-3 border-b border-[#334155] gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-indigo-400" />
              NEXORA Executive Intelligence Terminal
            </h1>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
              Live Quant Feed
            </span>
          </div>
          <p className="text-xs text-slate-300 font-mono mt-0.5">
            Institutional Asset Management & Advanced Factor Intelligence
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {['Overview', 'Portfolio', 'Risk & Compliance', 'Investment', 'Reports & Analytics'].map(
            (pill, i) => (
              <button
                key={pill}
                onClick={() => {
                  if (pill === 'Portfolio') onNavigateToTab('portfolio');
                  if (pill === 'Risk & Compliance') onNavigateToTab('quant_ml');
                  if (pill === 'Investment') onNavigateToTab('equity');
                }}
                className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-all ${
                  i === 0
                    ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                    : 'bg-[#1e293b] text-slate-300 hover:text-white hover:bg-[#283548] border border-[#334155]'
                }`}
              >
                {pill}
              </button>
            )
          )}
        </div>
      </div>

      {/* Main 3-Column Grid Layout (Apple Glassmorphism UI) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* =========================================================================
            COLUMN 1 (Left - 4 Cols): Performance Overview, Stacked Profit, Benchmark
           ========================================================================= */}
        <div className="lg:col-span-4 space-y-5">
          {/* 1.1 Performance Overview Card */}
          <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-200 flex items-center">
                Performance Overview <span className="ml-1 text-slate-400 text-[10px]">ⓘ</span>
              </span>
              <span className="text-[11px] font-mono font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
                +12% growth
              </span>
            </div>

            <div className="flex items-baseline space-x-2 mb-3">
              <span className="text-3xl font-extrabold text-white font-mono tracking-tight">85%</span>
              <span className="text-xs text-slate-300 font-mono">Total Efficiency</span>
            </div>

            {/* Segmented Efficiency Bar */}
            <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-slate-700 mb-3 shadow-inner">
              <div className="bg-indigo-500 h-full" style={{ width: '44%' }} />
              <div className="bg-cyan-400 h-full" style={{ width: '32%' }} />
              <div className="bg-purple-500 h-full" style={{ width: '24%' }} />
            </div>

            <div className="flex justify-between text-[11px] font-mono text-slate-300 mb-4 pb-3 border-b border-[#334155]">
              <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-indigo-500 mr-1" /> 44% Alpha</span>
              <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-cyan-400 mr-1" /> 32% Beta</span>
              <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-purple-500 mr-1" /> 24% Carry</span>
            </div>

            {/* Mini KPIs */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-[#0f172a] p-2.5 rounded-xl border border-[#334155]">
                <span className="text-sm font-bold text-white block">120</span>
                <span className="text-[10px] text-slate-400 font-medium">New Signals</span>
              </div>
              <div className="bg-[#0f172a] p-2.5 rounded-xl border border-[#334155]">
                <span className="text-sm font-bold text-emerald-400 block">80</span>
                <span className="text-[10px] text-slate-400 font-medium">Executed</span>
              </div>
              <div className="bg-[#0f172a] p-2.5 rounded-xl border border-[#334155]">
                <span className="text-sm font-bold text-rose-400 block">25</span>
                <span className="text-[10px] text-slate-400 font-medium">Overdue</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#334155] flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300">Total Revenue Generated:</span>
              <span className="text-white font-bold text-sm">$780K</span>
            </div>
          </div>

          {/* 1.2 Total Profit Multi-Layer Area Chart (Image 2 style) */}
          <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-xs font-bold text-slate-200">Total Profit</span>
                <div className="text-2xl font-mono font-extrabold text-white mt-0.5">
                  $87,536<span className="text-slate-300 text-lg">.75</span>
                </div>
                <div className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center mt-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +8.1% ($8,876.45 this year)
                </div>
              </div>

              <div className="flex items-center space-x-1 bg-[#0f172a] p-0.5 rounded-lg border border-[#334155]">
                {(['Yearly', 'Monthly'] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setProfitFilter(opt)}
                    className={`text-[10px] font-mono px-2 py-1 rounded transition-colors ${
                      profitFilter === opt
                        ? 'bg-indigo-600 text-white font-bold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4 text-[10px] font-mono text-slate-300 my-2">
              <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-cyan-400 mr-1.5" /> Stocks</span>
              <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-indigo-500 mr-1.5" /> Bonds</span>
              <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-amber-400 mr-1.5" /> Mutual Funds</span>
            </div>

            <div className="h-44 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={profitHistory}>
                  <defs>
                    <linearGradient id="colorStocks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorBonds" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorFunds" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: 8, fontSize: 11, color: '#f8fafc' }}
                  />
                  <Area type="monotone" dataKey="stocks" stackId="1" stroke="#06b6d4" fill="url(#colorStocks)" />
                  <Area type="monotone" dataKey="bonds" stackId="1" stroke="#6366f1" fill="url(#colorBonds)" />
                  <Area type="monotone" dataKey="mutualFunds" stackId="1" stroke="#f59e0b" fill="url(#colorFunds)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 1.3 Performance Comparison vs Benchmark */}
          <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-200">Performance Comparison</span>
              <div className="flex space-x-1">
                {(['1W', '1M', '3M', '6M', '1YR', '3YR'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setTimeRange(r)}
                    className={`text-[9px] font-mono px-2 py-0.5 rounded ${
                      timeRange === r
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white bg-[#0f172a]'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceCurve}>
                  <XAxis dataKey="label" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickFormatter={(v) => `${v}%`} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: 8, color: '#f8fafc' }} />
                  <Line type="monotone" dataKey="nexoraFund" stroke="#818cf8" strokeWidth={2.5} dot={{ r: 3 }} name="NEXORA Alpha" />
                  <Line type="monotone" dataKey="sp500" stroke="#38bdf8" strokeWidth={1.5} dot={false} strokeDasharray="3 3" name="S&P 500" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 mt-2 pt-2 border-t border-[#334155]">
              <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-indigo-400 mr-1.5" /> NEXORA Strategy (+8.6%)</span>
              <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-cyan-400 mr-1.5" /> US 60/40 (+4.5%)</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            COLUMN 2 (Center - 4 Cols): Asset Distribution, Glowing AI Orb, Concentric Circles
           ========================================================================= */}
        <div className="lg:col-span-4 space-y-5">
          {/* 2.1 Asset Distribution $5.2M (Image 2 style) */}
          <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-200">Asset Distribution</span>
              <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold">Institutional Portfolio</span>
            </div>

            <div className="flex items-baseline space-x-2 mb-4">
              <span className="text-3xl font-extrabold text-white font-mono">$5.2M</span>
              <span className="text-xs text-slate-300 font-mono">Total Assets Under Management</span>
            </div>

            {/* Segmented vertical bar graph representation */}
            <div className="grid grid-cols-4 gap-3 py-3 px-2 bg-[#0f172a] rounded-xl border border-[#334155] mb-4 text-center">
              <div>
                <span className="text-xs font-mono font-bold text-white block">$2.1M</span>
                <div className="w-full h-16 bg-slate-800 rounded-lg flex items-end p-1 my-1">
                  <div className="w-full bg-indigo-500 rounded h-[70%]" />
                </div>
                <span className="text-[10px] font-mono text-indigo-300 font-bold">40% Equity</span>
              </div>

              <div>
                <span className="text-xs font-mono font-bold text-white block">$1.4M</span>
                <div className="w-full h-16 bg-slate-800 rounded-lg flex items-end p-1 my-1">
                  <div className="w-full bg-cyan-400 rounded h-[50%]" />
                </div>
                <span className="text-[10px] font-mono text-cyan-300 font-bold">27% Fixed Inc</span>
              </div>

              <div>
                <span className="text-xs font-mono font-bold text-white block">$390K</span>
                <div className="w-full h-16 bg-slate-800 rounded-lg flex items-end p-1 my-1">
                  <div className="w-full bg-amber-400 rounded h-[35%]" />
                </div>
                <span className="text-[10px] font-mono text-amber-300 font-bold">18% Real Est</span>
              </div>

              <div>
                <span className="text-xs font-mono font-bold text-white block">$750K</span>
                <div className="w-full h-16 bg-slate-800 rounded-lg flex items-end p-1 my-1">
                  <div className="w-full bg-emerald-400 rounded h-[30%]" />
                </div>
                <span className="text-[10px] font-mono text-emerald-300 font-bold">15% Commod</span>
              </div>
            </div>
          </div>

          {/* 2.2 Glowing Purple Neon AI Event Horizon Orb */}
          <div className="relative rounded-2xl overflow-hidden p-6 bg-gradient-to-b from-[#2e1065] via-[#1e1b4b] to-[#0f172a] border border-indigo-500/40 shadow-xl group">
            {/* Glowing cosmic purple ring in background */}
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-gradient-to-t from-indigo-600/40 via-purple-500/30 to-transparent blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-48 h-32 rounded-full border-t-2 border-indigo-400/80 shadow-[0_0_40px_rgba(99,102,241,0.7)] pointer-events-none" />

            <div className="relative z-10 text-center space-y-3">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-400/40 text-indigo-200 text-[11px] font-bold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                <span>NEXORA Neural Engine v2.0</span>
              </div>

              <h3 className="text-lg font-bold text-white tracking-tight">
                AI-Driven Insights for Smarter Financial Decisions!
              </h3>
              <p className="text-xs text-indigo-100/90 max-w-xs mx-auto font-sans leading-relaxed">
                Autonomous real-time forensic scanning, systemic stress modeling, and institutional flow alerts.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => onNavigateToTab('copilot')}
                  className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/50 transition-all hover:scale-105"
                >
                  Try Now →
                </button>
              </div>
            </div>
          </div>

          {/* 2.3 Portfolio Comparison & Concentric Rings */}
          <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-200">Portfolio Sector Exposure</span>
              <span className="text-[10px] font-mono text-slate-400">Factor Decomposition</span>
            </div>

            <div className="space-y-2">
              {sectorExposures.map((sec) => (
                <div
                  key={sec.name}
                  className="flex items-center justify-between text-xs font-mono py-1.5 border-b border-[#334155]/60 last:border-0"
                >
                  <span className="text-slate-200 truncate max-w-[200px]">{sec.name}</span>
                  <span
                    className={`font-bold ${
                      sec.up ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {sec.weight}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================================================
            COLUMN 3 (Right - 4 Cols): Speedometer Risk Gauge, Growth Stocks, Categorized News
           ========================================================================= */}
        <div className="lg:col-span-4 space-y-5">
          {/* 3.1 Portfolio Risk Indicator Speedometer */}
          <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200">Portfolio Risk Indicator</span>
              <span className="text-[10px] font-mono text-slate-400">Monte Carlo VaR</span>
            </div>

            {/* Custom SVG Tachometer Arc */}
            <div className="flex flex-col items-center justify-center pt-2">
              <div className="relative w-44 h-24 flex items-center justify-center overflow-hidden">
                <svg className="w-44 h-44 -mt-20" viewBox="0 0 100 100">
                  {/* Gauge Background Track */}
                  <path
                    d="M 15 75 A 40 40 0 0 1 85 75"
                    fill="none"
                    stroke="#334155"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  {/* Gauge Colored Progress (Medium Risk Arc: Yellow/Orange) */}
                  <path
                    d="M 15 75 A 40 40 0 0 1 50 35"
                    fill="none"
                    stroke="url(#gaugeGradient)"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="60%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                  </defs>
                  {/* Gauge Needle pointing around 4.2 */}
                  <circle cx="50" cy="75" r="4" fill="#ffffff" />
                  <line x1="50" y1="75" x2="42" y2="46" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
                </svg>

                <div className="absolute bottom-0 text-center">
                  <div className="text-2xl font-mono font-extrabold text-white">
                    4.2<span className="text-xs text-slate-400">/10</span>
                  </div>
                  <div className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                    Medium Risk
                  </div>
                </div>
              </div>

              {/* Stats underneath gauge */}
              <div className="grid grid-cols-3 gap-2 w-full mt-4 text-center border-t border-[#334155] pt-3">
                <div>
                  <span className="text-xs font-mono font-bold text-emerald-400 block">7.5%</span>
                  <span className="text-[9px] text-slate-400">Portfolio ROI</span>
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-cyan-400 block">92%</span>
                  <span className="text-[9px] text-slate-400">AI Accuracy</span>
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-indigo-400 block">4.8/5</span>
                  <span className="text-[9px] text-slate-400">Health Score</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3.2 AI-Identified Growth Stocks */}
          <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-200">AI-Identified Growth Stocks</span>
              <span className="text-[10px] font-mono text-indigo-400 font-bold">High Momentum</span>
            </div>

            <div className="space-y-2.5">
              {growthStocks.map((stk) => (
                <div
                  key={stk.symbol}
                  onClick={() => onSelectStock(stk.symbol)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#0f172a] hover:bg-[#283548] border border-[#334155] cursor-pointer transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white"
                      style={{ backgroundColor: `${stk.color}35`, border: `1px solid ${stk.color}60` }}
                    >
                      {stk.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">{stk.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">{stk.symbol}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-white block">
                      ${stk.price.toFixed(2)}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 flex items-center justify-end">
                      <ArrowUpRight className="w-3 h-3 mr-0.5" /> +{stk.change.toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3.3 Regulated Catalyst News Feed */}
          <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-200">Market Intelligence Wire</span>
              <span className="text-[10px] font-mono text-slate-400">Live API</span>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-sans border-b border-[#334155] pb-2.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-400 font-mono">10 mins ago</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-indigo-950/80 text-indigo-300 border border-indigo-500/30 font-bold">
                    RegTech
                  </span>
                </div>
                <p className="text-slate-200 line-clamp-2">
                  SEC introduces new compliance measures for algorithmic high-frequency trading desks.
                </p>
              </div>

              <div className="text-xs font-sans border-b border-[#334155] pb-2.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-400 font-mono">3 hours ago</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 font-bold">
                    Crypto
                  </span>
                </div>
                <p className="text-slate-200 line-clamp-2">
                  Top sovereign wealth funds predict major structural institutional shift in digital assets.
                </p>
              </div>

              <div className="text-xs font-sans">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-400 font-mono">1 day ago</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 font-bold">
                    Finance / AI
                  </span>
                </div>
                <p className="text-slate-200 line-clamp-2">
                  Goldman Sachs CEO: Global market trends accelerate shift towards autonomous quant models.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
