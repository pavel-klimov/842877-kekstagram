'use strict';

(function () {
  var getRandomIntFromInterval = function (min, max) {
    return Math.floor(Math.random() * (max + 1 - min) + min);
  };
  var getRandomFromArray = function (array) {
    return array[getRandomIntFromInterval(0, array.length - 1)];
  };
  window.utils = {
    getRandomIntFromInterval: getRandomIntFromInterval,
    getRandomFromArray: getRandomFromArray,
  };
})();
