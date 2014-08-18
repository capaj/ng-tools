describe('Set', function () {
	var aset;

	beforeEach(function () {
		module('ngTools');
		inject(function(Set) {
			aset = new Set('id');
		});
	});

	it('hashFn should be created on the fly for string param', function () {
		expect(aset.hashFn).not.toBe(JSON.stringify);
		expect(aset.hashFn({id:1})).toBe(1);
	});

	it("set should be able to add new value", function() {
		var a = {id:1};
		aset.add(a);
		expect(aset.values[1]).toBe(a);
		expect(aset.size).toBe(1);
	});

	it("set should have has method which works for any parameter", function() {
		aset.add({id:1});
		expect(aset.has({id:1})).toBe(true);
		expect(aset.has('1')).toBe(true);
		expect(aset.has(1)).toBe(true);
	});

	it("set should be able to remove a value provided a string", function() {
		aset.add({id:1});
		aset.add({id:2});
		aset.remove('1');
		aset.remove(2);
		expect(aset.values[1]).toBe(undefined);
		expect(aset.size).toBe(0);
	});

	it("set should be able to create set from an array and clear itself", function() {
		var a = {id: 1};
		var arr = [a, {id: 2}, {id: 3}, {id: 3}, a];
		aset.fromArray(arr);
		expect(aset.size).toBe(3);
		expect(arr.length).toBe(5);
		aset.clear();
		expect(aset.size).toBe(0);
	});

	it("set should be able to filter values", function() {
		var a = {id:1};
		aset.fromArray([a, {id: 2}, {id: 3}]);
		var filtered = aset.filter(function(item) {
			return item.id < 3;
		});
		expect(filtered.length).toBe(2);

	});

});
