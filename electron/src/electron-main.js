'use strict'

const { app, Menu, BrowserWindow, shell, session, dialog, ipcMain } = require('electron');
const childProcess = require('child_process');
const path = require('path')
const url = require('url');
const fs = require('fs');

global.eval = function() { throw new Error('bad!!'); }

// Detect if the code is running with the "dev" arg. The "dev" arg is added when running npm
// start. If this is true, a local test server will not be started, but one is expected to be running,
// the contents served in http://localhost:4200 will be displayed and it will be allowed to
// reload the URLs using the Electron window, so that it is easier to test the changes made to
// the UI using npm start.
let dev = process.argv.find(arg => arg === 'dev') ? true : false;

app.commandLine.appendSwitch('ssl-version-fallback-min', 'tls1.2');
app.commandLine.appendSwitch('--no-proxy-server');
app.setAsDefaultProtocolClient('skycoin');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

let server = null;
const serverPort= 8412;

// It is only possible to make connections to hosts that are in this lists.
var allowedHosts = new Map();
allowedHosts.set('127.0.0.1:' + serverPort, true);
allowedHosts.set('api.coinpaprika.com', true);
allowedHosts.set('api.github.com', true);
allowedHosts.set('swaplab.cc', true);
if (dev) {
  allowedHosts.set('localhost:4200', true);
}

var defaultCoinHosts = new Map();
defaultCoinHosts.set('node.skycoin.net', true);

let allowedNodes = new Map();
let coinsWithAllowedNodes = new Map();
let temporarilyAllowedCoin;

function startServer() {
  if (!dev) {
    console.log('Starting the local server');

    if (server) {
      console.log('Server already running');
      return
    }

    // Resolve server binary location
    var appPath = app.getPath('exe');
    var exe = (() => {
      switch (process.platform) {
        case 'darwin':
          return path.join(appPath, '../../Resources/app/server')
        case 'win32':
          // User only the relative path on windows due to short path length
          // limits
          return './resources/app/server.exe';
        case 'linux':
          return path.join(path.dirname(appPath), './resources/app/server');
        default:
          return './resources/app/server';
      }
    })()

    var contentsPath = (() => {
      switch (process.platform) {
        case 'darwin':
          return path.join(appPath, '../../Resources/app/dist/')
        case 'win32':
          return path.join(path.dirname(appPath), './resources/app/dist/');
        case 'linux':
          return path.join(path.dirname(appPath), './resources/app/dist/');
        default:
          return './resources/app/dist/';
      }
    })()

    // Start the server
    server = childProcess.spawn(exe, ['-port=' + serverPort, '-path=' + contentsPath]);

    createWindow();

    server.on('error', (e) => {
      console.log('Failed to start the local server: ' + e);
      app.quit();
    });

    server.on('close', (code) => {
      console.log('Local server closed');
      app.quit();
    });

    server.on('exit', (code) => {
      console.log('Local server exited');
      app.quit();
    });
  } else {
    // If in dev mode, simply open the dev server URL.
    console.log('Omitting the start of the test server. The contents of http://localhost:4200/ will be shown');
    createWindow();
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  startServer();
});

function createWindow() {
  if (win) {
    return;
  }

  console.log('Creating window');

  // To fix appImage doesn't show icon in dock issue.
  var appPath = app.getPath('exe');
  var iconPath = (() => {
    switch (process.platform) {
      case 'linux':
        return path.join(path.dirname(appPath), './resources/icon512x512.png');
    }
  })()

  // Create the browser window.
  win = new BrowserWindow({
    width: 1200,
    height: 900,
    title: 'Skycoin',
    icon: iconPath,
    nodeIntegration: false,
    webPreferences: {
      webgl: false,
      webaudio: false,
      contextIsolation: false,
      webviewTag: false,
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      allowRunningInsecureContent: false,
      webSecurity: true,
      plugins: false,
      preload: __dirname + '/electron-api.js',
    },
  });

  // patch out eval
  win.eval = global.eval;
  win.webContents.executeJavaScript('window.eval = 0;');

  if (!dev) {
    win.loadURL(`http://127.0.0.1:` + serverPort);
  } else {
    win.loadURL(`http://localhost:4200/`);
  }

  const ses = win.webContents.session
  ses.clearCache(function () {
    console.log('Cleared the caching of the skycoin wallet.');
  });

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  // If in dev mode, allow to open URLs.
  if (!dev) {
    win.webContents.on('will-navigate', function(e, url) {
      e.preventDefault();
      require('electron').shell.openExternal(url);
    });
  }

  // Open links with target='_blank' in default browser.
  win.webContents.on('new-window', function(e, url) {
    e.preventDefault();
    require('electron').shell.openExternal(url);
  });

  // create application's main menu
  var template = [{
    label: 'Skycoin',
    submenu: [
      { label: 'Reload', role: 'reload' },
      { type: 'separator' },
      { label: 'Quit', role: 'quit' }
    ]
  }, {
    label: 'Edit',
    submenu: [
      { label: 'Undo', role: 'undo' },
      { label: 'Redo', role: 'redo' },
      { type: 'separator' },
      { label: 'Cut', role: 'cut' },
      { label: 'Copy', role: 'copy' },
      { label: 'Paste', role: 'paste' },
      { label: 'Select All', role: 'selectall' }
    ]
  }, {
    label: 'Show',
    submenu: [
      {
        label: 'DevTools',
        accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            win.webContents.openDevTools();
          }
        }
      },
    ]
  }];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  session
    .fromPartition('')
    .setPermissionRequestHandler((webContents, permission, callback) => {
      return callback(false);
    });

  // Blocks the connection if the URL is not in allowedHosts.
  session.defaultSession.webRequest.onBeforeRequest(['*://*./*'], function(details, callback) {
    if (!details.url.startsWith('chrome-devtools://')) {
      let requestUrl = details.url;
      if (details.url.startsWith('blob:')) {
        requestUrl = requestUrl.substr('blob:'.length, requestUrl.length - 'blob:'.length);
      }

      let requestHost = url.parse(requestUrl).host;
      if (!allowedHosts.has(requestHost) && !allowedNodes.has(requestHost) && !defaultCoinHosts.has(requestHost) && (!temporarilyAllowedCoin || temporarilyAllowedCoin.host !== requestHost)) {
        callback({cancel: true})
        return;
      }
    }
    callback({cancel: false})
  });
}

