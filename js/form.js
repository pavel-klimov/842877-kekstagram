'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var closeOverlayElement = function (className) {
    document.querySelector(className).classList.add('hidden');
  };

  var onBigPictureOverlayEscButtonPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeOverlayElement('.big-picture');
      document.removeEventListener('keydown', onBigPictureOverlayEscButtonPress);
    }
  };

  var onImgUploadOverlayEscButtonPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeOverlayElement('.img-upload__overlay');
      document.querySelector('#upload-file').value = '';
      document.removeEventListener('keydown', onImgUploadOverlayEscButtonPress);
    }
  };

  document.querySelector('.big-picture__cancel').addEventListener('click', function () {
    closeOverlayElement('.big-picture');
    document.removeEventListener('keydown', onBigPictureOverlayEscButtonPress);
  });

  document.querySelector('.img-upload__cancel').addEventListener('click', function () {
    closeOverlayElement('.img-upload__overlay');
    document.removeEventListener('keydown', onImgUploadOverlayEscButtonPress);
  });

  var onImgUploadOverlayTextInputFocus = function () {
    document.removeEventListener('keydown', onImgUploadOverlayEscButtonPress);
  };
  var onImgUploadOverlayTextInputBlur = function () {
    document.addEventListener('keydown', onImgUploadOverlayEscButtonPress);
  };
  document.querySelector('.text__hashtags').addEventListener('focus', onImgUploadOverlayTextInputFocus);
  document.querySelector('.text__hashtags').addEventListener('blur', onImgUploadOverlayTextInputBlur);
  document.querySelector('.text__description').addEventListener('focus', onImgUploadOverlayTextInputFocus);
  document.querySelector('.text__description').addEventListener('blur', onImgUploadOverlayTextInputBlur);
  window.form = {
    onBigPictureOverlayEscButtonPress: onBigPictureOverlayEscButtonPress,
    onImgUploadOverlayEscButtonPress: onImgUploadOverlayEscButtonPress
  };
})();
