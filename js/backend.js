'use strict';

(function () {
  var REQUEST_SETTINGS = {
    get: {
      URL: 'https://js.dump.academy/kekstagram/data',
      requestType: 'GET',
      dataType: 'json',
      timeout: 10000
    },
    post: {
      URL: 'https://js.dump.academy/kekstagram',
      requestType: 'POST',
      dataType: 'json',
      timeout: 10000
    }
  };

  var xhrRequest = function (setting, onLoad, onError, data) {
    var URL = setting.URL;
    var xhr = new XMLHttpRequest();

    xhr.responseType = setting.dataType;
    xhr.open(setting.requestType, URL);
    xhr.timeout = setting.timeout;

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.send(data);
  };

  var download = function (onLoad, onError) {
    xhrRequest(REQUEST_SETTINGS.get, onLoad, onError);
  };
  var upload = function (data, onLoad, onError) {
    xhrRequest(REQUEST_SETTINGS.post, onLoad, onError, data);
  };

  window.backend = {
    download: download,
    upload: upload
  };
})();
