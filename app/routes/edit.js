var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var dest = path.join(__dirname, '../fetch/site-config.json');

router.post('/save', function(req, res) {
  var data = req.body['data[]'];
  if (data && data.length) {
    console.log(data);
    fs.writeFileSync(dest, JSON.stringify(data));
  }
  res.send({success: true});
});

router.get('/', function(req, res) {
  var sites = JSON.parse(fs.readFileSync(dest).toString());
  res.render('edit', {
    title: 'Edit site config',
    sites: sites.join('\n'),
  });
});

module.exports = router;
