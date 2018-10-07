'use strict';

(function () {
  var MIN_COMMENT_AVATAR_COUNT = 1;
  var MAX_COMMENT_AVATAR_COUNT = 6;
  var COMMENTS_SHOW_GROUP = 5;
  var pictureTemplate = document.querySelector('#picture')
      .content
      .querySelector('.picture');
  var commentTemplate = document.querySelector('.social__comment').cloneNode(true);

  var removeAllElements = function (elements) {
    elements.forEach(function (elem) {
      elem.remove();
    });
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
  var showCommentsGroup = function (comments) {
    var groupSize = (comments.length <= COMMENTS_SHOW_GROUP) ? comments.length : COMMENTS_SHOW_GROUP;
    var onShowMoreClick = function () {
      document.querySelector('.comments-loader').removeEventListener('click', onShowMoreClick);
      showCommentsGroup(comments);
    };
    document.querySelector('.comments-count').textContent = comments.length;
    document.querySelector('.social__comments').appendChild(createCommentsFragment(comments.splice(0, groupSize)));
    document.querySelector('.social__comment-count').classList.add('visually-hidden');
    if (comments.length === 0) {
      document.querySelector('.comments-loader').classList.add('visually-hidden');
    } else {
      document.querySelector('.comments-loader').addEventListener('click', onShowMoreClick);
    }
  };

  var getPictureElement = function (picture) {
    var pictureElement = pictureTemplate.cloneNode(true);
    pictureElement.querySelector('.picture__img').src = picture.url;
    pictureElement.querySelector('.picture__likes').textContent = picture.likes;
    pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;
    pictureElement.addEventListener('click', function () {
      updateBigPictureData(picture);
      document.querySelector('.big-picture').classList.remove('hidden');
      document.addEventListener('keydown', window.overlay.onBigPictureOverlayEscButtonPress);
    });
    return pictureElement;
  };
  var updateBigPictureData = function (data) {
    document.querySelector('.big-picture__img img').src = data.url;
    document.querySelector('.likes-count').textContent = data.likes;
    removeAllElements(document.querySelectorAll('.social__comment'));
    document.querySelector('.comments-loader').classList.remove('visually-hidden');
    showCommentsGroup(data.comments.slice(0));
    document.querySelector('.social__caption').textContent = data.description;
  };

  var appendGalleryData = function (data) {
    var photoElementsList = document.createDocumentFragment();
    data.forEach(function (item) {
      photoElementsList.appendChild(getPictureElement(item));
    });
    document.querySelector('.pictures').appendChild(photoElementsList);
  };
  var bindEventToImageSortButton = function (data) {
    var onImgSortClick = function (evt) {
      var target = evt.target;
      if (!target.classList.contains('img-filters__button--active') && target.classList.contains('img-filters__button')) {
        document.querySelector('.img-filters__button--active').classList.remove('img-filters__button--active');
        target.classList.add('img-filters__button--active');
        var newData = data;
        if (target.id === 'filter-new') {
          newData = window.sort.random(data);
        } else if (target.id === 'filter-discussed') {
          newData = window.sort.byComments(data);
        }
        window.debounce(function () {
          removeAllElements(document.querySelectorAll('.container.pictures a.picture'));
          appendGalleryData(newData);
        });
      }
    };
    document.querySelector('.img-filters__form').addEventListener('click', onImgSortClick);
  };

  var onLoad = function (data) {
    appendGalleryData(data);
    document.querySelector('.img-filters--inactive').classList.remove('img-filters--inactive');
    bindEventToImageSortButton(data);
  };
  var onError = function (text) {
    var errorOverlayElement = window.overlay.getErrorOverlayElement();
    errorOverlayElement.querySelector('.error__title').innerText = text;
    errorOverlayElement.querySelector('.error__button').addEventListener('click', function () {
      window.overlay.removeOverlayElement('.error');
      window.backend.download(onLoad, onError);
    });
    errorOverlayElement.querySelector('.error__button:last-child').classList.add('hidden');
    document.querySelector('main').appendChild(errorOverlayElement);
  };

  window.backend.download(onLoad, onError);
})();
