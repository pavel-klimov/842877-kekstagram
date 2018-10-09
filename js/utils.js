'use strict';

(function () {
  var getRandomIntFromInterval = function (min, max) {
    return Math.floor(Math.random() * (max + 1 - min) + min);
  };
  window.utils = {
    getRandomIntFromInterval: getRandomIntFromInterval
  };
})();
