"""
NEXORA Quantitative Finance Engine
Production-grade implementations of technical indicators, financial ratios,
and statistical metrics for Indian and Global equities.
"""

import math
from typing import List, Dict, Any, Tuple, Optional

def calculate_sma(prices: List[float], period: int = 14) -> List[Optional[float]]:
    """Simple Moving Average"""
    sma = []
    for i in range(len(prices)):
        if i + 1 < period:
            sma.append(None)
        else:
            window = prices[i + 1 - period : i + 1]
            sma.append(round(sum(window) / period, 2))
    return sma

def calculate_ema(prices: List[float], period: int = 14) -> List[Optional[float]]:
    """Exponential Moving Average"""
    ema = []
    multiplier = 2 / (period + 1)
    
    # Initial SMA
    if len(prices) < period:
        return [None] * len(prices)
        
    for i in range(len(prices)):
        if i + 1 < period:
            ema.append(None)
        elif i + 1 == period:
            initial_sma = sum(prices[:period]) / period
            ema.append(round(initial_sma, 2))
        else:
            prev_ema = ema[-1]
            current_ema = (prices[i] - prev_ema) * multiplier + prev_ema
            ema.append(round(current_ema, 2))
    return ema

def calculate_rsi(prices: List[float], period: int = 14) -> List[Optional[float]]:
    """Relative Strength Index (Wilder's RSI)"""
    if len(prices) <= period:
        return [None] * len(prices)
        
    rsi = [None] * period
    gains = []
    losses = []
    
    for i in range(1, len(prices)):
        delta = prices[i] - prices[i - 1]
        gains.append(max(delta, 0.0))
        losses.append(max(-delta, 0.0))
        
    avg_gain = sum(gains[:period]) / period
    avg_loss = sum(losses[:period]) / period
    
    if avg_loss == 0:
        rsi.append(100.0)
    else:
        rs = avg_gain / avg_loss
        rsi.append(round(100.0 - (100.0 / (1.0 + rs)), 2))
        
    for i in range(period, len(gains)):
        avg_gain = (avg_gain * (period - 1) + gains[i]) / period
        avg_loss = (avg_loss * (period - 1) + losses[i]) / period
        
        if avg_loss == 0:
            rsi.append(100.0)
        else:
            rs = avg_gain / avg_loss
            rsi.append(round(100.0 - (100.0 / (1.0 + rs)), 2))
            
    return rsi

def calculate_macd(prices: List[float], fast: int = 12, slow: int = 26, signal: int = 9) -> Dict[str, List[Optional[float]]]:
    """Moving Average Convergence Divergence (MACD)"""
    ema_fast = calculate_ema(prices, fast)
    ema_slow = calculate_ema(prices, slow)
    
    macd_line: List[Optional[float]] = []
    for f, s in zip(ema_fast, ema_slow):
        if f is not None and s is not None:
            macd_line.append(round(f - s, 2))
        else:
            macd_line.append(None)
            
    valid_macd = [x for x in macd_line if x is not None]
    valid_signal = calculate_ema(valid_macd, signal)
    
    # Pad signal line to match original length
    signal_line: List[Optional[float]] = [None] * (len(prices) - len(valid_signal)) + valid_signal
    
    histogram: List[Optional[float]] = []
    for m, s in zip(macd_line, signal_line):
        if m is not None and s is not None:
            histogram.append(round(m - s, 2))
        else:
            histogram.append(None)
            
    return {
        "macd": macd_line,
        "signal": signal_line,
        "histogram": histogram
    }

def calculate_bollinger_bands(prices: List[float], period: int = 20, num_std: float = 2.0) -> Dict[str, List[Optional[float]]]:
    """Bollinger Bands (Upper, Middle, Lower)"""
    middle = calculate_sma(prices, period)
    upper = []
    lower = []
    
    for i in range(len(prices)):
        if middle[i] is None:
            upper.append(None)
            lower.append(None)
        else:
            window = prices[i + 1 - period : i + 1]
            mean = middle[i]
            variance = sum((x - mean) ** 2 for x in window) / period
            std_dev = math.sqrt(variance)
            upper.append(round(mean + num_std * std_dev, 2))
            lower.append(round(mean - num_std * std_dev, 2))
            
    return {
        "upper": upper,
        "middle": middle,
        "lower": lower
    }

