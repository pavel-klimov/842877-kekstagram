'use strict';

(function () {
  var MIN_COMMENT_AVATAR_COUNT = 1;
  var MAX_COMMENT_AVATAR_COUNT = 6;

  var pictureTemplate = document.querySelector('#picture')
      .content
      .querySelector('.picture');
  var commentTemplate = document.querySelector('.social__comment').cloneNode(true);

  var removeAllChild = function (element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  };
  var errorMessageTemplate = document.querySelector('#error')
  .content
  .querySelector('.error');

  var onError = function (text) {
    var errorMessage = errorMessageTemplate.cloneNode(true);
    if (text) {
      errorMessage.querySelector('.error__title').innerText = text;
    }
    document.querySelector('main').appendChild(errorMessage);
  };

  // comments
  var getCommentElement = function (comment) {
    var commentElement = commentTemplate.cloneNode(true);
    commentElement.querySelector('.social__picture').src = 'img/avatar-' + window.utils.getRandomIntFromInterval(MIN_COMMENT_AVATAR_COUNT, MAX_COMMENT_AVATAR_COUNT) + '.svg';
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
  var getPictureElement = function (picture) {
    var pictureElement = pictureTemplate.cloneNode(true);
    pictureElement.querySelector('.picture__img').src = picture.url;
    pictureElement.querySelector('.picture__likes').textContent = picture.likes;
    pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;
    pictureElement.addEventListener('click', function () {
      updateBigPictureData(picture);
      document.querySelector('.big-picture').classList.remove('hidden');
      document.addEventListener('keydown', window.closeOverlay.onBigPictureOverlayEscButtonPress);
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

  // Создаю и вставляю на страницу предью изображений
  /* var photoElementsList = document.createDocumentFragment();
  for (var index = 0; index < window.data.NUMBER_OF_PHOTOS; index++) {
    photoElementsList.appendChild(getPictureElement(window.data.photos[index]));
  }
  document.querySelector('.pictures').appendChild(photoElementsList);
*/
  var onLoad = function (data) {
    // console.log(data);
    var photoElementsList = document.createDocumentFragment();
    data.forEach(function (item) {
      photoElementsList.appendChild(getPictureElement(item));
    });
    document.querySelector('.pictures').appendChild(photoElementsList);
  };
  window.backend.download(onLoad, onError);
  // Прячу блоки счётчика комментариев и загрузки новых комментариев
  document.querySelector('.social__comment-count').classList.add('visually-hidden');
  document.querySelector('.comments-loader').classList.add('visually-hidden');
})();
