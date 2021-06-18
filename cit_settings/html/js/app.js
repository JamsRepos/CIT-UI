/*

	CIT PROJECT
	HassoN


*/

let selected = null;
let settingsLines = {};

 // HIDE ON START
$(".container").hide();

$(document).keyup(function (e) {
	if (e.keyCode == 27) {
		$(".container").hide();
		$.post('http://cit_settings/close', JSON.stringify({}));
		return;
	}
});

$(document).mouseup(function(e) {
    var container = $(".container");
    if (!container.is(e.target) && container.has(e.target).length === 0)
    {
        container.hide();
		$.post('http://cit_settings/close', JSON.stringify({}));
    }
});


function exitPanel() {
	$(".container").hide();
	$.post('http://cit_settings/close', JSON.stringify({}));
	return;
}

function doAction(action) {
	var newValue = null;
	if (!selected && action !== "resetall") {
		return;
	}
	if (action !== "resetall") {
		if (typeof settingsLines[selected].options == "object") {
			var e = document.getElementById("select");
			newValue = e.options[e.selectedIndex].text;
		} else {
			newValue = document.getElementById("settingsInput").value
		}
	}
	$(".container").hide();
	$.post('http://cit_settings/doaction', JSON.stringify({ action: action, selectedSettingCode: selected, selectedSettingUpdatedValue: newValue }));
	return;
}



window.addEventListener('message', function(event) {
	var item = event.data;

	// show/hide panel
	if (item.show == true) {
		selected = null;
		$(".container").show();
		$("#settingsInput").hide();
		$("#select").hide();
		$(".information").hide();
		$('.tables').empty();

		for (var i=0; i < item.categories.length; i++) {
			let name = item.categories[i][0];
			let id = item.categories[i][1];

			$('.tables').append('\
				<table id="' + id + '" class="table table-borderless table-rounded text-white">\
					<thead>\
						<tr class="bg-header">\
							<th class="col">' + name + '</th>\
							<th class="col">Value</th>\
						</tr>\
					</thead>\
					\
					<tbody id="' + id + '-body">\
					</tbody>\
				</table>\
			');
		}

		for (var i=0; i < item.userSettings.length; i++) {

			let category = item.userSettings[i].category;
			let name = item.userSettings[i].name;
			let friendlyname = item.userSettings[i].friendly;
			let options = item.userSettings[i].options;
			let defaultValue = item.userSettings[i].defaultValue;
			let description = item.userSettings[i].description;
			let placeholder = item.userSettings[i].placeholder;

			settingsLines[name] = {options: options, defaultValue: defaultValue, description: description, placeholder: placeholder}

			$('#'+category+'-body').append('<tr id="' + name + '" class="setting"><td>' + friendlyname + '<td>' + defaultValue + '</td>');
		}

		// select on click

		$(".setting").click(function () {
			selected = $(this).attr('id');
			document.getElementById("label").innerHTML  = settingsLines[selected].description;

			$(".information").fadeIn();

			if (typeof settingsLines[selected].options == "object") {
				$("#select").show();
				$("#settingsInput").hide();
			} else {
				$("#settingsInput").show();
				$("#select").hide();
			}

			var select = document.getElementById("select");
			var length = select.options.length;
			for (i = length-1; i >= 0; i--) {
			  select.options[i] = null;
			}


			for (var i=0; i < settingsLines[selected].options.length; i++) {
				var option = document.createElement("option");
				option.text = settingsLines[selected].options[i];
				option.id = settingsLines[selected].options[i];
				option.value = settingsLines[selected].options[i];
				document.getElementById("select").add(option);
			}
			if (settingsLines[selected].placeholder) {
				document.getElementById("settingsInput").placeholder = settingsLines[selected].placeholder;
			}

			$('.setting').removeClass('selected');
			$(this).addClass('selected');
		});

	}
	else if (item.show == false)
	{
		$(".container").hide();
		return
	}


})