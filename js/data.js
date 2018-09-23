'use strict';

(function () {
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
  var NUMBER_OF_PHOTOS = 25;

  var getRandomPhoto = function (photoCounter) {
    return {
      url: 'photos/' + (photoCounter + 1) + '.jpg',
      likes: window.utils.getRandomIntFromInterval(MIN_LIKES, MAX_LIKES),
      comments: window.utils.createItemsArrayWithGenerator(window.utils.getRandomIntFromInterval(MIN_COMMENT_COUNT, MAX_COMMENT_COUNT), getRandomComment),
      description: window.utils.getRandomFromArray(MOCK_DESCRIPTIONS)
    };
  };

  var getRandomComment = function () {
    return (window.utils.getRandomIntFromInterval(1, 2) === 1) ? window.utils.getRandomFromArray(MOCK_COMMENTS) : window.utils.getRandomFromArray(MOCK_COMMENTS) + ' ' + window.utils.getRandomFromArray(MOCK_COMMENTS);
  };

  window.data = {
    NUMBER_OF_PHOTOS: NUMBER_OF_PHOTOS,
    photos: window.utils.createItemsArrayWithGenerator(NUMBER_OF_PHOTOS, getRandomPhoto)
  };
})();
