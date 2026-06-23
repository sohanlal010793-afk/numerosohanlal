#!/bin/bash
cd "$(dirname "$0")"

if ! command -v node &> /dev/null; then
  echo ""
  echo "============================================"
  echo " Node.js is not installed on this computer."
  echo " Download it from https://nodejs.org"
  echo " (choose the LTS version), install it,"
  echo " then run this file again."
  echo "============================================"
  read -p "Press Enter to close..."
  exit 1
fi

if [ ! -d "node_modules" ]; then
  echo "First time setup - installing required packages..."
  npm install
fi

echo ""
echo "Starting server..."
( sleep 2 && open http://localhost:3000 2>/dev/null || xdg-open http://localhost:3000 2>/dev/null ) &
npm start
