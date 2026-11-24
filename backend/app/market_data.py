"""
NEXORA Market Data Hub
Comprehensive, institutional-grade dataset covering Indian (NSE/BSE), US (NYSE/NASDAQ),
Global Indices, Sector Breadth, Institutional FII/DII activity, and Financial Statements.
Matches Equilytics and Bloomberg Terminal standards.
"""

from typing import List, Dict, Any, Optional
import datetime
import math

# 1. Broad Market Indices
MARKET_INDICES = [
    {
        "symbol": "NIFTY 50",
        "name": "Nifty 50 Index",
        "exchange": "NSE",
        "value": 24752.15,
        "change": 180.45,
        "change_pct": 0.73,
        "sparkline": [24580, 24610, 24650, 24630, 24710, 24752.15],
        "high": 24785.40,
        "low": 24560.10,
        "status": "bullish"
    },
    {
        "symbol": "SENSEX",
        "name": "BSE Sensex 30",
        "exchange": "BSE",
        "value": 81193.72,
        "change": 620.18,
        "change_pct": 0.77,
        "sparkline": [80600, 80750, 80920, 80840, 81050, 81193.72],
        "high": 81280.90,
        "low": 80540.20,
        "status": "bullish"
    },
    {
        "symbol": "NIFTY BANK",
        "name": "Nifty Bank Index",
        "exchange": "NSE",
        "value": 55168.90,
        "change": 512.35,
        "change_pct": 0.94,
        "sparkline": [54700, 54820, 54950, 55010, 55120, 55168.90],
        "high": 55240.00,
        "low": 54650.00,
        "status": "bullish"
    },
    {
        "symbol": "NIFTY IT",
        "name": "Nifty IT Sector",
        "exchange": "NSE",
        "value": 37865.40,
        "change": -120.60,
        "change_pct": -0.32,
        "sparkline": [38100, 38020, 37950, 37890, 37920, 37865.40],
        "high": 38150.00,
        "low": 37810.00,
        "status": "bearish"
    },
    {
        "symbol": "NIFTY MIDCAP 100",
        "name": "Nifty Midcap 100",
        "exchange": "NSE",
        "value": 57482.30,
        "change": 210.85,
        "change_pct": 0.37,
        "sparkline": [57200, 57310, 57390, 57420, 57450, 57482.30],
        "high": 57550.00,
        "low": 57180.00,
        "status": "bullish"
    },
    {
        "symbol": "NIFTY SMALLCAP 100",
        "name": "Nifty Smallcap 100",
        "exchange": "NSE",
        "value": 18765.40,
        "change": 65.30,
        "change_pct": 0.35,
        "sparkline": [18680, 18710, 18730, 18740, 18750, 18765.40],
        "high": 18810.00,
        "low": 18650.00,
        "status": "bullish"
    },
    {
        "symbol": "S&P 500",
        "name": "S&P 500 Index",
        "exchange": "NYSE",
        "value": 5980.20,
        "change": 32.80,
        "change_pct": 0.55,
        "sparkline": [5930, 5945, 5960, 5970, 5980.20],
        "high": 5995.00,
        "low": 5925.00,
        "status": "bullish"
    },
    {
        "symbol": "NASDAQ",
        "name": "Nasdaq 100",
        "exchange": "NASDAQ",
        "value": 18920.10,
        "change": 154.20,
        "change_pct": 0.82,
        "sparkline": [18720, 18800, 18850, 18900, 18920.10],
        "high": 18970.00,
        "low": 18700.00,
        "status": "bullish"
    }
]

# 2. Market Breadth Statistics
MARKET_BREADTH = {
    "advances": 1682,
    "advances_pct": 65.0,
    "declines": 894,
    "declines_pct": 35.0,
    "unchanged": 120,
    "total_traded": 2696,
    "adv_dec_ratio": 1.88,
    "sentiment": "Strong Positive Breadth"
}

