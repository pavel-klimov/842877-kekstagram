'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var closeOverlayElement = function (className) {
    document.querySelector(className).classList.add('hidden');
  };

  var removeOverlayElement = function (className) {
    document.querySelector('main').removeChild(document.querySelector(className));
  };

  var errorOverlayTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');

  var successOverlayTemplate = document.querySelector('#success')
    .content
    .querySelector('.success');

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

  var onErrorOverlayEscButtonPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      removeOverlayElement('.error');
      document.removeEventListener('keydown', onErrorOverlayEscButtonPress);
    }
  };

  var onErrorOverlayClick = function (evt) {
    var target = evt.target;
    if (target === document.querySelector('.error')) {
      removeOverlayElement('.error');
    }
  };

  var getErrorOverlayElement = function () {
    var errorOverlayElement = errorOverlayTemplate.cloneNode(true);
    errorOverlayElement.addEventListener('click', onErrorOverlayClick);
    document.addEventListener('keydown', onErrorOverlayEscButtonPress);
    return errorOverlayElement;
  };

  var onSuccessOverlayEscButtonPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      removeOverlayElement('.success');
      document.removeEventListener('keydown', onSuccessOverlayEscButtonPress);
    }
  };

  var onSuccessOverlayClick = function (evt) {
    var target = evt.target;
    if ((target === document.querySelector('.success')) || (target === document.querySelector('.success__button'))) {
      removeOverlayElement('.success');
    }
  };

  var getSuccessOverlayElement = function () {
    var successOverlayElement = successOverlayTemplate.cloneNode(true);
    successOverlayElement.addEventListener('click', onSuccessOverlayClick);
    document.addEventListener('keydown', onSuccessOverlayEscButtonPress);
    return successOverlayElement;
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
  window.overlay = {
    onBigPictureOverlayEscButtonPress: onBigPictureOverlayEscButtonPress,
    onImgUploadOverlayEscButtonPress: onImgUploadOverlayEscButtonPress,
    removeOverlayElement: removeOverlayElement,
    closeOverlayElement: closeOverlayElement,
    getErrorOverlayElement: getErrorOverlayElement,
    getSuccessOverlayElement: getSuccessOverlayElement
  };
})();
