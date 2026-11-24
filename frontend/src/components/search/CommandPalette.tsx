'use client';

import React, { useState, useEffect } from 'react';
import { EquityStock } from '@/types';
import { TerminalTab } from '@/components/layout/Navigation';
import { formatCurrency, formatPct, getChangeColor } from '@/lib/utils';
import { Search, X, TrendingUp, Cpu, Layers, History, Briefcase, Bot } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  stocks: EquityStock[];
  onSelectStock: (symbol: string) => void;
  onSelectTab: (tab: TerminalTab) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  stocks,
  onSelectStock,
  onSelectTab,
}) => {
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredStocks = stocks.filter(
    (s) =>
      s.symbol.toLowerCase().includes(query.toLowerCase()) ||
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.sector.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-start justify-center pt-20 p-4">
      <div className="bg-[#0e121b] border border-surface-border rounded-xl max-w-xl w-full shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-surface-border">
          <Search className="w-4 h-4 text-slate-400 mr-2.5" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a ticker symbol, company name, or terminal command..."
            className="w-full bg-transparent text-white text-sm font-mono focus:outline-none placeholder:text-slate-500"
          />
          <button onClick={onClose} className="text-slate-400 hover:text-white ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Module Navigation */}
        {!query && (
          <div className="p-3 border-b border-surface-border bg-surface-elevated/40">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-2 font-bold px-2">
              Quick Module Jumps
            </span>
            <div className="grid grid-cols-2 gap-1 text-xs font-mono">
              <button
                onClick={() => {
                  onSelectTab('equity');
                  onClose();
                }}
                className="flex items-center space-x-2 p-2 rounded hover:bg-surface-elevated text-slate-300 hover:text-white text-left"
              >
                <TrendingUp className="w-3.5 h-3.5 text-brand-purple" />
                <span>Equity Terminal</span>
              </button>
              <button
                onClick={() => {
                  onSelectTab('quant_ml');
                  onClose();
                }}
                className="flex items-center space-x-2 p-2 rounded hover:bg-surface-elevated text-slate-300 hover:text-white text-left"
              >
                <Cpu className="w-3.5 h-3.5 text-brand-cyan" />
                <span>Quant & ML Predict</span>
              </button>
              <button
                onClick={() => {
                  onSelectTab('options');
                  onClose();
                }}
                className="flex items-center space-x-2 p-2 rounded hover:bg-surface-elevated text-slate-300 hover:text-white text-left"
              >
                <Layers className="w-3.5 h-3.5 text-brand-amber" />
                <span>Options Greeks & Payoff</span>
              </button>
              <button
                onClick={() => {
                  onSelectTab('copilot');
                  onClose();
                }}
                className="flex items-center space-x-2 p-2 rounded hover:bg-surface-elevated text-slate-300 hover:text-white text-left"
              >
                <Bot className="w-3.5 h-3.5 text-emerald-400" />
                <span>AI Copilot & Screener</span>
              </button>
            </div>
          </div>
        )}

        {/* Stock Search Results */}
        <div className="max-h-80 overflow-y-auto p-2">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1 px-2 font-bold">
            Equities Universe ({filteredStocks.length})
          </span>
          <div className="space-y-1">
            {filteredStocks.map((stk) => (
              <div
                key={stk.symbol}
                onClick={() => {
                  onSelectStock(stk.symbol);
                  onClose();
                }}
                className="flex items-center justify-between p-2 rounded hover:bg-surface-elevated cursor-pointer transition-colors"
              >
                <div>
                  <span className="font-mono font-bold text-xs text-white">{stk.symbol}</span>
                  <span className="ml-2 text-[10px] font-mono text-slate-400 uppercase">
                    {stk.exchange} • {stk.sector}
                  </span>
                  <p className="text-[11px] text-slate-400 truncate max-w-[280px]">{stk.name}</p>
                </div>
                <div className="text-right font-mono">
                  <span className="text-xs font-bold text-white block">
                    {formatCurrency(stk.price, stk.market)}
                  </span>
                  <span className={`text-[10px] font-semibold ${getChangeColor(stk.change)}`}>
                    {formatPct(stk.change_pct)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
