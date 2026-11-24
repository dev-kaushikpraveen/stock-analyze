'use client';

import React, { useState, useEffect } from 'react';
import {
  MarketIndex,
  MarketBreadth,
  SectorBreadth,
  EquityStock,
  InstitutionalData,
  MarketNewsItem,
} from '@/types';
import { api } from '@/services/api';
import { Header } from '@/components/layout/Header';
import { TickerTape } from '@/components/layout/TickerTape';
import { Navigation, TerminalTab } from '@/components/layout/Navigation';
import { ExecutiveDashboardTab } from '@/components/dashboard/ExecutiveDashboardTab';
import { NiftyHeatmapGrid } from '@/components/dashboard/NiftyHeatmapGrid';
import { MarketOverviewTab } from '@/components/dashboard/MarketOverviewTab';
import { EquityTerminalTab } from '@/components/equity/EquityTerminalTab';
import { QuantMLEngineTab } from '@/components/quant/QuantMLEngineTab';
import { OptionsLabTab } from '@/components/options/OptionsLabTab';
import { BacktestingLabTab } from '@/components/backtest/BacktestingLabTab';
import { PortfolioStressTab } from '@/components/portfolio/PortfolioStressTab';
import { CopilotScreenerTab } from '@/components/copilot/CopilotScreenerTab';
import { AcademyTab } from '@/components/academy/AcademyTab';
import { SubscriptionTab } from '@/components/subscription/SubscriptionTab';
import { AdminDashboardTab } from '@/components/admin/AdminDashboardTab';
import { CommandPalette } from '@/components/search/CommandPalette';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TerminalTab>('executive');
  const [activeMarket, setActiveMarket] = useState<'ALL' | 'IN' | 'US'>('ALL');
  const [currentTheme, setCurrentTheme] = useState<'slate' | 'light' | 'navy'>('slate');
  const [selectedSymbol, setSelectedSymbol] = useState<string>('RELIANCE');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Core Data
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [breadth, setBreadth] = useState<MarketBreadth | null>(null);
  const [sectors, setSectors] = useState<SectorBreadth[]>([]);
  const [stocks, setStocks] = useState<EquityStock[]>([]);
  const [topGainers, setTopGainers] = useState<EquityStock[]>([]);
  const [topLosers, setTopLosers] = useState<EquityStock[]>([]);
  const [institutional, setInstitutional] = useState<InstitutionalData | null>(null);
  const [news, setNews] = useState<MarketNewsItem[]>([]);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  // Load initial terminal data
  useEffect(() => {
    let isMounted = true;
    async function initData() {
      try {
        const [indicesData, breadthData, stocksData, instData, newsData] =
          await Promise.all([
            api.getIndices(),
            api.getBreadth(),
            api.getStocks(activeMarket),
            api.getInstitutional(),
            api.getNews(),
          ]);

        if (isMounted) {
          setIndices(indicesData);
          setBreadth(breadthData.market_breadth);
          setSectors(breadthData.sector_breadth);
          setStocks(stocksData.stocks);
          setTopGainers(stocksData.top_gainers);
          setTopLosers(stocksData.top_losers);
          setInstitutional(instData);
          setNews(newsData);
        }
      } catch (err) {
        console.error('Initial data fetch failed:', err);
      } finally {
        if (isMounted) setInitialLoading(false);
      }
    }
    initData();
    return () => {
      isMounted = false;
    };
  }, [activeMarket]);

  const handleStockSelection = (symbol: string) => {
    setSelectedSymbol(symbol);
    setActiveTab('equity');
  };

  const getThemeClass = () => {
    if (currentTheme === 'light') return 'bg-[#f8fafc] text-slate-800';
    if (currentTheme === 'navy') return 'bg-[#0a1128] text-slate-100';
    return 'bg-gradient-to-b from-[#0f172a] via-[#131d31] to-[#0f172a] text-slate-100';
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${getThemeClass()} selection:bg-indigo-500 selection:text-white`}>
      {/* 1. Global Header with Theme Switcher */}
      <Header
        activeMarket={activeMarket}
        onMarketChange={(m) => setActiveMarket(m)}
        onSearchClick={() => setIsSearchOpen(true)}
        currentTheme={currentTheme}
        onThemeChange={(th) => setCurrentTheme(th)}
      />

      {/* 2. Real-Time Marquee Ticker Tape */}
      <TickerTape indices={indices} />

      {/* 3. Primary Module Switcher Navigation */}
      <Navigation activeTab={activeTab} onTabChange={(t) => setActiveTab(t)} />

      {/* 4. Active Module Viewport */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto p-4 sm:p-6">
        {initialLoading ? (
          <div className="h-[60vh] flex flex-col items-center justify-center space-y-3 font-mono text-xs text-slate-300">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
            <span>Initializing NEXORA Institutional Quant Feeds...</span>
          </div>
        ) : (
          <>
            {activeTab === 'executive' && (
              <ExecutiveDashboardTab
                onSelectStock={handleStockSelection}
                onNavigateToTab={(t) => setActiveTab(t as TerminalTab)}
              />
            )}

            {activeTab === 'heatmap_nifty' && (
              <NiftyHeatmapGrid onSelectStock={handleStockSelection} />
            )}

            {activeTab === 'dashboard' && (
              <MarketOverviewTab
                indices={indices}
                breadth={breadth}
                sectors={sectors}
                stocks={stocks}
                topGainers={topGainers}
                topLosers={topLosers}
                institutional={institutional}
                news={news}
                onSelectStock={handleStockSelection}
              />
            )}

            {activeTab === 'equity' && (
              <EquityTerminalTab
                stocks={stocks}
                selectedSymbol={selectedSymbol}
                onSelectSymbol={(sym) => setSelectedSymbol(sym)}
              />
            )}

            {activeTab === 'quant_ml' && (
              <QuantMLEngineTab
                stocks={stocks}
                selectedSymbol={selectedSymbol}
                onSelectSymbol={(sym) => setSelectedSymbol(sym)}
              />
            )}

            {activeTab === 'options' && <OptionsLabTab />}

            {activeTab === 'backtest' && <BacktestingLabTab stocks={stocks} />}

            {activeTab === 'portfolio' && (
              <PortfolioStressTab onSelectStock={handleStockSelection} />
            )}

            {activeTab === 'copilot' && (
              <CopilotScreenerTab
                stocks={stocks}
                onSelectStock={handleStockSelection}
              />
            )}

            {activeTab === 'academy' && <AcademyTab />}

            {activeTab === 'subscription' && <SubscriptionTab />}

            {activeTab === 'admin' && <AdminDashboardTab />}
          </>
        )}
      </main>

      {/* 5. Terminal Footer Strip */}
      <footer className="w-full bg-[#1e293b] border-t border-[#334155] px-4 py-2.5 text-[11px] font-mono text-slate-300 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-inner">
        <div className="flex items-center space-x-3">
          <span className="flex items-center text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
            NEXORA Quant Engine Active
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">Feed: Consolidated NSE/BSE & Global Equities</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">Theme: Institutional Slate</span>
        </div>
        <div className="flex items-center space-x-3 text-slate-400">
          <span>Latency: 1.8ms</span>
          <span>•</span>
          <span>Press ⌘K to Search</span>
        </div>
      </footer>

      {/* 6. Quick Command Search Palette */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        stocks={stocks}
        onSelectStock={handleStockSelection}
      />
    </div>
  );
}
