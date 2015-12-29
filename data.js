var fs = require('fs');
var _ = require('lodash');

var content = fs.readFileSync(`${__dirname}/1228.json`);
var data = JSON.parse(content);
var printOrder = 'Boll and Branch,Diamond Candles,drinkhint,fijiwater,Neff,Peter Millar,The Elephant Pants,Blunt USA,bumbleride,Chilitechnology,Gatorade Endurance,kravejerky,rockflowerpaper,Sebamed,Vintage Marquee Lights';

var result = _(data.sites).map(function(site) {
	return [site.name, {
		pagespeed: calcAverage(site.median, 'pagespeed').toFixed(),
		render: changeToSecond(calcAverage(site.median, 'render')),
		dom: changeToSecond(calcAverage(site.median, 'dom')),
		size: (calcAverage(site.median, 'size')/1024).toFixed(),
	}];
}).zipObject().value();

var orderedResult = _.map(printOrder.split(','), function(name) {
	return result[name];
});

function calcAverage(data, field) {
	return _(data).map(field).reduce(function(total, n) {
		return total + n;
	}) / data.length;
}

function changeToSecond(v) {
	return (v / 1000).toFixed(1);
}

function printTable(printOrder, orderedResult) {
	var titleLine = "\t" + ['pagespeed', 'render', 'dom', 'size'].join("\t");
	var siteNames = printOrder.split(',');
	var content = _.map(siteNames, function(name, index) {
		var data = orderedResult[index];
		return name + "\t" + data.pagespeed + "\t" + data.render + "\t" +
			data.dom + "\t" + data.size;
	}).join("\n");

	console.log(titleLine);
	console.log(content);
}

printTable(printOrder, orderedResult);
