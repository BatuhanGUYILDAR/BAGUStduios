const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electro', {
  platform: () => ipcRenderer.invoke('app:platform'),
  onBackendLog: (handler) => {
    const listener = (_event, payload) => handler(payload);
    ipcRenderer.on('backend:log', listener);
    return () => ipcRenderer.removeListener('backend:log', listener);
  },
});
