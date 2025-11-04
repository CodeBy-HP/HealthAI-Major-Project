#!/bin/bash
# Quick script to restart the backend with the new AI features

echo "🛑 Stopping any existing backend processes..."
# Kill any python processes running uvicorn
pkill -f "uvicorn main:app" 2>/dev/null || true

echo "⏳ Waiting for processes to stop..."
sleep 2

echo "🚀 Starting backend with AI features..."
cd backend
python -m uvicorn main:app --reload --port 8000 &

echo "⏳ Waiting for backend to start..."
sleep 3

echo "✅ Backend should now be running on http://localhost:8000"
echo ""
echo "📝 To test the AI features, run:"
echo "   python test_ai_features.py"
echo ""
echo "🌐 Or open your browser and test manually at:"
echo "   http://localhost:5173"
echo ""
echo "📋 To see backend logs:"
echo "   tail -f backend/uvicorn.log"
