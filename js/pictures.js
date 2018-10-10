'use strict';

(function () {
  var EFFECTS_PREVIEW_SETTINGS = {
    'chrome': {
      name: 'grayscale',
      min: 0,
      max: 1,
      dimension: '',
      className: 'effects__preview--chrome'
    },
    'sepia': {
      name: 'sepia',
      min: 0,
      max: 1,
      dimension: '',
      className: 'effects__preview--sepia'
    },
    'marvin': {
      name: 'invert',
      min: 0,
      max: 100,
      dimension: '%',
      className: 'effects__preview--marvin'
    },
    'phobos': {
      name: 'blur',
      min: 0,
      max: 3,
      dimension: 'px',
      className: 'effects__preview--phobos'
    },
    'heat': {
      name: 'brightness',
      min: 1,
      max: 3,
      dimension: '',
      className: 'effects__preview--heat'
    }
  };
  var FILTER_EFFECT_DEFAULT = 100;
  var SCALE_EFFECT_STEP = 25;
  var SCALE_EFFECT_DEFAULT = 100;
  var SCALE_EFFECT_MIN = 25;
  var SCALE_EFFECT_MAX = 100;

  var setScaleEffectLevel = function (level) {
    document.querySelector('.scale__control--value').value = level + '%';
    document.querySelector('.img-upload__preview').style.transform = 'scale(' + level / 100 + ')';
  };

  var onScaleEffectLevel = function (evt) {
    var level = parseInt(document.querySelector('.scale__control--value').value, 10);
    var target = evt.target;
    if (target.classList.contains('scale__control--smaller')) {
      level -= SCALE_EFFECT_STEP;
      if (level <= SCALE_EFFECT_MIN) {
        level = SCALE_EFFECT_MIN;
      }
    } else if (target.classList.contains('scale__control--bigger')) {
      level += SCALE_EFFECT_STEP;
      if (level >= SCALE_EFFECT_MAX) {
        level = SCALE_EFFECT_MAX;
      }
    }
    setScaleEffectLevel(level);
  };

  var calculatingPercentageOfInterval = function (percent, min, max) {
    return (percent / 100) * (max - min) + min;
  };

  document.querySelector('.img-upload__scale').addEventListener('click', onScaleEffectLevel);
  var getCurrentFilterStyle = function (level, nameEffect) {
    return (nameEffect === 'none') ? 'none' :
      EFFECTS_PREVIEW_SETTINGS[nameEffect].name + '(' +
      calculatingPercentageOfInterval(level, EFFECTS_PREVIEW_SETTINGS[nameEffect].min, EFFECTS_PREVIEW_SETTINGS[nameEffect].max) +
      EFFECTS_PREVIEW_SETTINGS[nameEffect].dimension + ')';
  };

  var setFilterEffectClass = function (nameEffect) {
    if (nameEffect === 'none') {
      document.querySelector('.img-upload__effect-level').classList.add('hidden');
      var onFilterFromNoneChange = function () {
        document.querySelector('.img-upload__effect-level').classList.remove('hidden');
        document.querySelector('.effects__list').removeEventListener('change', onFilterFromNoneChange);
      };
      document.querySelector('.effects__list').addEventListener('change', onFilterFromNoneChange);
    } else {
      document.querySelector('.img-upload__preview').classList.add(EFFECTS_PREVIEW_SETTINGS[nameEffect].className);
      var onEffectFilterChange = function () {
        document.querySelector('.img-upload__preview').classList.remove(EFFECTS_PREVIEW_SETTINGS[nameEffect].className);
        document.querySelector('.effects__list').removeEventListener('change', onEffectFilterChange);
      };
      document.querySelector('.effects__list').addEventListener('change', onEffectFilterChange);
    }
  };

  var setEffectLevelLine = function (level) {
    document.querySelector('.effect-level__pin').style.left = level + '%';
    document.querySelector('.effect-level__depth').style.width = level + '%';
  };

  var setEffectLevelBigPicture = function (level, nameEffect) {
    document.querySelector('.img-upload__preview').style.filter = getCurrentFilterStyle(level, nameEffect);
  };

  var onFilterEffectChange = function () {
    var nameEffect = document.querySelector('.effects__radio:checked').value;
    document.querySelector('.effect-level__value').value = FILTER_EFFECT_DEFAULT;
    setFilterEffectClass(nameEffect);
    setEffectLevelLine(FILTER_EFFECT_DEFAULT);
    setEffectLevelBigPicture(FILTER_EFFECT_DEFAULT, nameEffect);
  };

  // Drag and Drop:
  document.querySelector('.effect-level__pin').addEventListener('mousedown', function () {
    var width = document.querySelector('.effect-level__line').offsetWidth;
    var elementX = document.querySelector('.effect-level__line').getBoundingClientRect().left;
    var nameEffect = document.querySelector('.effects__radio:checked').value;
    var changeEffectLevel = function (evtX) {
      var position = evtX - elementX;
      if (evtX < elementX) {
        position = 0;
      } else if (evtX > (width + elementX)) {
        position = width;
      }
      var level = position / width * 100;
      setEffectLevelLine(level);
      setEffectLevelBigPicture(level, nameEffect);
    };

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

  // Хэш-теги:
  var onHashTagValidate = function (evt) {
    var target = evt.target;
    var hashTags = target.value.split(' ');
    target.setCustomValidity('');
    if (hashTags.length > 5) {
      target.setCustomValidity('Нельзя указывать больше пяти хэш-тегов;');
      target.style.botder = null;
    } else if (target.value !== '') {
      for (var i = 0; i < hashTags.length; i++) {
        if (hashTags[i][0] !== '#') {
          target.setCustomValidity('Хэш-тег должен начинаться с символа # (решётка);');
          break;
        } else if (hashTags[i].length < 2) {
          target.setCustomValidity('Хэш-тег не может состоять только из одной решётки;');
          break;
        } else if (hashTags[i].length > 20) {
          target.setCustomValidity('Максимальная длина хэш-тега 20 символов, включая решётку;');
          break;
        } else if (hashTags[i].lastIndexOf('#') !== 0) {
          target.setCustomValidity('Между тегами должны быть пробелы;');
          break;
        } else {
          for (var j = i + 1; j < hashTags.length; j++) {
            if (hashTags[i].toLowerCase() === hashTags[j].toLowerCase()) {
              target.setCustomValidity('Один и тот же хэш-тег не может быть использован дважды, теги нечувствительны к регистру;');
              break;
            }
          }
        }
      }
    }
  };
  document.querySelector('.text__hashtags').setCustomValidity('');

  document.querySelector('#upload-file').addEventListener('change', function (evt) {
    var hashTagField = document.querySelector('.text__hashtags');
    document.querySelector('.text__description').value = '';
    document.querySelector('.effects__radio').checked = true;
    document.querySelector('.scale__control--value').value = '100%';
    hashTagField.value = '';
    hashTagField.setCustomValidity('');
    hashTagField.addEventListener('input', onHashTagValidate);
    onFilterEffectChange();
    setScaleEffectLevel(SCALE_EFFECT_DEFAULT);
    document.addEventListener('keydown', window.overlay.onImgUploadEscButtonPress);

    var file = evt.target.files[0];
    var reader = new FileReader();
    reader.addEventListener('load', function () {
      document.querySelector('.img-upload__preview img').src = reader.result;
    });
    reader.readAsDataURL(file);

    document.querySelector('.img-upload__overlay').classList.remove('hidden');
  });

  document.querySelector('.effects__list').addEventListener('change', onFilterEffectChange);

  var closeImgUploadOverlay = function () {
    window.overlay.closeElement('.img-upload__overlay');
    document.querySelector('#upload-file').value = '';
    document.removeEventListener('keydown', window.overlay.onImgUploadEscButtonPress);
  };
  var onLoad = function () {
    closeImgUploadOverlay();
    var successOverlayElement = window.overlay.getSuccessElement();
    document.querySelector('main').appendChild(successOverlayElement);
  };

  var onError = function (text) {
    var errorOverlayElement = window.overlay.getErrorElement();
    errorOverlayElement.querySelector('.error__title').innerText = text;
    closeImgUploadOverlay();
    errorOverlayElement.querySelectorAll('.error__button').forEach(function (elem) {
      elem.addEventListener('click', function () {
        window.overlay.removeElement('.error');
      });
    });
    document.querySelector('main').appendChild(errorOverlayElement);
  };

  var onSubmitButtonClick = function (evt) {
    evt.preventDefault();
    window.backend.upload(new FormData(evt.target), onLoad, onError);
  };
  document.querySelector('#upload-select-image').addEventListener('submit', onSubmitButtonClick);

})();
