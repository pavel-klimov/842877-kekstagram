'use strict';

(function () {
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
  window.utils = {
    calculatingPercentageOfInterval: calculatingPercentageOfInterval,
    getRandomIntFromInterval: getRandomIntFromInterval,
    getRandomFromArray: getRandomFromArray,
    createItemsArrayWithGenerator: createItemsArrayWithGenerator
  };
})();
