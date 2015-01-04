var config = require('config');
var logger = require('./logger');
var mysql      = require('mysql');
var connection = mysql.createConnection(process.env.CLEARDB_DATABASE_URL || config.get('database'));

connection.connect(function(err) {
	if (err) {
		logger.error('Unable to connect to MySQL-Database: ' + err.code);
		return;
	}
});

connection.on('close', function(err) {
	if (err) {
		connection = mysql.createConnection(connection.config);
	} else {
		logger.verbose('Database connection closed.');
	}
});

module.exports = connection;