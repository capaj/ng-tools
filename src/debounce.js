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