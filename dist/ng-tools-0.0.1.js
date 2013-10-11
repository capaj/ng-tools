angular.module('ng-tools', []);
// debounced function is called just once after specified time
angular.module('ng-tools').factory('debounce',['$timeout', function ($timeout) {
	return function(fn, timeout, apply){ // debounce fn
		timeout = angular.isUndefined(timeout) ? 0 : timeout;
		apply = angular.isUndefined(apply) ? true : apply; // !!default is true! most suitable to my experience
		var nthCall = 0;
		return function(){ // intercepting fn
			var that = this;
			var argz = arguments;
			nthCall++;
			var later = (function(version){
				return function(){
					if (version === nthCall){
						return fn.apply(that, argz);
					}
				};
			})(nthCall);
			return $timeout(later, timeout, apply);
		};
	};
}]);
/**
 *	directive include-in-scope
 *	attribute include-in-scope: if you have a scope variable containing html, assign it to this attribute
 *	attribute src: if you have a template in separate html file, which you want to load, assign the path to it to this attribute
 *	onload attribute is evaluated when content is included, if present
 */
angular.module('ng-tools').directive('includeInScope',
	['$http', '$templateCache', '$anchorScroll', '$compile',
		function($http,   $templateCache,   $anchorScroll,   $compile) {
			return {
				restrict: 'ECA',
				terminal: true,
				compile: function(element, attr) {
					var onloadExp = attr.onload || '';
					var autoScrollExp = attr.autoscroll;

					return function(scope, element) {
						var changeCounter = 0;
						var includeCompile = function (html) {
							element.html(html);
							$compile(element.contents())(scope);

							if (angular.isDefined(autoScrollExp) && (!autoScrollExp || scope.$eval(autoScrollExp))) {
								$anchorScroll();
							}

							scope.$emit('$includeContentLoaded');
							scope.$eval(onloadExp);
						};

						var clearContent = function() {
							element.html('');
						};

						if (attr.includeInScope) {
							var html = scope.$eval(attr.includeInScope);
							includeCompile(html);
						}else{
							scope.$watch(function () {
								return attr.src;
							}, function ngIncludeWatchAction(src) {
								var thisChangeId = ++changeCounter;

								if (src) {
									$http.get(src, {cache: $templateCache}).success(function(response) {
										if (thisChangeId !== changeCounter) return;
										includeCompile(response);

									}).error(function() {
										if (thisChangeId === changeCounter) clearContent();
									});
								} else clearContent();
							});
						}
					};
				}
			};
		}
	]
);