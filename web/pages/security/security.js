Namespace("org.prezoserver.page");

$( document ).ready(function() {
	var page = new org.prezoserver.page.Security();
	page.init();
});

org.prezoserver.page.Security = function() {
	var self = this;
	
	// tracks whether or not all tests passed
	var passed = true;
	
	var endpoint;
	
	/**
	 * Initializes the page and bind the click event to the 'Run tests' button
	 */
	this.init = function() {
		self.resetTestResults();
		
		$("#run_button").bind("click", function() {
			self.resetTestResults();
			
			if ($("#endpoint_select").val() === 'Other') {
				endpoint = $("#endpoint").val();
				
				if (endpoint === null || endpoint.trim() === '') {
					$("#endpoint_label").addClass("error");
					$("#endpoint").addClass("error");
				}
			} else {
				endpoint = $("#endpoint_select").val();
				
				if (endpoint === null || endpoint.trim() === '') {
					$("#endpoint_label").addClass("error");
					$("#endpoint_select").addClass("error");
				}
			}
			
			if (endpoint !== null && endpoint.trim() !== '') {
				// contrive some time delays for effect and to allow each test to finish
				setTimeout(self.checkAjaxWithCsrf, 500);
				setTimeout(self.createIframe, 1250);
				setTimeout(self.checkWithoutCsrf, 2000);
				setTimeout(self.report, 2750);
			}
		});
		
		$("#endpoint_select").bind("change", function() {
			self.resetTestResults();
			
			endpoint = $("#endpoint").val();
			if ($("#endpoint_select").val() === 'Other') {
				$("#endpoint").show();
			} else {
				$("#endpoint").hide();
			}
		});
	};
	
	/** 
	 * Resets the test results.
	 */
	this.resetTestResults = function() {
		passed = true;
		
		// reset error states
		$("#endpoint_label").removeClass("error");
		$("#endpoint").removeClass("error");
		$("#endpoint_select").removeClass("error");
			
		// reset ajax with csrf.js check
		$("#ajax_with_csrf_check_icon").removeClass("icon-check");
		$("#ajax_with_csrf_check").removeClass("error");
		$("#ajax_with_csrf_check").removeClass("success");
		$("#ajax_with_csrf_check_icon").addClass("icon-check-empty");
		$("#ajax_with_csrf_check").addClass("warning");			
		$("#ajax_with_csrf_check_message").text("AJAX with csrf.js");
		
		// reset ajax without csrf.js check
		$("#ajax_with_no_csrf_iframe").remove();
		$("#ajax_with_no_csrf_check_icon").removeClass("icon-check");
		$("#ajax_with_no_csrf_check").removeClass("error");
		$("#ajax_with_no_csrf_check").removeClass("success");
		$("#ajax_with_no_csrf_check_icon").addClass("icon-check-empty");
		$("#ajax_with_no_csrf_check").addClass("warning");
		$("#ajax_with_no_csrf_check_message").text("AJAX without csrf.js");
	};
	
	/**
	 * Checks if an AJAX request is successful to a JSON endpoint
	 * that is protected from CSRF attacks.
	 */
	this.checkAjaxWithCsrf = function() {
		var timestamp = new Date().getTime();
		$.ajax({
			url: endpoint + "?t=" + timestamp,
			dataType: "json",
			statusCode: {
				200: function(json) {
					if (json.message === "PrezoServer") {
						$("#ajax_with_csrf_check_icon").removeClass("icon-check-empty");
						$("#ajax_with_csrf_check").removeClass("warning");			
						$("#ajax_with_csrf_check_icon").addClass("icon-check");
						$("#ajax_with_csrf_check").addClass("success");			
						$("#ajax_with_csrf_check_message").append(" ... passed (JSON object retrieved).");
					} else {
						self.ajaxWithCsrfFailed();
					}
				}
			},
			error: function() {
				self.ajaxWithCsrfFailed();
			}
		});		
	}
	
	this.ajaxWithCsrfFailed = function() {
		$("#ajax_with_csrf_check_icon").removeClass("icon-check-empty");
		$("#ajax_with_csrf_check").removeClass("warning");						
		$("#ajax_with_csrf_check_icon").addClass("icon-check");
		$("#ajax_with_csrf_check").addClass("error");
		$("#ajax_with_csrf_check_message").append(" ... failed (JSON object not retrieved).");
		passed = false;
	}
	
	this.createIframe = function() {
		$("#ajax_with_no_csrf_check").append('<iframe id="ajax_with_no_csrf_iframe" style="display:none" src="pages/security/iframe.html?endpoint='+ encodeURIComponent(endpoint) + '"></iframe>');
	}
		
	/**
	 * 
	 */
	this.checkWithoutCsrf = function() {
		var body = $("#ajax_with_no_csrf_iframe").contents().find("body").html();
		
		if (body.indexOf('AJAX status code 417 detected!') >= 0) {
			$("#ajax_with_no_csrf_check_icon").removeClass("icon-check-empty");
			$("#ajax_with_no_csrf_check").removeClass("warning");			
			$("#ajax_with_no_csrf_check_icon").addClass("icon-check");
			$("#ajax_with_no_csrf_check").addClass("success");			
			$("#ajax_with_no_csrf_check_message").append(" ... passed (request blocked and server returned status code 417).");
		} else {
			$("#ajax_with_no_csrf_check_icon").removeClass("icon-check-empty");
			$("#ajax_with_no_csrf_check").removeClass("warning");						
			$("#ajax_with_no_csrf_check_icon").addClass("icon-check");
			$("#ajax_with_no_csrf_check").addClass("error");
			$("#ajax_with_no_csrf_check_message").append(" ... failed (content was successfully retrieved without being blocked).");
			passed = false;
		}
	}
		
	/**
	 * Once all tests are complete this provides a report of success or failure.
	 */
	this.report = function() {
		if (passed) {
			alert("Congratulations! The server security appears to be PrezoServer compliant.");
		} else {
			alert("Sorry! The server security does not appear to be PrezoServer compliant. Check configuration and try again.");
		}
	}
}
