
describe('Filter: localizeNumber', function () {

	beforeEach(module('ngTools'));

	var filter;
	beforeEach(inject(function ($filter) {
		filter = $filter('localizeNumber');
	}));

	it('should give us a string formatted according to national setting of the browser', function () {
		expect(filter(21598.489)).toEqual('21598.489');
	});

});
