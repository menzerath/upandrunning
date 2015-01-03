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
		});
	};

	Website.prototype.calcAvgAvailability = function() {
		db.get("SELECT ((SELECT CAST(COUNT(id) AS float) AS val1 FROM result WHERE website_id = $website_id AND (status = 200 OR status = 301 OR status = 302)) / (SELECT CAST(COUNT(id) AS float) AS val2 FROM result WHERE website_id = $website_id))*100 AS avg" , { $website_id: id }, function(err, row) {
			if (row !== undefined) {
				var avgAvail = row.avg.toFixed(2);
				logger.verbose(url + ': ' + avgAvail + '%');
				db.run("UPDATE website SET avgAvail = $avgAvail WHERE id = $id;", { $id: id, $avgAvail: avgAvail });
			}
		});
	};
}

module.exports = Website;