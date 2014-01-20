//ng-tools version 0.0.5 
angular.module('ngTools', []);
angular.module('ngTools').factory('debounce',['$timeout', function ($timeout) {
	/**
	 * will cal fn once after timeout even if more than one call wdo debounced fn was made
	 * @param {Function} fn to call debounced
	 * @param {Number} timeout
	 * @param {boolean} apply will be passed to $timeout as last param, if the debounce is triggering infinite digests, set this to false
	 * @returns {Function} which you can call instead fn as if you were calling fn
	 */
	function debounce(fn, timeout, apply){
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
	}
	return debounce;
}]);
/**
 *	directive include-in-scope
 *	attribute include-in-scope: if you have a scope variable containing html, assign it to this attribute
 *	attribute src: if you have a template in separate html file, which you want to load, assign the path to it to this attribute
 *	onload attribute is evaluated when content is included, if present
 */
angular.module('ngTools').directive('ntIncludeInScope',
	['$http', '$templateCache', '$anchorScroll', '$compile', '$animate',
		function($http,   $templateCache,   $anchorScroll,   $compile, $animate) {
			return {
				restrict: 'ECA',
				terminal: true,
				compile: function(element, attr) {
					var onloadExp = attr.onload || '';
					var autoScrollExp = attr.autoscroll;

					return function(scope, element) {
						var changeCounter = 0;
						var includeCompile = function (html) {
							element.html(html);
							$compile(element.contents())(scope);

							if (angular.isDefined(autoScrollExp) && (!autoScrollExp || scope.$eval(autoScrollExp))) {
								$anchorScroll();
							}

							scope.$emit('$includeContentLoaded');
							scope.$eval(onloadExp);
						};

						var clearContent = function() {
							$animate.leave(element);
							element.html('');
						};

						if (attr.includeInScope) {
							var html = scope.$eval(attr.includeInScope);
							includeCompile(html);
						}else{
							scope.$watch(function () {
                                return scope.$eval(attr.src);
							}, function ngIncludeWatchAction(src) {
								var thisChangeId = ++changeCounter;

								if (src) {
									$http.get(src, {cache: $templateCache}).success(function(response) {
										if (thisChangeId !== changeCounter) return;
										includeCompile(response);

									}).error(function() {
										if (thisChangeId === changeCounter) clearContent();
									});
								} else clearContent();
							});
						}
					};
				}
			};
		}
	]
);
//----------------------------------------------------------------------------------------------------------------------
// A directive for rendering markdown in AngularJS, shamelesly copied from https://bitbucket.org/morgul/angular-markdown
//
// Written by John Lindquist (original author). Modified by Jonathan Rowny (ngModel support).
// Adapted by Christopher S. Case
//
// Taken from: http://blog.angularjs.org/2012/05/custom-components-part-1.html
//
// @module angular.markdown.js
//----------------------------------------------------------------------------------------------------------------------

