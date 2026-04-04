#!/bin/bash

# AI Starter - Debian Setup Script
# -------------------------------
# This script automates the installation of system packages,
# Python environment, and Ollama for a full AI experience.

# Set text colors
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${GREEN}== Debian AI Starter: End-to-End Setup ==${NC}"

# 1. Update System & Install Base Packages
echo -e "\n${GREEN}[1/5] Installing Debian System Dependencies...${NC}"
sudo apt update
sudo apt install -y python3 python3-pip python3-venv build-essential curl git lsof

# 2. Setup Python Virtual Environment
echo -e "\n${GREEN}[2/5] Setting up Python Virtual Environment...${NC}"
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# 3. Install Ollama (Optional but recommended)
echo -e "\n${GREEN}[3/5] Checking for Ollama...${NC}"
if ! command -v ollama &> /dev/null; then
    echo "Ollama not found. Installing now..."
    curl -fsSL https://ollama.com/install.sh | sh
else
    echo "Ollama is already installed."
fi

# 4. Pull Default AI Model (Ollama)
echo -e "\n${GREEN}[4/5] Pulling default model (mistral)...${NC}"
# We start the ollama service in background if not running to pull the model
if ! pgrep -x "ollama" > /dev/null; then
    ollama serve > /dev/null 2>&1 &
    sleep 5 # wait for startup
fi
ollama pull mistral

# 5. Environment Variables
echo -e "\n${GREEN}[5/5] Finalizing configuration...${NC}"
if [ ! -f ".env" ]; then
    echo "OLLAMA_MODEL=mistral" > .env
    echo "Creating default .env file..."
fi

echo -e "\n${GREEN}== Setup Complete! ==${NC}"
echo "To start the system:"
echo "1. Activate venv: source venv/bin/activate"
echo "2. Run Backend: python3 backend/api.py"
echo "3. Open Frontend: Open frontend/index.html in your browser"
echo "4. Use CLI: python3 cli/main.py --help"
