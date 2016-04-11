var _ = require('lodash');
var fs = require('fs');

var CONSTANT = require('./constant');
var callApi = require('./utils').callApi;

module.exports = function fetchAllUrls(callback) {
  console.log('start to fetch url ids...');
  callApi('sites?days=1', function(data) {
    var homeUrls = [];
    var storeUrls = [];
    var productUrls = [];

    data.sites.forEach(function(site) {
      if (site.site_id === 4962) {
        homeUrls.push(site.urls[1]);
        storeUrls.push(site.urls[0]);
        productUrls.push(site.urls[2]);
      } else {
        homeUrls.push(site.urls[0]);
        storeUrls.push(site.urls[1]);
        productUrls.push(site.urls[2]);
      }
    });

    var data = {
      home: homeUrls,
      store: storeUrls,
      product: productUrls
    };

    fs.writeFileSync(CONSTANT.URL_IDS_SAVE_DEST, JSON.stringify(data));

    if (callback) {
      callback();
    }
  });
};