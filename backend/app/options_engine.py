"""
NEXORA Options & Derivatives Intelligence Engine
Implements Black-Scholes pricing, Option Greeks (Delta, Gamma, Theta, Vega, Rho),
Implied Volatility (Newton-Raphson), Max Pain, PCR, and Multi-Leg Strategy Payoffs.
"""

import math
from typing import List, Dict, Any, Tuple

def _norm_cdf(x: float) -> float:
    """Standard normal cumulative distribution function using error function"""
    return (1.0 + math.erf(x / math.sqrt(2.0))) / 2.0

def _norm_pdf(x: float) -> float:
    """Standard normal probability density function"""
    return math.exp(-0.5 * x * x) / math.sqrt(2.0 * math.pi)

def calculate_black_scholes(
    spot: float,
    strike: float,
    time_to_expiry_years: float,
    risk_free_rate: float = 0.065, # 6.5% standard Indian/Global risk-free rate
    volatility: float = 0.20 # 20% annualized IV
) -> Dict[str, Any]:
    """
    Computes Black-Scholes theoretical call and put prices with all first and second order Greeks.
    """
    if time_to_expiry_years <= 0 or spot <= 0 or strike <= 0 or volatility <= 0:
        return {
            "call_price": max(0.0, spot - strike),
            "put_price": max(0.0, strike - spot),
            "delta_call": 1.0 if spot > strike else 0.0,
            "delta_put": 0.0 if spot > strike else -1.0,
            "gamma": 0.0,
            "theta_call": 0.0,
            "theta_put": 0.0,
            "vega": 0.0,
            "rho_call": 0.0,
            "rho_put": 0.0
        }
        
    s = spot
    k = strike
    t = time_to_expiry_years
    r = risk_free_rate
    v = volatility
    
    d1 = (math.log(s / k) + (r + 0.5 * v * v) * t) / (v * math.sqrt(t))
    d2 = d1 - v * math.sqrt(t)
    
    call_price = s * _norm_cdf(d1) - k * math.exp(-r * t) * _norm_cdf(d2)
    put_price = k * math.exp(-r * t) * _norm_cdf(-d2) - s * _norm_cdf(-d1)
    
    # Greeks
    pdf_d1 = _norm_pdf(d1)
    
    delta_call = _norm_cdf(d1)
    delta_put = delta_call - 1.0
    
    gamma = pdf_d1 / (s * v * math.sqrt(t))
    
    # 1-day Theta (decay per day)
    theta_term1 = -(s * pdf_d1 * v) / (2.0 * math.sqrt(t))
    theta_call = (theta_term1 - r * k * math.exp(-r * t) * _norm_cdf(d2)) / 365.0
    theta_put = (theta_term1 + r * k * math.exp(-r * t) * _norm_cdf(-d2)) / 365.0
    
    # Vega (per 1% change in IV)
    vega = (s * math.sqrt(t) * pdf_d1) / 100.0
    
    # Rho (per 1% change in interest rate)
    rho_call = (k * t * math.exp(-r * t) * _norm_cdf(d2)) / 100.0
    rho_put = (-k * t * math.exp(-r * t) * _norm_cdf(-d2)) / 100.0
    
    return {
        "call_price": round(call_price, 2),
        "put_price": round(put_price, 2),
        "delta_call": round(delta_call, 4),
        "delta_put": round(delta_put, 4),
        "gamma": round(gamma, 6),
        "theta_call": round(theta_call, 2),
        "theta_put": round(theta_put, 2),
        "vega": round(vega, 2),
        "rho_call": round(rho_call, 4),
        "rho_put": round(rho_put, 4)
    }

def calculate_implied_volatility(
    market_price: float,
    spot: float,
    strike: float,
    time_to_expiry_years: float,
    option_type: str = "call",
    risk_free_rate: float = 0.065
) -> float:
    """
    Solves for Implied Volatility using Newton-Raphson root finding method.
    """
    if market_price <= 0 or time_to_expiry_years <= 0:
        return 0.15 # fallback 15%
        
    v = 0.25 # Initial estimate 25%
    for _ in range(50):
        bs = calculate_black_scholes(spot, strike, time_to_expiry_years, risk_free_rate, v)
        price = bs["call_price"] if option_type.lower() == "call" else bs["put_price"]
        diff = price - market_price
        
        if abs(diff) < 0.005:
            return round(v * 100, 2)
            
        vega = bs["vega"] * 100.0 # scale back from 1% unit
        if abs(vega) < 1e-6:
            break
            
        v = v - (diff / vega)
        if v <= 0.01:
            v = 0.01
        elif v > 3.0:
            v = 3.0
            
    return round(v * 100, 2)

