var express = require('express');
var router = express.Router();

var db = require('../lib/database');
var logger = require('../lib/logger');

router.get('/', function(req, res) {
	res.send({ requestSuccess: true, message: 'Welcome to UpAndRunning\'s API!' });
});

router.get('/status', function(req, res) {
	res.status(422).send({ requestSuccess: false, message: 'You need to select a website.' });
});

router.get('/status/:url', function(req, res) {
	db.get("SELECT * FROM website WHERE url = $url;", { $url: req.params.url }, function(err, row) {
		if (row === undefined) {
			res.status(404).send({ requestSuccess: false, message: 'Unable to find any data matching the given url.' });
		} else {
			res.send({ requestSuccess: true, websiteData: { id: row.id, name: row.name, enabled: row.enabled, url: row.protocol + '://' + row.url, avgAvail: row.avgAvail + '%' }, lastCheckResult: { status: row.status, time: row.lastCheck } });
		}
	});
});

router.get('/lastFail', function(req, res) {
	res.status(422).send({ requestSuccess: false, message: 'You need to select a website.' });
});

router.get('/lastFail/:url', function(req, res) {
	db.get("SELECT result.status, result.time FROM website, result WHERE website.id = result.website_id AND website.url = $url AND result.status IS NOT 200 ORDER BY result.id DESC LIMIT 1;", { $url: req.params.url }, function(err, row) {
		if (row === undefined) {
			res.status(404).send({ requestSuccess: false, message: 'Unable to find any data matching the given url.' });
		} else {
			res.send({ requestSuccess: true, lastFailedCheckResult: { status: row.status, time: row.time } });
		}
	});
});

router.get('/results', function(req, res) {
	res.status(422).send({ requestSuccess: false, message: 'You need to select a website.' });
});

router.get('/results/:url', function(req, res) {
	var output = '{ "requestSuccess": true, "results": { ';

	db.each("SELECT result.id, result.status, result.time FROM website, result WHERE website.id = result.website_id AND website.url = $url LIMIT 500;", { $url: req.params.url }, function(err, row) {
		output += '"' + row.id + '": { "status": "' + row.status + '", "time": "' + row.time + '" }, ';
	}, function(err, rows) {
		if (rows == 0) {
			res.status(404).send({ requestSuccess: false, message: 'Unable to find any data matching the given url.' });
		} else {
			res.send(JSON.parse(output.slice(0, - 2) + ' } }'));
		}
	});
});

router.get('/isup', function(req, res) {
	res.send({ requestSuccess: false, message: 'You need to select a website.' });
});

router.get('/isup/:url', function(req, res) {
	db.get("SELECT status FROM website WHERE url = $url AND enabled = 1;", { $url: req.params.url }, function(err, row) {
		if (row === undefined) {
			res.status(404).send('Unknown');
		} else {
			if (row.status == 200 || row.status == 301 || row.status == 302) {
				res.send('Yes');
			} else {
				res.send('No');
			}
		}
	});
});

module.exports = router;