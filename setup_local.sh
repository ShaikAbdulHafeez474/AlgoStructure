#!/bin/bash

# Algorithm Visualizer - Local Setup Script
# This script helps set up and run the Algorithm Visualizer project in a local environment

# Color codes for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=====================================${NC}"
echo -e "${YELLOW}  Algorithm Visualizer Setup Script  ${NC}"
echo -e "${YELLOW}=====================================${NC}"

# Check for Node.js installation
echo -e "\n${YELLOW}Checking for Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓ Node.js is installed (${NODE_VERSION})${NC}"
else
    echo -e "${RED}✗ Node.js is not installed. Please install Node.js v16 or higher.${NC}"
    echo -e "   Visit: https://nodejs.org/"
    exit 1
fi

# Check for npm installation
echo -e "\n${YELLOW}Checking for npm...${NC}"
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓ npm is installed (${NPM_VERSION})${NC}"
else
    echo -e "${RED}✗ npm is not installed. Please install npm.${NC}"
    exit 1
fi

# Install dependencies
echo -e "\n${YELLOW}Installing dependencies...${NC}"
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependencies installed successfully${NC}"
else
    echo -e "${RED}✗ Failed to install dependencies${NC}"
    exit 1
fi

# Check for Emscripten (optional)
echo -e "\n${YELLOW}Checking for Emscripten (optional)...${NC}"
if command -v emcc &> /dev/null; then
    EMCC_VERSION=$(emcc --version | head -n 1)
    echo -e "${GREEN}✓ Emscripten is installed (${EMCC_VERSION})${NC}"
    
    # Ask if user wants to compile C++ algorithms
    echo -e "\n${YELLOW}Do you want to compile C++ algorithms to WebAssembly? (y/n)${NC}"
    read -r compile_choice
    if [[ $compile_choice =~ ^[Yy]$ ]]; then
        echo -e "\n${YELLOW}Compiling C++ algorithms...${NC}"
        node server/algorithms/compile.js
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ Algorithms compiled successfully${NC}"
        else
            echo -e "${RED}✗ Failed to compile algorithms${NC}"
            echo -e "${YELLOW}Continuing with mock implementations...${NC}"
        fi
    else
        echo -e "${YELLOW}Skipping compilation. Using mock implementations.${NC}"
    fi
else
    echo -e "${YELLOW}! Emscripten not found. Using mock algorithm implementations.${NC}"
    echo -e "  If you want to compile C++ algorithms later, install Emscripten:"
    echo -e "  https://emscripten.org/docs/getting_started/downloads.html"
fi

# Start the development server
echo -e "\n${YELLOW}Starting the development server...${NC}"
echo -e "${YELLOW}You can access the application at http://localhost:5000${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
echo -e "\n${GREEN}=====================================${NC}"
echo -e "${GREEN}  Server starting...${NC}"
echo -e "${GREEN}=====================================${NC}"

npm run dev