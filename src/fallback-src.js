angular.module('ngTools').directive('fallbackSrc', function () {	//inspired by Rubens Mariuzzo's answer http://stackoverflow.com/a/16349631/671457
	return {
		link: function postLink(scope, elm, attrs) {
			if (attrs.src === undefined && (attrs.ngSrc == undefined || attrs.ngSrc == null)) {
				attrs.$set('src', attrs.fallbackSrc);
			}
			elm.on('error', function() {
				if (attrs.src !== attrs.fallbackSrc) {
					attrs.$set('src', attrs.fallbackSrc);
				}
			});
		}
	};
});