# 3. Sector Breadth Analysis
SECTOR_BREADTH = [
    {"sector": "Nifty Bank", "advancing": 11, "declining": 3, "neutral": 1, "pct_green": 79.0, "status": "Strongly Bullish"},
    {"sector": "Nifty FMCG", "advancing": 8, "declining": 2, "neutral": 2, "pct_green": 73.0, "status": "Bullish"},
    {"sector": "Nifty Pharma", "advancing": 7, "declining": 3, "neutral": 1, "pct_green": 64.0, "status": "Bullish"},
    {"sector": "Nifty Auto", "advancing": 5, "declining": 4, "neutral": 2, "pct_green": 50.0, "status": "Neutral"},
    {"sector": "Nifty IT", "advancing": 5, "declining": 6, "neutral": 0, "pct_green": 45.0, "status": "Mild Profit Booking"},
    {"sector": "Nifty Metal", "advancing": 4, "declining": 5, "neutral": 1, "pct_green": 44.0, "status": "Bearish Drag"}
]

# 4. Equities Universe (Indian & US Equities)
EQUITIES_UNIVERSE = [
    {
        "symbol": "RELIANCE",
        "name": "Reliance Industries Ltd",
        "exchange": "NSE",
        "market": "IN",
        "sector": "Energy & Conglomerate",
        "price": 2948.40,
        "change": 46.80,
        "change_pct": 1.62,
        "market_cap_cr": 1994500,
        "pe_ratio": 26.4,
        "pb_ratio": 2.1,
        "roe": 13.8,
        "roce": 12.4,
        "debt_to_equity": 0.42,
        "dividend_yield": 0.38,
        "volume": 6842000,
        "avg_volume": 5200000,
        "sparkline": [2901, 2915, 2930, 2925, 2940, 2948.40],
        "high_52w": 3217.90,
        "low_52w": 2220.30
    },
    {
        "symbol": "HDFCBANK",
        "name": "HDFC Bank Ltd",
        "exchange": "NSE",
        "market": "IN",
        "sector": "Banking & Financial Services",
        "price": 1678.45,
        "change": 21.20,
        "change_pct": 1.28,
        "market_cap_cr": 1276000,
        "pe_ratio": 18.2,
        "pb_ratio": 2.6,
        "roe": 16.4,
        "roce": 15.1,
        "debt_to_equity": 0.95,
        "dividend_yield": 1.15,
        "volume": 14200000,
        "avg_volume": 12000000,
        "sparkline": [1655, 1660, 1668, 1672, 1675, 1678.45],
        "high_52w": 1794.00,
        "low_52w": 1363.55
    },
    {
        "symbol": "ICICIBANK",
        "name": "ICICI Bank Ltd",
        "exchange": "NSE",
        "market": "IN",
        "sector": "Banking & Financial Services",
        "price": 1236.50,
        "change": 17.60,
        "change_pct": 1.45,
        "market_cap_cr": 872000,
        "pe_ratio": 17.5,
        "pb_ratio": 2.9,
        "roe": 18.5,
        "roce": 17.2,
        "debt_to_equity": 0.88,
        "dividend_yield": 0.80,
        "volume": 11500000,
        "avg_volume": 9800000,
        "sparkline": [1218, 1222, 1229, 1231, 1234, 1236.50],
        "high_52w": 1334.80,
        "low_52w": 915.00
    },
    {
        "symbol": "TCS",
        "name": "Tata Consultancy Services Ltd",
        "exchange": "NSE",
        "market": "IN",
        "sector": "Information Technology",
        "price": 3912.10,
        "change": -17.70,
        "change_pct": -0.45,
        "market_cap_cr": 1415000,
        "pe_ratio": 28.5,
        "pb_ratio": 14.2,
        "roe": 48.2,
        "roce": 58.6,
        "debt_to_equity": 0.05,
        "dividend_yield": 1.85,
        "volume": 2100000,
        "avg_volume": 2400000,
        "sparkline": [3935, 3928, 3920, 3915, 3918, 3912.10],
        "high_52w": 4585.00,
        "low_52w": 3313.00
    },
    {
        "symbol": "INFY",
        "name": "Infosys Ltd",
        "exchange": "NSE",
        "market": "IN",
        "sector": "Information Technology",
        "price": 1592.80,
        "change": -5.10,
        "change_pct": -0.32,
        "market_cap_cr": 661000,
        "pe_ratio": 24.8,
        "pb_ratio": 8.1,
        "roe": 31.4,
        "roce": 39.2,
        "debt_to_equity": 0.08,
        "dividend_yield": 2.45,
        "volume": 4900000,
        "avg_volume": 5800000,
        "sparkline": [1600, 1598, 1594, 1590, 1595, 1592.80],
        "high_52w": 1991.45,
        "low_52w": 1358.35
    },
    {
        "symbol": "BAJFINANCE",
        "name": "Bajaj Finance Ltd",
        "exchange": "NSE",
        "market": "IN",
        "sector": "NBFC & Consumer Finance",
        "price": 7462.30,
        "change": 118.90,
        "change_pct": 1.63,
        "market_cap_cr": 461000,
        "pe_ratio": 28.2,
        "pb_ratio": 5.4,
        "roe": 22.8,
        "roce": 21.5,
        "debt_to_equity": 3.8,
        "dividend_yield": 0.48,
        "volume": 1200000,
        "avg_volume": 950000,
        "sparkline": [7340, 7370, 7410, 7440, 7450, 7462.30],
        "high_52w": 8190.00,
        "low_52w": 6375.00
    },
    {
        "symbol": "HINDUNILVR",
        "name": "Hindustan Unilever Ltd",
        "exchange": "NSE",
        "market": "IN",
        "sector": "FMCG",
        "price": 2485.60,
        "change": 21.60,
        "change_pct": 0.88,
        "market_cap_cr": 584000,
        "pe_ratio": 54.2,
        "pb_ratio": 11.6,
        "roe": 20.4,
        "roce": 27.8,
        "debt_to_equity": 0.02,
        "dividend_yield": 1.68,
        "volume": 1600000,
        "avg_volume": 1400000,
        "sparkline": [2460, 2465, 2472, 2478, 2480, 2485.60],
        "high_52w": 3035.00,
        "low_52w": 2172.00
    },
    {
        "symbol": "ITC",
        "name": "ITC Ltd",
        "exchange": "NSE",
        "market": "IN",
        "sector": "FMCG & Diversified",
        "price": 472.15,
        "change": 1.65,
        "change_pct": 0.35,
        "market_cap_cr": 590000,
        "pe_ratio": 27.8,
        "pb_ratio": 8.4,
        "roe": 29.5,
        "roce": 38.4,
        "debt_to_equity": 0.01,
        "dividend_yield": 3.20,
        "volume": 8400000,
        "avg_volume": 7900000,
        "sparkline": [470, 471, 471.5, 472, 471.8, 472.15],
        "high_52w": 528.50,
        "low_52w": 399.30
    },
    {
        "symbol": "SBIN",
        "name": "State Bank of India",
        "exchange": "NSE",
        "market": "IN",
        "sector": "Public Sector Banking",
        "price": 824.50,
        "change": 8.55,
        "change_pct": 1.05,
        "market_cap_cr": 735000,
        "pe_ratio": 10.4,
        "pb_ratio": 1.6,
        "roe": 17.2,
        "roce": 16.0,
        "debt_to_equity": 1.2,
        "dividend_yield": 1.65,
        "volume": 14800000,
        "avg_volume": 13200000,
        "sparkline": [815, 818, 821, 822, 823, 824.50],
        "high_52w": 912.00,
        "low_52w": 555.25
    },
    {
        "symbol": "BHARTIARTL",
        "name": "Bharti Airtel Ltd",
        "exchange": "NSE",
        "market": "IN",
        "sector": "Telecommunications",
        "price": 1610.20,
        "change": 11.80,
        "change_pct": 0.74,
        "market_cap_cr": 925000,
        "pe_ratio": 58.4,
        "pb_ratio": 8.2,
        "roe": 14.5,
        "roce": 16.2,
        "debt_to_equity": 1.85,
        "dividend_yield": 0.52,
        "volume": 4200000,
        "avg_volume": 3800000,
        "sparkline": [1595, 1600, 1604, 1608, 1609, 1610.20],
        "high_52w": 1779.00,
        "low_52w": 980.00
    },
    {
        "symbol": "KOTAKBANK",
        "name": "Kotak Mahindra Bank Ltd",
        "exchange": "NSE",
        "market": "IN",
        "sector": "Banking & Financial Services",
        "price": 1785.40,
        "change": 19.40,
        "change_pct": 1.10,
        "market_cap_cr": 355000,
        "pe_ratio": 19.2,
        "pb_ratio": 2.8,
        "roe": 14.8,
        "roce": 13.9,
        "debt_to_equity": 0.85,
        "dividend_yield": 0.12,
        "volume": 3100000,
        "avg_volume": 2900000,
        "sparkline": [1764, 1770, 1778, 1782, 1784, 1785.40],
        "high_52w": 1940.00,
        "low_52w": 1544.00
    },
    {
        "symbol": "LT",
        "name": "Larsen & Toubro Ltd",
        "exchange": "NSE",
        "market": "IN",
        "sector": "Infrastructure & Capital Goods",
        "price": 3640.80,
        "change": 33.20,
        "change_pct": 0.92,
        "market_cap_cr": 500500,
        "pe_ratio": 33.8,
        "pb_ratio": 5.1,
        "roe": 16.2,
        "roce": 18.4,
        "debt_to_equity": 0.92,
        "dividend_yield": 0.95,
        "volume": 2200000,
        "avg_volume": 1900000,
        "sparkline": [3605, 3615, 3625, 3632, 3638, 3640.80],
        "high_52w": 3963.40,
        "low_52w": 2860.00
    },
    {
        "symbol": "ASIANPAINT",
        "name": "Asian Paints Ltd",
        "exchange": "NSE",
        "market": "IN",
        "sector": "Consumer Goods & Paints",
        "price": 2842.10,
        "change": 12.20,
        "change_pct": 0.43,
        "market_cap_cr": 272500,
        "pe_ratio": 51.6,
        "pb_ratio": 14.5,
        "roe": 28.5,
        "roce": 36.2,
        "debt_to_equity": 0.12,
        "dividend_yield": 1.15,
        "volume": 1100000,
        "avg_volume": 950000,
        "sparkline": [2830, 2835, 2838, 2840, 2841, 2842.10],
        "high_52w": 3422.00,
        "low_52w": 2670.00
    },
    {
        "symbol": "MARUTI",
        "name": "Maruti Suzuki India Ltd",
        "exchange": "NSE",
        "market": "IN",
        "sector": "Automobile",
        "price": 12585.00,
        "change": -31.50,
        "change_pct": -0.25,
        "market_cap_cr": 395600,
        "pe_ratio": 27.4,
        "pb_ratio": 4.2,
        "roe": 16.8,
        "roce": 21.4,
        "debt_to_equity": 0.03,
        "dividend_yield": 1.05,
        "volume": 420000,
        "avg_volume": 380000,
        "sparkline": [12620, 12610, 12595, 12580, 12588, 12585.00],
        "high_52w": 13680.00,
        "low_52w": 9735.00
    },
    {
        "symbol": "TITAN",
        "name": "Titan Company Ltd",
        "exchange": "NSE",
        "market": "IN",
        "sector": "Consumer Discretionary & Luxury",
        "price": 3280.40,
        "change": 5.90,
        "change_pct": 0.18,
        "market_cap_cr": 291200,
        "pe_ratio": 78.4,
        "pb_ratio": 24.1,
        "roe": 32.1,
        "roce": 35.8,
        "debt_to_equity": 0.85,
        "dividend_yield": 0.35,
        "volume": 980000,
        "avg_volume": 850000,
        "sparkline": [3270, 3274, 3278, 3282, 3279, 3280.40],
        "high_52w": 3868.00,
        "low_52w": 3055.00
    },
    {
        "symbol": "AXISBANK",
        "name": "Axis Bank Ltd",
        "exchange": "NSE",
        "market": "IN",
        "sector": "Banking & Financial Services",
        "price": 1184.20,
        "change": 10.40,
        "change_pct": 0.89,
        "market_cap_cr": 366000,
        "pe_ratio": 13.8,
        "pb_ratio": 2.2,
        "roe": 17.8,
        "roce": 16.5,
        "debt_to_equity": 1.1,
        "dividend_yield": 0.10,
        "volume": 7200000,
        "avg_volume": 6800000,
        "sparkline": [1172, 1176, 1180, 1182, 1183, 1184.20],
        "high_52w": 1339.65,
        "low_52w": 982.00
    },
    {
        "symbol": "SUNPHARMA",
        "name": "Sun Pharmaceutical Industries Ltd",
        "exchange": "NSE",
        "market": "IN",
        "sector": "Pharmaceuticals & Healthcare",
        "price": 1742.30,
        "change": -6.10,
        "change_pct": -0.35,
        "market_cap_cr": 418000,
        "pe_ratio": 38.6,
        "pb_ratio": 6.2,
        "roe": 16.5,
        "roce": 19.4,
        "debt_to_equity": 0.08,
        "dividend_yield": 0.78,
        "volume": 1800000,
        "avg_volume": 2100000,
        "sparkline": [1750, 1746, 1744, 1740, 1743, 1742.30],
        "high_52w": 1960.00,
        "low_52w": 1180.00
    },
    {
        "symbol": "ULTRACEMCO",
        "name": "UltraTech Cement Ltd",
        "exchange": "NSE",
        "market": "IN",
        "sector": "Materials & Cement",
        "price": 11240.00,
        "change": 31.20,
        "change_pct": 0.28,
        "market_cap_cr": 324500,
        "pe_ratio": 42.1,
        "pb_ratio": 5.2,
        "roe": 13.8,
        "roce": 15.6,
        "debt_to_equity": 0.35,
        "dividend_yield": 0.62,
        "volume": 310000,
        "avg_volume": 280000,
        "sparkline": [11200, 11215, 11230, 11235, 11240],
        "high_52w": 12140.00,
        "low_52w": 8200.00
    },
    {
        "symbol": "NTPC",
        "name": "NTPC Ltd",
        "exchange": "NSE",
        "market": "IN",
        "sector": "Utilities & Power",
        "price": 386.40,
        "change": 1.90,
        "change_pct": 0.49,
        "market_cap_cr": 374600,
        "pe_ratio": 17.8,
        "pb_ratio": 2.4,
        "roe": 14.2,
        "roce": 13.5,
        "debt_to_equity": 1.45,
        "dividend_yield": 2.10,
        "volume": 9400000,
        "avg_volume": 8800000,
        "sparkline": [384, 385, 385.5, 386, 386.40],
        "high_52w": 448.00,
        "low_52w": 235.00
    },
    {
        "symbol": "POWERGRID",
        "name": "Power Grid Corporation of India",
        "exchange": "NSE",
        "market": "IN",
        "sector": "Utilities & Power",
        "price": 318.90,
        "change": 0.70,
        "change_pct": 0.22,
        "market_cap_cr": 296500,
        "pe_ratio": 18.5,
        "pb_ratio": 3.2,
        "roe": 18.4,
        "roce": 16.8,
        "debt_to_equity": 1.55,
        "dividend_yield": 3.65,
        "volume": 7800000,
        "avg_volume": 7200000,
        "sparkline": [318, 318.2, 318.5, 318.7, 318.90],
        "high_52w": 366.00,
        "low_52w": 202.00
    },
    # US / Global Equities (matching Image 1)
    {
        "symbol": "TSLA",
        "name": "Tesla Inc.",
        "exchange": "NASDAQ",
        "market": "US",
        "sector": "Automotive & Clean Energy",
        "price": 870.76,
        "change": 77.10,
        "change_pct": 9.72,
        "market_cap_cr": 820000, # USD Millions
        "pe_ratio": 72.5,
        "pb_ratio": 14.8,
        "roe": 21.4,
        "roce": 18.2,
        "debt_to_equity": 0.08,
        "dividend_yield": 0.0,
        "volume": 84000000,
        "avg_volume": 62000000,
        "sparkline": [805, 820, 845, 860, 870.76],
        "high_52w": 910.00,
        "low_52w": 380.00
    },
    {
        "symbol": "MSFT",
        "name": "Microsoft Corporation",
        "exchange": "NASDAQ",
        "market": "US",
        "sector": "Information Technology & AI",
        "price": 463.23,
        "change": 23.45,
        "change_pct": 5.34,
        "market_cap_cr": 3440000,
        "pe_ratio": 35.8,
        "pb_ratio": 12.4,
        "roe": 38.6,
        "roce": 32.5,
        "debt_to_equity": 0.35,
        "dividend_yield": 0.72,
        "volume": 26000000,
        "avg_volume": 22000000,
        "sparkline": [442, 448, 455, 460, 463.23],
        "high_52w": 470.00,
        "low_52w": 360.00
    },
    {
        "symbol": "NVDA",
        "name": "NVIDIA Corporation",
        "exchange": "NASDAQ",
        "market": "US",
        "sector": "Semiconductors & AI Hardware",
        "price": 434.76,
        "change": 18.45,
        "change_pct": 4.43,
        "market_cap_cr": 3120000,
        "pe_ratio": 48.2,
        "pb_ratio": 32.5,
        "roe": 85.4,
        "roce": 78.2,
        "debt_to_equity": 0.15,
        "dividend_yield": 0.03,
        "volume": 52000000,
        "avg_volume": 44000000,
        "sparkline": [418, 424, 430, 432, 434.76],
        "high_52w": 460.00,
        "low_52w": 180.00
    },
    {
        "symbol": "AAPL",
        "name": "Apple Inc.",
        "exchange": "NASDAQ",
        "market": "US",
        "sector": "Consumer Electronics",
        "price": 757.43,
        "change": 29.80,
        "change_pct": 4.10,
        "market_cap_cr": 3500000,
        "pe_ratio": 32.6,
        "pb_ratio": 42.1,
        "roe": 145.0,
        "roce": 54.0,
        "debt_to_equity": 1.45,
        "dividend_yield": 0.45,
        "volume": 38000000,
        "avg_volume": 42000000,
        "sparkline": [730, 738, 745, 752, 757.43],
        "high_52w": 780.00,
        "low_52w": 520.00
    },
    {
        "symbol": "SHOP",
        "name": "Shopify Inc.",
        "exchange": "NYSE",
        "market": "US",
        "sector": "E-Commerce Infrastructure",
        "price": 435.53,
        "change": 13.68,
        "change_pct": 3.24,
        "market_cap_cr": 142000,
        "pe_ratio": 64.2,
        "pb_ratio": 11.2,
        "roe": 18.4,
        "roce": 15.2,
        "debt_to_equity": 0.12,
        "dividend_yield": 0.0,
        "volume": 14000000,
        "avg_volume": 11000000,
        "sparkline": [422, 427, 431, 433, 435.53],
        "high_52w": 460.00,
        "low_52w": 280.00
    }
]

