#!/bin/bash

echo "🚀 GitHub Portfolio Analyzer - Auto Setup Script"
echo "=================================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the project root
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📦 Step 1: Installing Backend Dependencies..."
cd backend
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
else
    echo "❌ Backend installation failed"
    exit 1
fi

echo ""
echo "📦 Step 2: Installing Frontend Dependencies..."
cd ../frontend
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
else
    echo "❌ Frontend installation failed"
    exit 1
fi

echo ""
echo "⚙️  Step 3: Setting up environment files..."
cd ../backend
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo -e "${GREEN}✅ Backend .env created${NC}"
    echo -e "${YELLOW}⚠️  Optional: Add your GitHub token to backend/.env for higher rate limits${NC}"
else
    echo -e "${BLUE}ℹ️  Backend .env already exists${NC}"
fi

cd ../
echo ""
echo -e "${GREEN}✨ Setup Complete!${NC}"
echo ""
echo "📋 Next Steps:"
echo "=============="
echo ""
echo "1️⃣  Start Backend (Terminal 1):"
echo "   cd backend"
echo "   npm start"
echo ""
echo "2️⃣  Start Frontend (Terminal 2):"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "3️⃣  Open browser:"
echo "   http://localhost:3000"
echo ""
echo "🌐 For deployment instructions, see QUICKSTART.md"
echo ""
