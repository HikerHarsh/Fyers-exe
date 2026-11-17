@echo off
title Fyers Desktop App (Ultra-Fast)
cd /d "D:\fyers-desktop"

:: Kill any stuck background instances
taskkill /f /im electron.exe >nul 2>&1

echo ========================================================
echo   Launching Fyers Desktop (Real-Time Ultra-Fast Mode)
echo   Process Priority: HIGH (Windows Kernel Scheduled)
echo ========================================================

if exist "node_modules\electron\dist\electron.exe" (
    start "" /high "node_modules\electron\dist\electron.exe" .
) else (
    npm start
)
