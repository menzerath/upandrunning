var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
	res.render('index');
});

router.get('/status', function (req, res) {
	res.render('index');
});

router.get('/status/:url', function (req, res) {
	res.render('index');
});

router.get('/isup', function (req, res) {
	res.render('index');
});

router.get('/isup/:url', function (req, res) {
	res.render('index');
});

module.exports = router;