var Promise = require('promise');
var _ = require('lodash');
var moment = require('moment');
var path = require('path');
var fs = require('fs');
var CONSTANT = require('./constant');

var callApi = require('./utils').callApi;

function fetchOne(urlId, days, browsers) {
  return new Promise(function(resolve, reject) {
    callApi('urls/' + urlId + '?days=' + days, function(data) {
      data.tests = _.filter(data.tests, function(o) {
        if (browsers === 'all') {
          return ['Chrome', 'Apple iPad Landscape', 'Apple iPhone 5'].indexOf(o.browser) !== -1;
        } else if (browsers === 'mobile') {
          return ['Apple iPad Landscape', 'Apple iPhone 5'].indexOf(o.browser) !== -1;
        } else {
          return o.browser === browsers;
        }
      });
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

function fetch(urls, days, browsers, resultSaveDest, callback) {
  var promises = _.map(urls, function(urlData) {
    return fetchOne(urlData.url_id, days, browsers);
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
      var result = {};
      res.forEach(function(urlTestData) {
        var domain = urlTestData.url.match(/^https?:\/\/(?:[-\w]+\.)?([-\w]+)\.com?.*/)[1];
        result[domain] = {
          pagespeed: calcAverage(urlTestData.tests, 'pagespeed').toFixed(),
          render: changeToSecond(calcAverage(urlTestData.tests, 'render')),
          dom: changeToSecond(calcAverage(urlTestData.tests, 'dom')),
          size: (calcAverage(urlTestData.tests, 'size')/1024).toFixed()
        };
      });
      if (!_.isEmpty(result)) {
        fs.writeFileSync(resultSaveDest, JSON.stringify(result));
      }
      callback(result);
    });

}

module.exports = function(allUrls, type, options, callback) {

  var urls = _.filter(allUrls[type]);
  var days = options.days;
  var browsers = options.browsers;
  var ignoreCache = options.ignoreCache;
  var resultSaveDest = path.join(CONSTANT.CACHE_DIR, type + '-' + moment().format('YYYYMMDD') + '-' + days + '.json');

  var shouldFetch = ignoreCache;
  if (!shouldFetch) {
    try {
      fs.statSync(resultSaveDest);
    } catch(e) {
      shouldFetch = true;
    }
  }

  if (shouldFetch) {
    fetch(urls, days, browsers, resultSaveDest, callback);
  } else {
    callback(require(resultSaveDest));
  }

};
