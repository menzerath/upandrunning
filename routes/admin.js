var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	if (req.session.loggedin) {
		res.render('admin');
	} else {
		res.redirect('/admin/login');
	}
});

router.get('/login', function(req, res) {
	if (req.session.loggedin) {
		res.redirect('/admin');
	} else {
		res.render('login');
	}
});

module.exports = router;