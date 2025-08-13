#!/bin/bash
# Modern Password Manager Setup & Launch Script

echo "� Setting up Modern Secure Password Manager..."

# Check if virtual environment exists, create if not
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "⬆️ Upgrading pip..."
pip install --upgrade pip

# Install Python dependencies
echo "� Installing Python dependencies..."
pip install -r requirements.txt

# Create environment file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "🔐 Creating environment configuration..."
    cp .env.example .env
    echo "⚠️  Please update .env with your production secrets before deploying!"
fi

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Build the frontend for production (optional)
if [ "$1" = "build" ]; then
    echo "🏗️ Building frontend for production..."
    npm run build
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Starting the application..."
echo ""

# Function to start backend
start_backend() {
    echo "🔵 Starting Flask backend..."
    cd backend
    python app.py &
    BACKEND_PID=$!
    cd ..
    echo "Backend started with PID: $BACKEND_PID"
}

# Function to start frontend
start_frontend() {
    echo "🟢 Starting React frontend..."
    npm run dev &
    FRONTEND_PID=$!
    echo "Frontend started with PID: $FRONTEND_PID"
}

# Start both services
start_backend
sleep 2
start_frontend

echo ""
echo "� Password Manager is now running!"
echo ""
echo "📍 Frontend: http://localhost:5173"
echo "📍 Backend:  http://localhost:5000"
echo ""
echo "🛑 Press Ctrl+C to stop all services"
echo ""

# Wait for user interrupt
trap 'echo ""; echo "🛑 Stopping services..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo "✅ All services stopped"; exit 0' INT

# Keep script running
wait