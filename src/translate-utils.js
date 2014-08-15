angular.module('ngTools').directive('longTextClass', function() {
	return {
		restrict: 'A',
		link: function (scope, el, attrs) {
			scope.$watch(function () {
				return el.text().trim();
			}, function (nV) {
				if (nV.length > attrs.longTextClass) {
					el.addClass('long_text');
				} else {
					el.removeClass('long_text');
				}
			});
		}
	};
}).directive('textOverflowClass', function () {
	function checkOverflow(el, attrs){
		var curOverflow = el.style.overflow;
		if ( !curOverflow || curOverflow === "visible" ){
			el.style.overflow = "hidden";
		}
		var isOverflowing;
		if (!attrs.textOverflowClass) { //use text-overflow-class="true" when you want to check width and height for overflow
			isOverflowing = el.clientWidth < el.scrollWidth;
		} else {
			isOverflowing = el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight;
		}

		el.style.overflow = curOverflow;

		return isOverflowing;
	}
	return {
		restrict: 'A',
		link: function (scope, el, attrs) {
			scope.$watch(function () {
				return el.text();
			}, function () {

				if (checkOverflow(el[0], attrs)) {
					el.addClass('text_overflow');
				} else {
					el.removeClass('text_overflow');
				}

			});
		}
	};
});