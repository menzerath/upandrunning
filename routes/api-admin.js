var express = require('express');
var router = express.Router();

var db = require(__libBase + 'database');
var logger = require(__libBase + 'logger');
var admin = require(__libBase + 'admin');

router.get('/', function(req, res) {
	res.send({ requestSuccess: true, message: 'Welcome to UpAndRunning\'s Admin-API!' });
});

router.get('/websites', function(req, res) {
	if (!req.session.loggedin) { res.status(401).send({ requestSuccess: false, message: 'Unauthorized' }); return; }
	db.query("SELECT * FROM website;", function(err, rows) {
		if (err) {
			logger.error("Unable to fetch websites: " + err.code);
			res.status(500).send({requestSuccess: false, message: 'Unable to process your request.'});
		} else {
			if (rows[0] === undefined) {
				res.status(404).send({requestSuccess: false, message: 'Unable to find any data.'});
			} else {
				var content = {requestSuccess: true, websites: []};
				for (var i = 0; i < rows.length; i++) {
					content.websites.push({
						id: rows[i].id,
						name: rows[i].name,
						enabled: rows[i].enabled ? true : false,
						visible: rows[i].visible ? true : false,
						protocol: rows[i].protocol,
						url: rows[i].url,
						status: rows[i].status,
						time: rows[i].time,
						avgAvail: rows[i].avgAvail + '%'
					});
				}
				res.send(content);
			}
		}
	});
});

router.get('/websites/add/:name/:protocol/:url', function(req, res) {
	if (!req.session.loggedin) { res.status(401).send({ requestSuccess: false, message: 'Unauthorized' }); return; }
	var insertData = { name: req.params.name, protocol: req.params.protocol, url: req.params.url };
	db.query("INSERT INTO website SET ?;", insertData, function (err) {
		if (err) { logger.error("Unable to add new website: " + err.code); res.status(400).send({ requestSuccess: false, message: 'Unable to process your request: ' + err.code }); } else { res.send({ requestSuccess: true }); }
	});
});

router.get('/websites/enable/:id', function(req, res) {
	if (!req.session.loggedin) { res.status(401).send({ requestSuccess: false, message: 'Unauthorized' }); return; }
	db.query("UPDATE website SET enabled = 1 WHERE id = ?;", [req.params.id], function (err) {
		if (err) { logger.error("Unable to enable website: " + err.code); res.status(400).send({ requestSuccess: false, message: 'Unable to process your request: ' + err.code }); } else { res.send({ requestSuccess: true }); }
	});
});

router.get('/websites/disable/:id', function(req, res) {
	if (!req.session.loggedin) { res.status(401).send({ requestSuccess: false, message: 'Unauthorized' }); return; }
	db.query("UPDATE website SET enabled = 0 WHERE id = ?;", [req.params.id], function (err) {
		if (err) { logger.error("Unable to disable website: " + err.code); res.status(400).send({ requestSuccess: false, message: 'Unable to process your request: ' + err.code }); } else { res.send({ requestSuccess: true }); }
	});
});

router.get('/websites/visible/:id', function(req, res) {
	if (!req.session.loggedin) { res.status(401).send({ requestSuccess: false, message: 'Unauthorized' }); return; }
	db.query("UPDATE website SET visible = 1 WHERE id = ?;", [req.params.id], function (err) {
		if (err) { logger.error("Unable to enable website-visibility: " + err.code); res.status(400).send({ requestSuccess: false, message: 'Unable to process your request: ' + err.code }); } else { res.send({ requestSuccess: true }); }
	});
});

router.get('/websites/invisible/:id', function(req, res) {
	if (!req.session.loggedin) { res.status(401).send({ requestSuccess: false, message: 'Unauthorized' }); return; }
	db.query("UPDATE website SET visible = 0 WHERE id = ?;", [req.params.id], function (err) {
		if (err) { logger.error("Unable to disable website-visibility: " + err.code); res.status(400).send({ requestSuccess: false, message: 'Unable to process your request: ' + err.code }); } else { res.send({ requestSuccess: true }); }
	});
});

router.get('/websites/edit/:id/:name/:protocol/:url', function(req, res) {
	if (!req.session.loggedin) { res.status(401).send({ requestSuccess: false, message: 'Unauthorized' }); return; }
	db.query("UPDATE website SET name = ?, protocol = ?, url = ? WHERE id = ?;", [req.params.name, req.params.protocol, req.params.url, req.params.id], function (err) {
		if (err) { logger.error("Unable to edit website: " + err.code); res.status(400).send({ requestSuccess: false, message: 'Unable to process your request: ' + err.code }); } else { res.send({ requestSuccess: true }); }
	});
});

router.get('/websites/delete/:id', function(req, res) {
	if (!req.session.loggedin) { res.status(401).send({ requestSuccess: false, message: 'Unauthorized' }); return; }
	db.query("DELETE FROM website WHERE id = ?;", [req.params.id], function (err) {
		if (err) { logger.error("Unable to remove website: " + err.code); res.status(400).send({ requestSuccess: false, message: 'Unable to process your request: ' + err.code }); } else { res.send({ requestSuccess: true }); }
	});
});

router.get('/settings/password/:password', function(req, res) {
	if (!req.session.loggedin) { res.status(401).send({ requestSuccess: false, message: 'Unauthorized' }); return; }
	new admin().changePassword(req.params.password, function(status, error) {
		if (status === false) {
			res.status(400).send({ requestSuccess: false, message: 'Unable to process your request: ' + error });
		} else {
			res.send({ requestSuccess: true });
		}
	});
});

router.get('/login/:password', function(req, res) {
	new admin().validatePassword(req.params.password, function(status, error) {
		if (status === false) {
			res.status(400).send({ requestSuccess: false, message: 'Unable to process your request: ' + error });
		} else {
			req.session.loggedin = true;
			res.send({ requestSuccess: true });
		}
	});
});

router.get('/logout', function(req, res) {
	req.session.destroy(function(err) {
		if (err) { logger.error("Unable to logout: " + err.code); res.status(400).send({ requestSuccess: false, message: 'Unable to process your request: ' + err.code }); } else { res.send({ requestSuccess: true }); }
	});
});

module.exports = router;