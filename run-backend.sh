#!/bin/bash

echo "🚀 Starting Backend Server..."
echo "================================"

cd backend

if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "⚙️  Starting Express server..."
npm start
