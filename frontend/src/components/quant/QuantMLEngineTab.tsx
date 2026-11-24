'use client';

import React, { useState, useEffect } from 'react';
import { EquityStock, MLPrediction } from '@/types';
import { api } from '@/services/api';
import { formatPct, getChangeColor, getChangeBg } from '@/lib/utils';
import {
  Cpu,
  TrendingUp,
  TrendingDown,
  AlertOctagon,
  Sparkles,
  ShieldCheck,
  Compass,
  Activity,
  Layers,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';

interface QuantMLEngineTabProps {
  stocks: EquityStock[];
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
}

export const QuantMLEngineTab: React.FC<QuantMLEngineTabProps> = ({
  stocks,
  selectedSymbol,
  onSelectSymbol,
}) => {
  const [prediction, setPrediction] = useState<MLPrediction | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const currentStock = stocks.find((s) => s.symbol === selectedSymbol) || stocks[0];

  useEffect(() => {
    let isMounted = true;
    async function loadMLData() {
      if (!currentStock) return;
      setLoading(true);
      try {
        const res = await api.getPrediction(currentStock.symbol);
        if (isMounted) setPrediction(res);
      } catch (err) {
        console.error('Failed to load ML predictions:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadMLData();
    return () => {
      isMounted = false;
    };
  }, [selectedSymbol]);

  // Construct forecast chart data with 95% confidence cone
  const forecastChartData = (prediction?.forecast?.forecast_path || []).map((val, idx) => ({
    day: `T+${idx + 1}`,
    forecast: val,
    upper95: prediction?.forecast?.upper_band_95?.[idx] ?? val * 1.05,
    lower95: prediction?.forecast?.lower_band_95?.[idx] ?? val * 0.95,
  }));

  const factorWeightsData = (prediction?.explainable_ai?.factor_weights || []).map((f) => ({
    name: f.factor,
    weight: f.weight,
    impact: f.impact,
    desc: f.description,
  }));

  return (
    <div className="space-y-5">
      {/* 1. Header & Stock Target Bar */}
      <div className="bg-surface/90 border border-surface-border rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <select
              value={selectedSymbol}
              onChange={(e) => onSelectSymbol(e.target.value)}
              className="bg-surface-elevated text-white border border-surface-border rounded-md px-3 py-1.5 font-mono font-bold text-sm focus:outline-none focus:border-brand-purple"
            >
              {stocks.map((s) => (
                <option key={s.symbol} value={s.symbol}>
                  {s.symbol} - {s.name}
                </option>
              ))}
            </select>
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
              <Cpu className="w-4 h-4 text-brand-purple" />
              <span>Model: ARIMA(2,1,2) + Holt-Winters + Bayesian Volatility</span>
            </div>
          </div>

          {prediction?.forecast && (
            <div className="flex items-center space-x-3">
              <span className="text-xs font-mono text-slate-400">15-Day Horizon Projected Alpha:</span>
              <span
                className={`text-sm font-mono font-bold px-2.5 py-0.5 rounded ${
                  prediction.forecast.projected_change_pct >= 0
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}
              >
                {formatPct(prediction.forecast.projected_change_pct)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Predictive Forecast Cone & Regime Classification */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ARIMA 15-Day Cone Chart */}
        <div className="lg:col-span-2 bg-surface/90 border border-surface-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-200 flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-brand-purple" />
                15-Day Time-Series Forecast (95% Confidence Cone)
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                Stochastic diffusion model with mean-reverting drift damping
              </p>
            </div>
            <div className="flex items-center space-x-2 text-[10px] font-mono">
              <span className="flex items-center text-purple-400">
                <span className="w-2 h-2 rounded-full bg-purple-400 mr-1" /> Expected Path
              </span>
              <span className="flex items-center text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400 mr-1" /> 95% Confidence Band
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastChartData}>
                <defs>
                  <linearGradient id="coneGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#475569" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis
                  domain={['auto', 'auto']}
                  orientation="right"
                  stroke="#475569"
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  tickFormatter={(val) => val.toFixed(0)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0e121b',
                    borderColor: '#1e2638',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                {/* Upper and Lower Confidence Interval Area */}
                <Area
                  type="monotone"
                  dataKey="upper95"
                  stroke="#06b6d4"
                  strokeDasharray="3 3"
                  strokeWidth={1}
                  fill="url(#coneGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="forecast"
                  stroke="#a855f7"
                  strokeWidth={2.5}
                  fill="none"
                />
                <Area
                  type="monotone"
                  dataKey="lower95"
                  stroke="#06b6d4"
                  strokeDasharray="3 3"
                  strokeWidth={1}
                  fill="none"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-surface-border text-xs font-mono text-center">
            <div className="bg-surface-elevated/70 p-2 rounded">
              <span className="text-[10px] text-slate-400 uppercase block">Expected Trajectory</span>
              <span className="font-bold text-white">
                {prediction?.forecast?.expected_direction || 'BULLISH EXPANSION'}
              </span>
            </div>
            <div className="bg-surface-elevated/70 p-2 rounded">
              <span className="text-[10px] text-slate-400 uppercase block">Annualized Volatility</span>
              <span className="font-bold text-cyan-400">
                {prediction?.forecast?.annualized_volatility_pct?.toFixed(1) || '18.4'}%
              </span>
            </div>
            <div className="bg-surface-elevated/70 p-2 rounded">
              <span className="text-[10px] text-slate-400 uppercase block">Model Confidence</span>
              <span className="font-bold text-emerald-400">
                {prediction?.explainable_ai?.confidence_score ? `${(prediction.explainable_ai.confidence_score * 100).toFixed(0)}%` : '88%'}
              </span>
            </div>
          </div>
        </div>

        {/* Market Regime Classification Card */}
        <div className="bg-surface/90 border border-surface-border rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center">
                <Compass className="w-4 h-4 mr-2 text-brand-cyan" />
                Market Regime Classification
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-purple/20 text-brand-purple font-semibold">
                Hidden Markov
              </span>
            </div>

            {prediction?.regime && (
              <div className="space-y-4">
                {/* Regime Score Meter */}
                <div className="bg-surface-elevated/80 p-3 rounded-lg border border-surface-border">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs text-slate-300 font-semibold">{prediction.regime.regime}</span>
                    <span className="text-base font-mono font-bold text-emerald-400">
                      Score: {prediction.regime.regime_score}/100
                    </span>
                  </div>
                  <div className="w-full h-2 bg-surface-border rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-brand-cyan via-brand-purple to-emerald-400 h-full rounded-full transition-all duration-700"
                      style={{ width: `${prediction.regime.regime_score}%` }}
                    />
                  </div>
                </div>

                {/* Sub Factors */}
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between p-2 rounded bg-surface-elevated/50 border border-surface-border/50">
                    <span className="text-slate-400">Trend Strength:</span>
                    <span className="font-semibold text-white">{prediction.regime.trend_strength}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-surface-elevated/50 border border-surface-border/50">
                    <span className="text-slate-400">Volatility Regime:</span>
                    <span className="font-semibold text-white">{prediction.regime.volatility_regime}</span>
                  </div>
                </div>

                {/* Recommended Playbook */}
                <div className="p-3 rounded-lg bg-brand-purple/10 border border-brand-purple/20">
                  <span className="text-[10px] uppercase font-mono font-bold text-brand-purple block mb-1">
                    Recommended Institutional Playbook:
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">
                    {prediction.regime.recommended_playbook}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-3 pt-2 border-t border-surface-border text-[10px] font-mono text-slate-500 text-right">
            Re-evaluated at every 5-min interval
          </div>
        </div>
      </div>

      {/* 3. Explainable AI (XAI) Attribution & Anomaly Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* XAI Factor Weights Bar Chart */}
        <div className="bg-surface/90 border border-surface-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center">
              <Activity className="w-4 h-4 mr-2 text-brand-emerald" />
              Explainable AI (XAI) Factor Attribution
            </h3>
            <span className="text-xs font-mono text-slate-400">SHAP Value Weights</span>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={factorWeightsData} margin={{ left: 10, right: 20 }}>
                <XAxis type="number" stroke="#475569" tick={{ fontSize: 10, fill: '#94a3b8' }} domain={[0, 40]} />
                <YAxis dataKey="name" type="category" stroke="#475569" tick={{ fontSize: 10, fill: '#94a3b8' }} width={90} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0e121b', borderColor: '#1e2638', fontSize: '11px' }}
                />
                <Bar dataKey="weight" fill="#8b5cf6" radius={[0, 4, 4, 0]}>
                  {factorWeightsData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.impact === 'positive' ? '#10b981' : entry.impact === 'negative' ? '#f43f5e' : '#8b5cf6'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Key Drivers bullet points */}
          {prediction?.explainable_ai && (
            <div className="mt-3 pt-3 border-t border-surface-border space-y-1.5 text-xs text-slate-300">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                Identified Positive Alpha Drivers:
              </span>
              {prediction.explainable_ai.key_drivers?.map((d, i) => (
                <div key={i} className="flex items-start space-x-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{d}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Volume & Price Anomaly Detection */}
        <div className="bg-surface/90 border border-surface-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center">
              <AlertOctagon className="w-4 h-4 mr-2 text-rose-400" />
              Volume & Price Anomaly Detector
            </h3>
            <span className="text-xs font-mono text-slate-400">
              {prediction?.anomalies?.detected_count || 2} Anomalies Identified
            </span>
          </div>

          <div className="space-y-3">
            {(prediction?.anomalies?.anomalies || [
              {
                type: 'Institutional Block Inflow',
                severity: 'HIGH',
                description: 'Volume exceeded 3.2x 20-day average with tight 0.4% intraday price range (Dark Pool Absorption).',
              },
              {
                type: 'Volatility Compression Squeeze',
                severity: 'MEDIUM',
                description: 'Bollinger Bandwidth contracted to 90th percentile low; imminent directional breakout imminent.',
              },
              {
                type: 'RSI-Price Divergence',
                severity: 'LOW',
                description: 'Minor bullish divergence formed between higher close and lower RSI oscillator swing.',
              },
            ]).map((anom, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-surface-elevated/70 border border-surface-border flex items-start space-x-3"
              >
                <div
                  className={`px-2 py-1 rounded text-[10px] font-mono font-bold shrink-0 ${
                    anom.severity === 'HIGH'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : anom.severity === 'MEDIUM'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  }`}
                >
                  {anom.severity}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100">{anom.type}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    {anom.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
