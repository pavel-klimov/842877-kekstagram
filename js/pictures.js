'use strict';

var MOCK_COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
var MOCK_DESCRIPTIONS = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];
var MIN_LIKES = 15;
var MAX_LIKES = 200;
var MIN_COMMENT_COUNT = 0;
var MAX_COMMENT_COUNT = 20;
var MIN_COMMENT_AVATAR_COUNT = 1;
var MAX_COMMENT_AVATAR_COUNT = 6;
var NUMBER_OF_PHOTOS = 25;
var ESC_KEYCODE = 27;
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

var pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');
var commentTemplate = document.querySelector('.social__comment').cloneNode(true);

// utils
var calculatingPercentageOfInterval = function (percent, min, max) {
  return (percent / 100) * (max - min) + min;
};
var getRandomIntFromInterval = function (min, max) {
  return Math.floor(Math.random() * (max + 1 - min) + min);
};
var getRandomFromArray = function (array) {
  return array[getRandomIntFromInterval(0, array.length - 1)];
};
var createItemsArrayWithGenerator = function (length, itemGenerator) {
  var itemsArray = [];
  for (var i = 0; i < length; i++) {
    itemsArray[i] = itemGenerator(i);
  }
  return itemsArray;
};
var removeAllChild = function (element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

// comments
var getRandomComment = function () {
  return (getRandomIntFromInterval(1, 2) === 1) ? getRandomFromArray(MOCK_COMMENTS) : getRandomFromArray(MOCK_COMMENTS) + ' ' + getRandomFromArray(MOCK_COMMENTS);
};
var getCommentElement = function (comment) {
  var commentElement = commentTemplate.cloneNode(true);
  commentElement.querySelector('.social__picture').src = 'img/avatar-' + getRandomIntFromInterval(MIN_COMMENT_AVATAR_COUNT, MAX_COMMENT_AVATAR_COUNT) + '.svg';
  commentElement.querySelector('.social__text').textContent = comment;
  return commentElement;
};
var createCommentsFragment = function (comments) {
  var commentElementsList = document.createDocumentFragment();
  for (var i = 0; i < comments.length; i++) {
    commentElementsList.appendChild(getCommentElement(comments[i]));
  }
  return commentElementsList;
};

// photos
var getRandomPhoto = function (photoCounter) {
  return {
    url: 'photos/' + (photoCounter + 1) + '.jpg',
    likes: getRandomIntFromInterval(MIN_LIKES, MAX_LIKES),
    comments: createItemsArrayWithGenerator(getRandomIntFromInterval(MIN_COMMENT_COUNT, MAX_COMMENT_COUNT), getRandomComment),
    description: getRandomFromArray(MOCK_DESCRIPTIONS)
  };
};
var getPictureElement = function (picture) {
  var pictureElement = pictureTemplate.cloneNode(true);
  pictureElement.querySelector('.picture__img').src = picture.url;
  pictureElement.querySelector('.picture__likes').textContent = picture.likes;
  pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;
  pictureElement.addEventListener('click', function () {
    updateBigPictureData(picture);
    document.querySelector('.big-picture').classList.remove('hidden');
    document.addEventListener('keydown', onBigPictureOverlayEscButtonPress);
  });
  return pictureElement;
};
var updateBigPictureData = function (data) {
  document.querySelector('.big-picture__img img').src = data.url;
  document.querySelector('.likes-count').textContent = data.likes;
  document.querySelector('.comments-count').textContent = data.comments.length;
  removeAllChild(document.querySelector('.social__comments'));
  document.querySelector('.social__comments').appendChild(createCommentsFragment(data.comments));
  document.querySelector('.social__caption').textContent = data.description;
};

// Действия на странице, функции и сценарии.
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

var setScaleEffectLevel = function (level) {
  document.querySelector('.scale__control--value').value = level + '%';
  document.querySelector('.img-upload__preview img').style.transform = 'scale(' + level / 100 + ')';
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

document.querySelector('.img-upload__scale').addEventListener('click', onScaleEffectLevel);

// Drag and Drop:
document.querySelector('.effect-level__pin').addEventListener('mousedown', function () {
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

// Подготовка страницы:
// Создаю MOCK данные
var photos = createItemsArrayWithGenerator(NUMBER_OF_PHOTOS, getRandomPhoto);

// Создаю и вставляю на страницу предью изображений
var photoElementsList = document.createDocumentFragment();
for (var index = 0; index < NUMBER_OF_PHOTOS; index++) {
  photoElementsList.appendChild(getPictureElement(photos[index]));
}
document.querySelector('.pictures').appendChild(photoElementsList);

// Прячу блоки счётчика комментариев и загрузки новых комментариев
document.querySelector('.social__comment-count').classList.add('visually-hidden');
document.querySelector('.comments-loader').classList.add('visually-hidden');

// Events:
document.querySelector('.big-picture__cancel').addEventListener('click', function () {
  closeOverlayElement('.big-picture');
  document.removeEventListener('keydown', onBigPictureOverlayEscButtonPress);
});

document.querySelector('.img-upload__cancel').addEventListener('click', function () {
  closeOverlayElement('.img-upload__overlay');
  document.removeEventListener('keydown', onImgUploadOverlayEscButtonPress);
});

document.querySelector('#upload-file').addEventListener('change', function () {
  document.querySelector('.img-upload__overlay').classList.remove('hidden');
  onFilterEffectChange();
  setScaleEffectLevel(SCALE_EFFECT_DEFAULT);
  document.addEventListener('keydown', onImgUploadOverlayEscButtonPress);
});

document.querySelector('.effects__list').addEventListener('change', onFilterEffectChange);

// Хэш-теги:
var onHashTagValidate = function (evt) {
  var target = evt.target;
  var hashTags = target.value.split(' ');
  target.setCustomValidity('');
  if (hashTags.length > 5) {
    target.setCustomValidity('Нельзя указывать больше пяти хэш-тегов;');
  } else {
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
document.querySelector('.text__hashtags').addEventListener('input', onHashTagValidate);

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
