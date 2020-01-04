'use strict';

const { clipboard } = require('electron');


class PicturesList {

  constructor() {
    this.selector = document.querySelector('#pictures-list');
  }

  /**
   * <div class="row">
   *   <div><img class="picture-image"></div>
   *   <div class="picture-file-name">(--camera--)</div>
   *   <div class="picture-exif">(--exif--)</div>
   *   <div class="picture-information">[COPY EXIF]</div>
   * </div>
   */
  setTableRow({ filePath, fileName, exifData, fileNum = 0 }) {
    const row = document.createElement('div');
    row.classList.add('row');

    const imageCol = document.createElement('div');
    imageCol.classList.add('column');
    imageCol.classList.add('column-20');

    const image = document.createElement('img');
    image.classList.add('picture-image');
    image.setAttribute('data-normal', filePath);
    imageCol.appendChild(image);

    const cameraInfo = document.createElement('div');
    cameraInfo.classList.add('picture-file-name');
    cameraInfo.classList.add('column');
    cameraInfo.classList.add('column-20');
    cameraInfo.innerText = fileName;

    const exifInfo = document.createElement('div');
    exifInfo.classList.add('picture-exif');
    exifInfo.classList.add('column');
    exifInfo.classList.add('column-50');
    exifInfo.setAttribute('data-idx', fileNum);
    exifInfo.innerText = exifData;

    const copyLink = document.createElement('div');
    copyLink.classList.add('picture-information');
    exifInfo.classList.add('column');
    exifInfo.classList.add('column-10');
    copyLink.classList.add('button');
    copyLink.classList.add('button-clear');
    copyLink.innerText = '[COPY EXIF]';
    this.informationOnClick(copyLink, filePath);

    // create container row
    row.appendChild(imageCol);
    row.appendChild(cameraInfo);
    row.appendChild(exifInfo);
    row.appendChild(copyLink);

    this.selector.appendChild(row);
  }


  informationOnClick(selector, filePath) {
    selector.addEventListener('click', () => {
      // clipboard copy
      clipboard.writeText(selector.closest('.row').querySelector('.picture-exif').innerHTML.replace(/<br>/g, '\n'));

      // sweetalert2
      swal({
        position: 'top',
        type: 'success',
        imageUrl: filePath,
        title: 'copy exif complete',
        showConfirmButton: false,
        timer: 1000,
        width: '400px',
      });
    });
  }

}

module.exports = PicturesList;
