#!/usr/bin/env node
var fs = require('fs');

var CONSTANT = require('./constant');
var fetchUrlIds = require('./fetch_url_ids');
var fetchTestResult = require('./fetch_test_result');
var print = require('./print');

function fetchResult(type, options, resolve) {
  var urlIds = require(CONSTANT.URL_IDS_SAVE_DEST);
  fetchTestResult(urlIds, type, options, (...args) => {
    resolve(print(...args));
  });
}

module.exports = function(type, options) {
  options.days = options.days || 7;
  options.browsers = options.browsers || 'Chrome';

  try {
    fs.statSync(CONSTANT.CACHE_DIR);
  } catch(e) {
    fs.mkdirSync(CONSTANT.CACHE_DIR);
    console.log('Cache created...');
  }

  var shouldFetch = options.ignoreCache;
  if (!shouldFetch) {
    try {
      fs.statSync(CONSTANT.URL_IDS_SAVE_DEST);
    } catch(e) {
      shouldFetch = true;
    }
  }

  return new Promise(resolve => {

    if (shouldFetch) {
      fetchUrlIds(() => {
        fetchResult(type, options, resolve);
      });
    } else {
      fetchResult(type, options, resolve);
    }

  });
};
