const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const http = require('node:http');
const net = require('node:net');
const { spawn } = require('node:child_process');

let mainWindow = null;
let backendProcess = null;

const preferredBackendPort = Number(process.env.ELECTRO_AGENT_BACKEND_PORT || 8710);
let backendPort = preferredBackendPort;
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

function checkBackendHealth(port) {
  return new Promise((resolve) => {
    const request = http.get(
      {
        host: '127.0.0.1',
        port,
        path: '/health',
        timeout: 650,
      },
      (response) => {
        response.resume();
        resolve(response.statusCode === 200);
      },
    );

    request.on('timeout', () => {
      request.destroy();
      resolve(false);
    });
    request.on('error', () => resolve(false));
  });
}

function canListen(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen(port, '127.0.0.1');
  });
}

async function findBackendPort() {
  if (await checkBackendHealth(preferredBackendPort)) {
    return preferredBackendPort;
  }

  for (let port = preferredBackendPort; port < preferredBackendPort + 40; port += 1) {
    if (await canListen(port)) {
      return port;
    }
  }

  throw new Error('No local backend port is available.');
}

async function startBackend() {
  if (backendProcess) {
    return;
  }

  backendPort = await findBackendPort();
  if (await checkBackendHealth(backendPort)) {
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
      ELECTRO_AGENT_BACKEND_PORT: String(backendPort),
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

app.whenReady().then(async () => {
  await startBackend();
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
