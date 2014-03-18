angular.module('ngTools').factory('Set', function () {
    /**
     * return new instance of a Set
     * @param {Function} [hashFunction] defaults to JSON.stringify
     * @constructor
     */
    function Set(hashFunction) {
        this.hashFn = hashFunction || JSON.stringify;
        this.values = {};
        this.size = 0;
    }

    Set.prototype = {
        /**
         * @param value
         * @returns {boolean} true when item was added
         */
        add: function add(value) {
            var r = !this.contains(value);
            if (r) {
                //does not contain
                this.values[this.hashFn(value)] = value;
                this.size++;
            }
            return r;
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
         * @param value
         * @returns {boolean} whether it removed the item
         */
        remove: function remove(value) {
            var r = this.contains(value);
            if (r) {
                // does copntain
                delete this.values[this.hashFn(value)];
                this.size--;
            }
            return r;
        },
        /**
         * @param value
         * @returns {boolean}
         */
        contains: function contains(value) {
            return typeof this.values[this.hashFn(value)] !== "undefined";
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
            for (var value in this.values) {
                var contx = thisObj || this.values[value];
                iteratorFunction.call(contx, this.values[value]);
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
        }
    };
    return Set;
});
