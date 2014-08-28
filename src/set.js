angular.module('ngTools').factory('Set', function () {
	/**
	 * return new instance of a Set
	 * @param {Function|String} [hashFunction] defaults to JSON.stringify
	 * @constructor
	 */
	function Set(hashFunction) {
		if (typeof hashFunction === 'string') {
			this.hashFn = function (item) {
				if (item[hashFunction] !== undefined) {
					return item[hashFunction];
				} else {
					throw new Error('Undefined was returned by hash function on object ' + JSON.stringify(item) );
				}
			}
		} else {
			this.hashFn = hashFunction || JSON.stringify;
		}
		this.clear();
	}

    Set.prototype = {
        /**
         * @param value
         * @returns {boolean} true when item was added
         */
        add: function add(value) {
            var r = !this.has(value);
            if (r) {
                //does not contain
                this.values[this.hashFn(value)] = value;
                this.size++;
            }
            return r;
        },
		/**
		 *
		 * @param {Array} arr
		 * @returns {Number} count of items in the set after all items in the array have been added
		 */
		fromArray: function(arr) {
			var i = arr.length;
			while(i--) {
				this.add(arr[i]);
			}
			return this.size;
		},
		/**
		 * set will be left empty
		 */
		clear: function() {
			this.values = {};
			this.size = 0;
		},
        /**
         * @param value
         * @returns {boolean} true when item was replaced, false when just added
         */
        addReplace: function addReplace(value) {
            var r = this.remove(value);
            this.add(value);
            return r;
        },
		/**
		 * @param {String} hash
		 * @returns {*} stored value or undefined if the hash did not found anything
		 */
		getValue: function getValue(hash) {
			return this.values[hash];
		},
		/**
		 * @param {*} valueOrKey either hash or an object
		 * @returns {boolean} whether it removed the item
		 */
		remove: function remove(valueOrKey) {
			if (this.has(valueOrKey)) {
				// does contain
				if (angular.isObject(valueOrKey)) {
					delete this.values[this.hashFn(valueOrKey)];
				} else {
					delete this.values[valueOrKey];
				}
				this.size--;
				return true;
			} else {
				return false;
			}
		},
		/**
		 * @param {*} valueOrKey either hash or an object
		 * @returns {boolean}
		 */
		has: function has(valueOrKey) {
			if (angular.isObject(valueOrKey)) {
				return this.values[this.hashFn(valueOrKey)] !== undefined;
			} else {
				return this.values[valueOrKey] !== undefined;
			}
		},
        /**
         *
         * @returns {number}
         */
        size: function size() {
            return this.size;
        },
        /**
         * runs iteratorFunction for each value of set
         * @param {Function} iteratorFunction
         * @param {*} [thisObj] this context for iterator
         */
        each: function each(iteratorFunction, thisObj) {
			var keys = Object.keys(this.values).reverse();
			var item;
			while(item = keys.pop()) {
				var contx = thisObj || this.values[item];
				iteratorFunction.call(contx, this.values[item]);
			}
        },
        /**
         *
         * @returns {Array}
         */
        toArray: function () {
            var r = [];
            for(var i in this.values){
                r.push(this.values[i]);
            }
            return r;
        },
		/**
		 * @returns {Array} of filtered items
		 */
		filter: function() {
			var arr =  this.toArray();
			return arr.filter.apply(arr, arguments);
		}
    };
    return Set;
});
