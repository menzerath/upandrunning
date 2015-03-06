var crypto = require('crypto');
var db = require('./database');
var logger = require('./logger');

function User(name) {
	this.name = name;
	this.loggedin = false;

	User.prototype.login = function(password) {
		// TODO
	};

	User.prototype.logout = function() {
		// TODO
	};

	User.prototype.exists = function(callback) {
		db.query("SELECT count(name) as total FROM user WHERE name = ?;", [ this.name ], function(err, rows) {
			if (err) {
				logger.error("Unable to check for user '" + this.name + "' in database: " + err.code);
				callback(false);
			} else {
				if (rows[0].total === 1) { callback(true); } else { callback(false); }
			}
		});
	};

	User.prototype.isAdmin = function(callback) {
		db.query("SELECT count(name) as total FROM user WHERE name = ? AND isAdmin = 1;", [ this.name ], function(err, rows) {
			if (err) {
				logger.error("Unable to check for " + this.name + "'s admin-rights in database: " + err.code);
				callback(false);
			} else {
				if (rows[0].total === 1) { callback(true); } else { callback(false); }
			}
		});
	};

	User.prototype.changePassword = function(newPassword, callback) {
		// TODO
	};

	User.prototype.changeName = function(newName) {
		// TODO
	};

	User.prototype.addUser = function(newPassword, newAdmin, callback) {
		var salt = crypto.randomBytes(256).toString('hex');
		var password = crypto.pbkdf2Sync(newPassword, salt, 4096, 512, 'sha256').toString('hex');
		var insertData = { name: this.name, isAdmin: newAdmin, salt: salt, password: password };
		db.query("INSERT INTO user SET ?;", insertData, function(err, result) {
			if (err) { logger.error("Unable to create new user: " + err.code); callback(false, err.code); } else { callback(true); }
		});
	};

	User.prototype.deleteUser = function() {
		// TODO
	};

	User.prototype.getUserCount = function(callback) {
		db.query("SELECT count(name) as total FROM user;", function(err, rows) {
			if (err) {
				logger.error("Unable to check for user-count in database: " + err.code);
				callback(-1);
			} else {
				callback(rows[0].total);
			}
		});
	};
}

module.exports = User;