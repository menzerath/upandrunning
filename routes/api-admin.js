var express = require('express');
var router = express.Router();

var db = require('../lib/database');
var logger = require('../lib/logger');
var user = require('../lib/user');

router.get('/', function(req, res) {
	res.send({ requestSuccess: true, message: 'Welcome to UpAndRunning\'s Admin-API!' });
});

router.get('/website/list', function(req, res) {
	db.query("SELECT * FROM website;", function(err, rows) {
		if (err) {
			logger.error("Unable to fetch websites: " + err.code);
			res.status(500).send({ requestSuccess: false, message: 'Unable to process your request.' });
			return;
		}

		if (rows[0] === undefined) {
			res.status(404).send({ requestSuccess: false, message: 'Unable to find any data.' });
		} else {
			var content = { requestSuccess: true, websites: [] };
			for (var i = 0; i < rows.length; i++) {
				content.websites.push({ id: rows[i].id, name: rows[i].name, enabled: rows[i].enabled ? true : false, protocol: rows[i].protocol, url: rows[i].url });
			}
			res.send(content);
		}
	});
});

router.get('/website/add/:name/:protocol/:url', function(req, res) {
	var insertData = { name: req.params.name, protocol: req.params.protocol, url: req.params.url };
	db.query("INSERT INTO website SET ?;", insertData, function(err, result) {
		if (err) { logger.error("Unable to add new website: " + err.code); res.status(400).send({ requestSuccess: false, message: 'Unable to process your request: ' + err.code }); } else { res.send({ requestSuccess: true }); }
	});
});

router.get('/website/enable/:id', function(req, res) {
	db.query("UPDATE website SET enabled = 1 WHERE id = ?;", [ req.params.id ], function(err, result) {
		if (err) { logger.error("Unable to enable website: " + err.code); res.status(400).send({ requestSuccess: false, message: 'Unable to process your request: ' + err.code }); } else { res.send({ requestSuccess: true }); }
	});
});

router.get('/website/disable/:id', function(req, res) {
	db.query("UPDATE website SET enabled = 0 WHERE id = ?;", [ req.params.id ], function(err, result) {
		if (err) { logger.error("Unable to disable website: " + err.code); res.status(400).send({ requestSuccess: false, message: 'Unable to process your request: ' + err.code }); } else { res.send({ requestSuccess: true }); }
	});
});

router.get('/website/edit/:id/:name/:protocol/:url', function(req, res) {
	// TODO
});

router.get('/website/delete/:id', function(req, res) {
	db.query("DELETE FROM website WHERE id = ?;", [ req.params.id ], function(err, result) {
		if (err) { logger.error("Unable to remove website: " + err.code); res.status(400).send({ requestSuccess: false, message: 'Unable to process your request: ' + err.code }); } else { res.send({ requestSuccess: true }); }
	});
});

router.get('/user/list', function(req, res) {
	db.query("SELECT * FROM user;", function(err, rows) {
		if (err) {
			logger.error("Unable to fetch users: " + err.code);
			res.status(500).send({ requestSuccess: false, message: 'Unable to process your request.' });
			return;
		}

		if (rows[0] === undefined) {
			res.status(404).send({ requestSuccess: false, message: 'Unable to find any data.' });
		} else {
			var content = { requestSuccess: true, users: [] };
			for (var i = 0; i < rows.length; i++) {
				content.users.push({ id: rows[i].id, username: rows[i].name, isAdmin: rows[i].isAdmin ? true : false });
			}
			res.send(content);
		}
	});
});

router.get('/user/add/:name/:password/:admin', function(req, res) {
	new user(req.params.name).addUser(req.params.password, req.params.admin, function(status, message) {
		if (status === false) { res.status(400).send({ requestSuccess: false, message: 'Unable to process your request: ' + message }); } else { res.send({ requestSuccess: true }); }
	});
});

router.get('/user/edit/:id/:name/:password/:isAdmin', function(req, res) {
	// TODO
});

router.get('/user/delete/:id', function(req, res) {
	db.query("DELETE FROM user WHERE id = ?;", [ req.params.id ], function(err, result) {
		if (err) { logger.error("Unable to remove user: " + err.code); res.status(400).send({ requestSuccess: false, message: 'Unable to process your request: ' + err.code }); } else { res.send({ requestSuccess: true }); }
	});
});

router.get('/login/:user/:password', function(req, res) {
	// TODO
});

router.get('/logout', function(req, res) {
	// TODO
});

module.exports = router;