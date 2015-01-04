var config = require('config');
var logger = require('./logger');
var mysql = require('mysql');
var pool = mysql.createPool(process.env.CLEARDB_DATABASE_URL || config.get('database'));

pool.on('enqueue', function () {
	logger.warn('Request has to wait for an available connection slot. You should consider adding more connections to the pool.');
});

module.exports = pool;