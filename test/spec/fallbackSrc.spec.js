describe('fallbackSrc directive', function() {
	var elm, scope;

	// load the tabs code
	beforeEach(module('ngTools'));


	beforeEach(inject(function($rootScope, $compile) {
		// we might move this tpl into an html file as well...
		elm = angular.element('<img fallback-src="http://fallback.url" ng-src="{{ \'wrong_url\' }}"></img>');

		scope = $rootScope;
		$compile(elm)(scope);
		scope.$digest();

	}));


	it('should set src to fallback when image src is wrong', function(done) {
		setTimeout(function(){
			expect(elm.attr('src')).toEqual('http://fallback.url');
			done();
		}, 100);
	});


});

