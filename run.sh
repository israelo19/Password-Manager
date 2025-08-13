#!/bin/bash
# Simple run script for development

echo "🚀 Starting SecureVault Password Manager..."

# Check if virtual environment is activated
if [[ "$VIRTUAL_ENV" == "" ]]; then
    echo "🔧 Activating virtual environment..."
    source venv/bin/activate
fi

# Start backend in background
echo "🔵 Starting Flask backend..."
cd backend
python app.py &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🟢 Starting React frontend..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "🌟 SecureVault is now running!"
echo "📍 Frontend: http://localhost:5173"
echo "📍 Backend:  http://localhost:5000"
echo ""
echo "🛑 Press Ctrl+C to stop"

# Handle cleanup
trap 'echo ""; echo "🛑 Stopping services..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0' INT

# Keep script running
wait
