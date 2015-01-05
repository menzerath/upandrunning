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
	db.query("SELECT * FROM website WHERE url = ?;", [ req.params.url ], function(err, rows) {
		if (err) {
			logger.error("Unable to fetch website-status: " + err.code);
			res.status(500).send({ requestSuccess: false, message: 'Unable to process your request.' });
			return;
		}

		if (rows[0] === undefined) {
			res.status(404).send({ requestSuccess: false, message: 'Unable to find any data matching the given url.' });
		} else {
			res.send({ requestSuccess: true, websiteData: { id: rows[0].id, name: rows[0].name, enabled: rows[0].enabled, url: rows[0].protocol + '://' + rows[0].url }, availability: { ups: rows[0].ups, downs: rows[0].downs, total: rows[0].totalChecks, average: rows[0].avgAvail + '%' }, lastCheckResult: { status: rows[0].status, time: rows[0].time }, lastFailedCheckResult: { status: rows[0].lastFailStatus, time: rows[0].lastFailTime } });
		}
	});
});

router.get('/isup', function(req, res) {
	res.send({ requestSuccess: false, message: 'You need to select a website.' });
});

router.get('/isup/:url', function(req, res) {
	db.query("SELECT status FROM website WHERE url = ? AND enabled = 1;", [ req.params.url ], function(err, rows) {
		if (err) {
			logger.error("Unable to fetch website-status: " + err.code);
			res.status(500).send({ requestSuccess: false, message: 'Unable to process your request.' });
			return;
		}

		if (rows[0] === undefined) {
			res.status(404).send('Website unknown');
		} else if (rows[0].status.indexOf("200") > -1 || rows[0].status.indexOf("301") > -1 || rows[0].status.indexOf("302") > -1) {
			res.send('Yes');
		} else {
			res.send('No');
		}
	});
});

module.exports = router;