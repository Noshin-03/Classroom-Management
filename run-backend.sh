#!/bin/bash

set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
PID_FILE="$BACKEND_DIR/.backend.pid"
LOG_FILE="$BACKEND_DIR/backend.log"

print_usage() {
    echo "Usage: ./run-backend.sh [foreground|background|start|stop|restart|status|logs]"
}

is_running() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if kill -0 "$PID" 2>/dev/null; then
            return 0
        fi
    fi
    return 1
}

start_server() {
    echo "🚀 Starting Backend Server..."
    echo "================================"

    cd "$BACKEND_DIR"

    if [ ! -d "node_modules" ]; then
        echo "📦 Installing dependencies..."
        npm install
    fi

    if is_running; then
        echo "✅ Backend already running (PID: $(cat "$PID_FILE"))"
        echo "📄 Logs: $LOG_FILE"
        exit 0
    fi

    echo "⚙️  Starting Express server in background..."
    nohup npm start >> "$LOG_FILE" 2>&1 &
    NEW_PID=$!
    echo "$NEW_PID" > "$PID_FILE"

    sleep 1
    if kill -0 "$NEW_PID" 2>/dev/null; then
        echo "✅ Backend started (PID: $NEW_PID)"
        echo "📄 Logs: $LOG_FILE"
    else
        echo "❌ Backend failed to start. Check logs: $LOG_FILE"
        rm -f "$PID_FILE"
        exit 1
    fi
}

start_server_foreground() {
    echo "🚀 Starting Backend Server (foreground)..."
    echo "================================"

    cd "$BACKEND_DIR"

    if [ ! -d "node_modules" ]; then
        echo "📦 Installing dependencies..."
        npm install
    fi

    if is_running; then
        echo "⚠️  Backend is already running in background (PID: $(cat "$PID_FILE"))"
        echo "Run './run-backend.sh stop' first, then try foreground mode."
        exit 1
    fi

    echo "⚙️  Starting Express server..."
    npm start
}

stop_server() {
    if ! is_running; then
        echo "ℹ️  Backend is not running"
        rm -f "$PID_FILE"
        exit 0
    fi

    PID=$(cat "$PID_FILE")
    echo "🛑 Stopping backend (PID: $PID)..."
    kill "$PID" 2>/dev/null || true
    rm -f "$PID_FILE"
    echo "✅ Backend stopped"
}

status_server() {
    if is_running; then
        echo "✅ Backend is running (PID: $(cat "$PID_FILE"))"
        echo "📄 Logs: $LOG_FILE"
    else
        echo "ℹ️  Backend is not running"
    fi
}

show_logs() {
    cd "$BACKEND_DIR"
    if [ ! -f "$LOG_FILE" ]; then
        echo "ℹ️  No log file found yet"
        exit 0
    fi
    tail -f "$LOG_FILE"
}

ACTION="${1:-foreground}"

case "$ACTION" in
    background)
        start_server
        ;;
    start|foreground)
        start_server_foreground
        ;;
    stop)
        stop_server
        ;;
    restart)
        stop_server
        start_server
        ;;
    status)
        status_server
        ;;
    logs)
        show_logs
        ;;
    *)
        print_usage
        exit 1
        ;;
esac
