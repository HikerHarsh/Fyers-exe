const { app, BrowserWindow, Tray, Menu, shell, ipcMain, nativeTheme, globalShortcut } = require('electron');
const path = require('path');
const os   = require('os');

// ══════════════════════════════════════════════════════════════════════════════
// INSTITUTIONAL-GRADE LOW-LATENCY CHROMIUM & V8 FLAGS (Zero-Lag Realtime)
// ══════════════════════════════════════════════════════════════════════════════

// 1. Rendering Engine: Direct GPU 60/120fps Rendering & No Frame Drops
app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('enable-features', 'CanvasOopRasterization,VaapiVideoDecoder');

// 2. Anti-Freeze & Anti-Throttle (Keeps WebSocket Ticks Live Even Minimized/Hidden)
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('disable-backgrounding-occluded-windows');
app.commandLine.appendSwitch('disable-features', 'CalculateNativeWinOcclusion');

// 3. Network & WebSocket Speed: Unlimited Sockets & Direct Fast Path
app.commandLine.appendSwitch('ignore-connections-limit', 'trade.fyers.in,fyers.in,socket.fyers.in');
app.commandLine.appendSwitch('enable-tcp-fast-open');

// 4. V8 Engine Tuning: 4GB Heap to Eliminate Garbage Collection (GC) Freezes
app.commandLine.appendSwitch('js-flags', '--max-old-space-size=4096');

// 5. Cache Control: Fast 250MB Memory/Disk Cache
app.commandLine.appendSwitch('disk-cache-size', '262144000');
app.commandLine.appendSwitch('no-sandbox');

// ─── Set High CPU Priority on Windows (Scheduler Prioritizes Fyers) ──────────
try {
  os.setPriority(os.constants.priority.PRIORITY_HIGH);
} catch (e) {}

// ─── Dedicated Paths ─────────────────────────────────────────────────────────
app.setPath('userData', path.resolve('D:\\fyers-desktop\\userdata'));
app.setPath('cache',    path.resolve('D:\\fyers-desktop\\cache'));
app.setPath('logs',     path.resolve('D:\\fyers-desktop\\logs'));

const FYERS_URL = 'https://fyers.in/web/markets/home';
const APP_NAME  = 'Fyers Desktop (Ultra-Fast)';

let mainWindow = null;
let tray       = null;

Menu.setApplicationMenu(null);

app.whenReady().then(() => {
  nativeTheme.themeSource = 'dark';

  createWindow();
  createTray();

  // ─── Essential Trader Shortcuts ───────────────────────────────────────────
  globalShortcut.register('F5', () => mainWindow && mainWindow.webContents.reload());
  globalShortcut.register('CommandOrControl+R', () => mainWindow && mainWindow.webContents.reload());

  // F11: Fullscreen Mode
  globalShortcut.register('F11', () => {
    if (mainWindow) mainWindow.setFullScreen(!mainWindow.isFullScreen());
  });

  // Zoom Controls
  globalShortcut.register('CommandOrControl+=', () => {
    if (mainWindow) {
      const z = mainWindow.webContents.getZoomFactor();
      if (z < 2.0) mainWindow.webContents.setZoomFactor(z + 0.1);
    }
  });
  globalShortcut.register('CommandOrControl+-', () => {
    if (mainWindow) {
      const z = mainWindow.webContents.getZoomFactor();
      if (z > 0.6) mainWindow.webContents.setZoomFactor(z - 0.1);
    }
  });
  globalShortcut.register('CommandOrControl+0', () => {
    if (mainWindow) mainWindow.webContents.setZoomFactor(1.0);
  });

  // F12: DevTools on-demand
  globalShortcut.register('F12', () => {
    if (mainWindow) mainWindow.webContents.toggleDevTools();
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width:           1480,
    height:          920,
    minWidth:        960,
    minHeight:       600,
    title:           APP_NAME,
    icon:            path.join(__dirname, 'assets', 'icon.ico'),
    backgroundColor: '#121212',
    autoHideMenuBar: true,
    show:            false,
    webPreferences: {
      nodeIntegration:             false,
      contextIsolation:            true,
      preload:                     path.resolve(__dirname, 'preload.js'),
      webSecurity:                 true,
      allowRunningInsecureContent: false,
      backgroundThrottling:        false, // Critical: 0% throttling in background
      spellcheck:                  false, // Saves CPU cycles
    },
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.loadURL(FYERS_URL, {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  });

  mainWindow.webContents.on('page-title-updated', (event, title) => {
    mainWindow.setTitle(`${APP_NAME} — ${title || 'Trade'}`);
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.includes('fyers.in')) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.includes('fyers.in')) return { action: 'allow' };
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
}

function createTray() {
  const iconPath = path.join(__dirname, 'assets', 'icon.ico');
  try {
    tray = new Tray(iconPath);
  } catch (e) {
    return;
  }

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '📈 Fyers Kholo',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      },
    },
    { type: 'separator' },
    {
      label: '🔄 Reload (F5)',
      click: () => mainWindow && mainWindow.webContents.reload(),
    },
    {
      label: '🖥️ Fullscreen (F11)',
      click: () => {
        if (mainWindow) mainWindow.setFullScreen(!mainWindow.isFullScreen());
      },
    },
    {
      label: '🧹 Cache Clear',
      click: async () => {
        if (mainWindow) {
          await mainWindow.webContents.session.clearCache();
          mainWindow.webContents.reload();
        }
      },
    },
    { type: 'separator' },
    {
      label: '❌ Quit',
      click: () => {
        app.isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setToolTip(APP_NAME);
  tray.setContextMenu(contextMenu);
  tray.on('double-click', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) mainWindow.focus();
      else {
        mainWindow.show();
        mainWindow.focus();
      }
    }
  });
}

ipcMain.on('reload', () => {
  if (mainWindow) mainWindow.webContents.reload();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  app.isQuitting = true;
});
