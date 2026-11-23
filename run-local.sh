#!/usr/bin/env bash
# ==============================================================================
# WanderStay Oasis - Zero-Docker Local Startup Script
# ==============================================================================
set -e

# Load NVM if available
export NVM_DIR="/Users/indigi/Library/Application Support/Herd/config/nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh"
fi
export PATH="/Users/indigi/Library/Application Support/Herd/config/nvm/versions/node/v20.20.2/bin:/usr/local/bin:/usr/bin:/bin:$PATH"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
API_DIR="$ROOT_DIR/api"
WEB_DIR="$ROOT_DIR/web"

echo "=========================================================="
echo "🌴 Starting WanderStay Oasis Travel Booking Platform"
echo "=========================================================="

# Check Node.js
if ! command -v node >/dev/null 2>&1; then
  echo "❌ Node.js not found in PATH. Please install or activate Node.js (v18+ recommended)."
  exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js detected: $NODE_VERSION"

# Kill any existing processes on ports 4000 or 3005
echo "🧹 Checking ports 4000 & 3005..."
lsof -ti:4000 | xargs kill -9 2>/dev/null || true
lsof -ti:3005 | xargs kill -9 2>/dev/null || true

# 1. Start Backend API
echo "🚀 [1/2] Starting NestJS API Server on port 4000..."
cd "$API_DIR"
if [ ! -d "dist" ]; then
  echo "   Building NestJS backend..."
  npm run build
fi
node dist/main.js &
API_PID=$!

# Wait for backend health check
echo "   Waiting for API to become ready..."
for i in {1..20}; do
  if curl -s http://localhost:4000/api/v1/health >/dev/null 2>&1; then
    echo "✅ Backend API is live at http://localhost:4000/api/v1"
    break
  fi
  sleep 1
done

# 2. Start Frontend
echo "🚀 [2/2] Starting Next.js Web App on port 3005..."
cd "$WEB_DIR"
npm run dev -- -p 3005 &
WEB_PID=$!

# Cleanup on exit
trap "echo 'Stopping all servers...'; kill -9 $API_PID $WEB_PID 2>/dev/null; exit 0" SIGINT SIGTERM EXIT

echo ""
echo "=========================================================="
echo "🌟 WanderStay Oasis Platform is Ready!"
echo "=========================================================="
echo "🏨 Customer Web App:         http://localhost:3005"
echo "🚖 Cab Booking & Tracking:   http://localhost:3005?tab=cabs"
echo "💼 Unified Partner Central:   http://localhost:3005/partner"
echo "🛡️ Super Admin Console:      http://localhost:3005/admin/dashboard"
echo "🔌 NestJS API Health:        http://localhost:4000/api/v1/health"
echo "=========================================================="
echo "Press Ctrl+C at any time to stop all services."
echo ""

wait $WEB_PID $API_PID

