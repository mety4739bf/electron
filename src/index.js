const { log } = require('console');
const { app, BrowserWindow, Menu, Tray, ipcMain, Notification, autoUpdater, dialog } = require('electron');
const path = require('path');
let tray, notice;
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  Menu.setApplicationMenu(false);
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    title: 'E齿盟',
    icon: path.join(__dirname, 'favicon.ico'),
    width: 430,
    maxWidth: 430,
    height: 9999,
    resizable: true,
    center: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: true,
      nodeIntegration: true,
      contextIsolation: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  const webview = mainWindow.webContents;
  ipcMain.on('onMessage', (e, params) => {
    const isAllowed = Notification.isSupported();
    if (isAllowed) {
      const options = {
        title: params.title,
        body: params.body,
        icon: path.join(__dirname, 'favicon.ico')
      };
      if (notice) {
        notice.close();
        notice = null;
      }
      notice = new Notification(options);
      notice.show();
      notice.on('click', function () {
        webview.send('onMessage', 123);
      })
    }
  })

  const menuLIst = Menu.buildFromTemplate([
    {
      label: '显示主界面',
      click: () => {
        //显示主窗口
        mainWindow.show();
      }
    },
    {
      label: '退出',
      click: () => {
        // app.quit();
        app.exit();
      }
    }
  ])

  // 系统托盘
  tray = new Tray(path.join(__dirname, 'favicon.ico'));
  tray.on('double-click', () => {
    mainWindow.show();
  });
  tray.on('right-click', () => {
    //menuLIst是右键显示功能列表
    tray.popUpContextMenu(menuLIst)
  });

  mainWindow.on('close', e => {
    mainWindow.hide();
    e.preventDefault();
  });

  // 自动更新
  const server = 'https://your-deployment-url.com'
  const url = `${server}/update/${process.platform}/${app.getVersion()}`
  log(url);
  autoUpdater.setFeedURL({ url });
  autoUpdater.checkForUpdates();
  setInterval(() => {
    autoUpdater.checkForUpdates();
  }, 60000);

  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    const dialogOpts = {
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: 'Application Update',
      message: process.platform === 'win32' ? releaseNotes : releaseName,
      detail:
        'A new version has been downloaded. Restart the application to apply the updates.'
    }

    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) autoUpdater.quitAndInstall()
    })
  })
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {
  app.commandLine.appendSwitch('ignore-certificate-errors');
  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.