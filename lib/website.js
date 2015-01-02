var db = require('./database');
var logger = require('./logger');
var request = require('request');

function Website(id, protocol, url) {
	this.id = id;
	this.protocol = protocol;
	this.url = url;

	Website.prototype.runCheck = function() {
		request({ url: this.protocol + '://' + this.url, headers: { 'User-Agent': 'UpAndRunning (https://github.com/MarvinMenzerath/UpAndRunning)' } }, function (error, response, body) {
			var status;
			if (response === undefined) {
				status = 'Server not found';
			} else {
				status = response.statusCode;
			}

			logger.verbose(url + ': ' + status);
			db.run("UPDATE website SET status = $status, lastCheck = $time WHERE id = $id;", { $id: id, $status: status, $time: new Date().toISOString() });
			db.run("INSERT INTO result (website_id, status, time) VALUES ($website_id, $status, $time);", { $website_id: id, $status: status, $time: new Date().toISOString() });
		})
	};
}

module.exports = Website;