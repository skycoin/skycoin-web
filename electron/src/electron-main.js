'use strict'

const { app, Menu, BrowserWindow, shell, session, dialog, ipcMain } = require('electron');
const childProcess = require('child_process');
const path = require('path')
const url = require('url');

// This adds refresh and devtools console keybindings
// Page can refresh with cmd+r, ctrl+r, F5
// Devtools can be toggled with cmd+alt+i, ctrl+shift+i, F12
require('electron-debug')({enabled: true, showDevTools: false});
require('electron-context-menu')({});

global.eval = function() { throw new Error('bad!!'); }

app.commandLine.appendSwitch('ssl-version-fallback-min', 'tls1.2');
app.commandLine.appendSwitch('--no-proxy-server');
app.setAsDefaultProtocolClient('skycoin');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

var server = null;
const serverPort= 8412;

// It is only possible to make connections to hosts that are in this lists.
var allowedHosts = new Map();
allowedHosts.set('127.0.0.1:' + serverPort, true);
allowedHosts.set('api.coinmarketcap.com', true);
allowedHosts.set('api.github.com', true);
var allowedNodes = new Map();

function startServer() {
  console.log('Starting the local server');

  if (server) {
    console.log('Server already running');
    return
  }

  // Resolve server binary location
  var exePath = path.dirname(app.getPath('exe'));
  var exe = (() => {
    switch (process.platform) {
      case 'darwin':
        return path.join(exePath, './../server')
      case 'win32':
        return path.join(exePath, './server.exe');
      default:
        return path.join(exePath, './server');
    }
  })()

  var contentsPath = (() => {
    switch (process.platform) {
      case 'darwin':
        return path.join(exePath, './../dist/')
      case 'win32':
        return path.join(exePath, './dist/');
      default:
        return path.join(exePath, './dist/');
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

  win.loadURL(`http://127.0.0.1:` + serverPort);

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

  win.webContents.on('will-navigate', function(e, url) {
    e.preventDefault();
    require('electron').shell.openExternal(url);
  });

  // create application's main menu
  var template = [{
    label: 'Skycoin',
    submenu: [
      { label: 'Quit', accelerator: 'Command+Q', click: function() { app.quit(); } }
    ]
  }, {
    label: 'Edit',
    submenu: [
      { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
      { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
      { type: 'separator' },
      { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
      { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
      { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
      { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' }
    ]
  }, {
    label: 'Show',
    submenu: [
      {
        label: 'DevTools',
        accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            focusedWindow.toggleDevTools();
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
    let requestHost = url.parse(details.url).host;
    if (!allowedHosts.has(requestHost) && !allowedNodes.has(requestHost)) {
      callback({cancel: true})
      return;
    }
    callback({cancel: false})
  });
}

// Gets the URLs of the nodes of all the coins and adds the hosts to allowedNodes, so that it is
// possible to connect with them.
ipcMain.on('setNodesUrls', (event, list) => {
  allowedNodes = new Map();
  list.forEach(value => allowedNodes.set(url.parse(value).host, true));
  event.returnValue = null;
});

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
