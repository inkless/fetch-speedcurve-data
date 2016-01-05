#!/usr/local/bin/node

var fs = require('fs');
var _ = require('lodash');
var file = process.argv[2];
var execFileSync = require('child_process').execFileSync;
var moment = require('moment');
if (!file) {
	var currentDate = moment().format('MMDD')
	console.log(`Fetching data from speedcurve for today: ${currentDate}`);
	execFileSync(`${__dirname}/fetch.sh`);
	file = currentDate + '.json';
} else {
	console.log(`Using existing data: ${file}`);
}

var content = fs.readFileSync(`${__dirname}/${file}`);
var data = JSON.parse(content);
var printOrder = [
	// tier 1
	'J Brand Jeans',
	'Peter Millar',
	'Neff',
	'Fiji Water',
	'The Elephant Pants',
	'Diamond Candles',
	'Boll & Branch',
	'Hint Water',
	// tier 2
	'Blunt USA',
	'Gatorade Endurance',
	'Vintage Marquee Lights',
	'Krave Jerky',
	'Sebamed',
	'Bumbleride',
	'Chili Technology',
	'Rock Flower Paper',
	// Amazon
	'Amazon'
];

var result = _(data.sites).map(function(site) {
	return [site.name, {
		pagespeed: calcAverage(site.median, 'pagespeed').toFixed(),
		render: changeToSecond(calcAverage(site.median, 'render')),
		dom: changeToSecond(calcAverage(site.median, 'dom')),
		size: (calcAverage(site.median, 'size')/1024).toFixed(),
	}];
}).zipObject().value();

var orderedResult = _.map(printOrder, function(name) {
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
	var titleLine = "\t" + ['brand', 'pagespeed', 'render', 'dom', 'size'].join("\t");
	var content = _.map(printOrder, function(name, index) {
		var data = orderedResult[index];
		if (!data) {
			console.log('No data in site:', name);
		}
		return name + "\t" + data.pagespeed + "\t" + data.render + "\t" +
			data.dom + "\t" + data.size;
	}).join("\n");

	console.log(titleLine);
	console.log(content);
}

console.log('---------');
console.log(' Result:');
console.log('---------');
printTable(printOrder, orderedResult);