# 5. Top Gainers & Losers (Live computed slices)
def get_top_gainers(limit: int = 5) -> List[Dict[str, Any]]:
    return sorted(EQUITIES_UNIVERSE, key=lambda x: x["change_pct"], reverse=True)[:limit]

def get_top_losers(limit: int = 5) -> List[Dict[str, Any]]:
    return sorted(EQUITIES_UNIVERSE, key=lambda x: x["change_pct"])[:limit]

# 6. Institutional Cash Activity (FII / DII in Crores)
INSTITUTIONAL_ACTIVITY = {
    "date": "2026-05-21",
    "fii": {
        "gross_buy": 11420.50,
        "gross_sell": 12660.80,
        "net": -1240.30,
        "trend": "Marginal Net Seller"
    },
    "dii": {
        "gross_buy": 9840.20,
        "gross_sell": 7660.10,
        "net": +2180.10,
        "trend": "Aggressive Net Buyer"
    },
    "total_market_turnover": 88450.00,
    "promoter_pledge_status": "Negligible (Average pledge across Nifty 50 < 0.8%)",
    "recent_bulk_deals": [
        {"symbol": "RELIANCE", "client": "GIC Private Limited", "type": "BUY", "quantity": 1850000, "price": 2942.50},
        {"symbol": "HDFCBANK", "client": "Vanguard Emerging Markets", "type": "BUY", "quantity": 3200000, "price": 1675.00},
        {"symbol": "TCS", "client": "Abu Dhabi Investment Authority", "type": "BUY", "quantity": 450000, "price": 3915.00}
    ]
}

