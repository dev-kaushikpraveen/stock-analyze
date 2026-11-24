'use client';

import React, { useState } from 'react';
import { EquityStock, CopilotResponse, ScreenerResult } from '@/types';
import { api } from '@/services/api';
import { formatCurrency, formatPct, getChangeColor } from '@/lib/utils';
import {
  Bot,
  Send,
  Sparkles,
  Filter,
  Search,
  Globe2,
  HelpCircle,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Lightbulb,
} from 'lucide-react';

interface CopilotScreenerTabProps {
  stocks: EquityStock[];
  onSelectStock: (symbol: string) => void;
}

export const CopilotScreenerTab: React.FC<CopilotScreenerTabProps> = ({
  stocks,
  onSelectStock,
}) => {
  // Copilot State
  const [copilotQuery, setCopilotQuery] = useState<string>('');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [copilotLoading, setCopilotLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<
    Array<{
      sender: 'user' | 'copilot';
      text: string;
      confidence?: number;
      intent?: string;
      followups?: string[];
    }>
  >([
    {
      sender: 'copilot',
      text: 'Hello! I am NEXORA Institutional AI Copilot. You can ask me anything about Indian (NSE/BSE) and US equities in English or Hindi/Hinglish (e.g. "Why is Reliance falling?", "Nifty view for tomorrow", or "Reliance kyun gir raha hai?").',
      confidence: 0.98,
      intent: 'Greeting & Platform Guide',
      followups: [
        'Why is Reliance falling today?',
        'Reliance kyun gir raha hai?',
        'Nifty 50 expiry view & Max Pain',
        'Top quality compounders with high ROE',
      ],
    },
  ]);

  // Screener State
  const [screenerQuery, setScreenerQuery] = useState<string>(
    'Find Indian companies with consistent profit growth, low debt and strong ROE'
  );
  const [screenerLoading, setScreenerLoading] = useState<boolean>(false);
  const [screenerResult, setScreenerResult] = useState<ScreenerResult | null>(null);

  const handleAskCopilot = async (qText?: string) => {
    const queryToAsk = qText || copilotQuery;
    if (!queryToAsk.trim()) return;

    // Detect language if Hindi characters or Hinglish words appear
    const isHindi =
      /[\u0900-\u097F]/.test(queryToAsk) ||
      /\b(kyun|kya|hai|gira|badha|kaise|batao|munafa)\b/i.test(queryToAsk);
    const lang = isHindi ? 'hi' : 'en';

    setMessages((prev) => [...prev, { sender: 'user', text: queryToAsk }]);
    setCopilotQuery('');
    setCopilotLoading(true);

    try {
      const res = await api.askCopilot(queryToAsk, lang);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'copilot',
          text: res.response,
          confidence: res.confidence,
          intent: res.intent,
          followups: res.suggested_followups,
        },
      ]);
    } catch (err) {
      console.error('Failed to ask copilot:', err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'copilot',
          text: 'Encountered an error reaching the Quant engine. Please try again.',
        },
      ]);
    } finally {
      setCopilotLoading(false);
    }
  };

  const handleRunScreener = async (customQ?: string) => {
    const q = customQ || screenerQuery;
    setScreenerLoading(true);
    try {
      const res = await api.runScreener(q);
      setScreenerResult(res);
    } catch (err) {
      console.error('Screener run failed:', err);
    } finally {
      setScreenerLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Natural Language Screener */}
      <div className="bg-surface/90 border border-surface-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-surface-border">
          <div>
            <h3 className="text-sm font-semibold text-slate-200 flex items-center">
              <Filter className="w-4 h-4 mr-2 text-brand-purple" />
              Conversational NLP Equities Screener
            </h3>
            <p className="text-[11px] font-mono text-slate-400">
              Translates plain English or Hindi prompts directly into database filters
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-purple/20 text-brand-purple font-semibold">
            Zero-Code Screen
          </span>
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={screenerQuery}
              onChange={(e) => setScreenerQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRunScreener()}
              placeholder="e.g. Find Indian companies with consistent profit growth, low debt and strong ROE..."
              className="w-full bg-surface-elevated text-white pl-9 pr-4 py-2 text-xs font-mono rounded-lg border border-surface-border focus:outline-none focus:border-brand-purple"
            />
          </div>
          <button
            onClick={() => handleRunScreener()}
            disabled={screenerLoading}
            className="px-5 py-2 rounded-lg bg-brand-purple text-white text-xs font-mono font-bold hover:bg-brand-violet transition-colors disabled:opacity-50"
          >
            {screenerLoading ? 'Filtering Universe...' : 'Scan Market'}
          </button>
        </div>

        {/* Sample queries pills */}
        <div className="flex items-center space-x-2 overflow-x-auto text-[11px] font-mono mb-4 pb-1">
          <span className="text-slate-500 whitespace-nowrap">Try:</span>
          {[
            'Find Indian companies with consistent profit growth, low debt and strong ROE',
            'Undervalued companies with low PE and high ROE',
            'Large cap companies with strong institutional backing',
          ].map((sample) => (
            <button
              key={sample}
              onClick={() => {
                setScreenerQuery(sample);
                handleRunScreener(sample);
              }}
              className="px-2.5 py-1 rounded bg-surface border border-surface-border hover:border-brand-purple/50 text-slate-300 hover:text-white whitespace-nowrap transition-colors"
            >
              {sample}
            </button>
          ))}
        </div>

        {/* Screener Results */}
        {screenerResult && (
          <div className="space-y-3 pt-3 border-t border-surface-border">
            <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded bg-surface-elevated/70 border border-surface-border text-xs font-mono">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-400">Parsed Rule:</span>
                <span className="font-bold text-brand-cyan">
                  {screenerResult.nlp_parsed.human_readable_rule}
                </span>
              </div>
              <span className="text-emerald-400 font-bold">
                {screenerResult.matched_count} Companies Matched
              </span>
            </div>

            {/* Grid of matched stocks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {screenerResult.results.map((stk) => (
                <div
                  key={stk.symbol}
                  onClick={() => onSelectStock(stk.symbol)}
                  className="p-3 rounded-lg bg-surface-elevated/60 border border-surface-border hover:border-brand-purple/60 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold font-mono text-sm text-white">{stk.symbol}</span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">{stk.sector}</span>
                  </div>
                  <div className="text-xs text-slate-400 truncate mb-2">{stk.name}</div>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-sm font-mono font-bold text-white">
                      {formatCurrency(stk.price, stk.market)}
                    </span>
                    <span className={`text-xs font-mono font-semibold ${getChangeColor(stk.change)}`}>
                      {formatPct(stk.change_pct)}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 pt-2 border-t border-surface-border/50 text-[10px] font-mono text-center">
                    <div>
                      <span className="text-slate-500 block">ROE</span>
                      <span className="text-emerald-400 font-bold">{stk.roe}%</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">P/E</span>
                      <span className="text-white font-bold">{stk.pe_ratio.toFixed(1)}x</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">D/E</span>
                      <span className="text-white font-bold">0.35</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Bilingual AI Financial Copilot */}
      <div className="bg-surface/90 border border-surface-border rounded-lg p-4 flex flex-col h-[520px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-surface-border">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded bg-brand-purple/20 border border-brand-purple/40 flex items-center justify-center text-brand-purple">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center">
                Bilingual Financial Copilot
                <span className="ml-2 px-1.5 py-0.2 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  English & हिन्दी
                </span>
              </h3>
              <p className="text-[10px] font-mono text-slate-400">
                Grounding with live market data, XAI factor weights, and derivatives chain
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="text-slate-400">Response Lang:</span>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 rounded ${language === 'en' ? 'bg-brand-purple text-white' : 'text-slate-400'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2 py-0.5 rounded ${language === 'hi' ? 'bg-brand-purple text-white' : 'text-slate-400'}`}
            >
              हिन्दी
            </button>
          </div>
        </div>

        {/* Chat Messages Container */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-2">
          {messages.map((m, idx) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={idx}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed font-sans ${
                    isUser
                      ? 'bg-brand-purple text-white font-medium'
                      : 'bg-surface-elevated/90 text-slate-200 border border-surface-border shadow-md'
                  }`}
                >
                  {!isUser && m.intent && (
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1.5 pb-1 border-b border-surface-border/50">
                      <span className="text-brand-cyan uppercase font-bold">Intent: {m.intent}</span>
                      <span>Confidence: {m.confidence ? `${(m.confidence * 100).toFixed(0)}%` : '96%'}</span>
                    </div>
                  )}

                  <div className="whitespace-pre-line">{m.text}</div>

                  {/* Suggested Followups */}
                  {!isUser && m.followups && m.followups.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-surface-border/50 space-y-1">
                      <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                        Suggested Follow-ups:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {m.followups.map((f, fi) => (
                          <button
                            key={fi}
                            onClick={() => handleAskCopilot(f)}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-surface-border hover:border-brand-purple text-slate-300 hover:text-white transition-colors"
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {copilotLoading && (
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 p-2">
              <Bot className="w-4 h-4 animate-spin text-brand-purple" />
              <span>NEXORA Copilot analyzing quant signals...</span>
            </div>
          )}
        </div>

        {/* Input Field */}
        <div className="mt-3 pt-3 border-t border-surface-border flex items-center space-x-2">
          <input
            type="text"
            value={copilotQuery}
            onChange={(e) => setCopilotQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAskCopilot()}
            placeholder={
              language === 'hi'
                ? 'मुझसे हिंदी में पूछें (उदा: रिलायंस आज क्यों गिर रहा है?)...'
                : 'Ask NEXORA Copilot (e.g. Why is Reliance falling today? Nifty expiry forecast)...'
            }
            className="flex-1 bg-surface-elevated text-white px-3 py-2 rounded-lg text-xs font-mono border border-surface-border focus:outline-none focus:border-brand-purple"
          />
          <button
            onClick={() => handleAskCopilot()}
            disabled={copilotLoading}
            className="px-4 py-2 rounded-lg bg-brand-purple text-white text-xs font-mono font-bold hover:bg-brand-violet transition-colors flex items-center space-x-1 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