const customNodeUrlsFilePath = path.join(app.getPath('appData'), './Skycoin');
// File with the info about the custom node URLs added by the user.
const customNodeUrlsFile = path.join(customNodeUrlsFilePath, './custom-nodes.snd');

// Load, from customNodeUrlsFile, the custom node URLs added by the user and add them to the URL whitelist.
ipcMain.on('loadNodeUrlsSync', (event) => {
  let rawData;
  let data;

  if (fs.existsSync(customNodeUrlsFile)) {
    rawData = fs.readFileSync(customNodeUrlsFile, 'utf8');
  } else {
    rawData = '{}';
  }

  data = JSON.parse(rawData);

  for (var key in data) {
    coinsWithAllowedNodes.set(key + '', data[key]);
    allowedNodes.set(url.parse(data[key]).host, true);
  }

  event.returnValue = rawData;
});

// Removes a coin from customNodeUrlsFile an the URL whitelist.
ipcMain.on('removeAllowedCoinSync', (event, id) => {
  if (coinsWithAllowedNodes.has(id + '')) {
    allowedNodes.delete(url.parse(coinsWithAllowedNodes.get(id + '')).host);
    coinsWithAllowedNodes.delete(id + '');
    saveNodeUrls();
  }

  event.returnValue = null;
});

// Temporarily adds a coin to the URL whitelist, but not to customNodeUrlsFile.
ipcMain.on('temporarilyAllowCoinSync', (event, data) => {
  const coinHost = url.parse(data.url).host;
  if (allowedNodes.has(coinHost)) {
    event.returnValue = 1;
    return;
  }

  const dialogOptions = {
    type: 'warning',
    buttons: [data.confirmationCancel, data.confirmationOk],
    defaultId: 0,
    title: data.confirmationTitle,
    message: data.confirmationText,
    cancelId: 0,
    noLink: true,
  }

  dialog.showMessageBox(win, dialogOptions, response => {
    if (response === 1) {
      temporarilyAllowedCoin = {};
      temporarilyAllowedCoin['id'] = data.id;
      temporarilyAllowedCoin['url'] = data.url;
      temporarilyAllowedCoin['host'] = coinHost;

      event.returnValue = 0;
    } else {
      event.returnValue = 2;
    }
  })
});

// Removes a coin temporarily added to the URL whitelist.
ipcMain.on('removeTemporarilyAllowedCoinSync', (event) => {
  temporarilyAllowedCoin = null;
  event.returnValue = null;
});

// Adds a temporarily allowed coin to customNodeUrlsFile, so its URL can be accesses in future sessions.
ipcMain.on('acceptTemporarilyAllowedCoinSync', (event) => {
  if (coinsWithAllowedNodes.has(temporarilyAllowedCoin['id'] + '')) {
    allowedNodes.delete(url.parse(coinsWithAllowedNodes.get(temporarilyAllowedCoin['id'] + '')).host);
  }

  coinsWithAllowedNodes.set(temporarilyAllowedCoin['id'] + '', temporarilyAllowedCoin['url']);
  allowedNodes.set(temporarilyAllowedCoin['host'], true);

  temporarilyAllowedCoin = null;
  saveNodeUrls();

  event.returnValue = null;
});

// Updates customNodeUrlsFile.
function saveNodeUrls() {
  const data = {};
  coinsWithAllowedNodes.forEach((val, key) => {
    data[key] = val;
  });

  if (!fs.existsSync(customNodeUrlsFilePath)) {
    fs.mkdirSync(customNodeUrlsFilePath, { recursive: true });
  }

  fs.writeFileSync(customNodeUrlsFile, JSON.stringify(data), 'utf8');
}

// Enforce single instance
const alreadyRunning = app.makeSingleInstance((commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  if (win) {
    if (win.isMinimized()) {
      win.restore();
    }
    win.focus();
  } else {
    createWindow();
  }
});

if (alreadyRunning) {
  app.quit();
  return;
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('quit', () => {
  if (server) {
    server.kill();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

app.on('web-contents-created', (event, contents) => {
  contents.on('will-attach-webview', (event, webPreferences, params) => {
    // Strip away preload scripts if unused or verify their location is legitimate
    delete webPreferences.preload
    delete webPreferences.preloadURL

    // Disable Node.js integration
    webPreferences.nodeIntegration = false

    // Verify URL being loaded
    if (!params.src.startsWith('file:')) {
      event.preventDefault();
    }
  });
});