def calculate_vwap(highs: List[float], lows: List[float], closes: List[float], volumes: List[int]) -> List[float]:
    """Volume Weighted Average Price"""
    cumulative_pv = 0.0
    cumulative_vol = 0.0
    vwap = []
    
    for h, l, c, v in zip(highs, lows, closes, volumes):
        typical_price = (h + l + c) / 3.0
        cumulative_pv += typical_price * v
        cumulative_vol += v
        if cumulative_vol > 0:
            vwap.append(round(cumulative_pv / cumulative_vol, 2))
        else:
            vwap.append(round(typical_price, 2))
    return vwap

def calculate_supertrend(highs: List[float], lows: List[float], closes: List[float], period: int = 10, multiplier: float = 3.0) -> Dict[str, Any]:
    """Supertrend indicator with trend direction"""
    if len(closes) < period:
        return {"supertrend": closes, "direction": [1] * len(closes)}
        
    atr = []
    tr_list = []
    for i in range(len(closes)):
        if i == 0:
            tr_list.append(highs[i] - lows[i])
        else:
            tr = max(highs[i] - lows[i], abs(highs[i] - closes[i - 1]), abs(lows[i] - closes[i - 1]))
            tr_list.append(tr)
            
    # Calculate ATR
    current_atr = sum(tr_list[:period]) / period
    atr = [None] * (period - 1) + [current_atr]
    for i in range(period, len(tr_list)):
        current_atr = (current_atr * (period - 1) + tr_list[i]) / period
        atr.append(current_atr)
        
    supertrend = []
    direction = [] # 1 for bullish (green), -1 for bearish (red)
    
    upper_band = 0.0
    lower_band = 0.0
    in_uptrend = True
    
    for i in range(len(closes)):
        if atr[i] is None:
            supertrend.append(None)
            direction.append(1)
            continue
            
        hl2 = (highs[i] + lows[i]) / 2.0
        basic_upper = hl2 + multiplier * atr[i]
        basic_lower = hl2 - multiplier * atr[i]
        
        if i == period - 1:
            upper_band = basic_upper
            lower_band = basic_lower
            in_uptrend = closes[i] > hl2
        else:
            lower_band = basic_lower if (basic_lower > lower_band or closes[i - 1] < lower_band) else lower_band
            upper_band = basic_upper if (basic_upper < upper_band or closes[i - 1] > upper_band) else upper_band
            
            if in_uptrend and closes[i] < lower_band:
                in_uptrend = False
            elif not in_uptrend and closes[i] > upper_band:
                in_uptrend = True
                
        supertrend.append(round(lower_band if in_uptrend else upper_band, 2))
        direction.append(1 if in_uptrend else -1)
        
    return {
        "supertrend": supertrend,
        "direction": direction
    }

def calculate_fibonacci_levels(high: float, low: float) -> Dict[str, float]:
    """Key Fibonacci Retracement Levels"""
    diff = high - low
    return {
        "0.0% (High)": round(high, 2),
        "23.6%": round(high - 0.236 * diff, 2),
        "38.2%": round(high - 0.382 * diff, 2),
        "50.0% (Mid)": round(high - 0.500 * diff, 2),
        "61.8% (Golden)": round(high - 0.618 * diff, 2),
        "78.6%": round(high - 0.786 * diff, 2),
        "100.0% (Low)": round(low, 2),
        "161.8% (Extension)": round(high + 0.618 * diff, 2)
    }

