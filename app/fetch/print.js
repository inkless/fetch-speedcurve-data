var _ = require('lodash');
var fs = require('fs');

var printOrder = JSON.parse(fs.readFileSync(__dirname + '/site-config.json').toString());

function printTable(printOrder, orderedData) {
  return _.map(printOrder, function(name, index) {
    var data = orderedData[index];
    data.name = name;
    return data;
  });
}

module.exports = function print(data) {
  var order = [];
  var orderedData = [];
  printOrder.forEach(function(name) {
    if (data[name]) {
      order.push(name);
      orderedData.push(data[name]);
    }
  });
  return printTable(order, orderedData);
};
