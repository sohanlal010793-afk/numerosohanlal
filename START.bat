@echo off
echo Starting KundaliGrid...
cd /d "%~dp0"

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo ============================================
    echo  Node.js is not installed on this PC.
    echo  Download it from https://nodejs.org
    echo  (choose the LTS version), install it,
    echo  then double-click this file again.
    echo ============================================
    pause
    exit /b
)

if not exist "node_modules" (
    echo First time setup - installing required packages...
    call npm install
)

echo.
echo Starting server...
start "" "http://localhost:3000"
call npm start
