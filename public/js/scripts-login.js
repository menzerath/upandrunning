function showErrorBox() {
	$('#error-box').fadeIn(200);
}

function hideErrorBox() {
	$('#error-box').fadeOut(200);
}

$(document).ready(function() {
	$('#input-password').keypress(function(event) {
		if (event.keyCode == 13) {
			login();
		}
	});
	$('#input-password').focus();
});

function login() {
	var password = $('#input-password').val();

	if (password.trim()) {
		$.ajax({
			url: "/api/admin/login/" + password,
			type: "GET",
			success: function () {
				location.reload();
			},
			error: function(error) {
				$('#error-text').html(JSON.parse(error.responseText).message);
				showErrorBox();
			}
		});
	}
}