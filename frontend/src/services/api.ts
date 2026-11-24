import {
  MarketIndex,
  MarketBreadth,
  SectorBreadth,
  EquityStock,
  Candle,
  TechnicalIndicators,
  MLPrediction,
  FinancialXRay,
  MarketDNA,
  OptionsChainData,
  StrategyPayoffResult,
  StrategyPayoffLeg,
  BacktestResult,
  InstitutionalData,
  MarketNewsItem,
  UserPortfolio,
  WhatIfSimulationResult,
  ExplainLossResult,
  CopilotResponse,
  ScreenerResult
} from '@/types';

const API_BASE = '/backend-api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`API call failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export const api = {
  // Indices
  getIndices: async (): Promise<MarketIndex[]> => {
    return fetchJson<MarketIndex[]>(`${API_BASE}/indices`);
  },

  // Breadth
  getBreadth: async (): Promise<{ market_breadth: MarketBreadth; sector_breadth: SectorBreadth[] }> => {
    return fetchJson<{ market_breadth: MarketBreadth; sector_breadth: SectorBreadth[] }>(`${API_BASE}/breadth`);
  },

  // Stocks Universe
  getStocks: async (market: 'ALL' | 'IN' | 'US' = 'ALL'): Promise<{
    stocks: EquityStock[];
    top_gainers: EquityStock[];
    top_losers: EquityStock[];
    total_count: number;
  }> => {
    return fetchJson(`${API_BASE}/stocks?market=${market}`);
  },

  // Single Stock Details
  getStock: async (symbol: string): Promise<EquityStock> => {
    return fetchJson<EquityStock>(`${API_BASE}/stocks/${symbol}`);
  },

  // Historical Candles
  getCandles: async (symbol: string, days: number = 60): Promise<{ symbol: string; candles: Candle[] }> => {
    return fetchJson<{ symbol: string; candles: Candle[] }>(`${API_BASE}/stocks/${symbol}/history?days=${days}`);
  },

  // Technical Indicators
  getIndicators: async (symbol: string): Promise<TechnicalIndicators> => {
    return fetchJson<TechnicalIndicators>(`${API_BASE}/stocks/${symbol}/indicators`);
  },

  // Machine Learning & Regime Prediction
  getPrediction: async (symbol: string): Promise<MLPrediction> => {
    return fetchJson<MLPrediction>(`${API_BASE}/stocks/${symbol}/predict`);
  },

  // Financial X-Ray
  getXRay: async (symbol: string): Promise<FinancialXRay> => {
    return fetchJson<FinancialXRay>(`${API_BASE}/stocks/${symbol}/xray`);
  },

  // Market DNA
  getDNA: async (symbol: string): Promise<MarketDNA> => {
    return fetchJson<MarketDNA>(`${API_BASE}/stocks/${symbol}/dna`);
  },

  // Options Chain
  getOptionsChain: async (symbol: string = 'NIFTY 50'): Promise<OptionsChainData> => {
    return fetchJson<OptionsChainData>(`${API_BASE}/options?symbol=${encodeURIComponent(symbol)}`);
  },

  // Options Payoff
  calculatePayoff: async (
    strategy_name: string,
    spot_price: number,
    legs: StrategyPayoffLeg[]
  ): Promise<StrategyPayoffResult> => {
    return fetchJson<StrategyPayoffResult>(`${API_BASE}/options/payoff`, {
      method: 'POST',
      body: JSON.stringify({ strategy_name, spot_price, legs }),
    });
  },

  // Backtest
  runBacktest: async (params: {
    strategy_type: string;
    symbol: string;
    initial_capital?: number;
    stop_loss_pct?: number;
    take_profit_pct?: number;
    params?: Record<string, any>;
  }): Promise<BacktestResult> => {
    return fetchJson<BacktestResult>(`${API_BASE}/backtest`, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  // Institutional Intelligence
  getInstitutional: async (): Promise<InstitutionalData> => {
    return fetchJson<InstitutionalData>(`${API_BASE}/institutional`);
  },

  // Market News
  getNews: async (): Promise<MarketNewsItem[]> => {
    return fetchJson<MarketNewsItem[]>(`${API_BASE}/news`);
  },

  // User Portfolio
  getPortfolio: async (): Promise<UserPortfolio> => {
    return fetchJson<UserPortfolio>(`${API_BASE}/portfolio`);
  },

  // What-If Simulation
  runWhatIf: async (scenario_id: string, holdings?: any[]): Promise<WhatIfSimulationResult> => {
    return fetchJson<WhatIfSimulationResult>(`${API_BASE}/portfolio/whatif`, {
      method: 'POST',
      body: JSON.stringify({ scenario_id, holdings }),
    });
  },

  // Explain My Loss
  explainLoss: async (symbol: string, purchase_price: number, current_price: number): Promise<ExplainLossResult> => {
    return fetchJson<ExplainLossResult>(`${API_BASE}/portfolio/explain-loss`, {
      method: 'POST',
      body: JSON.stringify({ symbol, purchase_price, current_price }),
    });
  },

  // AI Copilot
  askCopilot: async (query: string, language: 'en' | 'hi' = 'en'): Promise<CopilotResponse> => {
    return fetchJson<CopilotResponse>(`${API_BASE}/copilot/ask`, {
      method: 'POST',
      body: JSON.stringify({ query, language }),
    });
  },

  // Natural Language Screener
  runScreener: async (query: string, filters?: Record<string, any>): Promise<ScreenerResult> => {
    return fetchJson<ScreenerResult>(`${API_BASE}/screener`, {
      method: 'POST',
      body: JSON.stringify({ query, filters }),
    });
  },
};
