var express = require('express');
var router = express.Router();
var fetch = require('../fetch');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Speedcurve' });
});

router.get('/data', function(req, res) {
  var options = {};
  if (req.query.days) options.days = req.query.days;
  if (req.query.ignoreCache) options.ignoreCache = Boolean(req.query.ignoreCache);
  if (req.query.browsers) options.browsers = req.query.browsers;

  var type = req.query.type;
  fetch(req.query.type, options).then(pageData => {
    res.render('data', { pageData, type });
  });
});

module.exports = router;
