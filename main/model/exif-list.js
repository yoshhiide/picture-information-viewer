'use strict';

const path = require('path');
const fs = require('fs');
const Exif = require('exif').ExifImage;
const Fraction = require('fraction.js');


const readdirAsync = (dirName) => new Promise((resolve, reject) => {
  fs.readdir(dirName, (err, files) => {
    if (err) return reject(err);
    resolve(files);
  });
});

const exif = (filePath) => {
  return new Promise((resolve, reject) => {
    new Exif({ image: filePath }, (err, exifData) => {
      if (err) {
        return reject(err);
      }

      resolve(exifData);
    });
  });
};

const showCameraInfo = (info) => {
  return [
    // Camera info
    info.image.Model,
    '／',
    // Lens info
    info.exif.LensModel,
    '／',
    // FocalLength
    info.exif.FocalLength,
    'mm',
    '／',
    // F
    'F',
    info.exif.FNumber,
    '／',
    // 露出時間
    (new Fraction(info.exif.ExposureTime)).toFraction(true),
    's／',
    // ISO
    'ISO ',
    info.exif.ISO
  ].join('');
};

const showExif = ({ fileName, dirName }) => {
  return exif(path.resolve(dirName, fileName))
    .then(info => ({
      fileName,
      exifData: showCameraInfo(info),
      filePath: path.resolve(dirName, fileName)
    }));
};


/**
 * @returns {Promise}
 * @resolve {{fileName: string, exifData: string, filePath: string }[]}
 */
module.exports = (dirName) => {
  return readdirAsync(dirName)
    .then(list => list.filter(fileName => /\.JPG$/i.test(fileName)))
    .then(list => Promise.all(list.map(fileName => showExif({ fileName, dirName }))))
    .catch(err => {
      console.error(err);
      return Promise.reject(err);
    });
};