def calculate_altman_z_score(
    working_capital: float,
    total_assets: float,
    retained_earnings: float,
    ebit: float,
    market_cap: float,
    total_liabilities: float,
    revenue: float
) -> Dict[str, Any]:
    """
    Altman Z-Score for Financial Distress Prediction
    Z = 1.2*X1 + 1.4*X2 + 3.3*X3 + 0.6*X4 + 0.999*X5
    Safe Zone: Z > 2.99
    Grey Zone: 1.81 <= Z <= 2.99
    Distress Zone: Z < 1.81
    """
    if total_assets <= 0 or total_liabilities <= 0:
        return {"z_score": 0.0, "status": "Unknown", "description": "Insufficient balance sheet data"}
        
    x1 = working_capital / total_assets
    x2 = retained_earnings / total_assets
    x3 = ebit / total_assets
    x4 = market_cap / total_liabilities
    x5 = revenue / total_assets
    
    z = 1.2 * x1 + 1.4 * x2 + 3.3 * x3 + 0.6 * x4 + 0.999 * x5
    z_score = round(z, 2)
    
    if z_score >= 2.99:
        status = "Safe"
        risk_level = "Low Risk of Insolvency"
    elif z_score >= 1.81:
        status = "Grey Zone"
        risk_level = "Moderate Financial Caution"
    else:
        status = "Distress"
        risk_level = "High Bankruptcy / Solvency Risk"
        
    return {
        "z_score": z_score,
        "status": status,
        "risk_level": risk_level,
        "components": {
            "x1_liquidity": round(x1, 3),
            "x2_retained_profits": round(x2, 3),
            "x3_operating_efficiency": round(x3, 3),
            "x4_market_leverage": round(x4, 3),
            "x5_asset_turnover": round(x5, 3)
        }
    }

def calculate_piotroski_f_score(
    net_income: float,
    operating_cash_flow: float,
    roa_current: float,
    roa_prior: float,
    cfo_greater_than_net_income: bool,
    long_term_debt_current: float,
    long_term_debt_prior: float,
    current_ratio_current: float,
    current_ratio_prior: float,
    shares_outstanding_current: float,
    shares_outstanding_prior: float,
    gross_margin_current: float,
    gross_margin_prior: float,
    asset_turnover_current: float,
    asset_turnover_prior: float
) -> Dict[str, Any]:
    """
    Piotroski F-Score (0 to 9) assessing company financial strength.
    Scores 8-9: Very Strong
    Scores 5-7: Moderate
    Scores 0-4: Weak
    """
    score = 0
    breakdown = {}
    
    # Profitability
    score += 1 if net_income > 0 else 0
    breakdown["positive_net_income"] = net_income > 0
    
    score += 1 if operating_cash_flow > 0 else 0
    breakdown["positive_operating_cf"] = operating_cash_flow > 0
    
    score += 1 if roa_current > roa_prior else 0
    breakdown["increasing_roa"] = roa_current > roa_prior
    
    score += 1 if cfo_greater_than_net_income else 0
    breakdown["cfo_accruals_quality"] = cfo_greater_than_net_income
    
    # Leverage & Liquidity
    score += 1 if long_term_debt_current <= long_term_debt_prior else 0
    breakdown["debt_reduction"] = long_term_debt_current <= long_term_debt_prior
    
    score += 1 if current_ratio_current > current_ratio_prior else 0
    breakdown["improved_liquidity"] = current_ratio_current > current_ratio_prior
    
    score += 1 if shares_outstanding_current <= shares_outstanding_prior else 0
    breakdown["no_equity_dilution"] = shares_outstanding_current <= shares_outstanding_prior
    
    # Operating Efficiency
    score += 1 if gross_margin_current > gross_margin_prior else 0
    breakdown["improved_gross_margin"] = gross_margin_current > gross_margin_prior
    
    score += 1 if asset_turnover_current > asset_turnover_prior else 0
    breakdown["improved_asset_turnover"] = asset_turnover_current > asset_turnover_prior
    
    rating = "Strong" if score >= 8 else ("Moderate" if score >= 5 else "Weak")
    return {
        "f_score": score,
        "max_score": 9,
        "rating": rating,
        "breakdown": breakdown
    }
