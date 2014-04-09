// thx to Leeroy Brun http://stackoverflow.com/a/21254635
angular.module('ngTools').filter('trustAsHtml', ['$sce', function($sce){
	return function(text) {
		return $sce.trustAsHtml(text);
	};
}]);