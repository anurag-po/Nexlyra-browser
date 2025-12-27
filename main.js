const { app, BrowserWindow, ipcMain, Menu, MenuItem } = require('electron');
const path = require('path');
const Store = require('electron-store');

const store = new Store();
let mainWindow;

function createWindow() {
  const bounds = store.get('windowBounds', { width: 1000, height: 800 });

  mainWindow = new BrowserWindow({
    width: bounds.width,
    height: bounds.height,
    x: bounds.x,
    y: bounds.y,
    frame: false, 
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: true,
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('close', () => {
    store.set('windowBounds', mainWindow.getBounds());
  });
  
  // --- NATIVE MENU (The Keyboard Fix) ---
  const menu = new Menu();
  
  // File Menu (Close App)
  menu.append(new MenuItem({
    label: 'File',
    submenu: [
      { role: 'quit' },
      { role: 'close', accelerator: 'CmdOrCtrl+W' } // Native Ctrl+W support
    ]
  }));

  // View Menu (Reload, etc)
  menu.append(new MenuItem({
    label: 'View',
    submenu: [
      { role: 'reload', accelerator: 'CmdOrCtrl+R' },
      { role: 'forceReload', accelerator: 'CmdOrCtrl+Shift+R' },
      { role: 'toggleDevTools', accelerator: 'CmdOrCtrl+Shift+I' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  }));

  // Edit Menu (Copy/Paste must exist for them to work!)
  menu.append(new MenuItem({
    label: 'Edit',
    role: 'editMenu'
  }));

  // Custom Shortcuts
  menu.append(new MenuItem({
    label: 'Window',
    submenu: [
      { 
        label: 'Focus Address Bar', 
        accelerator: 'CmdOrCtrl+L', 
        click: () => {
          // Send a message to the renderer to focus the bar
          mainWindow.webContents.send('focus-input');
        } 
      }
    ]
  }));

  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC Handlers
ipcMain.handle('get-settings', () => {
  return {
    engine: store.get('engine', 'google'),
    aiEngine: store.get('aiEngine', 'perplexity'),
    lastUrl: store.get('lastUrl', 'nexlyra://home'),
    theme: store.get('theme', 'dark')
  };
});

ipcMain.handle('save-setting', (event, key, value) => {
  store.set(key, value);
});

ipcMain.on('window-control', (event, action) => {
  const win = BrowserWindow.getFocusedWindow();
  if (!win) return;
  switch (action) {
    case 'minimize': win.minimize(); break;
    case 'maximize': win.isMaximized() ? win.unmaximize() : win.maximize(); break;
    case 'close': win.close(); break;
  }
});