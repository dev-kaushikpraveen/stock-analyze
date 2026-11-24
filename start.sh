#!/bin/bash
# NEXORA Institutional Financial Terminal Launcher

echo "=========================================================="
echo "  🚀 Starting NEXORA Institutional Terminal v2.0"
echo "  Core Quant Engine + Next.js High-Frequency Terminal"
echo "=========================================================="

# 1. Start Python Quant & ML Backend on port 8000
echo "[1/2] Launching Python Quant & ML Engine on http://localhost:8000..."
export PYTHONPATH="$(pwd)/backend"
python3 backend/run.py 8000 &
BACKEND_PID=$!

# Wait 1s for backend to initialize
sleep 1

# 2. Start Next.js Frontend on port 3000
echo "[2/2] Launching Next.js Terminal on http://localhost:3000..."
cd frontend && npm run dev &
FRONTEND_PID=$!

trap "echo 'Shutting down NEXORA...'; kill $BACKEND_PID $FRONTEND_PID; exit 0" SIGINT SIGTERM EXIT

echo ""
echo "✅ NEXORA Terminal Ready!"
echo "   Terminal UI: http://localhost:3000"
echo "   Quant API:   http://localhost:8000/api/health"
echo "=========================================================="
wait
