var _ = require('lodash');

var printOrder = require('./site-config');

function printTable(printOrder, orderedData) {
  var titleLine = "\t" + ['brand', 'pagespeed', 'render', 'dom', 'size'].join("\t");
  var content = _.map(printOrder, function(name, index) {
    var data = orderedData[index];
    if (!data) {
      console.log('No data in site:', name);
    }
    return name + "\t" + data.pagespeed + "\t" + data.render + "\t" +
      data.dom + "\t" + data.size;
  }).join("\n");

  console.log(titleLine);
  console.log(content);
}

module.exports = function print(data) {
  console.log('---------');
  console.log(' Result:');
  console.log('---------');
  var order = [];
  var orderedData = [];
  printOrder.forEach(function(name) {
    if (data[name]) {
      order.push(name);
      orderedData.push(data[name]);
    }
  });
  printTable(order, orderedData);
};