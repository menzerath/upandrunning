var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var db = require('./lib/database');
var logger = require('./lib/logger');
var website = require('./lib/website');

var app = express();

// welcome!
logger.info("Welcome to UpAndRunning v" + require('./package.json').version + "!");

// create database
db.query("CREATE TABLE IF NOT EXISTS `website` (`id` int(11) NOT NULL AUTO_INCREMENT, `name` varchar(50) NOT NULL, `enabled` int(1) NOT NULL DEFAULT '1', `protocol` varchar(8) NOT NULL, `url` varchar(100) NOT NULL, `status` varchar(50) NOT NULL DEFAULT 'unknown', `time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00', `lastFailStatus` varchar(50) NOT NULL DEFAULT 'unknown', `lastFailTime` datetime NOT NULL DEFAULT '0000-00-00 00:00:00', `ups` int(11) NOT NULL DEFAULT '0', `downs` int(11) NOT NULL DEFAULT '0', `totalChecks` int(11) NOT NULL DEFAULT '0', `avgAvail` float NOT NULL DEFAULT '100', PRIMARY KEY (`id`), UNIQUE KEY `url` (`url`)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;", function(err, rows, fields) {
	if (err) {
		logger.error(err);
		return;
	} else {
		logger.info("Database successfully prepared");
	}
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

app.use(require('morgan')('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// add our custom header
app.use(function (req, res, next) {
	res.setHeader("X-Powered-By", "UpAndRunning");
	next();
});

// the most important routes
app.use('/', require('./routes/index'));
app.use('/api', require('./routes/api'));
app.use('/show', require('./routes/show'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	res.status(err.status || 500).render('error', { code: err.status, message: err.message });
});

// check all the websites now (after a 3 second init-delay) and then every 5 minutes
setTimeout(function() {
	checkAllWebsites();
}, 3*1000);

setInterval(function() {
	checkAllWebsites();
}, 5*60*1000);

// "check all websites"-function
function checkAllWebsites() {
	db.query("SELECT id, protocol, url FROM website WHERE enabled = 1;", function(err, rows, fields) {
	    if (err) {
			logger.error("Unable to search for websites in my database: " + err.code);
			return;
	    } else {
	    	logger.info("Found " + rows.length + " active websites in my database");

	    	for (var i in rows) {
		        var w = new website(rows[i].id, rows[i].protocol, rows[i].url);
				w.runCheck();
				w.calcAvgAvailability();
		    }
	    }
	});
}

module.exports = app;