# 7. Financial News Feed with Real-time Tags
MARKET_NEWS = [
    {
        "id": "news_1",
        "time": "10:15 AM",
        "timestamp": "2026-05-21T10:15:00Z",
        "headline": "Banking stocks extend morning gains on strong institutional buying and deposit growth",
        "tag": "RegTech",
        "impact": "High Positive",
        "sentiment_score": 0.84,
        "symbols": ["HDFCBANK", "ICICIBANK", "SBIN"],
        "summary": "Private and PSU banks led Dalal Street higher as credit expansion outpaces expectations."
    },
    {
        "id": "news_2",
        "time": "09:48 AM",
        "timestamp": "2026-05-21T09:48:00Z",
        "headline": "IT stocks under mild pressure as global cues turn mixed amid dollar firmness",
        "tag": "Finance",
        "impact": "Mild Negative",
        "sentiment_score": -0.32,
        "symbols": ["TCS", "INFY", "WIPRO"],
        "summary": "Tier-1 IT exporters consolidate near weekly highs following conservative US enterprise budget updates."
    },
    {
        "id": "news_3",
        "time": "09:30 AM",
        "timestamp": "2026-05-21T09:30:00Z",
        "headline": "Market opens higher; NIFTY comfortably crosses above key 24,700 technical resistance",
        "tag": "AI",
        "impact": "High Positive",
        "sentiment_score": 0.78,
        "symbols": ["NIFTY 50", "SENSEX"],
        "summary": "Benchmark indices started the Thursday expiry session with a gap-up led by auto and capital goods."
    },
    {
        "id": "news_4",
        "time": "Yesterday",
        "timestamp": "2026-05-20T16:30:00Z",
        "headline": "DII inflows continue to support domestic equities for the 14th consecutive trading session",
        "tag": "Equity",
        "impact": "High Positive",
        "sentiment_score": 0.88,
        "symbols": ["DII", "MUTUAL_FUNDS"],
        "summary": "Domestic mutual funds absorbed foreign portfolio outflows, injecting net ₹2,180 Cr into equity markets."
    },
    {
        "id": "news_5",
        "time": "March 30",
        "timestamp": "2026-03-30T14:00:00Z",
        "headline": "SEC introduces new compliance measures for algorithmic hedge funds and real-time risk reporting",
        "tag": "RegTech",
        "impact": "Neutral",
        "sentiment_score": 0.12,
        "symbols": ["US_SEC", "HEDGE_FUNDS"],
        "summary": "Regulators mandate enhanced margin stress testing for high-frequency algorithmic market makers."
    },
    {
        "id": "news_6",
        "time": "March 29",
        "timestamp": "2026-03-29T11:00:00Z",
        "headline": "Goldman CEO: Market trends suggest a permanent structural shift into AI-driven investment tools",
        "tag": "AI",
        "impact": "High Positive",
        "sentiment_score": 0.92,
        "symbols": ["AI", "FINTECH"],
        "summary": "Institutional asset managers accelerating deployment of conversational quantitative copilots."
    }
]

