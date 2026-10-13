#!/usr/bin/env bash
# ============================================================================
# GlobeTrek - Worldwide Tourism Package and Travel Booking Platform
# Reference: MakeMyTrip Leisure Packages | 3NF Relational Database
# ============================================================================

set -e
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

echo "======================================================================"
echo " Starting GlobeTrek Worldwide Tourism & Travel Booking Platform (MMT) "
echo " Course: Database Management Systems (PBL Project 63 - 3NF Schema)    "
echo "======================================================================"

# 1. Initialize Database & Backend
echo ""
echo "[1/3] Checking Relational Database..."
if [ ! -f "bharatyatra.db" ]; then
    echo "Creating SQLite 3NF schema and populating realistic Indian tour data..."
    sqlite3 bharatyatra.db < backend/sql/schema_sqlite.sql
    sqlite3 bharatyatra.db < backend/sql/seed_data.sql
    echo "✓ Database seeded successfully!"
else
    echo "✓ Database bharatyatra.db is ready."
fi

# 2. Launch FastAPI Backend
echo ""
echo "[2/3] Launching Python FastAPI Backend on http://127.0.0.1:8000..."
PYTHONPATH=. "$PROJECT_ROOT/backend/venv/bin/uvicorn" backend.app.main:app --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

# Trap signals to cleanly shutdown processes
trap "echo 'Stopping services...'; kill $BACKEND_PID 2>/dev/null || true; exit" SIGINT SIGTERM EXIT

# Small delay to let backend start
sleep 2

# 3. Launch React Frontend
echo ""
echo "[3/3] Launching React + Vite Frontend on http://localhost:5173..."
cd "$PROJECT_ROOT/frontend"
npx vite --host 0.0.0.0 --port 5173 &
FRONTEND_PID=$!

LAN_IP=$(ifconfig 2>/dev/null | grep "inet " | grep -v 127.0.0.1 | head -n1 | awk '{print $2}')

echo ""
echo "======================================================================"
echo " 🚀 GlobeTrek is LIVE and ready for worldwide evaluation! "
echo " 💻 Full-Stack Unified (Port 8000): http://localhost:8000"
echo " 💻 Vite Frontend (Dev Server):     http://localhost:5173"
if [ -n "$LAN_IP" ]; then
    echo " 📱 Wi-Fi / Local Network:           http://$LAN_IP:8000"
fi
echo " 🌐 Fixed Subdomain Link:            https://globetrek-yatra.loca.lt"
echo " ☁️  Permanent 24/7 Cloud Link:       Deploy to Render via render.yaml (100% Free)"
echo " 📖 API Interactive Docs:             http://localhost:8000/docs"
echo "----------------------------------------------------------------------"
echo " Demo Credentials (or use 1-click Quick Login on /login page):"
echo " • Administrator: admin@bharatyatra.com       (Password: Admin@123)"
echo " • Tour Guide:    tashi.namgyal@bharatyatra.com (Password: Guide@123)"
echo " • Customer:      rohit.sharma@example.com      (Password: Customer@123)"
echo "======================================================================"
echo "Press [Ctrl+C] to stop all servers."

wait

