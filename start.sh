#!/usr/bin/env bash
# ApexStore Startup Script - Runs Python FastAPI Backend and Vite Frontend

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=== Starting ApexCommerce (Zero Docker / Pure Synthetic Test Store) ===${NC}"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 1. Start Python FastAPI Backend
echo -e "${GREEN}--> Launching Python FastAPI Backend on http://127.0.0.1:8000 ...${NC}"
cd "$ROOT_DIR/backend"
if [ ! -d "venv" ]; then
    echo "Creating Python virtualenv..."
    python3 -m venv venv
    ./venv/bin/pip install -r requirements.txt
fi
./venv/bin/python3 run.py &
BACKEND_PID=$!

# 2. Start Vite TypeScript Frontend
echo -e "${GREEN}--> Launching Vite TypeScript Frontend on http://localhost:5173 ...${NC}"
cd "$ROOT_DIR/frontend"
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi
npm run dev &
FRONTEND_PID=$!

trap "echo 'Stopping services...'; kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT SIGTERM

echo -e "${GREEN}=== Store Ready! ===${NC}"
echo -e "Frontend: ${BLUE}http://localhost:5173${NC}"
echo -e "Backend API / Swagger Docs: ${BLUE}http://127.0.0.1:8000/docs${NC}"
echo -e "Press Ctrl+C to terminate both servers."

wait
