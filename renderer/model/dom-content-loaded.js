'use strict';

const PicturesDir = require('../renderer/model/pictures-dir');
const Layzr = require('layzr.js');
const layzr = Layzr();

document.addEventListener('DOMContentLoaded', () => {
  // 遅延ロード
  layzr
    .update()
    .check()
    .handlers(true);

  new PicturesDir();
});