angular.module("ngTools").directive('markdown', function()
{
    var converter = new Showdown.converter();

    return {
        restrict: 'E',
        require: '?ngModel',
        link:  function(scope, element, attrs, model)
        {
            // Check for extensions
            var extAttr = attrs['extensions'];
            var callPrettyPrint = false;
            if(extAttr)
            {
                var extensions = [];

                // Convert the comma separated string into a list.
                extAttr.split(',').forEach(function(val)
                {
                    // Strip any whitespace from the beginning or end.
                    extensions.push(val.replace(/^\s+|\s+$/g, ''));
                });

                if(extensions.indexOf('prettify') >= 0)
                {
                    callPrettyPrint = true;
                } // end if

                // Create a new converter.
                converter = new Showdown.converter({extensions: extensions});
            } // end if

            // Check for option to strip whitespace
            var stripWS = attrs['strip'];
            stripWS = String(stripWS).toLowerCase() == 'true';

            // Check for option to translate line breaks
            var lineBreaks = attrs['lineBreaks'];
            lineBreaks = String(lineBreaks).toLowerCase() == 'true'; 

            var render = function()
            {
                var htmlText = "";
                var val = "";

                // Check to see if we're using a model.
                if(attrs['ngModel'])
                {
                    if (model.$modelValue)
                    {
                        val = model.$modelValue;
                    } // end if
                }
                else
                {
                    val = element.text();
                } // end if

                if(stripWS)
                {
                    val = val.replace(/^[ /t]+/g, '').replace(/\n[ /t]+/g, '\n');
                } // end stripWS

                if (lineBreaks) {
                    val = val.replace(/&#10;/g, '\n');
                } // end lineBreaks

                // Compile the markdown, and set it.
                htmlText = converter.makeHtml(val);
                element.html(htmlText);

                if(callPrettyPrint)
                {
                    prettyPrint();
                } // end if
            };

            if(attrs['ngModel'])
            {
                scope.$watch(attrs['ngModel'], render);
            } // end if

            render();
        } // end link
    }
}); // end markdown directive

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
         * @param {*} obj
         * @returns {*} stored value or null if the hash did not found anything
         */
        getValue: function getValue(obj) {
            var hash = this.hashFn(obj);
            if (this.values.hasOwnProperty(hash)) {
                return this.values[hash];
            }
            return null;
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

/**
 * set which is automatically stored in local storage, offers events to hook up syncing to the server, depends on
 * storage injectable. storage injectable must have "get(key)" and "set(key, value)" method
 */
angular.module('ngTools').factory('StoredSet',
    /**
     *
     * @param Set
     * @param {Object} storage
     * @param {Function} storage.get
     * @param {Function} storage.set
     * @param $log
     * @returns {Function}
     */
    function (Set, storage, $log) {
	/**
	 * @param {Object} opts typical call option object would look like:  {hashFn: .., storageKey: 'LSkey'}
     * @param {Function} opts.hashFn function for hashing
     * @param {string} opts.storageKey key for storing the set
	 * @constructor
	 */
	function StoredSet(opts) {
        var self = this;
        if (!opts.storageKey) {
            $log.error("storageKey property must be provided for storedSet");
            return;
        }
        angular.extend(self, opts);

        /**
         * @type {Set}
         */
        this.set = new Set(self.hashFn);

        this.onInit(storage.get(self.storageKey));
    }
	/**
	 * Prototype
	 * @type {{add: Function, addReplace: Function, remove: Function, toArray: Function, onAdd: Function, onRemove: Function, onInit: Function}}
	 */
    StoredSet.prototype = {
		/**
		 * @param {*} item
		 * @param {boolean} [skipSave]
		 * @returns {boolean} true when item added, false when not added
		 */
		add: function (item, skipSave) {
			var added = this.set.add(item);
			this.onAdd(item, added);
			added && this.save(skipSave);
			return added;
		},
		/**
		 * @param {*} item
		 * @param {boolean} [skipSave] if true, then the save to storage will be skipped
		 */
        addReplace: function (item, skipSave) {
			var replaced = this.set.addReplace(item);
            this.onAdd(item, replaced);
            this.save(skipSave);
			return !replaced;
        },
	    /**
	     * Remove from storage
	     * @param item
	     * @returns {boolean}
	     */
        remove: function (item) {
			var removed = this.set.remove(item);
			if (removed) {
                this.save();
                this.onRemove(item);
            }
			return removed;
        },
	    /**
	     * each similar to forEach with arrays
	     */
	    each: function(){
		    return this.set.each.apply(this.set, arguments);
	    },
	    /**
	     * To array
	     * @returns {Array}
	     */
        toArray: function () {
            return this.set.toArray();
        },
		/**
		 * @param skip the save
		 */
		save: function (skip) {
			!skip && storage.set(this.storageKey, angular.copy(this.toArray())); // angular.copy removes $$hashKey
		},
        //events
        onAdd: function (item, replaced) {},
        onRemove: function (item) {},
        onInit: function (cached) {
            if (cached && Array.isArray(cached)) {
                cached.forEach(angular.bind(this, function (obj) {
					this.add(obj, true);
                }) );
            }

        }
    };
    return StoredSet;
});


angular.module('ngTools').factory('urlize',['$location', '$route', '$log', function ($location, $route, $log) {
    function urlize(scope, prop){
        if($route.current.$$route.reloadOnSearch !== false){
            $log.error('Current route reloads on search, reloadOnSearch should be set to false');
        }

        function updateFromLocation() {
            var inLoc = $location.search()[prop];
            if (inLoc) {
                if (angular.isObject(inLoc)) {
                    inLoc = JSON.parse(inLoc);
                }
                scope[prop] = inLoc;
            }
        }

        updateFromLocation();
        
        scope.$watch(prop, function (nV, oV) {
            if (nV) {
                if (angular.isObject(nV)) {
                    nV = JSON.stringify(nV);
                }
                $location.search(prop, nV);
            }
        });

        scope.$on('$routeUpdate', updateFromLocation);
    }
    return urlize;
}]);