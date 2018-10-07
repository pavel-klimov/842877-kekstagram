'use strict';

(function () {
  var LEFT_KEYCODE = 37;
  var LEFT_EXTRA_KEYCODE = 100;
  var RIGHT_KEYCODE = 39;
  var RIGHT_EXTRA_KEYCODE = 102;
  var EFFECT_STEP = 5;
  var width = document.querySelector('.effect-level__line').offsetWidth;
  var elementX = document.querySelector('.effect-level__line').getBoundingClientRect().x;
  var nameEffect = document.querySelector('.effects__radio:checked').value;
  var changeEffectLevel = function (evtX) {
    var position = evtX - elementX;
    if (evtX < elementX) {
      position = elementX;
    } else if (evtX > (width + elementX)) {
      position = width;
    }
    var level = position / width * 100;
    window.picture.setEffectLevelLine(level);
    window.picture.setEffectLevelBigPicture(level, nameEffect);
  };

  var onEffectLevelPinKeydown = function (evt) {
    console.log(evt.keyCode);
    if ((evt.keyCode === LEFT_KEYCODE) || (evt.keyCode === LEFT_EXTRA_KEYCODE)) {
      changeEffectLevel(evt.clientX - EFFECT_STEP);
    } else if ((evt.keyCode === RIGHT_KEYCODE) || (evt.keyCode === RIGHT_EXTRA_KEYCODE)) {
      changeEffectLevel(evt.clientX + EFFECT_STEP);
    }
    /*
    if (evt.keyCode === ESC_KEYCODE) {
      removeOverlayElement('.error');
      document.removeEventListener('keydown', onErrorOverlayEscButtonPress);
    }
    */
  };
  var onSliderFocus = function () {
    document.addEventListener('keydown', onEffectLevelPinKeydown);
  };
  var onSliderBlur = function () {
    document.removeEventListener('keydown', onEffectLevelPinKeydown);
  };

  // Drag and Drop:
  document.querySelector('.effect-level__pin').addEventListener('mousedown', function () {
    var onEffectLevelPinMove = function (evt) {
      changeEffectLevel(evt.clientX);
    };

    var onEffectLevelPinMouseUp = function () {
      document.removeEventListener('mousemove', onEffectLevelPinMove);
      document.removeEventListener('mouseup', onEffectLevelPinMouseUp);
    };
    document.addEventListener('mousemove', onEffectLevelPinMove);
    document.addEventListener('mouseup', onEffectLevelPinMouseUp);
  });

  document.querySelector('.effect-level__pin').addEventListener('focus', onSliderFocus);
  document.querySelector('.effect-level__pin').addEventListener('blur', onSliderBlur);
})();
