#!/bin/bash

echo "🔍 MediLens Setup Verification"
echo "=============================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Found: $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Not found"
    echo "   Install from: https://nodejs.org"
fi

# Check npm
echo -n "Checking npm... "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓${NC} Found: v$NPM_VERSION"
else
    echo -e "${RED}✗${NC} Not found"
fi

# Check Python
echo -n "Checking Python... "
if command -v python &> /dev/null; then
    PYTHON_VERSION=$(python --version)
    echo -e "${GREEN}✓${NC} Found: $PYTHON_VERSION"
elif command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo -e "${GREEN}✓${NC} Found: $PYTHON_VERSION"
else
    echo -e "${RED}✗${NC} Not found"
    echo "   Install from: https://python.org"
fi

# Check pip
echo -n "Checking pip... "
if command -v pip &> /dev/null; then
    PIP_VERSION=$(pip --version | cut -d' ' -f2)
    echo -e "${GREEN}✓${NC} Found: v$PIP_VERSION"
elif command -v pip3 &> /dev/null; then
    PIP_VERSION=$(pip3 --version | cut -d' ' -f2)
    echo -e "${GREEN}✓${NC} Found: v$PIP_VERSION"
else
    echo -e "${RED}✗${NC} Not found"
fi

echo ""
echo "Project Structure:"
echo "==================="

# Check frontend
if [ -d "frontend" ]; then
    echo -e "${GREEN}✓${NC} frontend/ folder exists"
    
    if [ -f "frontend/package.json" ]; then
        echo -e "  ${GREEN}✓${NC} package.json found"
    else
        echo -e "  ${RED}✗${NC} package.json missing"
    fi
    
    if [ -d "frontend/node_modules" ]; then
        echo -e "  ${GREEN}✓${NC} node_modules installed"
    else
        echo -e "  ${YELLOW}!${NC} node_modules not found (run: cd frontend && npm install)"
    fi
else
    echo -e "${RED}✗${NC} frontend/ folder missing"
fi

# Check backend
if [ -d "backend" ]; then
    echo -e "${GREEN}✓${NC} backend/ folder exists"
    
    if [ -f "backend/main.py" ]; then
        echo -e "  ${GREEN}✓${NC} main.py found"
    else
        echo -e "  ${RED}✗${NC} main.py missing"
    fi
    
    if [ -f "backend/requirements.txt" ]; then
        echo -e "  ${GREEN}✓${NC} requirements.txt found"
    else
        echo -e "  ${RED}✗${NC} requirements.txt missing"
    fi
    
    if [ -f "backend/.env" ]; then
        echo -e "  ${GREEN}✓${NC} .env file configured"
    else
        echo -e "  ${YELLOW}!${NC} .env not found (optional, will use mock data)"
    fi
else
    echo -e "${RED}✗${NC} backend/ folder missing"
fi

echo ""
echo "Next Steps:"
echo "==========="

if [ ! -d "frontend/node_modules" ]; then
    echo "1. Install frontend dependencies:"
    echo "   cd frontend && npm install"
    echo ""
fi

if [ ! -f "backend/.env" ]; then
    echo "2. (Optional) Configure Gemini API:"
    echo "   cd backend"
    echo "   cp .env.example .env"
    echo "   # Edit .env and add your API key"
    echo ""
fi

echo "3. Start the application:"
echo "   bash start.sh"
echo "   OR manually:"
echo "   - Terminal 1: cd backend && python main.py"
echo "   - Terminal 2: cd frontend && npm run dev"
echo ""
echo "4. Open http://localhost:3000 in your browser"
echo "   Login: admin / admin123"
echo ""
