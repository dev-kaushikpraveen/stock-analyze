'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Award,
  TrendingUp,
  DollarSign,
  PlayCircle,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export const AcademyTab: React.FC = () => {
  // Paper Trading state
  const [paperCash, setPaperCash] = useState<number>(1000000); // 10 Lakhs INR
  const [paperHoldings, setPaperHoldings] = useState<Array<{ symbol: string; qty: number; avgPrice: number; ltp: number }>>([
    { symbol: 'RELIANCE', qty: 50, avgPrice: 2900, ltp: 2948.40 },
    { symbol: 'HDFCBANK', qty: 100, avgPrice: 1650, ltp: 1678.45 },
  ]);
  const [orderSymbol, setOrderSymbol] = useState<string>('RELIANCE');
  const [orderQty, setOrderQty] = useState<number>(10);
  const [orderAction, setOrderAction] = useState<'BUY' | 'SELL'>('BUY');
  const [tradeMessage, setTradeMessage] = useState<string | null>(null);

  // Candlestick Pattern Quiz state
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  const quizQuestions = [
    {
      pattern: 'Bullish Engulfing',
      description: 'A small red candle followed by a large green candle that completely engulfs the previous day range.',
      question: 'What institutional market sentiment does a Bullish Engulfing candle indicate at a support level?',
      options: [
        'Aggressive institutional accumulation and high probability trend reversal',
        'Imminent market crash and liquidity extraction',
        'Consolidation with zero momentum',
        'Distribution by high-frequency market makers',
      ],
      correct: 0,
      explanation: 'Bullish engulfing represents buyer dominance overcoming prior sellers, indicating institutional reversal.',
    },
    {
      pattern: 'Morning Star',
      description: 'A 3-candle pattern: large bearish candle, small-bodied star candle, and strong bullish candle closing above 50% of the first candle.',
      question: 'Where is the optimal stop-loss placed when trading a Morning Star confirmation?',
      options: [
        'At the 20-day moving average',
        'Immediately below the low of the middle star candle',
        'At the open of the third green candle',
        'No stop-loss is necessary for star patterns',
      ],
      correct: 1,
      explanation: 'The low of the middle star represents the ultimate capitulation point; a breach invalidates the reversal premise.',
    },
  ];

  const handleExecuteTrade = (e: React.FormEvent) => {
    e.preventDefault();
    const ltp = orderSymbol === 'RELIANCE' ? 2948.40 : orderSymbol === 'HDFCBANK' ? 1678.45 : 1236.50;
    const totalCost = ltp * orderQty;

    if (orderAction === 'BUY') {
      if (paperCash < totalCost) {
        setTradeMessage('❌ Insufficient Virtual Margin for execution.');
        return;
      }
      setPaperCash((prev) => prev - totalCost);
      setPaperHoldings((prev) => {
        const existing = prev.find((h) => h.symbol === orderSymbol);
        if (existing) {
          const newQty = existing.qty + orderQty;
          const newAvg = (existing.qty * existing.avgPrice + totalCost) / newQty;
          return prev.map((h) => (h.symbol === orderSymbol ? { ...h, qty: newQty, avgPrice: newAvg } : h));
        }
        return [...prev, { symbol: orderSymbol, qty: orderQty, avgPrice: ltp, ltp }];
      });
      setTradeMessage(`✅ Executed BUY ${orderQty} shares of ${orderSymbol} @ ₹${ltp.toFixed(2)}`);
    } else {
      const existing = paperHoldings.find((h) => h.symbol === orderSymbol);
      if (!existing || existing.qty < orderQty) {
        setTradeMessage('❌ Cannot short sell more shares than held in Paper Account.');
        return;
      }
      setPaperCash((prev) => prev + totalCost);
      setPaperHoldings((prev) =>
        prev
          .map((h) => (h.symbol === orderSymbol ? { ...h, qty: h.qty - orderQty } : h))
          .filter((h) => h.qty > 0)
      );
      setTradeMessage(`✅ Executed SELL ${orderQty} shares of ${orderSymbol} @ ₹${ltp.toFixed(2)}`);
    }
  };

  const handleAnswerSubmit = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
    setShowResult(true);
    if (optionIndex === quizQuestions[currentQuestion].correct) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const totalPaperEquity = paperHoldings.reduce((acc, h) => acc + h.qty * h.ltp, paperCash);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950/60 via-[#0e121e] to-cyan-950/40 border border-purple-500/20 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-6 h-6 text-brand-purple" />
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              NEXORA Quant & Research Academy
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-purple/20 text-brand-purple border border-brand-purple/30 font-semibold">
              Live Paper Sandbox
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Master institutional technical analysis, algorithmic modeling, and risk-free paper trading with ₹10,00,000 virtual capital.
          </p>
        </div>

        <div className="flex items-center space-x-3 font-mono">
          <div className="bg-[#151b2c] px-4 py-2 rounded-xl border border-white/5 text-right">
            <span className="text-[10px] text-slate-400 block uppercase">Virtual Portfolio Value</span>
            <span className="text-lg font-bold text-white">₹{totalPaperEquity.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      {/* 2-Column: Paper Trading Sandbox + Candlestick Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Paper Trading Terminal (7 Columns) */}
        <div className="lg:col-span-7 bg-[#0b0f19] border border-[#1e2638] rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1e2638]">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
              <DollarSign className="w-4 h-4 mr-1.5 text-emerald-400" />
              Real-Time Paper Trading Desk
            </h2>
            <span className="text-xs font-mono text-slate-400">
              Available Cash: <strong className="text-emerald-400">₹{paperCash.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</strong>
            </span>
          </div>

          {/* Quick Order Form */}
          <form onSubmit={handleExecuteTrade} className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-[#151b2c] p-3.5 rounded-xl border border-white/5">
            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-1">Symbol</label>
              <select
                value={orderSymbol}
                onChange={(e) => setOrderSymbol(e.target.value)}
                className="w-full bg-[#0b0f19] border border-white/10 rounded px-2.5 py-1.5 text-xs font-mono text-white outline-none"
              >
                <option value="RELIANCE">RELIANCE (₹2,948.40)</option>
                <option value="HDFCBANK">HDFCBANK (₹1,678.45)</option>
                <option value="ICICIBANK">ICICIBANK (₹1,236.50)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                max="500"
                value={orderQty}
                onChange={(e) => setOrderQty(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-[#0b0f19] border border-white/10 rounded px-2.5 py-1.5 text-xs font-mono text-white outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-1">Side</label>
              <div className="flex rounded overflow-hidden border border-white/10">
                <button
                  type="button"
                  onClick={() => setOrderAction('BUY')}
                  className={`flex-1 py-1.5 text-xs font-bold font-mono transition-colors ${
                    orderAction === 'BUY' ? 'bg-emerald-500 text-white' : 'bg-[#0b0f19] text-slate-400'
                  }`}
                >
                  BUY
                </button>
                <button
                  type="button"
                  onClick={() => setOrderAction('SELL')}
                  className={`flex-1 py-1.5 text-xs font-bold font-mono transition-colors ${
                    orderAction === 'SELL' ? 'bg-rose-500 text-white' : 'bg-[#0b0f19] text-slate-400'
                  }`}
                >
                  SELL
                </button>
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 rounded bg-brand-purple hover:bg-brand-violet text-white text-xs font-bold transition-all shadow-md shadow-purple-500/20"
              >
                Execute Order
              </button>
            </div>
          </form>

          {tradeMessage && (
            <div className="text-xs font-mono p-2.5 rounded bg-[#151b2c] border border-white/10 text-slate-200">
              {tradeMessage}
            </div>
          )}

          {/* Holdings Table */}
          <div>
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Virtual Holdings Position
            </div>
            <div className="space-y-1.5 font-mono text-xs">
              {paperHoldings.map((h) => {
                const currentVal = h.qty * h.ltp;
                const investedVal = h.qty * h.avgPrice;
                const pnl = currentVal - investedVal;
                const pnlPct = (pnl / investedVal) * 100;
                return (
                  <div
                    key={h.symbol}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-[#151b2c]/80 border border-white/5"
                  >
                    <div>
                      <span className="font-bold text-white">{h.symbol}</span>
                      <span className="text-[10px] text-slate-400 ml-2">Qty: {h.qty} • Avg: ₹{h.avgPrice.toFixed(2)}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-white block">₹{currentVal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                      <span className={`text-[11px] font-semibold ${pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {pnl >= 0 ? '+' : ''}₹{pnl.toFixed(2)} ({pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Candlestick Pattern Interactive Quiz Simulator (5 Columns) */}
        <div className="lg:col-span-5 bg-[#0b0f19] border border-[#1e2638] rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1e2638]">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
              <Sparkles className="w-4 h-4 mr-1.5 text-brand-purple" />
              Pattern Recognition Simulator
            </h2>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              Score: {quizScore}/{quizQuestions.length}
            </span>
          </div>

          <div className="bg-[#151b2c] p-4 rounded-xl border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-cyan uppercase font-mono">
                Pattern: {quizQuestions[currentQuestion].pattern}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Question {currentQuestion + 1} of {quizQuestions.length}
              </span>
            </div>

            <p className="text-xs text-slate-300 italic">
              "{quizQuestions[currentQuestion].description}"
            </p>

            <h3 className="text-xs font-bold text-white">
              {quizQuestions[currentQuestion].question}
            </h3>

            <div className="space-y-2 pt-2">
              {quizQuestions[currentQuestion].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerSubmit(idx)}
                  disabled={showResult}
                  className={`w-full text-left p-2.5 rounded-lg text-xs font-mono border transition-all ${
                    showResult
                      ? idx === quizQuestions[currentQuestion].correct
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                        : idx === selectedAnswer
                        ? 'bg-rose-950/60 border-rose-500 text-rose-200'
                        : 'bg-[#0b0f19] border-white/5 text-slate-400'
                      : 'bg-[#0b0f19] border-white/10 hover:border-brand-purple text-slate-200 hover:text-white'
                  }`}
                >
                  <span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span>
                  {opt}
                </button>
              ))}
            </div>

            {showResult && (
              <div className="pt-3 border-t border-white/10 space-y-2">
                <p className="text-xs text-slate-300 font-mono">
                  <strong>Insight:</strong> {quizQuestions[currentQuestion].explanation}
                </p>
                {currentQuestion < quizQuestions.length - 1 && (
                  <button
                    onClick={() => {
                      setCurrentQuestion((prev) => prev + 1);
                      setSelectedAnswer(null);
                      setShowResult(false);
                    }}
                    className="px-4 py-1.5 rounded bg-brand-purple text-white text-xs font-mono font-semibold"
                  >
                    Next Question →
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
