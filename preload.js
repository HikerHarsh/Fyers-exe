// preload.js — Minimal & Lightweight Bridge
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('fyersApp', {
  reload: () => ipcRenderer.send('reload'),
});