# 8. User Portfolio Initial State (matching Image 1)
USER_PORTFOLIO = {
    "total_value": 5200000.0, # $5.2M / ₹5.2 Cr
    "total_profit": 87536.75,
    "profit_growth_pct": 8.1,
    "efficiency_pct": 85.0,
    "portfolio_risk_score": 4.2, # Gauge: 4.2 / 10 Medium
    "portfolio_roi": 7.5,
    "ai_prediction_score": 92.0,
    "quality_score": "4.8 / 5.0",
    "asset_distribution": [
        {"asset_class": "Equity", "amount": 2100000.0, "percentage": 40.0, "color": "#8b5cf6"},
        {"asset_class": "Fixed Income", "amount": 1400000.0, "percentage": 27.0, "color": "#06b6d4"},
        {"asset_class": "Real Estate", "amount": 936000.0, "percentage": 18.0, "color": "#10b981"},
        {"asset_class": "Commodities", "amount": 764000.0, "percentage": 15.0, "color": "#f59e0b"}
    ],
    "concentric_holdings": [
        {"symbol": "DIA", "name": "SPDR Dow Jones Industrial Average ETF", "percentage": 51.0},
        {"symbol": "IEF", "name": "iShares 7-10 Year Treasury Bond ETF", "percentage": 21.0},
        {"symbol": "QQQ", "name": "Invesco QQQ Trust (Nasdaq 100)", "percentage": 15.0},
        {"symbol": "TLT", "name": "iShares 20+ Year Treasury Bond ETF", "percentage": 13.0}
    ],
    "sector_exposure": [
        {"sector": "Treasuries, 7-10 yr", "weight_pct": 37.98, "trend": "up"},
        {"sector": "Information Technology", "weight_pct": 35.27, "trend": "up"},
        {"sector": "Treasuries, 20+ yr", "weight_pct": 29.18, "trend": "up"},
        {"sector": "Consumer Discretionary", "weight_pct": 22.12, "trend": "up"},
        {"sector": "Financials", "weight_pct": 16.99, "trend": "down"},
        {"sector": "Communication Sector", "weight_pct": 13.08, "trend": "down"},
        {"sector": "Healthcare", "weight_pct": 11.79, "trend": "up"}
    ],
    "holdings": [
        {"symbol": "TSLA", "name": "Tesla Inc.", "quantity": 600, "avg_price": 790.0, "current_price": 870.76, "sector": "Consumer Discretionary"},
        {"symbol": "MSFT", "name": "Microsoft Corporation", "quantity": 1200, "avg_price": 420.0, "current_price": 463.23, "sector": "Information Technology"},
        {"symbol": "NVDA", "name": "NVIDIA Corporation", "quantity": 1500, "avg_price": 380.0, "current_price": 434.76, "sector": "Information Technology"},
        {"symbol": "RELIANCE", "name": "Reliance Industries Ltd", "quantity": 800, "avg_price": 2820.0, "current_price": 2948.40, "sector": "Energy & Conglomerate"},
        {"symbol": "HDFCBANK", "name": "HDFC Bank Ltd", "quantity": 1500, "avg_price": 1610.0, "current_price": 1678.45, "sector": "Financials"}
    ]
}

# 9. Synthetic 60-day historical candles generator for any symbol
def get_historical_candles(symbol: str, count: int = 60) -> List[Dict[str, Any]]:
    # Look up base price
    base = 2500.0
    for eq in EQUITIES_UNIVERSE:
        if eq["symbol"] == symbol.upper():
            base = eq["price"]
            break
            
    candles = []
    curr = base * 0.90
    today = datetime.date(2026, 5, 21)
    
    # Deterministic pseudo-random seed generator
    seed = sum(ord(c) for c in symbol)
    
    for i in range(count):
        d = today - datetime.timedelta(days=(count - i))
        # Daily drift and volatility
        step = math.sin((i + seed) * 0.35) * (base * 0.015) + (base * 0.002)
        o = round(curr, 2)
        c = round(curr + step, 2)
        h = round(max(o, c) + abs(step) * 0.8, 2)
        l = round(min(o, c) - abs(step) * 0.8, 2)
        vol = int(3500000 + abs(step) * 80000)
        
        candles.append({
            "date": d.strftime("%Y-%m-%d"),
            "open": o,
            "high": h,
            "low": l,
            "close": c,
            "volume": vol
        })
        curr = c
        
    # Ensure final candle matches current live price
    candles[-1]["close"] = base
    return candles
