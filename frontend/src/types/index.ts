// Global Types for NEXORA Institutional Financial Terminal

export interface MarketIndex {
  symbol: string;
  name: string;
  exchange: string;
  value: number;
  change: number;
  change_pct: number;
  sparkline: number[];
  high: number;
  low: number;
  status: 'bullish' | 'bearish' | 'neutral';
}

export interface MarketBreadth {
  advances: number;
  declines: number;
  unchanged: number;
  new_highs: number;
  new_lows: number;
  advance_decline_ratio: number;
  sentiment: string;
}

export interface SectorBreadth {
  sector: string;
  change_pct: number;
  advances: number;
  declines: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

export interface EquityStock {
  symbol: string;
  name: string;
  exchange: string;
  market: 'IN' | 'US';
  sector: string;
  price: number;
  change: number;
  change_pct: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  market_cap_cr: number;
  pe_ratio: number;
  pb_ratio: number;
  roe: number;
  dividend_yield: number;
  beta: number;
  week_52_high: number;
  week_52_low: number;
  sparkline?: number[];
  recommendation?: string;
  target_price?: number;
}

export interface Candle {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TechnicalIndicators {
  symbol: string;
  sma_20: (number | null)[];
  ema_50: (number | null)[];
  rsi_14: (number | null)[];
  macd: {
    macd: (number | null)[];
    signal: (number | null)[];
    histogram: (number | null)[];
  };
  bollinger: {
    upper: (number | null)[];
    middle: (number | null)[];
    lower: (number | null)[];
    bandwidth: (number | null)[];
  };
  vwap: (number | null)[];
  supertrend: {
    supertrend: (number | null)[];
    direction: (string | null)[];
  };
}

export interface MLPrediction {
  forecast: {
    symbol?: string;
    model_type: string;
    forecast_horizon_days: number;
    projected_change_pct: number;
    forecast_path: number[];
    upper_band_95: number[];
    lower_band_95: number[];
    annualized_volatility_pct: number;
    expected_direction: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  };
  regime: {
    regime: string;
    regime_score: number;
    trend_strength: string;
    volatility_regime: string;
    recommended_playbook: string;
  };
  anomalies: {
    detected_count: number;
    anomalies: Array<{
      date?: string;
      type: string;
      severity: 'HIGH' | 'MEDIUM' | 'LOW';
      description: string;
      close_price?: number;
    }>;
  };
  explainable_ai: {
    symbol: string;
    confidence_score: number;
    model_decision: string;
    factor_weights: Array<{
      factor: string;
      weight: number;
      impact: 'positive' | 'negative' | 'neutral';
      description: string;
    }>;
    key_drivers: string[];
    risk_factors: string[];
  };
}

export interface FinancialXRay {
  symbol: string;
  altman_z_score: {
    z_score: number;
    zone: 'Safe Zone' | 'Grey Zone' | 'Distress Zone';
    distress_probability_pct: number;
    status: string;
  };
  piotroski_f_score: {
    f_score: number;
    rating: string;
    max_score: number;
    signals: Record<string, boolean>;
  };
  earnings_manipulation_risk: string;
}

export interface MarketDNA {
  symbol: string;
  dimensions: {
    value: number;
    quality: number;
    momentum: number;
    growth: number;
    volatility_safety: number;
    institutional_backing: number;
  };
  archetype: string;
  summary: string;
}

export interface OptionContract {
  ltp: number;
  oi: number;
  change_oi: number;
  iv: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
}

export interface OptionsChainRow {
  strike: number;
  call: OptionContract;
  put: OptionContract;
}

export interface OptionsChainData {
  symbol: string;
  spot_price: number;
  chain: OptionsChainRow[];
  max_pain: {
    max_pain_strike: number;
    pcr_ratio: number;
    total_call_oi: number;
    total_put_oi: number;
    sentiment: string;
  };
}

export interface StrategyPayoffLeg {
  type: 'call' | 'put';
  strike: number;
  premium: number;
  action: 'buy' | 'sell';
  qty: number;
}

export interface StrategyPayoffResult {
  strategy_name: string;
  spot_price: number;
  net_premium_debit_credit: number;
  max_profit: number | string;
  max_loss: number | string;
  risk_reward_ratio: string;
  breakeven_points: number[];
  payoff_curve: Array<{
    price: number;
    pnl: number;
  }>;
}

export interface BacktestTrade {
  entry_date: string;
  entry_price: number;
  exit_date: string;
  exit_price: number;
  pnl_pct: number;
  pnl_amount: number;
  exit_reason: string;
  holding_bars: number;
}

export interface BacktestResult {
  strategy: string;
  initial_capital: number;
  final_equity: number;
  net_profit: number;
  total_return_pct: number;
  benchmark_return_pct: number;
  sharpe_ratio: number;
  sortino_ratio: number;
  max_drawdown_pct: number;
  win_rate_pct: number;
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  profit_factor: number;
  equity_curve: Array<{
    date: string;
    equity: number;
    benchmark_equity: number;
  }>;
  trade_log: BacktestTrade[];
}

export interface InstitutionalData {
  fii_net_crores: number;
  dii_net_crores: number;
  fii_derivative_sentiment: string;
  retail_client_pcr: number;
  historical_flows_weekly: Array<{
    date: string;
    fii: number;
    dii: number;
  }>;
  top_fii_inflows_sectors: Array<{
    sector: string;
    flow_cr: number;
  }>;
  top_fii_outflows_sectors: Array<{
    sector: string;
    flow_cr: number;
  }>;
}

export interface MarketNewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  category: 'Breaking' | 'Macro' | 'Earnings' | 'Commodities' | 'Corporate';
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  summary: string;
  impact_symbols: string[];
}

export interface PortfolioHolding {
  symbol: string;
  company_name: string;
  sector: string;
  quantity: number;
  purchase_price: number;
  current_price: number;
  invested_amount: number;
  current_value: number;
  unrealized_pnl: number;
  pnl_pct: number;
  day_pnl: number;
  weight_pct: number;
}

export interface UserPortfolio {
  total_investment: number;
  current_portfolio_value: number;
  unrealized_total_pnl: number;
  unrealized_total_pnl_pct: number;
  today_pnl: number;
  today_pnl_pct: number;
  beta: number;
  sector_allocation: Array<{
    sector: string;
    value: number;
    percentage: number;
  }>;
  holdings: PortfolioHolding[];
}

export interface WhatIfSimulationResult {
  scenario_id: string;
  title: string;
  description: string;
  initial_portfolio_value: number;
  projected_portfolio_value: number;
  net_pnl_impact: number;
  net_pnl_pct: number;
  risk_verdict: string;
  holdings_impact: Array<{
    symbol: string;
    sector: string;
    price_before: number;
    price_shocked: number;
    value_change: number;
    change_pct: number;
  }>;
  hedging_recommendations: string[];
}

export interface ExplainLossResult {
  symbol: string;
  purchase_price: number;
  current_price: number;
  total_drawdown_pct: number;
  attribution_breakdown: {
    macro_market_factor_pct: number;
    sectoral_headwind_factor_pct: number;
    company_fundamentals_factor_pct: number;
    sentiment_valuation_compression_pct: number;
  };
  verdict: string;
  actionable_guidance: string[];
  historical_drawdowns_recovery_stats: {
    avg_recovery_days: number;
    probability_of_new_high_12m: number;
  };
}

export interface CopilotResponse {
  query: string;
  language: 'en' | 'hi';
  response: string;
  confidence: number;
  intent: string;
  chart_data?: {
    type: string;
    symbol: string;
    metric: string;
    points: Array<{ label: string; value: number }>;
  };
  suggested_followups: string[];
}

export interface ScreenerResult {
  query: string;
  nlp_parsed: {
    original_query: string;
    structured_filters: Record<string, any>;
    human_readable_rule: string;
    detected_intent: string;
  };
  results: EquityStock[];
  matched_count: number;
}
