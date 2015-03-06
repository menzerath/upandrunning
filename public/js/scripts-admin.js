function showErrorBox() {
	$('#error-box').fadeIn(500);
}

function hideErrorBox() {
	$('#error-box').fadeOut(500);
}

$(document).ready(function() {
	reloadData();
});

function reloadData() {
	loadWebsites();
	loadUsers();
}

function loadWebsites() {
	$.ajax({
		url: "/api/admin/website/list",
		type: "GET",
		success: function(data) {
			var dataString = '';
			for (var i = 0; i < data.websites.length; i++) {
				dataString += '<tr><td>' + data.websites[i].id + '</td><td>' + data.websites[i].name + '</td><td>';
				if (data.websites[i].enabled) {
					dataString += ' <span class="label label-success" onclick="disableWebsite(' + data.websites[i].id + ')">Enabled</span> ';
				} else {
					dataString += ' <span class="label label-warning" onclick="enableWebsite(' + data.websites[i].id + ')">Disabled</span> ';
				}
				dataString += '</td><td>' + data.websites[i].protocol + '</td><td>' + data.websites[i].url + '</td><td><span class="label label-primary" onclick="editWebsite(' + data.websites[i].id + ')">Edit</span> ';
				dataString += ' <span class="label label-danger" onclick="deleteWebsite(' + data.websites[i].id + ')">Delete</span></td></tr>';
			}
			$('#table-websites').html(dataString);
		},
		error: function(error) {
			$('#table-websites').html('<tr><td>X</td><td>Error</td><td></td><td></td><td>None</td>');
		}
	});
}

function addWebsite() {
	var name = $('#input-add-name').val();
	var protocol = $('#input-add-protocol').val();
	var url = $('#input-add-url').val();

	if (name.trim() && protocol.trim() && url.trim()) {
		$.ajax({
			url: "/api/admin/website/add/" + name + "/" + protocol + "/" + url,
			type: "GET",
			success: function(data) {
				$('#input-add-name').val('');
				$('#input-add-protocol').val('https');
				$('#input-add-url').val('');
				loadWebsites();
			},
			error: function(error) {
				$('#error-text').html(JSON.parse(error.responseText).message);
				showErrorBox();
			}
		});
	}
}

function enableWebsite(id) {
	$.ajax({
		url: "/api/admin/website/enable/" + id,
		type: "GET",
		success: function(data) {
			loadWebsites();
		},
		error: function(error) {
			$('#error-text').html(JSON.parse(error.responseText).message);
			showErrorBox();
		}
	});
}

function disableWebsite(id) {
	$.ajax({
		url: "/api/admin/website/disable/" + id,
		type: "GET",
		success: function(data) {
			loadWebsites();
		},
		error: function(error) {
			$('#error-text').html(JSON.parse(error.responseText).message);
			showErrorBox();
		}
	});
}

function editWebsite(id) {

}

function deleteWebsite(id) {
	if (window.confirm("Are you sure?")) {
		$.ajax({
			url: "/api/admin/website/delete/" + id,
			type: "GET",
			success: function(data) {
				loadWebsites();
			},
			error: function(error) {
				$('#error-text').html(JSON.parse(error.responseText).message);
				showErrorBox();
			}
		});
	}
}

function loadUsers() {
	$.ajax({
		url: "/api/admin/user/list",
		type: "GET",
		success: function(data) {
			var dataString = '';
			for (var i = 0; i < data.users.length; i++) {
				dataString += '<tr><td>' + data.users[i].id + '</td><td>' + data.users[i].username + '</td><td>' + data.users[i].isAdmin + '</td><td><span class="label label-primary" onclick="editUser(' + data.users[i].id + ')">Edit</span> <span class="label label-danger" onclick="deleteUser(' + data.users[i].id + ')">Delete</span></td></tr>';
			}
			$('#table-users').html(dataString);
		},
		error: function(error) {
			$('#table-users').html('<tr><td>X</td><td>Error</td><td></td><td>None</td></tr>');
		}
	});
}

function addUser() {
	var name = $('#input-add-user-name').val();
	var admin = $('#input-add-user-admin').val();
	var password = $('#input-add-user-password').val();

	if (name.trim() && admin.trim() && password.trim()) {
		$.ajax({
			url: "/api/admin/user/add/" + name + "/" + admin + "/" + password,
			type: "GET",
			success: function(data) {
				$('#input-add-user-name').val('');
				$('#input-add-user-admin').val('0');
				$('#input-add-user-password').val('');
				loadUsers();
			},
			error: function(error) {
				$('#error-text').html(JSON.parse(error.responseText).message);
				showErrorBox();
			}
		});
	}
}

function editUser(id) {

}

function deleteUser(id) {
	if (window.confirm("Are you sure?")) {
		$.ajax({
			url: "/api/admin/user/delete/" + id,
			type: "GET",
			success: function(data) {
				loadUsers();
			},
			error: function(error) {
				$('#error-text').html(JSON.parse(error.responseText).message);
				showErrorBox();
			}
		});
	}
}