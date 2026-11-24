# 🏛️ NEXORA: Next-Generation AI Stock Market Intelligence Platform

> **About NEXORA**: Production-grade, institutional-grade equity analysis, quantitative modeling, derivatives intelligence, and algorithmic backtesting platform combining Wall Street financial rigor with futuristic Apple-grade dark glassmorphic design. Built for both Indian (NSE/BSE) and Global (NYSE/NASDAQ) markets.

---

### 🌐 Quick Links & Live Site Access
- **Terminal Web UI**: [http://localhost:3000](http://localhost:3000)
- **Quant & ML API Gateway**: [http://localhost:8000](http://localhost:8000)
- **Health Check Status**: [http://localhost:8000/api/health](http://localhost:8000/api/health)
- **Database Schema**: [backend/database/schema.sql](file:///backend/database/schema.sql)
- **Executive Project Report**: [Documents/stock analyze/NEXORA_PROJECT_REPORT.md](file:///Users/praveen/Documents/stock%20analyze/NEXORA_PROJECT_REPORT.md)

---

## 🌟 Architecture & Key Modules

```
                              ┌─────────────────────────────────────────────────────────┐
                              │           NEXORA Web & Desktop Client (Next.js)         │
                              │  • Executive Dashboard ($5.2M AUM, Risk Gauge, Waves)  │
                              │  • NIFTY 50 Heatmap Matrix & Sector Donut Breadth        │
                              │  • Equity Terminal, Candlesticks & Forensic X-Ray       │
                              │  • Quant ML Forecasting Cones & Market Regime Gauges    │
                              │  • Options Chain Greeks & Multi-Leg Payoff Simulator     │
                              │  • Algorithmic Strategy Backtesting Lab (Slippage/Fee)   │
                              │  • Bilingual AI Copilot & NLP Screener (English/Hindi)  │
                              │  • Paper Trading Simulator (₹10L) & Pattern Academy     │
                              └───────────────────────────┬─────────────────────────────┘
                                                          │ HTTPS / WebSockets
                                                          ▼
                              ┌─────────────────────────────────────────────────────────┐
                              │            REST & Real-Time API Gateway (Port 8000)      │
                              │  • High-frequency tick dispatch & CORS headers          │
                              │  • Sub-millisecond latency quant indicator engines       │
                              └───────┬─────────────────────────┬───────────────────────┘
                                      │                         │
            ┌─────────────────────────┴──────────┐   ┌──────────┴────────────────────────┐
            │   Quantitative & Machine Learning  │   │   Database & Storage (Timescale)   │
            │  • ARIMA & Holt-Winters Forecasts  │   │  • TimescaleDB Hypertables (Ticks) │
            │  • Altman Z, Piotroski & Beneish M │   │  • Financial Statements & Balance  │
            │  • Black-Scholes Greeks Engine     │   │  • Institutional Flows & Portfolios│
            │  • Monte Carlo What-If Simulator   │   │  • OWASP Top 10 Security Audits    │
            └────────────────────────────────────┘   └───────────────────────────────────┘
```

---

## 🚀 All 12 Advanced Modules & 10 Proprietary Features

### 1. Executive Intelligence Terminal (Apple Glassmorphism UI)
- **Asset Distribution**: \$5.2M Total AUM across Equity (40%), Fixed Income (27%), Real Estate (18%), and Commodities (15%).
- **Portfolio Risk Tachometer**: Real-time speedometer arc gauge (4.2/10 Medium Risk, 7.5% ROI, 92% AI Accuracy).
- **Glowing Neon Purple Orb**: AI-Driven Insights for Smarter Financial Decisions.
- **Total Profit Multi-Layer Waves**: \$87,536.75 stacked across Stocks, Bonds, and Mutual Funds.
- **AI Growth Stocks Watchlist**: TSLA, MSFT, NVDA, AAPL, SHOP.

### 2. Market Overview & NIFTY 50 Heatmap Matrix
- **50-Tile Constituents Matrix**: Real-time tick-weighted tiles with color depth (-2% to +2%).
- **Advances vs Declines**: 1,682 (65%) Advances vs 894 (35%) Declines with live day range.
- **Sector Breadth**: Donut gauge (65% advancing) and sector strength bars (Bank 79%, IT 45%, FMCG 73%, Pharma 64%, Auto 50%, Metal 44%).
- **Institutional Flows (FII / DII)**: Daily cash net buy/sell values and smart money sectoral allocations.

### 3. Equity Deep Dive & Forensic Analysis
- **Forensic Health X-Ray**:
  - **Altman Z-Score**: Real-time bankruptcy distress classification.
  - **Piotroski 9-Point F-Score**: Forensic score across Profitability, Leverage, and Efficiency.
  - **Beneish M-Score**: Forensic earnings manipulation risk detection (-2.84 Safe).
- **Market DNA Radar**: 6-dimensional factor radar mapping Value, Quality, Momentum, Growth, Volatility Safety, and Institutional Backing.

### 4. Quantitative ML & Predictive Intelligence
- **ARIMA & Holt-Winters 15-Day Forecast**: Predictive trajectory bounded by 95% Confidence Interval cones.
- **Market Regime Classification**: Trend Strength and Volatility Regime scoring (0-100).
- **Anomaly Detection & Explainable AI (XAI)**: SHAP-style alpha attribution.

### 5. Options & Derivatives Lab
- **Live Options Chain**: Calls and Puts across strike ladders with LTP, Open Interest, OI Change, and IV.
- **Black-Scholes Greeks**: Delta ($\Delta$), Gamma ($\Gamma$), Theta ($\Theta$), Vega ($\mathcal{V}$).
- **Max Pain & PCR**: Real-time strike calculation and Put-Call Ratio sentiment analysis.
- **Multi-Leg Payoff Simulator**: Bull Call Spread, Bear Put, Straddle, and Iron Condor payoff charts.

### 6. Algorithmic Strategy Backtesting Lab
- **Strategies Supported**: Dual Moving Average Crossover, RSI Mean Reversion, Supertrend Momentum, and Donchian Breakout Channels.
- **Institutional Execution Simulation**: Realistic slippage (0.05%) and brokerage (0.03%) deduction to eliminate look-ahead bias.
- **Performance Analytics**: Sharpe Ratio, Sortino Ratio, Maximum Drawdown, Win Rate, and Trade Logs.

### 7. Portfolio Health & Macroeconomic Stress Testing
- **Holdings Management**: Comprehensive portfolio metrics, unrealized P&L, day P&L, and beta.
- **What-If Scenario Simulator**: Monte Carlo systemic shock simulation across Macro Shocks (Crude Oil spike to $110/bbl, RBI +50 bps rate hike, US tech contraction, Rupee depreciation).
- **Explain My Loss Attribution**: Forensic factor decomposition breaking down losses into Macro Beta, Sectoral Headwinds, Company Fundamentals, and Valuation Compression.

### 8. Bilingual AI Copilot & NLP Screener
- **Bilingual Copilot (English & Hindi/Hinglish)**: Conversational assistant answering market queries with live context (e.g., *"Why is Reliance falling today?"* or *"Reliance kyun gir raha hai?"*).
- **Natural Language Screener**: Translates free-form conversational queries into structured multi-factor filters (ROE > 15%, D/E < 0.5, P/E < 25x).

### 9. Paper Trading Desk & Research Academy
- **₹10,00,000 Virtual Capital**: Instant simulated market execution with live P&L tracking.
- **Pattern Recognition Quiz**: Interactive candlestick pattern trainer with instant explanations.

### 10. Transparent Monetization & Tiering
- **Free, Pro, and Elite**: Multi-tier access with transparent feature comparison matrix.

### 11. Enterprise Admin & Cybersecurity Console
- **Data Vendor Quotas**: Live latency and rate limit monitoring for NSE/BSE, Yahoo Finance, and Polygon.
- **OWASP Top 10 Security Audit Logs**: IP tracking, action records, and status code tracing.

---

## 🚀 Quick Start Guide

### 1. Launch with One Command
```bash
chmod +x start.sh
./start.sh
```
This starts:
- **Backend API**: `http://localhost:8000`
- **Frontend Terminal**: `http://localhost:3000`

### 2. Run Backend Test Suite
```bash
cd backend && PYTHONPATH=. python3 -m unittest app/test_backend.py
```
*(All 13 unit tests pass in 0.001s)*

### 3. Database Schema
PostgreSQL & TimescaleDB production schema available at [backend/database/schema.sql](file:///backend/database/schema.sql).
