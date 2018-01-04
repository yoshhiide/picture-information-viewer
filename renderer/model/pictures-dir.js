'use strict';

const { remote, ipcRenderer, clipboard } = require('electron');
const Dialog = remote.dialog;
const PicturesList = require('./pictures-list');


class PicturesDir {

  constructor() {
    this.selector = document.querySelector('#pictures-dir');
    this.selector.addEventListener('click', (arg) => this.onClick(arg));
    this.picturesList = new PicturesList();
    this.ipcReply();
  }

  /** @private */
  onClick() {
    Dialog.showOpenDialog(null, {
      properties: [ 'openDirectory' ],
      title: 'フォルダ選択',
      defaultPath: '.'
    }, (dirNames) => {
      console.log(dirNames);

      this.ipcSend(dirNames[0]);
    });
  }

  ipcSend(dirName) {
    ipcRenderer.send('PICTURE-DIR:SEND', dirName);
  }

  ipcReply() {
    ipcRenderer.on('PICTURE-DIR:REPLY:SUCCESS', (event, fullExifList) => {
      console.log('ipcReply:', fullExifList);

      fullExifList.forEach(({ fileName, exifData, filePath }, idx) => {
        this.picturesList.setTableRow({
          filePath,
          fileName,
          exifData,
          fileNum: idx,
        });
      });
    });

    ipcRenderer.on('PICTURE-DIR:REPLY:ERROR', (event, err) => {
      console.log('ipcReply error.');
    });
  }
}

module.exports = PicturesDir;
