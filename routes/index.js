var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	res.render('index', {title: global.TITLE});
});

router.get('/status', function(req, res) {
	res.render('index', {title: global.TITLE});
});

router.get('/status/:url', function(req, res) {
	res.render('index', {title: global.TITLE});
});

router.get('/isup', function(req, res) {
	res.render('index', {title: global.TITLE});
});

router.get('/isup/:url', function(req, res) {
	res.render('index', {title: global.TITLE});
});

module.exports = router;