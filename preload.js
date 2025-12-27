const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // Settings
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSetting: (key, val) => ipcRenderer.invoke('save-setting', key, val),

  // Window Controls
  controlWindow: (action) => ipcRenderer.send('window-control', action),
  
  // Listen Keyboard Shortcuts 
  onFocusInput: (callback) => ipcRenderer.on('focus-input', callback)
});