-- ==============================================================================
-- NEXORA INSTITUTIONAL FINANCIAL TERMINAL & QUANT ML SUITE
-- High-Performance Relational & Time-Series Database Schema (PostgreSQL + TimescaleDB)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "timescaledb";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. USERS, ACCESS CONTROL & SUBSCRIPTIONS
-- ==============================================================================
CREATE TYPE subscription_tier_enum AS ENUM ('FREE', 'PRO', 'ELITE', 'ENTERPRISE');
CREATE TYPE user_role_enum AS ENUM ('TRADER', 'ANALYST', 'QUANT', 'ADMIN', 'SUPERADMIN');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(150),
    role user_role_enum DEFAULT 'TRADER',
    tier subscription_tier_enum DEFAULT 'FREE',
    preferred_currency VARCHAR(10) DEFAULT 'INR',
    preferred_language VARCHAR(10) DEFAULT 'en', -- 'en' or 'hi'
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(64),
    api_rate_limit_rpm INT DEFAULT 60,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tier subscription_tier_enum NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    started_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    payment_provider VARCHAR(50), -- 'STRIPE', 'RAZORPAY'
    external_subscription_id VARCHAR(255),
    auto_renew BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. FINANCIAL INSTRUMENT UNIVERSE & ASSET METADATA
-- ==============================================================================
CREATE TYPE asset_class_enum AS ENUM ('EQUITY', 'INDEX', 'ETF', 'COMMODITY', 'FOREX', 'CRYPTO', 'DERIVATIVE');
CREATE TYPE market_exchange_enum AS ENUM ('NSE', 'BSE', 'NYSE', 'NASDAQ', 'MCX', 'FOREX', 'BINANCE');

CREATE TABLE instruments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    symbol VARCHAR(50) NOT NULL,
    ticker_isin VARCHAR(50),
    name VARCHAR(200) NOT NULL,
    exchange market_exchange_enum NOT NULL,
    asset_class asset_class_enum NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    sector VARCHAR(100),
    industry VARCHAR(100),
    country VARCHAR(10) DEFAULT 'IN',
    lot_size INT DEFAULT 1,
    tick_size NUMERIC(10, 4) DEFAULT 0.05,
    is_fno_eligible BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_instrument_symbol_exchange UNIQUE(symbol, exchange)
);

CREATE INDEX idx_instruments_symbol ON instruments(symbol);
CREATE INDEX idx_instruments_sector ON instruments(sector);
CREATE INDEX idx_instruments_exchange ON instruments(exchange);

-- ==============================================================================
-- 4. HIGH-FREQUENCY TIMESERIES: TICKS & OHLCV CANDLES (TimescaleDB Hypertables)
-- ==============================================================================
CREATE TABLE market_ticks (
    timestamp TIMESTAMPTZ NOT NULL,
    instrument_id UUID REFERENCES instruments(id),
    price NUMERIC(14, 4) NOT NULL,
    volume BIGINT NOT NULL,
    bid NUMERIC(14, 4),
    ask NUMERIC(14, 4),
    bid_qty INT,
    ask_qty INT,
    open_interest BIGINT
);

-- Convert to hypertable partitioned by 1-day chunks
SELECT create_hypertable('market_ticks', 'timestamp', chunk_time_interval => INTERVAL '1 day', if_not_exists => TRUE);
CREATE INDEX idx_ticks_inst_time ON market_ticks(instrument_id, timestamp DESC);

CREATE TABLE historical_candles (
    timestamp TIMESTAMPTZ NOT NULL,
    instrument_id UUID REFERENCES instruments(id),
    timeframe VARCHAR(10) NOT NULL, -- '1m', '5m', '15m', '1h', '1d', '1w'
    open NUMERIC(14, 4) NOT NULL,
    high NUMERIC(14, 4) NOT NULL,
    low NUMERIC(14, 4) NOT NULL,
    close NUMERIC(14, 4) NOT NULL,
    volume BIGINT NOT NULL,
    turnover NUMERIC(18, 2),
    open_interest BIGINT DEFAULT 0,
    vwap NUMERIC(14, 4),
    CONSTRAINT uq_candle_record UNIQUE (instrument_id, timeframe, timestamp)
);

SELECT create_hypertable('historical_candles', 'timestamp', chunk_time_interval => INTERVAL '1 month', if_not_exists => TRUE);
CREATE INDEX idx_candles_inst_timeframe ON historical_candles(instrument_id, timeframe, timestamp DESC);

-- ==============================================================================
-- 5. FORENSIC FINANCIALS & CORPORATE STATEMENTS
-- ==============================================================================
CREATE TABLE financial_statements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    instrument_id UUID REFERENCES instruments(id),
    fiscal_year INT NOT NULL,
    fiscal_quarter INT NOT NULL, -- 0 for Annual, 1..4 for Quarters
    filing_date DATE NOT NULL,
    
    -- Income Statement
    revenue NUMERIC(18, 2),
    operating_profit_ebit NUMERIC(18, 2),
    net_income NUMERIC(18, 2),
    diluted_eps NUMERIC(10, 4),
    gross_margin_pct NUMERIC(6, 2),
    operating_margin_pct NUMERIC(6, 2),
    net_margin_pct NUMERIC(6, 2),

    -- Balance Sheet
    total_assets NUMERIC(18, 2),
    total_liabilities NUMERIC(18, 2),
    total_equity NUMERIC(18, 2),
    working_capital NUMERIC(18, 2),
    retained_earnings NUMERIC(18, 2),
    long_term_debt NUMERIC(18, 2),
    cash_and_equivalents NUMERIC(18, 2),

    -- Cash Flows
    operating_cash_flow NUMERIC(18, 2),
    capital_expenditures NUMERIC(18, 2),
    free_cash_flow NUMERIC(18, 2),

    -- Forensic Health Models
    altman_z_score NUMERIC(8, 3),
    altman_zone VARCHAR(30), -- 'DISTRESS', 'GREY', 'SAFE'
    piotroski_f_score INT, -- 0 to 9
    beneish_m_score NUMERIC(8, 3),
    beneish_risk_status VARCHAR(30), -- 'MANIPULATOR', 'NON_MANIPULATOR'

    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_instrument_statement_period UNIQUE(instrument_id, fiscal_year, fiscal_quarter)
);

