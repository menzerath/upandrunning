var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
	if (req.session.loggedin) {
		res.render('admin', { version: { node: process.version, app: require('../package.json').version }, interval: global.INTERVAL });
	} else {
		res.redirect('/admin/login');
	}
});

router.get('/login', function (req, res) {
	if (req.session.loggedin) {
		res.redirect('/admin');
	} else {
		res.render('login');
	}
});

module.exports = router;