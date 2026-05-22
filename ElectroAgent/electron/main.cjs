const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const { spawn } = require('node:child_process');

let mainWindow = null;
let backendProcess = null;

const backendPort = 8710;
const rendererUrl = process.env.ELECTRON_RENDERER_URL;

function pythonExecutable() {
  const root = path.join(__dirname, '..');
  const candidates = [
    path.join(root, '.venv', 'Scripts', 'python.exe'),
    path.join(root, 'backend', '.venv', 'Scripts', 'python.exe'),
    'python',
  ];

  return candidates.find((candidate) => {
    if (candidate === 'python') {
      return true;
    }
    return fs.existsSync(candidate);
  });
}

function startBackend() {
  if (backendProcess) {
    return;
  }

  const backendRoot = path.join(__dirname, '..', 'backend');
  const python = pythonExecutable();
  const args = ['-m', 'uvicorn', 'app.main:app', '--host', '127.0.0.1', '--port', String(backendPort)];

  backendProcess = spawn(python, args, {
    cwd: backendRoot,
    windowsHide: true,
    env: {
      ...process.env,
      ELECTRO_AGENT_DESKTOP: '1',
    },
  });

  backendProcess.stdout?.on('data', (chunk) => {
    mainWindow?.webContents.send('backend:log', chunk.toString());
  });

  backendProcess.stderr?.on('data', (chunk) => {
    mainWindow?.webContents.send('backend:log', chunk.toString());
  });

  backendProcess.on('exit', () => {
    backendProcess = null;
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1180,
    minHeight: 760,
    backgroundColor: '#020504',
    title: 'Electro Agent',
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 18, y: 16 },
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  if (rendererUrl) {
    mainWindow.loadURL(rendererUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }
}

app.whenReady().then(() => {
  startBackend();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('before-quit', () => {
  if (backendProcess) {
    backendProcess.kill();
    backendProcess = null;
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('app:platform', () => ({
  platform: process.platform,
  backendUrl: `http://127.0.0.1:${backendPort}`,
}));
