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
// var MIN_COMMENT_LENGTH = 1;
// var MAX_COMMENT_LENGTH = 2;
var MIN_COMMENT_COUNT = 0;
var MAX_COMMENT_COUNT = 20;
var NUMBER_OF_PHOTOS = 25;

var photoCounter = 0;

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
    itemsArray[i] = itemGenerator();
  }
  return itemsArray;
};

var getRandomPhoto = function () {
  photoCounter++;
  return {
    url: 'photos/' + photoCounter + '.jpg',
    likes: getRandomIntFromInterval(MIN_LIKES, MAX_LIKES),
    comments: createItemsArrayWithGenerator(getRandomIntFromInterval(MIN_COMMENT_COUNT, MAX_COMMENT_COUNT), getRandomComment),
    description: getRandomFromArray(MOCK_DESCRIPTIONS)
  };
};

var photos = createItemsArrayWithGenerator(NUMBER_OF_PHOTOS, getRandomPhoto);

console.log(photos);
