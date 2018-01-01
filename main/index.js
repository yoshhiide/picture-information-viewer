'use strict';

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const exifList = require('./model/exif-list');

let win;


// create windows
const createWindow = () => {
  win = new BrowserWindow({
    width: 1300,
    height: 800,
    'node-integration': false
  });

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  //win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
};


app.on('ready', () => {
  createWindow();
});


app.on('window-all-closed', () => {
  // for macos process
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


app.on('activate', (e, hasVisibleWindows) => {
  // for macos dock
  if ((win === null) || !hasVisibleWindows) {
    createWindow();
  }
});


ipcMain.on('PICTURE-DIR:SEND', (event, dirNames) => {
  const fullExifList = exifList(dirNames)
    .then(fullExifList => {
      console.log(fullExifList);
      event.sender.send('PICTURE-DIR:REPLY:SUCCESS', fullExifList);
    })
    .catch(err => {
      event.sender.send('PICTURE-DIR:REPLY:ERROR', err);
    });
});
