$(document).ready(function () {
	$('#input-password').keypress(function (event) {
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
			error: function (error) {
				$('.bottom-right').notify({
					type: 'danger',
					message: {text: JSON.parse(error.responseText).message},
					fadeOut: {enabled: true, delay: 3000}
				}).show();
			}
		});
	}
}