def calculate_max_pain(strikes: List[float], call_oi: List[int], put_oi: List[int]) -> Dict[str, Any]:
    """
    Max Pain Theory: The strike price where option buyers experience the maximum financial loss
    and option writers/sellers experience the least payout at expiry.
    """
    if not strikes or len(strikes) != len(call_oi) or len(strikes) != len(put_oi):
        return {"max_pain_strike": 0.0, "total_pain": {}}
        
    min_loss = float("inf")
    max_pain_strike = strikes[0]
    pain_map = {}
    
    for expiry_test_strike in strikes:
        total_loss = 0.0
        for s, c_oi, p_oi in zip(strikes, call_oi, put_oi):
            # Call buyer payoff if expiry is at expiry_test_strike
            call_payoff = max(0.0, expiry_test_strike - s) * c_oi
            # Put buyer payoff if expiry is at expiry_test_strike
            put_payoff = max(0.0, s - expiry_test_strike) * p_oi
            total_loss += (call_payoff + put_payoff)
            
        pain_map[expiry_test_strike] = round(total_loss, 2)
        if total_loss < min_loss:
            min_loss = total_loss
            max_pain_strike = expiry_test_strike
            
    total_call_oi = sum(call_oi)
    total_put_oi = sum(put_oi)
    pcr = round(total_put_oi / total_call_oi, 2) if total_call_oi > 0 else 1.0
    
    sentiment = "Bullish (Oversold/Put heavy)" if pcr > 1.25 else ("Bearish (Call heavy/Resistance)" if pcr < 0.75 else "Neutral")
    
    return {
        "max_pain_strike": max_pain_strike,
        "total_call_oi": total_call_oi,
        "total_put_oi": total_put_oi,
        "pcr_ratio": pcr,
        "pcr_sentiment": sentiment,
        "pain_distribution": [{"strike": k, "loss_crores": round(v / 10000000, 2)} for k, v in pain_map.items()]
    }

def calculate_strategy_payoff(
    strategy_name: str,
    spot_price: float,
    legs: List[Dict[str, Any]], # [{type: 'call'|'put'|'stock', strike: float, premium: float, action: 'buy'|'sell', qty: int}]
    price_range_pct: float = 0.15 # +/- 15% around spot
) -> Dict[str, Any]:
    """
    Calculates multi-leg options strategy profit/loss across a price curve.
    """
    min_price = spot_price * (1.0 - price_range_pct)
    max_price = spot_price * (1.0 + price_range_pct)
    steps = 31
    step_size = (max_price - min_price) / (steps - 1)
    
    curve = []
    max_profit = float("-inf")
    max_loss = float("inf")
    breakevens = []
    
    prev_pl = None
    for i in range(steps):
        s_price = round(min_price + i * step_size, 2)
        total_pl = 0.0
        
        for leg in legs:
            action_mult = 1 if leg["action"].lower() == "buy" else -1
            qty = leg.get("qty", 1)
            leg_type = leg["type"].lower()
            premium = leg.get("premium", 0.0)
            strike = leg.get("strike", spot_price)
            
            if leg_type == "call":
                intrinsic = max(0.0, s_price - strike)
                pl = (intrinsic - premium) * action_mult * qty
            elif leg_type == "put":
                intrinsic = max(0.0, strike - s_price)
                pl = (intrinsic - premium) * action_mult * qty
            else: # stock
                pl = (s_price - strike) * action_mult * qty
                
            total_pl += pl
            
        total_pl = round(total_pl, 2)
        curve.append({"underlying_price": s_price, "pnl": total_pl})
        
        if total_pl > max_profit:
            max_profit = total_pl
        if total_pl < max_loss:
            max_loss = total_pl
            
        if prev_pl is not None and ((prev_pl < 0 and total_pl >= 0) or (prev_pl > 0 and total_pl <= 0)):
            breakevens.append(s_price)
        prev_pl = total_pl
        
    return {
        "strategy": strategy_name,
        "spot_price": spot_price,
        "max_profit": "Unlimited" if max_profit > 100000 else max_profit,
        "max_loss": "Unlimited" if max_loss < -100000 else max_loss,
        "breakeven_points": breakevens,
        "payoff_curve": curve
    }