-- ==============================================================================
-- 6. INSTITUTIONAL SMART MONEY & SHAREHOLDING INTELLIGENCE
-- ==============================================================================
CREATE TABLE institutional_flows (
    date DATE PRIMARY KEY,
    fii_cash_buy NUMERIC(14, 2),
    fii_cash_sell NUMERIC(14, 2),
    fii_cash_net NUMERIC(14, 2),
    dii_cash_buy NUMERIC(14, 2),
    dii_cash_sell NUMERIC(14, 2),
    dii_cash_net NUMERIC(14, 2),
    fii_index_future_long_pct NUMERIC(6, 2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE insider_bulk_deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    instrument_id UUID REFERENCES instruments(id),
    deal_date DATE NOT NULL,
    deal_type VARCHAR(20), -- 'BULK', 'BLOCK', 'INSIDER'
    client_name VARCHAR(255) NOT NULL,
    action VARCHAR(10) NOT NULL, -- 'BUY', 'SELL'
    quantity BIGINT NOT NULL,
    traded_price NUMERIC(14, 4) NOT NULL,
    value_in_cr NUMERIC(14, 2),
    source_filing_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 7. PORTFOLIOS, HOLDINGS & WHAT-IF STRESS TESTING
-- ==============================================================================
CREATE TABLE user_portfolios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    benchmark_symbol VARCHAR(50) DEFAULT 'NIFTY 50',
    total_invested NUMERIC(16, 2) DEFAULT 0,
    current_value NUMERIC(16, 2) DEFAULT 0,
    portfolio_beta NUMERIC(6, 3) DEFAULT 1.0,
    risk_score NUMERIC(4, 1) DEFAULT 5.0, -- 0.0 to 10.0
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE portfolio_holdings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID REFERENCES user_portfolios(id) ON DELETE CASCADE,
    instrument_id UUID REFERENCES instruments(id),
    quantity NUMERIC(14, 4) NOT NULL,
    average_buy_price NUMERIC(14, 4) NOT NULL,
    current_market_price NUMERIC(14, 4) NOT NULL,
    unrealized_pnl NUMERIC(16, 2),
    unrealized_pnl_pct NUMERIC(8, 2),
    allocation_pct NUMERIC(6, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_portfolio_holding UNIQUE(portfolio_id, instrument_id)
);

-- ==============================================================================
-- 8. QUANTITATIVE STRATEGIES & BACKTESTING ENGINE
-- ==============================================================================
CREATE TABLE backtest_experiments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    strategy_name VARCHAR(150) NOT NULL,
    instrument_symbol VARCHAR(50) NOT NULL,
    timeframe VARCHAR(10) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    initial_capital NUMERIC(16, 2) NOT NULL,
    slippage_pct NUMERIC(6, 4) DEFAULT 0.0005, -- 0.05%
    commission_pct NUMERIC(6, 4) DEFAULT 0.0003, -- 0.03%
    parameters_json JSONB NOT NULL,
    
    -- Summary Analytics
    total_return_pct NUMERIC(8, 2),
    annualized_return_pct NUMERIC(8, 2),
    benchmark_return_pct NUMERIC(8, 2),
    sharpe_ratio NUMERIC(6, 3),
    sortino_ratio NUMERIC(6, 3),
    max_drawdown_pct NUMERIC(6, 2),
    win_rate_pct NUMERIC(6, 2),
    profit_factor NUMERIC(6, 3),
    total_trades INT,
    
    equity_curve_json JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 9. NLP SENTIMENT & AI RESEARCH AGENT ARCHIVE
-- ==============================================================================
CREATE TABLE news_sentiment_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    summary TEXT,
    source VARCHAR(100),
    url TEXT,
    published_at TIMESTAMPTZ NOT NULL,
    category VARCHAR(50), -- 'Macro', 'Earnings', 'Commodities', 'Policy'
    sentiment_score NUMERIC(5, 3), -- -1.000 (Bearish) to +1.000 (Bullish)
    sentiment_label VARCHAR(20), -- 'BULLISH', 'BEARISH', 'NEUTRAL'
    tagged_symbols TEXT[], -- e.g. ARRAY['RELIANCE', 'TCS']
    impact_level VARCHAR(20) -- 'HIGH', 'MEDIUM', 'LOW'
);

CREATE INDEX idx_news_published_at ON news_sentiment_items(published_at DESC);

-- ==============================================================================
-- 10. AUDIT LOGS & CYBERSECURITY TRACEABILITY
-- ==============================================================================
CREATE TABLE security_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    action VARCHAR(100) NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    status_code INT NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_created ON security_audit_logs(created_at DESC);
