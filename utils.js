var request = require('request');

var CONSTANT = require('./constant');

exports.callApi = function(params, callback, errorCb) {
  request.get(CONSTANT.API_URL + params, {
    'auth': {
      'user': CONSTANT.API_USER,
      'pass': CONSTANT.API_PASSWORD,
      'sendImmediately': false
    }
  }, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      callback(JSON.parse(body));
    } else {
      errorCb && errorCb(error);
    }
  });
};