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

var pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');

var commentTemplate = document.querySelector('.social__comment').cloneNode(true);

var getRandomIntFromInterval = function (min, max) {
  return Math.floor(Math.random() * (max + 1 - min) + min);
};

var getRandomFromArray = function (array) {
  return array[getRandomIntFromInterval(0, array.length - 1)];
};

var getRandomComment = function () {
  return (getRandomIntFromInterval(1, 2) === 1) ? getRandomFromArray(MOCK_COMMENTS) : getRandomFromArray(MOCK_COMMENTS) + ' ' + getRandomFromArray(MOCK_COMMENTS);
};

var createItemsArrayWithGenerator = function (length, itemGenerator) {
  var itemsArray = [];
  for (var i = 0; i < length; i++) {
    itemsArray[i] = itemGenerator(i);
  }
  return itemsArray;
};

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
  return pictureElement;
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

var removeAllChild = function (element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

var updateBigPictureData = function (data) {
  document.querySelector('.big-picture__img img').src = data.url;
  document.querySelector('.likes-count').textContent = data.likes;
  document.querySelector('.comments-count').textContent = data.comments.length;
  removeAllChild(document.querySelector('.social__comments'));
  document.querySelector('.social__comments').appendChild(createCommentsFragment(data.comments));
  document.querySelector('.social__caption').textContent = data.description;
};

// Создаю MOCK данные
var photos = createItemsArrayWithGenerator(NUMBER_OF_PHOTOS, getRandomPhoto);

// Создаю и вставляю на страницу предью изображений
var photoElementsList = document.createDocumentFragment();
for (var i = 0; i < NUMBER_OF_PHOTOS; i++) {
  photoElementsList.appendChild(getPictureElement(photos[i]));
}
document.querySelector('.pictures').appendChild(photoElementsList);

// Обновляю данные и отображаю блок с первым изображением
updateBigPictureData(photos[0]);
document.querySelector('.big-picture').classList.remove('hidden');

// Прячу блоки счётчика комментариев и загрузки новых комментариев
document.querySelector('.social__comment-count').classList.add('visually-hidden');
document.querySelector('.comments-loader').classList.add('visually-hidden');
