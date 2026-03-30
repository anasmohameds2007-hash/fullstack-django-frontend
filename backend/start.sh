#!/bin/bash

# Django E-Commerce Backend Startup Script
# Run this script to setup and start the backend

echo "🚀 Starting Django E-Commerce Backend Setup..."

# Check if Python is installed
if ! command -v python &> /dev/null; then
    echo "❌ Python is not installed. Please install Python 3.8 or higher."
    exit 1
fi

echo "✅ Python found: $(python --version)"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "🔌 Activating virtual environment..."
if [ -f "venv/Scripts/activate" ]; then
    . venv/Scripts/activate  # Windows
else
    . venv/bin/activate      # macOS/Linux
fi

# Install dependencies
echo "⬇️  Installing dependencies..."
pip install -r requirements.txt

# Apply migrations
echo "🗄️  Applying database migrations..."
python manage.py migrate

# Create superuser if needed
echo "👤 Creating superuser (optional)..."
read -p "Do you want to create a superuser? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    python manage.py createsuperuser
fi

# Run server
echo "🎉 Starting server..."
echo "📍 Server running at http://localhost:8000"
echo "📍 Admin panel at http://localhost:8000/admin"
echo "📍 API documentation at https://your-docs-url"
echo ""
echo "Press Ctrl+C to stop the server"

python manage.py runserver
