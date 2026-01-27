#!/bin/bash

# SkyTech Dev Server Launcher
# Runs both Admin (Next.js) and Public Site (Vite) dev servers

set -e

echo "🚀 Starting SkyTech Development Servers"
echo "======================================="
echo ""
echo "📝 Admin Dashboard:  http://localhost:3000"
echo "🌐 Public Site:      http://localhost:5173"
echo ""

# Kill any existing processes on these ports
echo "Cleaning up existing processes on ports 3000 & 5173..."
lsof -ti:3000 | xargs -r kill -9 2>/dev/null || true
lsof -ti:5173 | xargs -r kill -9 2>/dev/null || true
sleep 1

# Start Admin Dashboard (Next.js)
echo "Starting Admin Dashboard (Next.js)..."
cd admin
npm run dev &
ADMIN_PID=$!
echo "✓ Admin PID: $ADMIN_PID"

sleep 3

# Start Public Site (Vite)
echo "Starting Public Site (Vite)..."
cd ..
npm run dev &
VITE_PID=$!
echo "✓ Vite PID: $VITE_PID"

echo ""
echo "✅ Both servers are running!"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait

# Cleanup on exit
kill $ADMIN_PID $VITE_PID 2>/dev/null || true
