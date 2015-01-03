var express = require('express');
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');

var db = require('./lib/database');
var logger = require('./lib/logger');
var website = require('./lib/website');

var index = require('./routes/index');
var api = require('./routes/api');

var app = express();

// welcome!
logger.info("Welcome to UpAndRunning v" + require('./package.json').version + "!");

// create database
logger.info("Preparing Database...");
db.serialize(function() {
	db.run("CREATE TABLE IF NOT EXISTS website (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, name TEXT NOT NULL, enabled INTEGER NOT NULL DEFAULT 1, protocol TEXT NOT NULL, url TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'unknown', lastCheck TEXT NOT NULL DEFAULT 'never', avgAvail INTEGER NOT NULL DEFAULT 100);");
	db.run("CREATE TABLE IF NOT EXISTS result (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, website_id INTEGER NOT NULL, status TEXT NOT NULL, time TEXT NOT NULL);");
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// Add our custom header
app.use(function (req, res, next) {
	res.setHeader("X-Powered-By", "UpAndRunning");
	next();
});

app.use('/', index);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', { message: err.message, error: {} });
});

// check all the websites now and then every 5 minutes
checkAllWebsites();
setInterval(function() {
	checkAllWebsites();
}, 5*60*1000);

// "check all websites"-function
function checkAllWebsites() {
	db.get("SELECT COUNT(id) AS sites FROM website WHERE enabled = 1;", function(err, row) {
		if (row === undefined) {
			logger.verbose("Unable to find a single enabled website in my database");
		} else {
			logger.info("Found " + row.sites + " active websites in my database");

			db.each("SELECT id, protocol, url FROM website WHERE enabled = 1;", function(err, row) {
				var w = new website(row.id, row.protocol, row.url);
				w.runCheck();

				setTimeout(function() {
					w.calcAvgAvailability();
				}, 5*1000);
			});
		}
	});
}

module.exports = app;