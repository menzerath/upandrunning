var loadedWebsiteData;
var editId;

function showSuccessBox() {
	$('#success-box').fadeIn(200);
}

function hideSuccessBox() {
	$('#success-box').fadeOut(200);
}

function showErrorBox() {
	$('#error-box').fadeIn(200);
}

function hideErrorBox() {
	$('#error-box').fadeOut(200);
}

$(document).ready(function () {
	$('#input-add-name').keypress(function (event) {
		if (event.keyCode == 13) {
			addWebsite();
		}
	});
	
	$('#input-add-url').keypress(function (event) {
		if (event.keyCode == 13) {
			addWebsite();
		}
	});
	
	$('#input-edit-name').keypress(function (event) {
		if (event.keyCode == 13) {
			saveWebsite();
		}
	});
	
	$('#input-edit-url').keypress(function (event) {
		if (event.keyCode == 13) {
			saveWebsite();
		}
	});
	
	$('#input-new-password').keypress(function (event) {
		if (event.keyCode == 13) {
			changePassword();
		}
	});
	
	$('#input-new-interval').keypress(function (event) {
		if (event.keyCode == 13) {
			changeInterval();
		}
	});
	
	loadWebsites();
});

function logout() {
	$.ajax({
		url: "/api/admin/logout",
		type: "GET",
		success: function () {
			location.reload();
		},
		error: function (error) {
			$('#error-text').html(JSON.parse(error.responseText).message);
			showErrorBox();
		}
	});
}

function loadWebsites() {
	$.ajax({
		url: "/api/admin/websites",
		type: "GET",
		success: function (data) {
			loadedWebsiteData = data.websites;
			var dataString = '';
			for (var i = 0; i < loadedWebsiteData.length; i++) {
				dataString += '<tr><td>' + loadedWebsiteData[i].id + '</td><td>' + loadedWebsiteData[i].name + '</td><td>';
				
				if (loadedWebsiteData[i].enabled) {
					dataString += ' <span class="label label-success" id="label-action" onclick="disableWebsite(' + loadedWebsiteData[i].id + ')">Enabled</span> </td><td>';
				} else {
					dataString += ' <span class="label label-warning" id="label-action" onclick="enableWebsite(' + loadedWebsiteData[i].id + ')">Disabled</span> </td><td>';
				}
				
				if (loadedWebsiteData[i].visible) {
					dataString += ' <span class="label label-success" id="label-action" onclick="invisibleWebsite(' + loadedWebsiteData[i].id + ')">Visbile</span> ';
				} else {
					dataString += ' <span class="label label-warning" id="label-action" onclick="visibleWebsite(' + loadedWebsiteData[i].id + ')">Invisible</span> ';
				}
				
				dataString += '</td><td>' + loadedWebsiteData[i].protocol + '</td><td>' + loadedWebsiteData[i].url + '</td><td>';
				
				if (loadedWebsiteData[i].status.indexOf("200") > -1) {
					dataString += ' <span class="label label-success">' + loadedWebsiteData[i].status + '</span> ';
				} else if (loadedWebsiteData[i].status.indexOf("301") > -1 || loadedWebsiteData[i].status.indexOf("302") > -1) {
					dataString += ' <span class="label label-warning">' + loadedWebsiteData[i].status + '</span> ';
				} else {
					dataString += ' <span class="label label-danger">' + loadedWebsiteData[i].status + '</span> ';
				}
				
				if (loadedWebsiteData[i].time === '0000-00-00 00:00:00') {
					dataString += '</td><td>never</td>';
				} else {
					var date = new Date(loadedWebsiteData[i].time.replace(' ', 'T'));
					dataString += '</td><td>' + date.toLocaleDateString() + ' ' + date.toLocaleTimeString() + '</td>';
				}
				
				dataString += '<td>' + loadedWebsiteData[i].avgAvail + '</td>';
				
				dataString += '<td><span class="label label-primary" id="label-action" onclick="editWebsite(' + loadedWebsiteData[i].id + ')">Edit</span> <span class="label label-danger" id="label-action" onclick="deleteWebsite(' + loadedWebsiteData[i].id + ')">Delete</span></td></tr>';
			}
			$('#table-websites').html(dataString);
		},
		error: function (error) {
			$('#table-websites').html('<tr><td colspan="10">An error occured. Please authenticate again or add a website.</td></tr>');
		}
	});
}

