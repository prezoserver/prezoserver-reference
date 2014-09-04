Namespace("org.prezoserver.page");

$( document ).ready(function() {
	var page = new org.prezoserver.page.Configuration();
	page.init();
});

org.prezoserver.page.Configuration = function() {
	var self = this;
	
	// tracks whether or not all tests passed
	var passed = true;
	
	/**
	 * Initializes the page and bind the click event to the 'Run tests' button
	 */
	this.init = function() {
		self.resetTestResults();
		
		$("#run_button").bind("click", function() {
			self.resetTestResults();
			
			// contrive some time delays for effect and to allow each test to finish
			setTimeout(self.testSSI, 500);
			setTimeout(self.testBase, 1250);
			setTimeout(self.testPrezoJS, 2000);
			setTimeout(self.testCsrfJS, 2750);
			setTimeout(self.report, 3500);
		});
	};
	
	/** 
	 * Resets the test results.
	 */
	this.resetTestResults = function() {
		passed = true;
			
		// reset ssi check
		$("#ssi_check_icon").removeClass("icon-check");
		$("#ssi_check").removeClass("error");
		$("#ssi_check").removeClass("success");
		$("#ssi_check_icon").addClass("icon-check-empty");
		$("#ssi_check").addClass("warning");
		$("#ssi_check_message").text("Server Side Includes (SSI)");
		
		// reset base.html check
		$("#base_html_icon").removeClass("icon-check");
		$("#base_html_check").removeClass("error");
		$("#base_html_check").removeClass("success");
		$("#base_html_icon").addClass("icon-check-empty");
		$("#base_html_check").addClass("warning");
		$("#base_html_message").text("/prezo/fragments/base.html");
		
		// reset prezo.js check
		$("#constants_js_icon").removeClass("icon-check");
		$("#constants_js_check").removeClass("error");
		$("#constants_js_check").removeClass("success");
		$("#constants_js_icon").addClass("icon-check-empty");
		$("#constants_js_check").addClass("warning");
		$("#constants_js_message").text("/prezo/js/prezo.js");
		
		// reset csrf check
		$("#csrf_js_icon").removeClass("icon-check");
		$("#csrf_js_check").removeClass("error");
		$("#csrf_js_check").removeClass("success");	
		$("#csrf_js_icon").addClass("icon-check-empty");
		$("#csrf_js_check").addClass("warning");
		$("#csrf_js_message").text("/prezo/js/csrf.js");
	};
	
	/**
	 * Checks if SSI is working by trying to find an element that should have
	 * been included via SSI.
	 */
	this.testSSI = function() {
		if ($(".navbar")[0]) {	
			$("#ssi_check_icon").removeClass("icon-check-empty");
			$("#ssi_check").removeClass("warning");			
			$("#ssi_check_icon").addClass("icon-check");
			$("#ssi_check").addClass("success");			
			$("#ssi_check_message").append(" ... passed.");
		} else {
			$("#ssi_check_icon").removeClass("icon-check-empty");
			$("#ssi_check").removeClass("warning");						
			$("#ssi_check_icon").addClass("icon-check");
			$("#ssi_check").addClass("error");
			$("#ssi_check_message").append(" ... failed.");
			passed = false;
		}
	}
	
	/**
	 * Makes an AJAX call for prezo/fragments/base.html. A response status
	 * of 200 is used to assume the file meets the specification.
	 */
	this.testBase = function() {
		$.ajax({
			url: "prezo/fragments/base.html",
			statusCode: {
				200: function() {
					$("#base_html_icon").removeClass("icon-check-empty");
					$("#base_html_check").removeClass("warning");			
					$("#base_html_icon").addClass("icon-check");
					$("#base_html_check").addClass("success");			
					$("#base_html_message").append(" ... passed.");
				}
			},
			error: function() {
				$("#base_html_icon").removeClass("icon-check-empty");
				$("#base_html_check").removeClass("warning");						
				$("#base_html_icon").addClass("icon-check");
				$("#base_html_check").addClass("error");
				$("#base_html_message").append(" ... failed.");
				passed = false;
			}
		});
	}
	
	/**
	 * Tests that the path prezo/js/prezo.js exists.
	 */
	this.testPrezoJS = function() {
		$.ajax({
			url: "prezo/js/prezo.js",
			statusCode: {
				200: function() {
					$("#constants_js_icon").removeClass("icon-check-empty");
					$("#constants_js_check").removeClass("warning");			
					$("#constants_js_icon").addClass("icon-check");
					$("#constants_js_check").addClass("success");			
					$("#constants_js_message").append(" ... passed.");
				}
			},
			error: function() {
				$("#constants_js_icon").removeClass("icon-check-empty");
				$("#constants_js_check").removeClass("warning");						
				$("#constants_js_icon").addClass("icon-check");
				$("#constants_js_check").addClass("error");
				$("#constants_js_message").append(" ... failed.");
				passed = false;
			}
		});
	};
	
	/**
	 * Tests that the path prezo/js/csrf.js exists.
	 */
	this.testCsrfJS = function() {
		$.ajax({
			url: "prezo/js/csrf.js",
			dataType: "html",
			statusCode: {
				200: function() {
					$("#csrf_js_icon").removeClass("icon-check-empty");
					$("#csrf_js_check").removeClass("warning");			
					$("#csrf_js_icon").addClass("icon-check");
					$("#csrf_js_check").addClass("success");			
					$("#csrf_js_message").append(" ... passed.");
				}
			},
			error: function() {
				$("#csrf_js_icon").removeClass("icon-check-empty");
				$("#csrf_js_check").removeClass("warning");						
				$("#csrf_js_icon").addClass("icon-check");
				$("#csrf_js_check").addClass("error");
				$("#csrf_js_message").append(" ... failed.");
				passed = false;
			}
		});
	};
	
	/**
	 * Once all tests are complete this provides a report of success or failure.
	 */
	this.report = function() {
		if (passed) {
			alert("Congratulations! The server configuration appears to be PrezoServer compliant.");
		} else {
			alert("Sorry! The server configuration does not appear to be PrezoServer compliant. Check configuration and try again.");
		}	
	}
}