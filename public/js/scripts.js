function showInformationBox() {
	$('#what-is-this').fadeIn(500);
}

function hideInformationBox() {
	$('#what-is-this').fadeOut(500);
}

$(document).ready(function() {
	$('#input-information').keypress(function(event) {
		if (event.keyCode == 13) {
			showInformation();
		}
	});

	$('#input-isup').keypress(function(event) {
		if (event.keyCode == 13) {
			showIsUp();
		}
	});

	if (location.pathname.split("/")[1] == "status") {
		if (location.pathname.split("/")[2] !== undefined  && location.pathname.split("/")[2] !== "") {
			$('#input-information').val(location.pathname.split("/")[2]);
			showInformation();
		} else {
			history.replaceState('data', '', '/');
		}
	} else if (location.pathname.split("/")[1] == "isup") {
		if (location.pathname.split("/")[2] !== undefined && location.pathname.split("/")[2] !== "") {
			$('#input-isup').val(location.pathname.split("/")[2]);
			showIsUp();
		} else {
			history.replaceState('data', '', '/');
		}
	}
});

var informationOriginal;
var isUpOriginal;

function showInformation() {
	var website = $('#input-information').val();
	if (website == "") { return; }

	informationOriginal = $('#col-form-information').clone();
	$('#button-information').text('Loading...');
	$('#bc-feature').css('display', 'inline-block').text('Status');
	$('#bc-site').css('display', 'inline-block').text(website);
	history.replaceState('data', '', '/status/' + website + '/');

	$.ajax({
		url: "/api/status/" + website,
		type: "GET",
		success: function(data) {
			var dateRecent = new Date(data.lastCheckResult.time.replace(' ', 'T'));

			var dataString = '<div class="well"><legend>Information about ' + website + '</legend>' +
				'<p>The website at <a href="' + data.websiteData.url + '">' + data.websiteData.url + '</a> is called <b>"' + data.websiteData.name + '"</b>, was checked <b>' + data.availability.total + ' times</b> and has an average availability of <b>' + data.availability.average + '</b>.</p>' +
				'<p>The most recent check on <b>' + dateRecent.toLocaleDateString() + '</b> at <b>' + dateRecent.toLocaleTimeString() + '</b> got the following response: <b>' + data.lastCheckResult.status + '</b></p>';
			
			if (data.lastFailedCheckResult.status !== 'unknown') {
				var dateFail = new Date(data.lastFailedCheckResult.time.replace(' ', 'T'));
				dataString += '<p>The last failed check on <b>' + dateFail.toLocaleDateString() + '</b> at <b>' + dateFail.toLocaleTimeString() + '</b> failed because of this response: <b>' + data.lastFailedCheckResult.status + '</b></p>';
			}
			
			dataString += '<button class="btn btn-primary" onclick="resetInformation()">New Query</button></div>';
			
			$('#col-form-information').html(dataString);
			$('#bc-site').html('<a href="' + window.location.href + '">' + website + '</a>');
		},
		error: function(error) {
			$('#col-form-information').html('<div class="well"><legend>Oops...</legend><p>Sorry, but I was unable to process your request.<br />Error: ' + JSON.parse(error.responseText).message + '</p><button class="btn btn-primary" onclick="resetInformation()">New Query</button></div>');
		}
	});
}

function resetInformation() {
	$('#col-form-information').replaceWith(informationOriginal);
	resetMain();
}

function showIsUp() {
	var website = $('#input-isup').val();
	if (website == "") { return; }

	isUpOriginal = $('#col-form-isup').clone();
	$('#button-isup').text('Loading...');
	$('#bc-feature').css('display', 'inline-block').text('IsUp');
	$('#bc-site').css('display', 'inline-block').text(website);
	history.replaceState('data', '', '/isup/' + website + '/');

	$.ajax({
		url: "/api/isup/" + website,
		type: "GET",
		success: function(data) {
			$('#col-form-isup').html('<div class="well"><legend>Is ' + website + ' up?</legend><p>' + data + '</p><button class="btn btn-primary" onclick="resetIsUp()">New Query</button></div>');
			$('#bc-site').html('<a href="' + window.location.href + '">' + website + '</a>');
		},
		error: function(error) {
			$('#col-form-isup').html('<div class="well"><legend>Oops...</legend><p>Sorry, but I was unable to process your request.<br />Error: ' + error.responseText + '</p><button class="btn btn-primary" onclick="resetIsUp()">New Query</button></div>');
		}
	});
}

function resetIsUp() {
	$('#col-form-isup').replaceWith(isUpOriginal);
	resetMain();
}

function resetMain() {
	$('#bc-feature').css('display', 'none').text('');
	$('#bc-site').css('display', 'none').text('');
	history.replaceState('data', '', '/');
	bindKeypressHandlers();
}