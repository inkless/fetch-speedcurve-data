var _ = require('lodash');
var fs = require('fs');

var CONSTANT = require('./constant');
var callApi = require('./utils').callApi;

module.exports = function fetchAllUrls(callback) {
  console.log('start to fetch url ids...');
  callApi('sites?days=1', function(data) {
    var toSaveData = {
      home: [],
      store: [],
      product: [],
    };

    data.sites.forEach(function(site) {
      site.urls.forEach(function(urlObj, index) {
        var type = getType(urlObj.label);
        toSaveData[type].push(urlObj);
      });
    });

    fs.writeFileSync(CONSTANT.URL_IDS_SAVE_DEST, JSON.stringify(toSaveData));

    if (callback) {
      callback();
    }
  });
};

function getType(label) {
  label = label || 'home';
  label = label.toLowerCase();
  if (label.indexOf('store') !== -1 || label.indexOf('category') !== -1) {
    return 'store';
  }

  if (label.indexOf('product') !== -1) {
    return 'product';
  }

  return 'home';
}
