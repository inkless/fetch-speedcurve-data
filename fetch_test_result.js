var Promise = require('promise');
var _ = require('lodash');
var moment = require('moment');
var path = require('path');
var fs = require('fs');

var callApi = require('./utils').callApi;

function fetchOne(urlId, days) {
  return new Promise(function(resolve, reject) {
    callApi('urls/' + urlId + '?days=' + days, function(data) {
      resolve(data);
    }, function(err) {
      reject(err);
    });
  });
}

function calcAverage(data, field) {
  return _(data).map(field).reduce(function(total, n) {
    return total + n;
  }) / data.length;
}

function changeToSecond(v) {
  return (v / 1000).toFixed(1);
}

function fetch(urls, days, resultSaveDest, callback) {
  var promises = _.map(urls, function(urlData) {
    return fetchOne(urlData.url_id, days);
  });

  // based on the api capacity, if it does not support this many requests
  // we can do:
  // var data = [];
  //  urls
  // .reduce(function(cur, next) {
  //   return cur.then(function(urlData) {
  //     if (urlData) {
  //       data.push(urlData);
  //     }
  //     return fetchOne(next.url_id, days);
  //   });
  // }, Promise.resolve(undefined))
  // .then(function(urlData) {
  //    data.push(urlData);
  //    var result = ...
  // })

  console.log('start to fetch url data...');
  Promise.all(promises)
    .then(function(res) {
      var result = _(res).map(function(urlTestData) {
        var domain = urlTestData.url.match(/^https?:\/\/[-\w]+\.(\w+)\.com.*/)[1];
        return [domain, {
          pagespeed: calcAverage(urlTestData.tests, 'pagespeed').toFixed(),
          render: changeToSecond(calcAverage(urlTestData.tests, 'render')),
          dom: changeToSecond(calcAverage(urlTestData.tests, 'dom')),
          size: (calcAverage(urlTestData.tests, 'size')/1024).toFixed()
        }];
      }).zipObject().value();
      fs.writeFileSync(resultSaveDest, JSON.stringify(result));
      callback(result);
    });

}

module.exports = function(allUrls, type, options, callback) {

  var resultSaveDest = path.join(__dirname, 'data/' + type + '-' + moment().format("YYYYMMDD") + '.json');
  var urls = allUrls[type];
  var days = options.days;

  try {
    fs.statSync(resultSaveDest);
  } catch(e) {
    fetch(urls, days, resultSaveDest, callback);
    return;
  }

  callback(require(resultSaveDest));

};
