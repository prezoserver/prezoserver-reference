$( document ).ready(function() {
	var endpoint = decodeURIComponent($.url.param(window.location.href, "endpoint"));
	var timestamp = new Date().getTime();
	$.ajax({
		url: endpoint + "?t=" + timestamp,
		dataType: "json",
		statusCode: {
			417: function(xhr) {
				console.log(xhr);
				$("body").append(xhr.responseText);					
			}
		}
	});
});
