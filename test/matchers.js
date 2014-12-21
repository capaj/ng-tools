// jasmine matchers for expecting an element to have a css class
// https://github.com/angular/angular.js/blob/master/test/matchers.js
beforeEach(function() {

	jasmine.addMatchers({
		toHaveClass: function(util) {

			return {
				compare: function(actual, expected) {
					//console.log("expected " + expected);
					//matcher.message = "Expected '" + actual.html() + "' to have class '" + expected + "'";

					return {
						pass: actual.hasClass(expected)
					};
				}
			};
		}
	});

});