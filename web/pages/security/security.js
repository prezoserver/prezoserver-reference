Namespace("org.prezoserver");

org.prezoserver.SecurityController = function($scope) {
	this.TEST_IFRAME_ID = "test_iframe";
	this.ENDPOINT = "api/test-csrf.html";
		
	this.init = function() {
		this.ajaxWithCsrf = {checked:false, passed:false, message:null};
		this.ajaxNoCsrf = {checked:false, passed:false, message:null};
		$("#" + this.TEST_IFRAME_ID).remove();
	};
	
	this.runTests = function() {	
		setTimeout(this.testAjaxWithCsrf, 500);
		setTimeout(this.createIframe, 750);
		setTimeout(this.testAjaxNoCsrf, 1250);
		setTimeout(function() {
			this.testsExecuted = true;
			
			if (this.ajaxWithCsrf.passed && this.ajaxNoCsrf.passed) {
				alert("Congratulations! The server configuration appears to be PrezoServer compliant.");
			} else {
				alert("Sorry! The server configuration does not appear to be PrezoServer compliant. Check configuration and try again.");
			}
		}.bind(this), 1500);
	};
	
	/**
	 * Checks if an AJAX request is successful to a JSON endpoint
	 * that is protected from CSRF attacks.
	 */
	this.testAjaxWithCsrf = function() {
		this.ajaxWithCsrf.checked = true;
				
		var timestamp = new Date().getTime();
		$.ajax({
			url: this.ENDPOINT + "?t=" + timestamp,
			dataType: "json",
			statusCode: {
				200: function(json) {
					this.ajaxWithCsrf.passed = true;
					this.ajaxWithCsrf.message = " ... passed (JSON object retrieved).";
					$scope.$apply();
				}.bind(this),
				error: function() {
					this.ajaxWithCsrf.message = " ... failed (JSON object not retrieved).";
					$scope.$apply();
				}.bind(this)
			}
		});	
	}.bind(this);
	
	/**
	 * Checks the result in the iframe to determine if CSRF check passed. A 
	 * CSRF error status code is expected since CSRF was not included. 
	 */
	this.testAjaxNoCsrf = function() {
		this.ajaxNoCsrf.checked = true; 
		
		var body = $("#" + this.TEST_IFRAME_ID).contents().find("body").html();
		
		if (body.indexOf('Potential CSRF Attack Detected') >= 0) {
			this.ajaxNoCsrf.passed = true;
			this.ajaxNoCsrf.message = " ... passed (request blocked and server returned status code 417).";
		} else {
			this.ajaxNoCsrf.message = " ... failed (content was successfully retrieved without being blocked).";
		}
		
		$scope.$apply();
	}.bind(this);
	
	this.createIframe = function() {
		$("body").append('<iframe id="' + this.TEST_IFRAME_ID + '" style="display:none" src="pages/security/iframe.html?endpoint='+ encodeURIComponent(this.ENDPOINT) + '"></iframe>');
	}.bind(this);
};

(function() {
	var app = angular.module('security', []);
	
	app.controller('SecurityController', org.prezoserver.SecurityController);
})();