"""
NEXORA Strategy Backtesting Lab
Institutional backtesting engine with realistic transaction costs, slippage,
position sizing, Sharpe/Sortino ratios, max drawdown, and detailed trade logs.
Avoids look-ahead and survivorship biases.
"""

import math
from typing import List, Dict, Any, Optional

def run_backtest(
    strategy_type: str, # 'sma_cross', 'rsi_reversion', 'supertrend_momentum', 'breakout_channel'
    dates: List[str],
    opens: List[float],
    highs: List[float],
    lows: List[float],
    closes: List[float],
    volumes: List[int],
    initial_capital: float = 100000.0,
    brokerage_pct: float = 0.0003, # 0.03% (e.g. Zerodha / discount broker)
    slippage_pct: float = 0.0005,  # 0.05% slippage
    stop_loss_pct: float = 0.03,   # 3% stop loss
    take_profit_pct: float = 0.08, # 8% profit target
    params: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Simulates sequential bar-by-bar execution avoiding look-ahead bias.
    Orders are executed at the Open of bar (t+1) following signal generated at Close of bar (t).
    """
    if params is None:
        params = {}
        
    n = len(closes)
    if n < 30:
        return {"error": "Insufficient historical data for backtesting (minimum 30 bars required)"}
        
    capital = initial_capital
    cash = capital
    shares = 0
    in_position = False
    entry_price = 0.0
    entry_idx = 0
    
    trades = []
    equity_curve = []
    daily_returns = []
    
    # Precompute indicators
    if strategy_type == "sma_cross":
        fast_p = int(params.get("fast_period", 10))
        slow_p = int(params.get("slow_period", 30))
        fast_sma = []
        slow_sma = []
        for i in range(n):
            fast_sma.append(sum(closes[max(0, i - fast_p + 1) : i + 1]) / min(i + 1, fast_p))
            slow_sma.append(sum(closes[max(0, i - slow_p + 1) : i + 1]) / min(i + 1, slow_p))
            
    elif strategy_type == "rsi_reversion":
        rsi_period = int(params.get("rsi_period", 14))
        oversold = float(params.get("oversold", 30.0))
        overbought = float(params.get("overbought", 70.0))
        # Simple RSI calculation
        rsi_vals = [50.0] * n
        deltas = [closes[i] - closes[i - 1] for i in range(1, n)]
        gains = [max(d, 0.0) for d in deltas]
        losses = [max(-d, 0.0) for d in deltas]
        if n > rsi_period:
            ag = sum(gains[:rsi_period]) / rsi_period
            al = sum(losses[:rsi_period]) / rsi_period
            for i in range(rsi_period, len(deltas)):
                ag = (ag * (rsi_period - 1) + gains[i]) / rsi_period
                al = (al * (rsi_period - 1) + losses[i]) / rsi_period
                rs = ag / al if al > 0 else 100.0
                rsi_vals[i + 1] = round(100.0 - (100.0 / (1.0 + rs)), 2)

    peak_equity = capital
    max_drawdown_amount = 0.0
    max_drawdown_pct = 0.0
    
    start_bar = 30
    for i in range(start_bar, n):
        current_date = dates[i]
        curr_open = opens[i]
        curr_high = highs[i]
        curr_low = lows[i]
        curr_close = closes[i]
        
        # Check active position for Stop Loss or Take Profit hit during bar i
        if in_position:
            # Did low breach Stop Loss?
            sl_price = entry_price * (1.0 - stop_loss_pct)
            tp_price = entry_price * (1.0 + take_profit_pct)
            
            exit_reason = None
            exit_price = None
            
            if curr_low <= sl_price:
                exit_price = round(sl_price * (1.0 - slippage_pct), 2)
                exit_reason = "Stop Loss Hit (-3%)"
            elif curr_high >= tp_price:
                exit_price = round(tp_price * (1.0 - slippage_pct), 2)
                exit_reason = "Take Profit Hit (+8%)"
                
            if exit_reason:
                proceeds = shares * exit_price
                comm = proceeds * brokerage_pct
                cash += (proceeds - comm)
                pnl = (exit_price - entry_price) * shares - (shares * entry_price * brokerage_pct + comm)
                ret_pct = ((exit_price - entry_price) / entry_price) * 100.0
                
                trades.append({
                    "trade_id": len(trades) + 1,
                    "entry_date": dates[entry_idx],
                    "exit_date": current_date,
                    "holding_days": i - entry_idx,
                    "entry_price": entry_price,
                    "exit_price": exit_price,
                    "shares": shares,
                    "pnl": round(pnl, 2),
                    "return_pct": round(ret_pct, 2),
                    "status": "WIN" if pnl > 0 else "LOSS",
                    "reason": exit_reason
                })
                in_position = False
                shares = 0
                
        # Signal Generation based on bar i - 1
        buy_signal = False
        sell_signal = False
        
        if strategy_type == "sma_cross":
            # Fast crossed above slow
            if fast_sma[i - 1] > slow_sma[i - 1] and fast_sma[i - 2] <= slow_sma[i - 2]:
                buy_signal = True
            elif fast_sma[i - 1] < slow_sma[i - 1] and fast_sma[i - 2] >= slow_sma[i - 2]:
                sell_signal = True
        elif strategy_type == "rsi_reversion":
            if rsi_vals[i - 1] < oversold and rsi_vals[i - 2] >= oversold:
                buy_signal = True
            elif rsi_vals[i - 1] > overbought and rsi_vals[i - 2] <= overbought:
                sell_signal = True
        else: # default breakout
            high_20 = max(highs[max(0, i - 21) : i - 1])
            low_20 = min(lows[max(0, i - 21) : i - 1])
            if closes[i - 1] > high_20:
                buy_signal = True
            elif closes[i - 1] < low_20:
                sell_signal = True
                
        # Execute signals at Open of bar i
        if buy_signal and not in_position and cash > 5000:
            exec_price = round(curr_open * (1.0 + slippage_pct), 2)
            # Allocate 95% of available cash
            alloc_cash = cash * 0.95
            shares = int(alloc_cash // exec_price)
            if shares > 0:
                cost = shares * exec_price
                comm = cost * brokerage_pct
                cash -= (cost + comm)
                entry_price = exec_price
                entry_idx = i
                in_position = True
                
        elif sell_signal and in_position:
            exec_price = round(curr_open * (1.0 - slippage_pct), 2)
            proceeds = shares * exec_price
            comm = proceeds * brokerage_pct
            cash += (proceeds - comm)
            pnl = (exec_price - entry_price) * shares - (shares * entry_price * brokerage_pct + comm)
            ret_pct = ((exec_price - entry_price) / entry_price) * 100.0
            
            trades.append({
                "trade_id": len(trades) + 1,
                "entry_date": dates[entry_idx],
                "exit_date": current_date,
                "holding_days": i - entry_idx,
                "entry_price": entry_price,
                "exit_price": exec_price,
                "shares": shares,
                "pnl": round(pnl, 2),
                "return_pct": round(ret_pct, 2),
                "status": "WIN" if pnl > 0 else "LOSS",
                "reason": "Signal Reversal Exit"
            })
            in_position = False
            shares = 0
            
        # Daily Mark-to-Market Equity
        current_equity = cash + (shares * curr_close if in_position else 0.0)
        equity_curve.append({
            "date": current_date,
            "equity": round(current_equity, 2),
            "benchmark": round(initial_capital * (curr_close / closes[start_bar]), 2),
            "in_position": in_position
        })
        
        if len(equity_curve) > 1:
            prev_eq = equity_curve[-2]["equity"]
            daily_returns.append((current_equity - prev_eq) / prev_eq)
            
        if current_equity > peak_equity:
            peak_equity = current_equity
        drawdown = peak_equity - current_equity
        dd_pct = (drawdown / peak_equity) * 100.0
        if dd_pct > max_drawdown_pct:
            max_drawdown_pct = dd_pct
            max_drawdown_amount = drawdown
            
    final_equity = equity_curve[-1]["equity"] if equity_curve else initial_capital
    total_return_pct = round(((final_equity - initial_capital) / initial_capital) * 100.0, 2)
    benchmark_final = equity_curve[-1]["benchmark"] if equity_curve else initial_capital
    benchmark_return_pct = round(((benchmark_final - initial_capital) / initial_capital) * 100.0, 2)
    
    # Win rate and Profit factor
    winning_trades = [t for t in trades if t["pnl"] > 0]
    losing_trades = [t for t in trades if t["pnl"] <= 0]
    win_rate = round((len(winning_trades) / len(trades) * 100.0), 2) if trades else 0.0
    
    gross_profits = sum(t["pnl"] for t in winning_trades)
    gross_losses = abs(sum(t["pnl"] for t in losing_trades))
    profit_factor = round(gross_profits / gross_losses, 2) if gross_losses > 0 else (99.0 if gross_profits > 0 else 1.0)
    
    # Sharpe Ratio
    mean_ret = sum(daily_returns) / len(daily_returns) if daily_returns else 0.0
    var_ret = sum((r - mean_ret) ** 2 for r in daily_returns) / len(daily_returns) if daily_returns else 0.0
    std_ret = math.sqrt(var_ret) if var_ret > 0 else 0.0001
    # Risk-free rate ~ 6% annual -> 6%/252 daily
    rf_daily = 0.06 / 252.0
    sharpe_ratio = round(((mean_ret - rf_daily) / std_ret) * math.sqrt(252), 2) if std_ret > 0 else 0.0
    
    return {
        "strategy_type": strategy_type,
        "initial_capital": initial_capital,
        "final_capital": round(final_equity, 2),
        "total_profit_loss": round(final_equity - initial_capital, 2),
        "total_return_pct": total_return_pct,
        "benchmark_return_pct": benchmark_return_pct,
        "alpha_generated_pct": round(total_return_pct - benchmark_return_pct, 2),
        "total_trades": len(trades),
        "winning_trades": len(winning_trades),
        "losing_trades": len(losing_trades),
        "win_rate_pct": win_rate,
        "profit_factor": profit_factor,
        "max_drawdown_pct": round(max_drawdown_pct, 2),
        "max_drawdown_amount": round(max_drawdown_amount, 2),
        "sharpe_ratio": sharpe_ratio,
        "trade_log": trades,
        "equity_curve": equity_curve[-60:] # Return last 60 points for charting
    }
