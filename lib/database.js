var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.cached.Database('database.sqlite');

module.exports = db;