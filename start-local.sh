#!/bin/bash

echo "🚀 Starting CVGenius Local Development Environment..."

# Function to kill background processes on exit
cleanup() {
    echo "🛑 Stopping servers..."
    pkill -f "python main.py"
    pkill -f "next dev"
    exit
}

# Set trap to cleanup on script exit
trap cleanup EXIT

# Start backend
echo "🔧 Starting Backend (FastAPI)..."
cd backend
python main.py &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🌐 Starting Frontend (Next.js)..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Local Development Servers Started!"
echo ""
echo "📍 Frontend: http://localhost:3000"
echo "📍 Backend:  http://localhost:8000"
echo "📍 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for user to stop
wait 