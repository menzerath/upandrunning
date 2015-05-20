var db = require('../lib/database');
var logger = require('../lib/logger');
var httpcodes = require('../lib/http-status-codes');
var pushBullet = require('pushbullet');
var request = require('request');

function Website(id, protocol, url) {
	this.id = id;
	this.protocol = protocol;
	this.url = url;

	Website.prototype.runCheck = function() {
		request({
			url: protocol + '://' + url,
			headers: {'User-Agent': 'UpAndRunning (https://github.com/MarvinMenzerath/UpAndRunning)'}
		}, function(error, response) {
			var status;
			if (response === undefined) {
				status = 'Server not found';
			} else {
				status = response.statusCode + ' - ' + httpcodes[response.statusCode];
			}

			// compare previous and new status and send a push if there is a change
			if (global.PBAPI != "") {
				db.query("SELECT status FROM website WHERE id = ?", [id], function(err, rows) {
					if (err) {
						logger.error("Unable get website's old status: " + err.code);
						return;
					}
					var oldStatus = rows[0].status;

					if (oldStatus != status) {
						var pusher = new pushBullet(global.PBAPI);
						pusher.note({}, global.TITLE + " - Status Change", url + " went from \"" + oldStatus + "\" to \"" + status + "\".", function(err) {
							if (err) {
								logger.error("Unable to send PushBullet-notification: " + err);
							}
						});
					}
				});
			}

			if (status.indexOf(200) > -1 || status.indexOf(301) > -1 || status.indexOf(302) > -1) {
				// success
				db.query("UPDATE website SET status = ?, time = NOW(), ups = ups + 1, totalChecks = totalChecks + 1 WHERE id = ?;", [status, id], function(err) {
					if (err) {
						logger.error("Unable to save new website-status: " + err.code);
					} else {
						calcAvgAvailability();
					}
				});
			} else {
				// failure
				db.query("UPDATE website SET status = ?, time = NOW(), lastFailStatus = ?, lastFailTime = NOW(), downs = downs + 1, totalChecks = totalChecks + 1 WHERE id = ?;", [status, status, id], function(err) {
					if (err) {
						logger.error("Unable to save new website-status: " + err.code);
					} else {
						calcAvgAvailability();
					}
				});
			}
		});

		function calcAvgAvailability() {
			db.query("SELECT ((SELECT ups FROM website WHERE id = ?) / (SELECT totalChecks FROM website WHERE id = ?))*100 AS avg", [id, id], function(err, rows) {
				if (err) {
					logger.error("Unable to calculate new website-availability: " + err.code);
					return;
				}
				var avgAvail = rows[0].avg.toFixed(2);

				db.query("UPDATE website SET avgAvail = ? WHERE id = ?;", [avgAvail, id], function(err) {
					if (err) {
						logger.error("Unable to save new website-availability: " + err.code);
					}
				});
			});
		}
	};
}

module.exports = Website;