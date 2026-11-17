# Fyers Desktop (Fyers-exe) 🚀

An ultra-fast, low-latency desktop wrapper application for **Fyers Trading Terminal**, engineered with Electron and optimized for real-time market data streaming and 60/120fps TradingView charting.

---

## ⚡ Performance Features

- **Direct GPU Rasterization:** Hardware-accelerated canvas rendering for ultra-smooth TradingView candlestick charts.
- **Zero Background Throttling:** Background timers and renderer throttling disabled — live WebSocket price ticks never freeze or disconnect even when minimized.
- **V8 Heap Optimization:** 4GB heap allocation (`--max-old-space-size=4096`) to eliminate garbage collection pauses during volatile market hours (9:15 AM open).
- **Windows High Process Priority:** Automatically schedules with High Priority on the Windows kernel to avoid CPU starvation from background browser tabs.
- **Dedicated Cache & Session Storage:** Isolated session state keeps your broker login persisted across app restarts without browser tab clutter.

---

## ⌨️ Trading Shortcuts

| Shortcut | Action |
|---|---|
| **F5** or **Ctrl + R** | Instant Terminal Refresh |
| **F11** | Fullscreen Charting Mode |
| **Ctrl + =** | Zoom In (Multi-monitor / 4K) |
| **Ctrl + -** | Zoom Out |
| **Ctrl + 0** | Reset Zoom |
| **F12** | Developer Console (On-demand) |

---

## 🏗️ Project Structure

```
├── main.js          # Core Electron process with low-latency flags & window management
├── preload.js       # Minimal, secure context isolation bridge
├── assets/
│   └── icon.ico     # Fyers desktop application icon
├── start.bat        # High-priority Windows launcher script
├── package.json     # Configuration and build scripts
└── .gitignore       # Keeps user session tokens and builds out of version control
```

---

## 📦 Build & Run

### 1. Launch in Development / High-Performance Mode
```bash
# Run via launcher
start.bat

# Or via npm
npm start
```

### 2. Build Standalone .EXE
```bash
# Build Windows Installer (NSIS) & Portable .exe
npm run build
```

The output executables will be generated in the `dist/` directory.

---

## 🛡️ Security & Privacy
This application acts as a clean, direct browser instance loading official Fyers endpoints (`https://fyers.in/web/markets/home` and `https://trade.fyers.in/`). All credentials and 2FA tokens remain strictly between your device and Fyers's official authentication servers.