function addWebsite() {
	var name = $('#input-add-name').val();
	var protocol = $('#input-add-protocol').val();
	var url = $('#input-add-url').val();
	
	if (name.trim() && protocol.trim() && url.trim()) {
		$.ajax({
			url: "/api/admin/websites/add/" + name + "/" + protocol + "/" + url,
			type: "GET",
			success: function () {
				$('#input-add-name').val('');
				$('#input-add-protocol').val('https');
				$('#input-add-url').val('');
				loadWebsites();
			},
			error: function (error) {
				$('#error-text').html(JSON.parse(error.responseText).message);
				showErrorBox();
			}
		});
	} else {
		$('#error-text').html("Please fill in all fields to add a new website.");
		showErrorBox();
	}
}

function enableWebsite(id) {
	$.ajax({
		url: "/api/admin/websites/enable/" + id,
		type: "GET",
		success: function () {
			loadWebsites();
		},
		error: function (error) {
			$('#error-text').html(JSON.parse(error.responseText).message);
			showErrorBox();
		}
	});
}

function disableWebsite(id) {
	$.ajax({
		url: "/api/admin/websites/disable/" + id,
		type: "GET",
		success: function () {
			loadWebsites();
		},
		error: function (error) {
			$('#error-text').html(JSON.parse(error.responseText).message);
			showErrorBox();
		}
	});
}

function visibleWebsite(id) {
	$.ajax({
		url: "/api/admin/websites/visible/" + id,
		type: "GET",
		success: function () {
			loadWebsites();
		},
		error: function (error) {
			$('#error-text').html(JSON.parse(error.responseText).message);
			showErrorBox();
		}
	});
}

function invisibleWebsite(id) {
	$.ajax({
		url: "/api/admin/websites/invisible/" + id,
		type: "GET",
		success: function () {
			loadWebsites();
		},
		error: function (error) {
			$('#error-text').html(JSON.parse(error.responseText).message);
			showErrorBox();
		}
	});
}

function editWebsite(id) {
	editId = id;
	$('#form-edit-website').fadeIn(200);
	
	for (var i = 0; i < loadedWebsiteData.length; i++) {
		if (id === loadedWebsiteData[i].id) {
			$('#input-edit-name').val(loadedWebsiteData[i].name);
			$('#input-edit-protocol').val(loadedWebsiteData[i].protocol);
			$('#input-edit-url').val(loadedWebsiteData[i].url);
		}
	}
}

function saveWebsite() {
	var name = $('#input-edit-name').val();
	var protocol = $('#input-edit-protocol').val();
	var url = $('#input-edit-url').val();
	
	if (name.trim() && protocol.trim() && url.trim()) {
		$.ajax({
			url: "/api/admin/websites/edit/" + editId + "/" + name + "/" + protocol + "/" + url,
			type: "GET",
			success: function () {
				cancleSaveWebsite();
				loadWebsites();
			},
			error: function (error) {
				$('#error-text').html(JSON.parse(error.responseText).message);
				showErrorBox();
			}
		});
	} else {
		$('#error-text').html("Please fill in all fields to save this edited website.");
		showErrorBox();
	}
}

function cancleSaveWebsite() {
	$('#form-edit-website').fadeOut(200);
}

function deleteWebsite(id) {
	if (window.confirm("Are you sure?")) {
		$.ajax({
			url: "/api/admin/websites/delete/" + id,
			type: "GET",
			success: function () {
				loadWebsites();
			},
			error: function (error) {
				$('#error-text').html(JSON.parse(error.responseText).message);
				showErrorBox();
			}
		});
	}
}

function changePassword() {
	var newPassword = $('#input-new-password').val();
	
	if (newPassword.trim()) {
		$.ajax({
			url: "/api/admin/settings/password/" + newPassword,
			type: "GET",
			success: function () {
				$('#input-new-password').val('');
				$('#success-text').html("Password successfully changed.");
				showSuccessBox();
			},
			error: function (error) {
				$('#error-text').html(JSON.parse(error.responseText).message);
				showErrorBox();
			}
		});
	} else {
		$('#error-text').html("Please enter a valid password to change your password.");
		showErrorBox();
	}
}

function changeInterval() {
	var newInterval = $('#input-new-interval').val();
	
	if (newInterval.trim() && !(isNaN(newInterval) || newInterval < 1 || newInterval > 60)) {
		$.ajax({
			url: "/api/admin/settings/interval/" + newInterval,
			type: "GET",
			success: function () {
				$('#input-new-interval').val(newInterval);
				$('#success-text').html("Interval successfully changed.");
				showSuccessBox();
			},
			error: function (error) {
				$('#error-text').html(JSON.parse(error.responseText).message);
				showErrorBox();
			}
		});
	} else {
		$('#error-text').html("Please enter a valid interval (numbers between 1 and 60) to change it.");
		showErrorBox();
	}
}