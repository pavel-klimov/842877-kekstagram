'use strict';

(function () {
  var RANDOM_COUNT = 10;

  var sortRandom = function (data) {
    var result = [];
    var localData = data.slice(0);
    for (var i = 0; i < RANDOM_COUNT; i++) {
      result = result.concat(localData.splice(window.utils.getRandomIntFromInterval(0, localData.length), 1));
    }
    return result;
  };

  var sortByComments = function (data) {
    var localData = data.slice(0);
    return localData.sort(function (a, b) {
      return b.comments.length - a.comments.length;
    });
  };

  window.sort = {
    random: sortRandom,
    byComments: sortByComments,
  };
})();
