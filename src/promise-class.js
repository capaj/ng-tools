angular.module('ngTools').value('promiseClassStates',
	['not-initialized', 'in-progress', 'resolved', 'rejected'])
.directive('promiseClass', function (promiseClassStates) {
	return {
		restrict: 'A',
		link: function (scope, el, attrs) {
			var inProgress = function (prom) {
				el.removeClass(promiseClassStates[0]);
				el.addClass(promiseClassStates[1]);
				prom.then(function () {
					el.removeClass(promiseClassStates[1]);
					el.addClass(promiseClassStates[2]);
				}, function () {
					el.removeClass(promiseClassStates[1]);
					el.addClass(promiseClassStates[3]);
				});
			};

			scope.$watch(function () {
				return scope.$eval(attrs.promiseClass);
			}, function (nV) {
				if(nV && nV.then) {
					inProgress(nV);
				} else {
					el.addClass(promiseClassStates[0]);
				}
			});

		}
	};
});