"""
Unit and Integration Test Suite for NEXORA Backend
"""

import unittest
import math
from app.quant_engine import (
    calculate_sma,
    calculate_ema,
    calculate_rsi,
    calculate_macd,
    calculate_bollinger_bands,
    calculate_altman_z_score,
    calculate_piotroski_f_score
)
from app.ml_engine import (
    predict_time_series_arima,
    classify_market_regime,
    detect_anomalies,
    explainable_ai_insights
)
from app.options_engine import (
    calculate_black_scholes,
    calculate_max_pain,
    calculate_strategy_payoff
)
from app.backtest_engine import run_backtest
from app.copilot_engine import (
    translate_nlp_query_to_screener,
    run_what_if_simulator,
    get_market_dna,
    explain_my_loss,
    answer_financial_copilot
)
from app.market_data import get_historical_candles, EQUITIES_UNIVERSE

class TestNexoraBackend(unittest.TestCase):
    def setUp(self):
        self.sample_prices = [100.0 + i * 0.5 + math.sin(i) * 2.0 for i in range(50)]
        self.sample_volumes = [1000000 + int(math.sin(i) * 200000) for i in range(50)]

    def test_sma_ema(self):
        sma = calculate_sma(self.sample_prices, 10)
        self.assertEqual(len(sma), 50)
        self.assertIsNone(sma[0])
        self.assertIsNotNone(sma[9])

        ema = calculate_ema(self.sample_prices, 10)
        self.assertEqual(len(ema), 50)
        self.assertIsNotNone(ema[9])

    def test_rsi(self):
        rsi = calculate_rsi(self.sample_prices, 14)
        self.assertEqual(len(rsi), 50)
        valid_rsi = [x for x in rsi if x is not None]
        self.assertTrue(all(0 <= x <= 100 for x in valid_rsi))

    def test_macd(self):
        macd = calculate_macd(self.sample_prices)
        self.assertIn("macd", macd)
        self.assertIn("signal", macd)
        self.assertIn("histogram", macd)

    def test_bollinger_bands(self):
        bb = calculate_bollinger_bands(self.sample_prices, 20)
        self.assertIn("upper", bb)
        self.assertIn("middle", bb)
        self.assertIn("lower", bb)

    def test_altman_z_score(self):
        res = calculate_altman_z_score(
            working_capital=15000,
            total_assets=60000,
            retained_earnings=25000,
            ebit=8000,
            market_cap=100000,
            total_liabilities=30000,
            revenue=40000
        )
        self.assertIn("z_score", res)
        self.assertIn("status", res)
        self.assertGreater(res["z_score"], 2.0)

    def test_ml_arima_prediction(self):
        pred = predict_time_series_arima(self.sample_prices, 15)
        self.assertEqual(pred["forecast_horizon_days"], 15)
        self.assertEqual(len(pred["forecast_path"]), 15)
        self.assertEqual(len(pred["upper_band_95"]), 15)
        self.assertEqual(len(pred["lower_band_95"]), 15)

    def test_regime_classification(self):
        regime = classify_market_regime(self.sample_prices, self.sample_volumes)
        self.assertIn("regime", regime)
        self.assertIn("regime_score", regime)

    def test_options_black_scholes(self):
        bs = calculate_black_scholes(spot=24500, strike=24500, time_to_expiry_years=7/365, volatility=0.15)
        self.assertGreater(bs["call_price"], 0)
        self.assertGreater(bs["put_price"], 0)
        self.assertAlmostEqual(bs["delta_call"] - bs["delta_put"], 1.0, places=2)

    def test_max_pain(self):
        strikes = [24000, 24100, 24200, 24300, 24400, 24500]
        call_oi = [10000, 20000, 45000, 80000, 110000, 150000]
        put_oi =  [140000, 110000, 75000, 40000, 20000, 8000]
        mp = calculate_max_pain(strikes, call_oi, put_oi)
        self.assertIn("max_pain_strike", mp)
        self.assertIn("pcr_ratio", mp)

    def test_backtesting_engine(self):
        candles = get_historical_candles("RELIANCE", 60)
        dates = [c["date"] for c in candles]
        opens = [c["open"] for c in candles]
        highs = [c["high"] for c in candles]
        lows = [c["low"] for c in candles]
        closes = [c["close"] for c in candles]
        vols = [c["volume"] for c in candles]

        bt = run_backtest("sma_cross", dates, opens, highs, lows, closes, vols)
        self.assertIn("total_return_pct", bt)
        self.assertIn("sharpe_ratio", bt)
        self.assertIn("trade_log", bt)
        self.assertIn("equity_curve", bt)

    def test_copilot_hindi_english(self):
        # English query
        ans_en = answer_financial_copilot("Why is Reliance falling today?", "en")
        self.assertIn("RELIANCE", ans_en["response"])
        self.assertIn("chart_data", ans_en)

        # Hindi query
        ans_hi = answer_financial_copilot("Reliance kyun gir raha hai?", "hi")
        self.assertIn("रिलायंस", ans_hi["response"])

    def test_screener_nlp(self):
        query = "Find Indian companies with consistent profit growth, low debt and strong ROE"
        parsed = translate_nlp_query_to_screener(query)
        self.assertIn("min_roe", parsed["structured_filters"])
        self.assertIn("max_debt_to_equity", parsed["structured_filters"])

    def test_what_if_simulator(self):
        holdings = [
            {"symbol": "RELIANCE", "sector": "Energy & Conglomerate", "quantity": 100, "current_price": 2948.0},
            {"symbol": "TCS", "sector": "IT Services", "quantity": 50, "current_price": 3912.0}
        ]
        res = run_what_if_simulator("crude_oil_surge", holdings)
        self.assertIn("net_pnl_impact", res)
        self.assertIn("risk_verdict", res)

if __name__ == "__main__":
    unittest.main()
