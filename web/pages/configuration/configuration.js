Namespace("org.prezoserver");

org.prezoserver.ConfigurationController = function($scope) {
	this.ssi = {checked:false, passed:false, message:null};
	this.baseHtml = {checked:false, passed:false, message:null};
	this.prezoJS = {checked:false, passed:false, message:null};
	this.csrfJS = {checked:false, passed:false, message:null};
	
	this.reset = function() {
		this.ssi = {checked:false, passed:false, message:null};
		this.baseHtml = {checked:false, passed:false, message:null};
		this.prezoJS = {checked:false, passed:false, message:null};
		this.csrfJS = {checked:false, passed:false, message:null};
	};
	
	this.runTests = function() {	
		setTimeout(this.testSSI, 750);
		setTimeout(this.testBaseHtml, 1000);
		setTimeout(this.testPrezoJS, 1250);
		setTimeout(this.testCsrfJS, 1500);
		setTimeout(function() {
			this.testsExecuted = true;
			
			if (this.ssi.passed && this.baseHtml.passed && this.prezoJS.passed && this.csrfJS.passed) {
				alert("Congratulations! The server configuration appears to be PrezoServer compliant.");
			} else {
				alert("Sorry! The server configuration does not appear to be PrezoServer compliant. Check configuration and try again.");
			}
		}.bind(this), 1750);
	};
	
	/**
	 * Checks if SSI is working by finding an element that would only
	 * be present if the SSI directive worked. In this case the navbar class
	 * which is only found in the header.
	 */
	this.testSSI = function() {
		this.ssi.checked = true;
				
		if ($(".navbar")[0]) {	
			this.ssi.passed = true;
			this.ssi.message = " ... passed.";
		} else {
			this.ssi.passed = false;
			this.ssi.message = " ... failed.";
		}
		
		$scope.$apply();
	}.bind(this);
	
	/**
	 * Makes an AJAX call for prezo/fragments/base.html. A response status
	 * of 200 is used to assume the file meets the specification.
	 */
	this.testBaseHtml = function() {
		this.baseHtml.checked = true; 
		
		$.ajax({
			url: "prezo/fragments/base.html",
			statusCode: {
				200: function() {
					this.baseHtml.passed = true;
					this.baseHtml.message = " ... passed.";
					$scope.$apply();
				}.bind(this)
			},
			error: function() {
				this.baseHtml.passed = false;
				this.baseHtml.message = " ... failed.";
				$scope.$apply();
			}.bind(this)
		});
	}.bind(this);
	
	/**
	 * Tests that the path prezo/js/prezo.js exists.
	 */
	this.testPrezoJS = function() {
		this.prezoJS.checked = true;
		
		$.ajax({
			url: "prezo/js/prezo.js",
			statusCode: {
				200: function() {
					this.prezoJS.passed = true;
					this.prezoJS.message = " ... passed.";
					$scope.$apply();
				}.bind(this)
			},
			error: function() {
				this.prezoJS.passed = false;
				this.prezoJS.message = " ... failed.";
				$scope.$apply();
			}.bind(this)
		});
	}.bind(this);
	
	/**
	 * Tests that the path prezo/js/csrf.js exists.
	 */
	this.testCsrfJS = function() {
		this.csrfJS.checked = true;
		
		$.ajax({
			url: "prezo/js/csrf.js",
			dataType: "html",
			statusCode: {
				200: function() {
					this.csrfJS.passed = true;
					this.csrfJS.message = " ... passed.";
					$scope.$apply();
				}.bind(this)
			},
			error: function() {
				this.csrfJS.passed = false;
				this.csrfJS.message = " ... failed.";
				$scope.$apply();
			}.bind(this)
		});
	}.bind(this);
};

(function() {
	var app = angular.module('configuration', []);
	
	app.controller('ConfigurationController', org.prezoserver.ConfigurationController);
})();


