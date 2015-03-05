var express = require('express');
var router = express.Router();

var db = require('../lib/database');
var logger = require('../lib/logger');

router.get('/', function(req, res) {
	res.send({ requestSuccess: true, message: 'Welcome to UpAndRunning\'s Admin-API!' });
});

router.get('/login/:user/:password', function(req, res) {
	// TODO
});

router.get('/logout', function(req, res) {
	// TODO
});

module.exports = router;