/**
 * jQueryAnnex
 * Added functions / algorithms / helpers for jQuery.
 * Mainly simplifications and streamlined (jQuery-lized) versions of traditional vanilla js-functionality,
 * standard solutions for everyday JS-tasks and little syntax extensions.
 *
 * I'm always trying to fit this add-on with the most current version of jQuery, which could mean, that methods
 * with functionality, that has been integrated into the core, may be replaced or removed, depending on the implemented syntax.
 *
 * Always use the current version of this add-on with the current version of jQuery and keep an eye on the changes.
 *
 * @author Sebastian Schlapkohl
 * @version Revision 19 developed and tested with jQuery 1.11.3
 **/



//--|JQUERY-$-GENERAL-FUNCTIONS----------

$.extend({

	/**
	 * general dictionary to hold internal data and offer data space for plugins
	 *
	 * @global
	 * @private
	 * @static
	 **/
	jqueryAnnexData : {
		logging : {
			originalLoggingFunction : ((window['console'] !== undefined) && $.isFunction(console.log)) ? console.log : $.noop,
			enabled : true,
			xlog : {}
		},
		polls : {
			defaultLoop : null,
			activePollCount : 0,
			activePolls : {}
		},
		history : {
			currentState : null,
			currentTitle : null,
			currentHost : null,
			currentPath : null
		},
		touch : {
			types : {
				touchstart : 'mousedown',
				touchmove : 'mousemove',
				touchend: 'mouseup'
			},
			inputs : ['input', 'textarea', 'select', 'option']
		},
		preloadedImages : {
			unnamed : [],
			named : {}
		}
	},



	/**
	 * Logs a message to the console. Prevents errors in browsers, that don't support this feature.
	 *
	 * If the first parameter is not __enable__ or __disable__ it is treated as a value to log, in any other
	 * case the list to log begins after the first param.
	 *
	 * @param {String} [enabled] - enable/disable logging globally, including console.log, use tokens __enable__ and __disable__
	 * @param {...*} [...] - add any number of arguments you wish to log
	 **/
	log : function(enabled){
		if( this.isSet(enabled) && ($.inArray(enabled, ['__enable__', '__disable__']) >= 0) ){
			var args = $.makeArray(arguments).slice(1);

			if( enabled == '__enable__' ){
				if( !this.jqueryAnnexData.logging.enabled ){
					console.log = this.jqueryAnnexData.logging.originalLoggingFunction;
				}
			} else {
				this.jqueryAnnexData.logging.originalLoggingFunction = console.log;
				console.log = $.noop;
			}

			this.jqueryAnnexData.logging.enabled = (enabled == '__enable__');

			this.log.apply(this, args);
		} else {
			if( this.exists('console') && $.isFunction(console.log) ){
				$.each(arguments, function(index, obj){
					if( $.isA(obj, 'boolean') ){
						obj = obj ? 'true' : 'false';
					}

					console.log(obj);
				});
			}
		}
	},



	/**
	 * X marks the spot. A very simple method for urgent cases of printf-debugging.
	 * Simply logs the context of the call to the console, also providing a counter,
	 * counting the executions from that context.
	 *
	 * This does not, however log line, stack or file. For that you'd have to instantiate
	 * an Error object in the corresponding line, which defies the purpose of this method
	 * of having a minimum length call for very small and controlled test cases.
	 *
	 * This method needs arguments.caller and .callee for the function sig. I know this is
	 * legacy code and might not work in the future. Without these all calls will be counted
	 * as "anonymous".
	 *
	 * This method will not properly work in strict mode.
	 **/
	x : function(){
		var context = 'anonymous';

		if( this.exists('callee.caller', arguments)  ){
			if( this.isSet(arguments.callee.caller.name) && ($.trim(arguments.callee.caller.name) !== '') ){
				context = arguments.callee.caller.name;
			} else {
				var functionSourceLines = arguments.callee.caller.toString().split(/\r?\n/, 3);
				if( functionSourceLines.length == 1 ){
					context = functionSourceLines[0];
				} else {
					context = functionSourceLines.join(' ')+' ...';
				}
			}
		}

		if( !this.isSet(this.jqueryAnnexData.logging.xlog[context]) ){
			this.jqueryAnnexData.logging.xlog[context] = 0;
		}

		this.jqueryAnnexData.logging.xlog[context]++;
		this.log(context+' | '+this.jqueryAnnexData.logging.xlog[context]);
	},



	/**
	 * Creates jQuery-enabled DOM-elements on the fly.
	 *
	 * @param {String} tag - name of the tag/element to create
	 * @param {?Object.<String, String>} [attributes] - tag attributes as key/value-pairs
	 * @param {?String} [content] - content to embed into the element, such as text
	 * @returns {Object} jQuery-enabled DOM-element
	 **/
	elem : function(tag, attributes, content){
		var attrString = '';

		if( this.isSet(attributes) ){
			for( var attribute in attributes ){
				attrString += ' '+attribute+'="'+attributes[attribute]+'"';
			}
		}

		if( this.isSet(content) ){
			return $('<'+tag+(this.isSet(attrString) ? attrString : '')+'>'+content+'<\/'+tag+'>');
		} else {
			return $('<'+tag+(this.isSet(attrString) ? attrString : '')+'\/>');
		}
	},



	/**
	 * Classical assert method. If not condition, throw assert exception.
	 *
	 * @param {Boolean} condition - defines if an assertion is successful
	 * @param {String} [message] - to display if assertion fails
	 * @throws assert exception
	 * @returns {Boolean} result of the assertion
	 **/
	assert : function(condition, message){
		if( !condition ){
			message = this.isSet(message) ? ''+message : 'assert exception: assertion failed';
			throw message;
		}
	},



	/**
	 * Check if variable(s) is set at, by being neither undefined nor null.
	 *
	 * @param {...*} [...] - add any number of variables you wish to check
	 * @returns {Boolean} variable(s) is/are set
	 **/
	isSet : function(){
		var res = true;

		$.each(arguments, function(index, obj){
			res = res && ((obj !== undefined) && (obj !== null));
			if( !res ){
				return false;
			}
		});

		return res;
	},



	/**
	 * "Validates" an object in a very basic way by checking if all given members are present and are not null.
	 *
	 * @param {Object} obj - the object to check
	 * @param {String[]} memberNames - the names of the members to check
	 * @returns {Boolean} all memberNames present and not null
	 **/
	hasMembers : function(obj, memberNames){
		for( var i = 0; i < memberNames.length; i++ ){
			if( !this.isSet(obj[memberNames[i]]) ){
				this.log('hasMembers | missing member '+memberNames[i]);
				return false;
			}
		}

		return true;
	},



	/**
	 * If an expression returns an "empty" value,
	 * use the default value instead.
	 *
	 * @param {*} expression - the expression to evaluate
	 * @param {*} defaultValue - the default value to use if the expression is considered empty
	 * @param {Array} [additionalEmptyValues] - if set, provides a list of additional values to be considered empty, apart from undefined and null
	 * @returns {*} expression of defaultValue
	 **/
	orDefault : function(expression, defaultValue, additionalEmptyValues){
		additionalEmptyValues = $.isArray(additionalEmptyValues) ? additionalEmptyValues : [additionalEmptyValues];

		if( !this.isSet(expression) || ($.inArray(expression, additionalEmptyValues) >= 0) ){
			return defaultValue;
		} else {
			return expression;
		}
	},



	/**
	 * Check if a variable is defined in a certain context (normally globally in window).
	 * Or check if a jquery set contains anything based on its selector,
	 * answering if the query-string exists in its context.
	 *
	 * @param {(String|Object)} target - name of the variable to look for (not the variable itself) or a jquery Object
	 * @param {*} [context=window] - the context in which to look for the variable, holds no meaning for jquery objects
	 * @returns {Boolean} variable exists in context or jQuery-set has length > 0
	 **/
	exists : function(target, context){
		var res = true;

		if( this.isA(target, 'object') && this.isSet(target.jquery) ){
			return target.length > 0;
		} else {
			target = ''+target;

			if( !this.isSet(context) ){
				context = window;
			}

			$.each(target.split("."), function(index, value){
				res = res && (undefined !== context[''+value]);
				if( res ){
					context = context[''+value];
				} else {
					return false;
				}
			});
		}

		return res;
	},



	/**
	 * Short form of the standard "type"-method with a more compact syntax.
	 * Can identify "boolean", "number", "string", "function", "array", "date", "regexp" and "object".
	 *
	 * @param {*} target - variable to check the type of
	 * @param {String} typeName - the name of the type to check for, has to be a standard JS-type
	 * @returns {Boolean} target has type
	 **/
	isA : function(target, typeName){
		if( $.inArray(typeName, ['boolean', 'number', 'string', 'function', 'array', 'date', 'regexp', 'object']) >= 0 ){
			return $.type(target) == ''+typeName;
		} else {
			this.log('isA | not asked for valid JS-type');
			return false;
		}
	},



	/**
	 * Returns if a value is truly a real integer value and not just an int-parsable value for example.
	 * Since JS only knows the data type "number" all numbers are usable as floats by default, but not the
	 * other way round.
	 *
	 * @param {*} intVal - the value the check
	 * @returns {Boolean} true if intVal is a true integer value
	 **/
	isInt : function(intVal){
		return parseInt(intVal, 10) === intVal;
	},



	/**
	 * Returns if a value is a numeric value, usable as a float number in any calculation.
	 * Any number that fulfills isInt, is also considered a valid float, which lies in JS's
	 * nature of not differentiating ints and floats by putting them both into a "number"-type.
	 * So ints are always floats, but not necessarily the other way round.
	 *
	 * @param {*} floatVal - the value to check
	 * @returns {Boolean} true if floatVal is usable in a float context
	 **/
	isFloat : function(floatVal){
		return parseFloat(floatVal) === floatVal;
	},



	/**
	 * Returns if an expression is NaN or not.
	 * This method employs two different approaches:
	 * By default it really checks if the expression is the _value_ NaN or not, this being a valid JS-value for something.
	 * In JS this gets checked by comparing an expression with itself on identity, since NaN is the only value not being
	 * identical to itself. If you set checkForIdentity to false, this method will use the standard JS-isNaN, which
	 * inspects the expression, tries to cast or parse a number from it and returns the result.
	 *
	 * @param {*} expression - the expression to check
	 * @param {Boolean} [checkForIdentity=true] - set to false if you want to use default JS-functionality
	 * @returns {Boolean} true if expression is NaN
	 **/
	isNaN : function(expression, checkForIdentity){
		checkForIdentity = this.isSet(checkForIdentity) ? !!checkForIdentity : true;

		if( checkForIdentity ){
			return expression !== expression;
		} else {
			return isNaN(expression);
		}
	},



	/**
	 * Offers similar functionality to phps str_replace and avoids RegExps for this task.
	 * Replace occurrences of search in subject with replace. search and replace may be arrays.
	 * If search is an array and replace is a string, all phrases in the array will be replaced with one string.
	 * If replace is an array itself, phrases and replacements are matched by index.
	 * Missing replacements are treated as an empty string.
	 *
	 * @param {(String|String[])} search - the string(s) to replace
	 * @param {String|String[]} replace - the string(s) to replace the search string(s)
	 * @param {String} subject - the string to replace in
	 * @returns {String} the modified string
	 **/
	strReplace : function(search, replace, subject){
		search = [].concat(search);
		replace = [].concat(replace);
		subject = ''+subject;
		var tmp = '';

		$.each(search, function(index, searchTerm){
			tmp = (replace.length > 1) ? ((replace[index] !== undefined) ? replace[index] : '') : replace[0];
			subject = subject.split(searchTerm).join(tmp);
		});

		return subject;
	},



	/**
	 * Truncates a given string after a certain number of characters to enforce length restrictions.
	 *
	 * @param {String} subject - the string to check and truncate
	 * @param {?Number.Integer} [maxLength=30] - the maximum allowed character length for the string
	 * @param {?String} [suffix=...] - the trailing string to end a truncated string with
	 * @returns {String} the (truncated) subject
	 **/
	strTruncate : function(subject, maxLength, suffix){
		subject = ''+subject;

		if( !this.isSet(maxLength) ){
			maxLength = 30;
		}

		if( !this.isSet(suffix) ){
			suffix = '...';
		}

		if( subject.length > maxLength ){
			subject = ''+subject.substr(0, maxLength - suffix.length)+suffix;
		}

		return subject;
	},



	/**
	 * Simply concatenates strings with a glue part using array.join in a handy notation.
	 *
	 * @param {String} [glue=''] - the separator to use between single strings
	 * @returns {String} the concatenated string
	 **/
	strConcat : function(glue){
		glue = this.isSet(glue) ? ''+glue : '';

		var args = $.makeArray(arguments).slice(1);

		return args.join(glue);
	},



	/**
	 * This is a pythonesque string format implementation.
	 * Apply formatted values to a string template, in which replacements are marked with curly braces.
	 *
	 * Display literal curly brace with {{ and }}.
	 *
	 * Unknown keys/indexes will be ignored.
	 *
	 * This solution is adapted from:
	 * https://github.com/davidchambers/string-format
	 *
	 * Examples:
	 * $.strFormat('An elephant is {times:float(0.00)} times smarter than a {animal}', {times : 5.5555, animal : 'lion'})
	 * => 'An elephant is 5.56 times smarter than a lion'
	 * $.strFormat('{0}{0}{0} ... {{BATMAN!}}', 'Nana')
	 * => 'NanaNanaNana ... {BATMAN!}'
	 * $.strFormat('{} {} {} starts the alphabet.', 'A', 'B', 'C')
	 * => 'A B C starts the alphabet.'
	 * $.strFormat('{0:int}, {1:int}, {2:int}: details are for pussies', '1a', 2.222, 3)
	 * => '1, 2, 3: details are for pussies'
	 *
	 * @param {[type]} template [description]
	 * @returns {String} the formatted string
	 * @throws general exception on syntax errors
	 **/
	strFormat : function(template){
		var args = (arguments.length > 1) ? $.makeArray(arguments).slice(1) : [],
			idx = 0,
			explicit = false,
			implicit = false
		;

		var fResolve = function(object, key) {
			var value = object[key];

			if( $.isFunction(value) ){
				return value.call(object);
			} else {
				return value;
			}
		};

		var fLookup = function(object, key) {
			if( !/^(\d+)([.]|$)/.test(key) ){
				key = '0.'+key;
			}

			var match;
			while( match = /(.+?)[.](.+)/.exec(key) ){
				object = fResolve(object, match[1]);
				key = match[2];
			}

			return fResolve(object, key);
		};

		var formatters = {
			int : function(value, radix){
				radix = $.isSet(radix) ? parseInt(radix, 10) : 10;
				var res = parseInt(value, radix);
				return !$.isNaN(res) ? ''+res : '';
			},
			float : function(value, format){
				format = $.isSet(format) ? ''+format : null;

				var res = null;

				if( $.isSet(format) ){
					var precision = 0;

					try {
						precision = format.split('.')[1].length;
					} catch(ex) {
						throw 'strFormat | float precision arg malformed';
					}

					var power = Math.pow(10, precision);

					res = Math.round(parseFloat(value) * power) / power;
				} else {
					res = parseFloat(value);
				}

				return !$.isNaN(res) ? ''+res : '';
			}
		};

		return template.replace(/([{}])\1|[{](.*?)(?:!(.+?))?[}]/g, function(match, literal, key) {
			var ref = null,
				value = '',
				formatter = null,
				formatterArg = null
			;

			if( literal ){
				return literal;
			}

			if( key.length ){
				var keyParts = key.split(':');

				if( keyParts.length > 1 ){
					key = keyParts[0];

					var formatterParts = keyParts[1].split('('),
						formatterName = formatterParts[0]
					;

					if( formatterParts.length > 1 ){
						formatterArg = $.strReplace(')', '', formatterParts[1]);
					}

					try {
						formatter = formatters[formatterName];
					} catch(ex) {
						throw 'strFormat | unknown formatter';
					}
				}

				if( implicit ){
					throw 'strFormat | cannot switch from implicit to explicit numbering';
				} else {
					explicit = true;
				}

				ref = fLookup(args, key);
				value = $.isSet(ref) ? ref : '';
			} else {
				if( explicit ){
					throw 'strFormat | cannot switch from explicit to implicit numbering';
				} else {
					implicit = true;
				}

				ref = args[idx];
				value = $.isSet(ref) ? ref : '';
				idx++;
			}

			return $.isSet(formatter) ? formatter(value, formatterArg) : value;
		});
	},



	/**
	 * Removes Elements from an Array.
	 * Does not modify the original.
	 *
	 * @param {Array} target - the array to remove elements from
	 * @param {Number.Integer} from - index to start removing from (can also be negative to start counting from back)
	 * @param {Number.Integer} [to=target.length] - index to end removing (can also be negative to end counting from back)
	 * @returns {Array} the modified array
	 **/
	removeFromArray : function(target, from, to){
		target = target.slice(0);
		var rest = target.slice((to || from) + 1 || target.length);
		target.length = (from < 0) ? (target.length + from) : from;
		return $.merge(target, rest);
	},



	/**
	 * Counts enumerable properties of (plain) objects.
	 *
	 * @param {Object} object - the object to count properties in
	 * @returns {Number.Integer} number of enumerable properties
	 **/
	objectLength : function(object){
		var count = 0;

		$.each(object, function(key, value){
			count++;
		});

		return count;
	},



	/**
	 * Special form of Math.random, returning an int value between two ints,
	 * where floor and ceiling are included in the range.
	 *
	 * @param {?Number.Integer} [floor=0] - the lower end of random range
	 * @param {?Number.Integer} [ceiling=10] - the upper end of random range
	 * @returns {Number.Integer} random int between floor and ceiling
	 **/
	randomInt : function(floor, ceiling){
		if( !this.isSet(floor) ){
			floor = 0;
		} else {
			parseInt(floor, 10);
		}

		if( !this.isSet(ceiling) ){
			ceiling = 10;
		} else {
			parseInt(ceiling, 10);
		}

		if( ceiling < floor){
			this.log('randomInt | ceiling may not be smaller than floor');
			return null;
		}

		return Math.round(Math.random() * (ceiling - floor) + floor);
	},



	/**
	 * Returns a "UUID", as close as possible with JavaScript (so not really, but looks like one :).
	 *
	 * @param {Boolean} [withoutDashes=false] - defines if UUID shall include dashes or not
	 * @returns {String} a "UUID"
	 **/
	randomUUID : function(withoutDashes){
		if( !this.isSet(withoutDashes) ){
			withoutDashes = false;
		}

		var uuidLength = 36;
		if( withoutDashes ){
			uuidLength = 32;
		}

		var s = [];
		var itoh = '0123456789ABCDEF';
		var i = 0;

		for (i = 0; i < uuidLength; i++) s[i] = Math.floor(Math.random()*0x10);

		// Conform to RFC-4122, section 4.4
		s[withoutDashes ? 12 : 14] = 4;
		s[withoutDashes ? 16 : 19] = (s[19] & 0x3) | 0x8;

		for (i = 0; i < uuidLength; i++) s[i] = itoh[s[i]];

		if( !withoutDashes ){
			s[8] = s[13] = s[18] = s[23] = '-';
		}

		return s.join('');
	},



	/**
	 * Checks if a value is within bounds of a minimum and maximum and returns
	 * the value or the upper or lower bound respectively.
	 *
	 * @param {Comparable} min - the lower bound
	 * @param {Comparable} value - the value to check
	 * @param {Comparable} max - the upper bound
	 * @returns {Comparable} value, min or max
	 **/
	minMax : function(min, value, max){
		return (value < min)
			? min
			:(
				(value > max)
				? max
				: value
			)
		;
	},



	/**
	 * Setup a timer for one-time execution of a callback, kills old timer if wished
	 * to prevent overlapping timers.
	 *
	 * @param {Number.Integer} ms - time in milliseconds until execution
	 * @param {Function} callback - callback function to execute after ms
	 * @param {(Object|Number.Integer)} [oldTimer] - if set, kills the timer before setting up new one
	 * @returns {(Object|null)} new timer or null in case of a param-error
	 **/
	schedule : function(ms, callback, oldTimer){
		if( this.isSet(oldTimer) ){
			this.countermand(oldTimer);
		}

		if( $.isFunction(callback) ){
			return {id : window.setTimeout(callback, ms), type : 'timeout'};
		}

		return null;
	},



	/**
	 * Setup a timer for one-time execution of a callback, kills old timer if wished
	 * to prevent overlapping timers.
	 * This implementation uses Date.getTime() to improve on timer precision for long
	 * running timers. The timers of this method can also be used in countermand().
	 *
	 * @param {Number.Integer} ms - time in milliseconds until execution
	 * @param {Function} callback - callback function to execute after ms
	 * @param {(Object|Number.Integer)} [oldTimer] - if set, kills the timer before setting up new one
	 * @returns {(Object|null)} new timer or null in case of a param-error (does not create new timer object if oldTimer given)
	 **/
	pschedule : function(ms, callback, oldTimer){
		if(
			this.isSet(oldTimer)
			&& $.isPlainObject(oldTimer)
			&& this.hasMembers(oldTimer, ['id', 'type'])
		){
			this.countermand(oldTimer);
			oldTimer.precise = true;
		} else {
			oldTimer = {id : -1, type : 'timeout', precise : true};
		}

		if( $.isFunction(callback) ){
			var waitStart = new Date().getTime();
			var waitMilliSecs = ms;
			var fAdjustWait = function(){
				if( waitMilliSecs > 0 ){
					var timeDiff = new Date().getTime() - waitStart;
					waitMilliSecs -= timeDiff;
					oldTimer.id = window.setTimeout(fAdjustWait, (waitMilliSecs > 10) ? waitMilliSecs : 10);
				} else {
					callback();
				}
			};

			oldTimer.id = window.setTimeout(fAdjustWait, waitMilliSecs);

			return oldTimer;
		}

		return null;
	},



	/**
	 * Alias for schedule() with more natural param-order for rescheduling.
	 *
	 * @param {(Object|Number.Integer)} timer - the timer to refresh/reset
	 * @param {Number.Integer} ms - time in milliseconds until execution
	 * @param {Function} callback - callback function to execute after ms
	 * @returns {(Object|null)} new timer or null in case of a param-error
	 **/
	reschedule : function(timer, ms, callback){
		if(
			$.isPlainObject(timer)
			&& this.hasMembers(timer, ['id', 'type'])
		){
			if( this.isSet(timer.precise) && timer.precise ){
				return this.pschedule(ms, callback, timer);
			} else {
				return this.schedule(ms, callback, timer);
			}
		}
	},



	/**
	 * Setup a loop for repeated execution of a callback, kills old loop if wished
	 * to prevent overlapping loops.
	 *
	 * @param {Number.Integer} ms - time in milliseconds until execution
	 * @param {Function} callback - callback function to execute after ms
	 * @param {(Object|Number.Integer)} [oldLoop] - if set, kills the loop before setting up new one
	 * @returns {(Object|null)} new loop or null in case of a param-error
	 **/
	loop : function(ms, callback, oldLoop){
		if( this.isSet(oldLoop) ){
			this.countermand(oldLoop, true);
		}

		if( $.isFunction(callback) ){
			return {id : window.setInterval(callback, ms), type : 'interval'};
		}

		return null;
	},



	/**
	 * Setup a loop for repeated execution of a callback, kills old loop if wished
	 * to prevent overlapping loops.
	 * This implementation uses Date.getTime() to improve on timer precision for long running loops.
	 * The loops of this method can also be used in countermand().
	 * This method does not actually use intervals internally but timeouts,
	 * so don't wonder if you can't find the ids in JS.
	 *
	 * @param {Number.Integer} ms - time in milliseconds until execution
	 * @param {Function} callback - callback function to execute after ms
	 * @param {(Object|Number.Integer)} [oldLoop] - if set, kills the loop before setting up new one
	 * @returns {(Object|null)} new loop or null in case of a param-error
	 **/
	ploop : function(ms, callback, oldLoop){
		if(
			this.isSet(oldLoop)
			&& $.isPlainObject(oldLoop)
			&& this.hasMembers(oldLoop, ['id', 'type'])
		){
			this.countermand(oldLoop, true);
			oldLoop.precise = true;
		} else {
			oldLoop = {id : -1, type : 'interval', precise : true};
		}

		if( $.isFunction(callback) ){
			var waitStart = new Date().getTime();
			var waitMilliSecs = ms;
			var fAdjustWait = function(){
				if( waitMilliSecs > 0 ){
					var timeDiff = new Date().getTime() - waitStart;
					waitMilliSecs -= timeDiff;
					oldLoop.id = window.setTimeout(fAdjustWait, (waitMilliSecs > 10) ? waitMilliSecs : 10);
				} else {
					callback();
					waitStart = new Date().getTime();
					waitMilliSecs = ms;
					oldLoop.id = window.setTimeout(fAdjustWait, waitMilliSecs);
				}
			};

			oldLoop.id = window.setTimeout(fAdjustWait, waitMilliSecs);

			return oldLoop;
		}

		return null;
	},



	/**
	 * Cancel a timer or loop immediately.
	 *
	 * @param {(Object|Number.Integer)} timer - the timer or loop to end
	 * @param {Boolean} [isInterval] - defines if a timer or a loop is to be stopped, set in case timer is a GUID
	 **/
	countermand : function(timer, isInterval){
		if( this.isSet(timer) ){
			if( $.isPlainObject(timer) && this.hasMembers(timer, ['id', 'type']) ){
				if( timer.type == 'interval' ){
					window.clearInterval(timer.id);
				} else {
					window.clearTimeout(timer.id);
				}
			} else if( $.isA(timer, 'number') ){
				if( !this.isSet(isInterval) || !isInterval ){
					window.clearTimeout(timer);
				} else {
					window.clearInterval(timer);
				}
			}
		}
	},



	/**
	 * Waits for a certain program- or DOM-state before executing a certain action. Waiting is implemented via
	 * a global timer (and optionally locals as well). If you need to react to a certain case, that's not
	 * defined by standard events and reaction does not have to be razor sharp, this is your method.
	 * Pick a name for the state/event you want to poll, define a condition closure and an action closure that
	 * holds what is to be done in case the condition works out.
	 * Polls end or are repeated after an execution of the action depending on the result of the action closure.
	 * There can always be only one poll of a certain name, redefining it overwrites the first one.
	 *
	 * @param {String} name - name of the state or event you are waiting/polling for
	 * @param {Function} fCondition - closure to define the state to wait for, returns true if state exists and false if not
	 * @param {Function} fAction - closure to define action to take place if condition is fullfilled, poll removes itself if this evaluates to true, receives Boolean parameter defining if result has changed
	 * @param {Function} fElseAction - closure to define action to take place if contition is not fulfilled, receives Boolean parameter defining if result has changed
	 * @param {?Number.Integer} [newLoopMs=250] - new loop wait time in ms, resets global timer if useOwnTimer is not set, otherwise sets local timer for poll
	 * @param {?Boolean} [useOwnTimer=false] - has to be set and true to tell the poll to use an independent local timer instead of the global one.
	 * @returns {(Object|null)} new poll or null in case of param error
	 **/
	poll : function(name, fCondition, fAction, fElseAction, newLoopMs, useOwnTimer){
		name = $.trim(''+name);

		if( (name !== '') && $.isFunction(fCondition) && $.isFunction(fAction) ){
			fElseAction = $.isFunction(fElseAction) ? fElseAction : $.noop;

			var newPoll = {
				name : name,
				condition: fCondition,
				action : fAction,
				elseAction : fElseAction,
				loop : null,
				lastPollResult : false,
				forceFire : function(){
					if( fCondition() ){
						fAction(true);
						newPoll.lastPollResult = true;
					} else {
						fElseAction(true);
						newPoll.lastPollResult = false;
					}
				}
			};

			if( this.isSet(useOwnTimer) && useOwnTimer ){
				newPoll.loop = this.loop(!this.isSet(newLoopMs) ? 250 : parseInt(newLoopMs, 10), function(){
					if( newPoll.condition() ){
						if( newPoll.action(newPoll.lastPollResult === false) ){
							$.countermand(newPoll.loop);
							newPoll.loop = null;
							delete $.jqueryAnnexData.polls.activePolls[newPoll.name];
							$.jqueryAnnexData.polls.activePollCount--;
						}
						newPoll.lastPollResult = true;
					} else {
						newPoll.elseAction(newPoll.lastPollResult === true);
						newPoll.lastPollResult = false;
					}
				});
			}
			if( this.isSet(this.jqueryAnnexData.polls.activePolls[name]) ){
				this.unpoll(name);
			}

			this.jqueryAnnexData.polls.activePolls[name] = newPoll;
			this.jqueryAnnexData.polls.activePollCount++;

			if(
				(
					!this.isSet(this.jqueryAnnexData.polls.defaultLoop)
					|| (this.isSet(newLoopMs) && !this.isSet(useOwnTimer))
				) && (this.jqueryAnnexData.polls.activePollCount > 0)
			){
				if( this.isSet(this.jqueryAnnexData.polls.defaultLoop) ){
					this.countermand(this.jqueryAnnexData.polls.defaultLoop);
				}

				this.jqueryAnnexData.polls.defaultLoop = this.loop(!this.isSet(newLoopMs) ? 250 : parseInt(newLoopMs, 10), function(){
					if( $.jqueryAnnexData.polls.activePollCount > 0 ){
						$.each($.jqueryAnnexData.polls.activePolls, function(name, poll){
							if( !$.isSet(poll.loop) ){
								if( poll.condition() ){
									if( poll.action(poll.lastPollResult === false) ){
										delete $.jqueryAnnexData.polls.activePolls[name];
										$.jqueryAnnexData.polls.activePollCount--;
									}
									poll.lastPollResult = true;
								} else {
									poll.elseAction(poll.lastPollResult === true);
									poll.lastPollResult = false;
								}
							}
						});
					} else {
						$.countermand($.jqueryAnnexData.polls.defaultLoop);
						$.jqueryAnnexData.polls.defaultLoop = null;
					}
				});
			}

			return newPoll;
		} else {
			return null;
		}
	},



	/**
	 * Removes an active poll from the poll stack via given name.
	 *
	 * @param {String} name - name of the state or event you are waiting/polling for that shall be removed
	 * @returns {Boolean} true if poll has been removed, false if nothing has changed
	 **/
	unpoll : function(name){
		name = $.trim(''+name);

		if( name !== '' ){
			if( this.isSet(this.jqueryAnnexData.polls.activePolls[name].loop) ){
				this.countermand(this.jqueryAnnexData.polls.activePolls[name].loop);
			}

			if( this.isSet(this.jqueryAnnexData.polls.activePolls[name]) ){
				delete this.jqueryAnnexData.polls.activePolls[name];
				this.jqueryAnnexData.polls.activePollCount--;

				if( this.jqueryAnnexData.polls.activePollCount <= 0 ){
					this.countermand(this.jqueryAnnexData.polls.defaultLoop);
					this.jqueryAnnexData.polls.defaultLoop = null;
				}

				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	},



	/**
	 * Throttle the execution of a function to only execute every n ms.
	 *
	 * @param {Integer} ms - the waiting time between executions in milliseconds
	 * @param {Function} func - the function to throttle
	 * @param {Boolean} [leadingExecution=true] - defines if the function is executed initially without waiting first
	 **/
	throttleExecution : function(ms, func, leadingExecution){
		leadingExecution = this.isSet(leadingExecution) ? !!leadingExecution : true;

		var nextExecutionWaiting = false,
			throttleTimer = null
		;

		return function(){
			if( !nextExecutionWaiting && !$.isSet(throttleTimer) ){
				throttleTimer = $.loop(ms, function(){
					if( nextExecutionWaiting ){
						func();
					} else {
						$.countermand(throttleTimer);
						throttleTimer = null;
					}

					nextExecutionWaiting = false;
				});

				if( leadingExecution ){
					func();
				}
			} else {
				nextExecutionWaiting = true;
			}
		};
	},



	/**
	 * Hold the execution of a function until it has not been called for n ms.
	 *
	 * @param {Integer} ms - timeframe in milliseconds without call before execution
	 * @param {Function} func - the function to hold the execution of
	 **/
	holdExecution : function(ms, func){
		var holdTimer = this.schedule(1, $.noop);

		return function(){
			holdTimer = $.reschedule(holdTimer, ms, function(){ func(); });
		};
	},



	/**
	 * Defer the execution of a function until the callstack is empty.
	 * This works identical to setTimeout(function(){}, 1);
	 *
	 * @param {Function} func - the function to defer
	 * @param {Integer} [delay=1] - the delay to apply to the timeout
	 **/
	deferExecution : function(func, delay){
		delay = this.isSet(delay) ? parseInt(delay, 10) : 1;
		$.schedule(delay, func);
	},



	/**
	 * Changes the current window-location.
	 * Also offers to only change the hash/anchor or send additional post params via hidden form transport.
	 *
	 * @param {?String} [url=window.location.href] - the location to load, if null current location is reloaded
	 * @param {?Object.<String, String>} [params={}] - GET-parameters to add to the url as key-value-pairs
	 * @param {?String} [anchor] - site anchor to set for called url, must be set via parameter, won't work reliably in URL only
	 * @param {?Object} [postParams] - a dictionary of postParameters to send with the redirect, solved with a hidden form
	 * @param {?String} [target] - name of the window to perform the redirect to/in
	 **/
	redirect : function(url, params, anchor, postParams, target){
		var reload = !this.isSet(url);
		if( !this.isSet(url) ){
			url = window.location.href;
		}

		if( this.isSet($(document).urlAnchor()) ){
			url = url.replace(/\#.+$/, '');
		}

		var urlParts = url.split('?', 2);
		url = urlParts[0];
		var presentParamString = this.isSet(urlParts[1]) ? urlParts[1] : '';

		var presentParams = {};
		if( presentParamString.length > 0 ){
			var presentParamArray = presentParamString.split('&');
			for( var i = 0; i < presentParamArray.length; i++ ){
				var paramPair = presentParamArray[i].split('=', 2);
				if( paramPair.length == 2 ){
					presentParams[''+paramPair[0]] = paramPair[1];
				} else {
					presentParams[''+paramPair[0]] = null;
				}
			}
		}

		if( this.isSet(params) && $.isPlainObject(params) ){
			$.extend(presentParams, params);
		}
		params = presentParams;

		var paramString = '';
		for( var prop in params ){
			if( this.isSet(params[prop]) ){
				paramString += prop+'='+encodeURIComponent(decodeURIComponent(params[prop]))+'&';
			} else {
				paramString += prop+'&';
			}
		}

		if( paramString.length > 0 ){
			paramString = paramString.substring(0, paramString.length-1);

			if( url.indexOf('?') == -1 ){
				paramString = '?'+paramString;
			} else {
				paramString = '&'+paramString;
			}
		}

		if( !this.isSet(anchor) ){
			anchor = reload ? $(document).urlAnchor(true) : null;
		}

		var finalUrl = url+((paramString.length > 0) ? paramString : '')+(this.isSet(anchor) ? '#'+anchor : '');
		if( !this.isSet(postParams) && !this.isSet(target) ){
			window.location.href = finalUrl;
		} else if( !this.isSet(postParams) && this.isSet(target) ){
			window.open(finalUrl, ''+target);
		} else {
			if( !this.isSet(postParams) ){
				postParams = {};
			}

			var formAttributes = {method : 'post', action : finalUrl, 'data-ajax' : 'false'};
			if( this.isSet(target) ){
				$.extend(formAttributes, {target : ''+target});
			}

			var redirectForm = this.elem('form', formAttributes);
			$.each(postParams, function(index, value){
				if( $.isArray(value) ){
					$.each(value, function(_index_, _value_){
						redirectForm.append($.elem('input', {type : 'hidden', name : index+'[]', value : ''+_value_}));
					});
				} else {
					redirectForm.append($.elem('input', {type : 'hidden', name : ''+index, value : ''+value}));
				}
			});
			$('body').append(redirectForm);

			redirectForm.submit();
			redirectForm.remove();
		}
	},



	/**
	 * Detects if the browser supports history manipulation, by checking the most common
	 * methods for presence in the history-object.
	 *
	 * @returns {Boolean} true if browser seems to support history manipulation
	 **/
	browserSupportsHistoryManipulation : function(){
		return window.history && window.history.pushState && window.history.replaceState;
	},



	/**
	 * Detects if the browser supports local storage, by testing if something can be stored in it and removed
	 * afterwards. This test was more or less stolen from modernizr.
	 *
	 * @param {String} [testKey=!!!foo!!!] - a key to use as a testkey when setting and removing data, use in case of collision
	 *
	 * @returns {Boolean} true if browser seems to support local storage
	 **/
	browserSupportsLocalStorage : function(testKey){
		testKey = this.isSet(testKey) ? ''+testKey : '!!!foo!!!';

	    try {
	        window.localStorage.setItem(testKey, 'bar');
	        window.localStorage.removeItem(testKey);
	        return true;
	    } catch(e) {
	        return false;
	    }
	},



	/**
	 * Changes the current URL silently by manipulating the browser history.
	 * Be aware that this replaces the current URL in the history _without_ any further loads.
	 * This method only works if window.history is supported by the browser, otherwise
	 * nothing will happen.
	 *
	 * @param {String} url - an absolute or relative url to change the current address to
	 * @param {?Object} [state] - a serializable object to supply to the popState-event
	 * @param {?String} [title] - a name/title for the new state, not used in browsers atm
	 * @param {Boolean} [usePushState] - push new state instead of replacing current
	 **/
	changeUrlSilently : function(url, state, title, usePushState){
		if( !this.isSet(state) ){
			state = '';
		}

		if( !this.isSet(title) ){
			title = '';
		}

		if ( window.history ) {
			if( usePushState && window.history.pushState ){
				window.history.pushState(state, ''+title, ''+url);
			} else if( !usePushState && window.history.replaceState ){
				window.history.replaceState(state, ''+title, ''+url);
			}

			var urlParts = this.strReplace(['http://', 'https://', '//'], '', url);
			urlParts = urlParts.split('/');

			var host = urlParts.shift();
			if( $.trim(host) === '' ){
				host = window.location.host;
			}

			var path = urlParts.join('/');

			this.jqueryAnnexData.history.currentState = state;
			this.jqueryAnnexData.history.currentTitle = ''+title;
			this.jqueryAnnexData.history.currentHost = ''+host;
			this.jqueryAnnexData.history.currentPath = '/'+path;
		}
	},



	/**
	 * Registers an onpopstate event if history api is available.
	 * Does nothing if api is not present.
	 * Takes a callback, which is provided with two states as plain
	 * objects like {state : ..., title : ..., url : ...}. The first is the
	 * current state before the page change, the secode the state after popping.
	 *
	 * @param {Function} callback - method to execute on popstate
	 * @param {?String} [name] - namespace for popstate event, to be able to remove only specific handlers
	 * @param {Boolean} [clearOld] - defines if old handlers should be removed before setting new one
	 **/
	onHistoryChange : function(callback, name, clearOld){
		if ( this.browserSupportsHistoryManipulation() ) {
			name = this.isSet(name) ? '.'+name : '';
			if( clearOld ){
				$(window).off('popstate'+name);
			}
			$(window).on('popstate'+name, function(e){
				callback(
					{
						state : $.jqueryAnnexData.history.currentState,
						title : $.jqueryAnnexData.history.currentTitle,
						host : $.jqueryAnnexData.history.currentHost,
						path : $.jqueryAnnexData.history.currentPath
					},
					{
						state : e.state,
						title : e.title,
						host : window.location.host,
						path : window.location.pathname
					}
				);

				$.jqueryAnnexData.history.currentState = e.state;
				$.jqueryAnnexData.history.currentTitle = ''+e.title;
				$.jqueryAnnexData.history.currentHost = window.location.host;
				$.jqueryAnnexData.history.currentPath = window.location.pathname;
			});
		}
	},



	/**
	 * Reloads the current window-location. Differentiates between cached and cache-refreshing reload.
	 *
	 * @param {Boolean} [quickLoad=false] - if true, load as fast as possible using everything in cache
	 **/
	reload : function(quickLoad){
		window.location.reload(this.isSet(quickLoad) && quickLoad);
	},



	/**
	 * Opens a subwindow for the current window or another defined parent window.
	 *
	 * @param {String} url - the URL to load into the new window
	 * @param {?Object.<String, String>} [options] - parameters for the new window according to the definitions of window.open + "name" for the window name
	 * @param {?Window} [parentWindow=window] - parent window for the new window
	 * @param {?Boolean} [tryAsPopup=false] - defines if it should be tried to force a new window instead of a tab
	 * @returns {Window} the newly opened window/tab
	 **/
	openWindow : function(url, options, parentWindow, tryAsPopup){
		parentWindow = this.isSet(parentWindow) ? parentWindow : window;
		tryAsPopup = this.isSet(tryAsPopup) ? !!tryAsPopup : false;

		var windowName = '';
		var optionArray = [];

		if( this.isSet(options) ){
			if( this.isSet(options.name) ){
				windowName = ''+options.name;
			}

			for( var prop in options ){
				if( (prop != 'name') || tryAsPopup ){
					optionArray.push(prop+'='+options[prop]);
				}
			}
		}

		return parentWindow.open(''+url, windowName, optionArray.join(', '));
	},



	/**
	 * AJAX-Loads an external CSS-file and includes the contents into the DOM, very similar to getScript.
	 * The method offers the possiblity to include the CSS as a link or a style tag. Includes are marked with a
	 * html5-conform "data-id"-attribute, so additional loads can be removed again unproblematically.
	 *
	 * @param {String} url - the URL of the CSS-file to load
	 * @param {?Object.<String, *>} [options] - config for the call (styletag : true/false, media : screen/print/all/etc., charset : utf-8/etc., id : {String})
	 * @param {Function} [callback] - function to call after css is loaded and included into DOM, gets included DOM-element as parameter
	 **/
	getCSS : function(url, options, callback){
		var that = this;
		var $res = null;

		var defaultOptions = {
			styletag : false,
			media : 'all',
			charset : 'utf-8'
		};

		if( this.isSet(options) ){
			$.extend(defaultOptions, options);
		}

		options = defaultOptions;

		$.get(url, function(data){
			if( !options.styletag ){
				$res = that.elem('link', {
					'rel' : 'stylesheet',
					'type' : 'text/css',
					'media' : options.media || 'screen',
					'href' : ''+url
				});
			} else {
				$res = that.elem('style', {'type' : 'text/css'}, data);
			}

			if( that.isSet(options.charset) ){
				$res.attr('charset', ''+options.charset);
			}

			if( that.isSet(options.id) ){
				if( $.isFunction(callback) ){
					callback = (function(callback){
						return function(){
							$res.attr('data-id', ''+options.id);
							callback($res);
						};
					})(callback);
				} else {
					callback = function(){
						$res.attr('data-id', ''+options.id);
					};
				}
			}

			if( !options.styletag ){
				if( $('head link').length > 0 ){
					$('head link:last').after($res);
				} else if( $('head style').length > 0 ){
					$('head style:first').before($res);
				} else {
					$('head').append($res);
				}

				if( $.isFunction(callback) ){
					that.schedule(100, function(){ callback($res); });
				}
			} else {
				if( $('head style').length > 0 ){
					$('head style:last').after($res);
				} else if( $('head link').length > 0 ){
					$('head link:last').after($res);
				} else {
					$('head').append($res);
				}

				if( $.isFunction(callback) ){
					callback($res);
				}
			}
		});
	},



	/**
	 * Sets cookies and retrieves them again.
	 *
	 * @param {String} name - name of the cookie
	 * @param {String} [value] - value-string of the cookie
	 * @param {Object} [options] - config-object for the cookie setting expiries etc., use together with a value
	 * @returns {(void|String)} either nothing, when setting a cookie, or the value of a requested cookie
	 **/
	cookie : function(name, value, options) {
		if( value !== undefined ){
			options = options || {};

			if (value === null) {
				value = '';
				options.expires = -1;
			}

			var expires = '';
			if( options.expires && ($.type(options.expires) == 'number' || options.expires.toUTCString) ){
				var date;

				if( $.isA(options.expires, 'number') ){
					date = new Date();
					date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
				} else {
					date = options.expires;
				}

				expires = '; expires='+date.toUTCString(); // use expires attribute, max-age is not supported by IE
			}

			var path = options.path ? '; path='+(options.path) : '';
			var domain = options.domain ? '; domain='+(options.domain) : '';
			var secure = options.secure ? '; secure' : '';
			document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
		} else {
			var cookieValue = null;
			if( document.cookie && document.cookie !== '' ){
				var cookies = document.cookie.split(';');
				for( var i = 0; i < cookies.length; i++ ){
					var cookie = $.trim(cookies[i]);

					if( cookie.substring(0, name.length + 1) == (name+'=') ){
						cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
						break;
					}
				}
			}

			return cookieValue;
		}
	},



	/**
	 * Converts a CSS-value to an integer without unit.
	 *
	 * @param {String} cssVal - the css-value to convert
	 * @returns {Number.Integer} true integer representation of the given value
	 **/
	cssToInt : function(cssVal){
		return parseInt(cssVal.replace(/(px|em|%)$/, ''), 10);
	},



	/**
	 * Converts a CSS-URL to a img-src-usable value.
	 *
	 * @param {String} cssUrl - the URL from the css
	 * @param {String} [relativePathPart] - the relative path part of the URL from the css to cut for src-use
	 * @returns {String} src value or empty string if cssUrl is no CSS-URL-value
	 **/
	cssUrlToSrc : function(cssUrl, relativePathPart){
		var urlRex = new RegExp('^url\\((?:\'|\")?([^\'\"]+)(?:\'|\")?\\)$', 'i');
		var matches = urlRex.exec(cssUrl);

		if( this.isSet(matches) ){
			if( !this.isSet(relativePathPart) ){
				return matches[1];
			} else {
				return matches[1].substr(relativePathPart.length);
			}
		} else {
			return '';
		}
	},



	/**
	 * Preloads images by URL.
	 * Images can be preloaded by name and are thereby retrievable afterwards or anonymously.
	 * So you can either just use the url again, or, to be super-sure, call the method again, with just the image name to get the URL.
	 *
	 * @param {(String|String[]|Object.<String, String>)} images - an URL, an array of URLS or a plain object containing named URLs. In case the string is an already used name, the image-object is returned.
	 * @param {Function} [callback] - callback to call when all images have loaded, this also fires on already loaded images if inserted again
	 * @returns {(Image|Object.<String, String>)} either returns a requested cached image or the currently added named/unnamed images as saved
	 **/
	preloadImages : function(images, callback){
		var res = null;

		if( !$.isPlainObject(images) && !$.isArray(images) ){
			image = ''+images;

			if( this.exists(image, this.jqueryAnnexData.preloadedImages.named) ){
				return this.jqueryAnnexData.preloadedImages.named[image];
			} else {
				images = [image];
			}
		}


		if( $.isPlainObject(images) ){
			var newImages = {};
			$.each(images, function(key, value){
				key = ''+key;
				value = ''+value;

				if( !$.exists(key, $.jqueryAnnexData.preloadedImages.named) ){
					newImages[key] = new Image();
					newImages[key].src = value;
				}
			});

			$.extend(this.jqueryAnnexData.preloadedImages.named, newImages);

			res = this.jqueryAnnexData.preloadedImages.named;
		} else if( $.isArray(images) ){
			$.each(images, function(index, value){
				var newImage = new Image();
				newImage.src = ''+value;
				$.jqueryAnnexData.preloadedImages.unnamed.push(newImage);
			});

			res = this.jqueryAnnexData.preloadedImages.unnamed;
		}

		var imageList = [];
		$.each(this.jqueryAnnexData.preloadedImages.named, function(key, value){
			imageList.push(value);
		});
		$.merge(imageList, this.jqueryAnnexData.preloadedImages.unnamed);

		var targetCount = imageList.length;
		var blank = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
		$.each(imageList, function(index, value){
			$(value).on('load.preload', function(e){
				if( this.src != blank ){
					if( (--targetCount <= 0) && $.isFunction(callback) ){
						$.each(imageList, function(index, value){ $(this).off('load.preload'); });
						callback(imageList, e);
					}
				} else {
					var $target = $(this);
					$.schedule(10, function(){ $target.trigger('load.preload'); });
				}
			});

			if( value.complete || value.complete === undefined ){
				var src = value.src;
				value.src = blank;
				value.src = src;
			}
		});

		return res;
	},



	/**
	 * Waits for a list of webfonts to load before executing a callback.
	 * Works for fonts already loaded as well.
	 *
	 * @param {String|String[]} fonts - the CSS-names of the fonts to wait upon
	 * @param {Function} callback - the callback to execute once all given webfonts are loaded
	 * @param {?String} [fallbackFontName=sans-serif] - the system font onto which the page falls back if the webfont is not loaded
	 **/
	waitForWebfonts : function(fonts, callback, fallbackFontName) {
		fonts = $.isArray(fonts) ? fonts : [''+fonts];
		fallbackFontName = this.isSet(fallbackFontName) ? ''+fallbackFontName : 'sans-serif';

		var loadedFonts = 0;
		for(var i = 0; i < fonts.length; i++){
				var $node = this.elem('span')
					.html('giItT1WQy@!-/#')
					.css({
						'position' : 'absolute',
						'visibility' : 'hidden',
						'left' : '-10000x',
						'top' : '-10000px',
						'font-size' : '300px',
						'font-family' : fallbackFontName,
						'font-variant' : 'normal',
						'font-style' : 'normal',
						'font-weight' : 'normal',
						'letter-spacing' : '0'
					})
				;
				$('body').append($node);

				var systemFontWidth = $node.width();
				$node.css('font-family', fonts[i]+', '+fallbackFontName);

				var tCheckFontLoaded = null;
				var fCheckFont = function(){
					if( $node && ($node.width() != systemFontWidth) ){
						loadedFonts++;
						$node.remove();
						$node = null;
					}

					if( loadedFonts >= fonts.length ){
						if( $.isSet(tCheckFontLoaded) ){
							$.countermand(tCheckFontLoaded);
						}

						if( loadedFonts == fonts.length ){
							callback();
							return true;
						}
					}
				};

				if( !fCheckFont() ){
					tCheckFontLoaded = this.loop(50, fCheckFont);
				}
		}
	},



	/**
	 * Tries to isolate a supposed (DB-)Id from a given String
	 *
	 * @param {String} baseString - the string to isolate an id from
	 * @returns {(String|null)} either the isolated id or null
	 **/
	isolateId : function(baseString){
		var occurrences = String(baseString).match(/[0-9]+/);

		if( this.isSet(occurrences) && occurrences.length > 0 ){
			return occurrences[0];
		} else {
			return null;
		}
	},



	/**
	 * Determines if a given value could be a valid id, being digits with or without given pre- and postfix.
	 *
	 * @param {(String|Number.Integer)} testVal - the value to test
	 * @param {?String} [prefix] - a prefix for the id
	 * @param {?String} [postfix] - a postfix for the id
	 * @param {?Boolean} [dontMaskFixes=false] - if you want to use regexs as fixes, set this true
	 * @returns {Boolean} true if value may be id
	 **/
	isPossibleId : function(testVal, prefix, postfix, dontMaskFixes){
		prefix = $.isSet(prefix) ? ''+prefix : '';
		postfix = $.isSet(postfix) ? ''+postfix : '';

		var rex = null;
		if( !dontMaskFixes ){
			rex = new RegExp('^'+this.maskForRegEx(prefix)+'[0-9]+'+this.maskForRegEx(postfix)+'$');
		} else {
			rex = new RegExp('^'+prefix+'[0-9]+'+postfix+'$');
		}

		return rex.test(''+testVal);
	},



	/**
	 * Masks all selector-special-characters.
	 *
	 * @param {String} string - the string to mask for use in a selector
	 * @returns {String} the masked string
	 **/
	maskForSelector : function(string){
		return string.replace(/([\#\;\&\,\.\+\*\~\'\:\"\!\^\$\[\]\(\)\=\>\ß\|\/\@])/, '\\$1');
	},



	/**
	 * Masks all regex special characters.
	 *
	 * @param {String} string - the string to mask for use in a regexp
	 * @returns {String} the masked string
	 **/
	maskForRegEx : function(string){
		return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	},



	/**
	 * Return the de-nodified text content of a node-ridden string or a jQuery object.
	 * Returns the raw text content, with all markup cleanly removed.
	 * Can also be used to return only the concatenated child text nodes.
	 *
	 * @param {String|Object} nodeInfested - the node-ridden string or jquery object to "clean"
	 * @param {Boolean} [onlyFirstLevel=false] - true if only the text of direct child text nodes is to be returned
	 * @returns {String} the escaped string
	 **/
	textContent : function(nodeInfested, onlyFirstLevel){
		onlyFirstLevel = this.isSet(onlyFirstLevel) ? !!onlyFirstLevel : false;

		var res = '';
		var $holder = (this.isA(nodeInfested, 'object') && this.isSet(nodeInfested.jquery))
			? nodeInfested
			: this.elem('p').html(''+nodeInfested)
		;

		if( onlyFirstLevel ){
			res = $holder
				.contents()
				.filter(function(){
					return this.nodeType == 3;
				})
				.text()
			;
		} else {
			res = $holder.text();
		}

		return res;
	},



	/**
	 * Binds a callback to a cursor key, internally identified by keycode.
	 *
	 * @param {String} keyName - the key to bind => up/down/left/right
	 * @param {Function} callback - callback to call of cursor key use, takes event e
	 * @param {String} [eventType=keydown] - the event type to use when binding => keypress/keydown/keyup
	 **/
	bindCursorKey : function(keyName, callback, eventType){
		var keys = {
			up : 38,
			right : 39,
			down : 40,
			left : 37
		};

		if( !this.isSet(eventType) ){
			eventType = 'keydown';
		}

		if( this.exists(keyName, keys) ){
			$(document).on(eventType+'.'+keyName, function(e){ if(e.keyCode == keys[keyName]) callback(e); });
		}
	},



	/**
	 * Unbinds a callback to a cursor key, internally identified by keycode.
	 *
	 * @param {String} keyName - the key to unbind => up/down/left/right
	 * @param {String} [eventType=keydown] - the event type to use when binding => keypress/keydown/keyup
	 **/
	unbindCursorKey : function(keyName, eventType){
		var keys = {
			up : 38,
			right : 39,
			down : 40,
			left : 37
		};

		if( !this.isSet(eventType) ){
			eventType = 'keydown';
		}

		if( this.exists(keyName, keys) ){
			$(document).off(eventType+'.'+keyName);
		}
	},



	/**
	 * Removes all textselections from the current frame if possible.
	 **/
	removeSelection : function(){
		if( window.getSelection ){
			window.getSelection().removeAllRanges();
		}else if( document.getSelection ){
			document.getSelection().removeAllRanges();
		}
	},



	/**
	 * Detects if the current JavaScript-context runs on a (dedicated) touch device.
	 * Checks these UserAgents by default: iOS-devices, Blackberry, Android, IE mobile, Opera Mobilem Firefox Mobile and Kindle.
	 *
	 * @param {Boolean} [inspectUserAgent=false] - defines if the user agent should be inspected additionally to identifying touch events
	 * @param {?String[]} [additionalUserAgentIds] - list of string-ids to search for in the user agent additionally to the basic ones
	 * @param {?Boolean} [onlyConsiderUserAgent=false] - tells the algorithm to ignore feature checks and just go by the user-agent-ids
	 * @returns {Boolean} true if device knows touch events and or sends fitting useragent
	 **/
	contextIsTouchDevice : function(inspectUserAgent, additionalUserAgentIds, onlyConsiderUserAgent){
		var that = this;
		var touchEventsPresent = 'createTouch' in document;
		var res = onlyConsiderUserAgent ? true : touchEventsPresent;
		var ua = navigator.userAgent;

		if( this.isSet(inspectUserAgent) && inspectUserAgent ){
			res =
				touchEventsPresent
				&& (
					this.isSet(ua.match(/(iPhone|iPod|iPad)/i))
					|| this.isSet(ua.match(/(BlackBerry|PlayBook)/i))
					|| this.isSet(ua.match(/Android/i))
					|| this.isSet(ua.match(/IE\sMobile\s[0-9]{0,2}/i))
					|| this.isSet(ua.match(/Opera Mobi/i))
					|| this.isSet(ua.match(/mobile.+firefox/i))
					|| this.isSet(ua.match(/Kindle/i))
				)
			;

			if( !res && this.isSet(additionalUserAgentIds) && $.isArray(additionalUserAgentIds) ){
				$.each(additionalUserAgentIds, function(index, value){
					var rex = new RegExp(value, 'i');
					var matches = rex.exec(ua);
					res = (touchEventsPresent && res) || (touchEventsPresent && that.isSet(matches));
				});
			}
		}

		return res;
	},



	/**
	 * Checks if the context would benefit from high DPI graphics.
	 *
	 * @returns {Boolean} true if device has high DPI, false if not or browser does not support media queries
	 **/
	contextHasHighDpi : function(){
		if( window.matchMedia ){
			var query = '@media only screen and (-webkit-min-device-pixel-ratio: 1.5),'
				+'only screen and (-o-min-device-pixel-ratio: 3/2),'
				+'only screen and (min--moz-device-pixel-ratio: 1.5),'
				+'only screen and (min-device-pixel-ratio: 1.5),'
				+'only screen and (min-resolution: 144dpi),'
				+'only screen and (min-resolution: 1.5dppx)'
			;

			return window.matchMedia(query).matches;
		} else {
			return false;
		}
	}

});



//--|JQUERY-OBJECT-GENERAL-FUNCTIONS----------

$.fn.extend({

	/**
	 * Returns the original object of a jQuery-enabled object.
	 *
	 * @returns {(Object|Object[]|null)} the original dom object(s) or null in case of empty collection
	 **/
	oo : function(){
		if( $(this).length == 1 ){
			return $(this).first()[0];
		} else if( $(this).length > 1 ) {
			var res = [];

			$(this).each(function(){
				res.push($(this).first()[0]);
			});

			return res;
		} else {
			return null;
		}
	},



	/**
	 * Sets an option selected or selects the text in a text-field/textarea.
	 *
	 * @returns {Object} this
	 **/
	doselect : function(){
		if( $(this).is('option, :text, textarea') ){
			if( $(this).is(':text, textarea') ){
				$(this).each(function(){
					this.focus();
					this.select();
				});
			} else {
				$(this)
					.attr('selected', 'selected')
					.prop('selected', true)
				;
			}
		}

		return this;
	},



	/**
	 * Removes a selection from an option or deselects the text in a text-field/textarea.
	 *
	 * @returns {Object} this
	 **/
	deselect : function(){
		if( $(this).is(':text, textarea') ){
			var tmpVal = $(this).val();
			var stopperFunc = function(e){ return false; };
			$(this)
				.on('change', stopperFunc)
				.val('')
				.val(tmpVal)
				.off('change', stopperFunc)
			;
		} else {
			$(this)
				.removeAttr('selected')
				.prop('selected', false)
			;
		}

		return this;
	},



	/**
	 * Checks a checkbox or radiobutton.
	 *
	 * @returns {Object} this
	 **/
	check : function(){
		if( $(this).is(':checkbox, :radio') ){
			$(this)
				.attr('checked', 'checked')
				.prop('checked', true)
			;
		}

		return this;
	},



	/**
	 * Removes a check from a checkbox or radiobutton.
	 *
	 * @returns {Object} this
	 **/
	uncheck : function(){
		$(this)
			.removeAttr('checked')
			.prop('checked', false)
		;

		return this;
	},



	/**
	 * Enables a form-element.
	 *
	 * @returns {Object} this
	 **/
	enable : function(){
		$(this)
			.removeAttr('disabled')
			.prop('disabled', false)
		;

		return this;
	},



	/**
	 * Disables a form-element.
	 *
	 * @returns {Object} this
	 **/
	disable : function(){
		if( $(this).is(':input') ){
			$(this)
				.attr('disabled', 'disabled')
				.prop('disabled', true)
			;
		}

		return this;
	},



	/**
	 * Creates the basic attributes for a DOM-element that define its DOM- and CSS-identity.
	 * Namely id, class and style. An element may be used a source to inherit values from.
	 * If identity is inherited from another element html5-data-attributes are also transferred additionally.
	 * Explicit on-event-handlers are also transferred and added as jquery-events with the "frommarkup"-namespace.
	 *
	 * @param {?String} [id] - the DOM-id the element should have
	 * @param {?(String|String[])} [classes] - the html-classes the element should have
	 * @param {?(String|Object.<String, String>)} [style] - the element's styles as a css-string or a jquery-style css-plain-object
	 * @param {?Object} $inheritFrom - the element to inherit identity values from
	 * @returns {Object} this
	 **/
	setElementIdentity : function(id, classes, style, $inheritFrom){
		var that = this;
		var copyAttrs = ['id', 'class', 'style'];

		if( $.isSet($inheritFrom) && $.isA($inheritFrom, 'object') ){
			$.each($inheritFrom[0].attributes, function(index, attribute){
				if( $.inArray(attribute.name, copyAttrs) != -1 ){
					$(that).attr(attribute.name, attribute.value);
				} else if( attribute.name.indexOf('data-') === 0 ){
					$(that)
						.attr(attribute.name, attribute.value)
						.data($.strReplace('data-', '', attribute.name), attribute.value)
					;
				} else if( attribute.name.indexOf('on') === 0 ){
					$(that).on(attribute.name.substring(2)+'.frommarkup', function(){ eval(attribute.value); });
				}
			});
		}

		if( $.isSet(id) ){
			$(this).attr('id', ''+id);
		}

		if( $.isSet(classes) ){
			if( $.isArray(classes) ){
				$.each(classes, function(index, value){
					$(that).addClass(value);
				});
			} else {
				$(this).attr('class', ($.isSet($(this).attr('class')) ? $(this).attr('class')+' ' : '')+classes);
			}
		}

		if( $.isSet(style) ){
			if( $.isPlainObject(style) ){
				$(that).css(style);
			} else {
				$(this).attr('style', ($.isSet($(this).attr('style')) ? $(this).attr('style')+' ' : '')+style);
			}
		}

		return this;
	},



	/**
	 * Searches for and returns parameters embedded in URLs, either in the document(-url) or elements
	 * having a src- or href-attributes.
	 *
	 * @param {String} paramName the name of the parameter to extract
	 * @returns {(null|true|String|String[])} null in case the parameter doesn't exist, true in case it exists but has no value, a string in case the parameter has one value, or an array of strings
	 **/
	urlParameter : function(paramName){
		paramName = ''+paramName;

		var paramExists = false;
		var res = [];
		var qString = null;
		var url = '';

		if( $(this).prop('nodeName') == '#document' ){
			if( window.location.search.search(paramName) > -1 ){
				qString = window.location.search.substr(1, window.location.search.length).split('&');
			}
		} else if( $.isSet($(this).attr('src')) ){
			url = $(this).attr('src');
			if( url.indexOf('?') > -1 ){
				qString = url.substr(url.indexOf('?') + 1).split('&');
			}
		} else if( $.isSet($(this).attr('href')) ){
			url = $(this).attr('href');
			if ( url.indexOf('?') > -1 ){
				qString = url.substr(url.indexOf('?') + 1).split('&');
			}
		} else {
			return null;
		}

		if( qString === null ){
			return null;
		}

		var paramPair = null;
		for( var i = 0; i < qString.length; i++ ){
			paramPair = qString[i].split('=');
			if( paramPair[0] == paramName ){
				paramExists = true;
				if( paramPair.length > 1 ){
					res.push(paramPair[1]);
				}
			}
		}

		if( !paramExists ){
			return null;
		} else if( res.length === 0 ){
			return true;
		} else if( res.length == 1 ){
			return res[0];
		} else {
			return res;
		}
	},



	/**
	 * Returns the currently set URL-Anchor on the document(-url) or elements having a src- or href-attribute.
	 *
	 * @param {Boolean} [withoutCaret=false] - defines if anchor value should contain leading "#"
	 * @returns {(String|null)} current anchor value or null if no anchor in url
	 **/
	urlAnchor : function(withoutCaret){
		var anchor = null;
		var anchorParts = [];

		if( $(this).prop('nodeName') == '#document' ){
			anchor = window.location.hash;
		} else if( $.isSet($(this).attr('src')) ){
			anchorParts = $(this).attr('src').split('#');
			if( anchorParts.length > 1 ){
				anchor = '#'+anchorParts[1];
			}
		} else if( $.isSet($(this).attr('href')) ){
			anchorParts = $(this).attr('href').split('#');
			if( anchorParts.length > 1 ){
				anchor = '#'+anchorParts[1];
			}
		} else {
			return null;
		}

		if( $.isSet(withoutCaret) && withoutCaret ){
			anchor = anchor.replace('#', '');
		}

		if( $.isSet(anchor) && ($.trim(anchor) === '') ){
			anchor = null;
		}

		return anchor;
	},



	/**
	 * Parses form-element-values inside the target-object into a simple object.
	 * Basically an extension of jQuery's own serializeArray() with the difference that
	 * this function can handle form-arrays, which are returned under their name without bracket
	 * as an actual JS-Array.
	 *
	 * @returns {Object} form-data-object {name:val, name:[val, val]}
	 **/
	formDataToObject : function(){
		var fields = $(this).serializeArray();
		var targetObj = {};
		var currentFieldIsArray = false;

		for( var i = 0; i < fields.length; i++ ){
			currentFieldIsArray = false;
			if( fields[i].name.indexOf('[]') != -1 ){
				fields[i].name = fields[i].name.slice(0, fields[i].name.indexOf('[]'));
				currentFieldIsArray = true;
			}

			if( !$.isSet(targetObj[fields[i].name]) ){
				if( !currentFieldIsArray ){
					targetObj[fields[i].name] = fields[i].value;
				} else {
					targetObj[fields[i].name] = [fields[i].value];
				}
			} else if( !$.isArray(targetObj[fields[i].name]) ){
				targetObj[fields[i].name] = [targetObj[fields[i].name], fields[i].value];
			} else {
				targetObj[fields[i].name].push(fields[i].value);
			}
		}

		return targetObj;
	},



	/**
	 * Returns if the current element is currently part of the dom or detached/removed.
	 *
	 * @returns {Boolean} true if in dom
	 **/
	isInDom : function(){
		return $(this).closest(document.documentElement).length > 0;
	},



	/**
	 * Returns if the current element is visible in the window's viewport at the moment.
	 * This method uses getBoundingClientRect(), which has to be supported by the browser, otherwise
	 * the method will always return true.
	 *
	 * @param {Boolean} [mustBeFullyInside=false] - defines if the element has to be fully enclosed in the viewport, default is false
	 * @returns {Boolean} true if in viewport
	 **/
	isInViewport : function(mustBeFullyInside){
		var bb = null;

		try {
			bb = $(this).first().oo().getBoundingClientRect();
		} catch(err){
			return true;
		}

		if( $.isSet(mustBeFullyInside) ){
			mustBeFullyInside = !!mustBeFullyInside;
		} else {
			mustBeFullyInside = false;
		}

		var viewportBounds = null;
		if( mustBeFullyInside ){
			viewportBounds = {
				top: 0,
				right : $(window).width(),
				bottom : $(window).height(),
				left : 0
			};
		} else {
			viewportBounds = {
				top : -( bb.bottom - bb.top ) + 1,
				right : ( $(window).width() + ( bb.right - bb.left ) ) + 1,
				bottom : ( $(window).height() + ( bb.bottom - bb.top ) ) + 1,
				left : -( bb.right - bb.left ) + 1
			};
		}

		return (
			bb.top >= viewportBounds.top &&
			bb.right <= viewportBounds.right &&
			bb.left >= viewportBounds.left &&
			bb.bottom <= viewportBounds.bottom
		);
	},



	/**
	 * Replaces hidden-class with the jQuery-state hidden, which is just a weensy bit different :D
	 *
	 * @returns {Object} this
	 **/
	rehide : function(){
		$(this).each(function(){
			if( $(this).hasClass('hidden') ){
				$(this).removeClass('hidden').hide();
			}
		});

		return this;
	},



	/**
	 * Measures hidden elements by using a sandbox div.
	 *
	 * @param {String} functionName - name of the function to call on target
	 * @param {?String} [selector] - selector to apply to element to find target
	 * @param {?Object} [context=$('body')] - context to use as container for measurement
	 * @returns {*} result of function applied to target
	 **/
	measureHidden : function(functionName, selector, $context){
		var res = null;

		if( !$.isSet($context) ){
			$context = $('body');
		}

		$context.sandbox();

		var $measureClone = $(this).clone();
		$context.children('#sandbox').append($measureClone);

		var $target = null;
		if( $.isSet(selector) ){
			$target = $measureClone.find(''+selector);
		} else {
			$target = $measureClone;
		}

		res = $.proxy($.fn[''+functionName], $target)();

		$context.removeSandbox();

		return res;
	},



	/**
	 * Fixes cross-browser problems with image-loads and fires the event even in case the image is already loaded.
	 *
	 * @param {Function} callback - callback to call when all images have been loaded
	 * @param {Boolean} [needsJqueryDims=false] - tells the check if we expect the loaded image to have readable dimensions
	 * @returns {Object} this
	 **/
	imgLoad : function(callback, needsJqueryDims){
		var targets = $(this).filter('img');
		var targetCount = targets.length;
		var blank = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

		targets.on('load.imgload', function(e){
			if( (!needsJqueryDims || (needsJqueryDims && $(this).width() > 0)) && (this.src != blank) ){
				if( (--targetCount <= 0) && $.isFunction(callback) ){
					targets.off('load.imgload');
					callback.call(targets, e);
				}
			} else {
				var $target = $(this);
				$.schedule(10, function(){ $target.trigger('load.imgload'); });
			}
		}).each(function(){
			if( this.complete || this.complete === undefined ){
				var src = this.src;
				this.src = blank;
				this.src = src;
			}
		});

		return this;
	},



	/**
	 * Loops an animation-based (needs to build an animation queue) closure indefinitely.
	 * Kills other animations on element if nothing else is declared.
	 * Cancel animation with .stop(true).
	 * The animationClosure needs to take a parameter, which is filled with the jQuery-element, this method is called upon.
	 *
	 * @param {Function} animationClosure - closure in which all animation is included, takes the jQuery-Element as first parameter, needs to do something queue-building
	 * @param {Function} [killAnimations=false] - defines if all current animation should be immediately finished before proceeding
	 * @returns {Object} this
	 **/
	loopAnimation : function(animationClosure, killAnimations){
		killAnimations = !$.isSet(killAnimations) || ($.isSet(killAnimations) && killAnimations);

		if( $.isFunction(animationClosure) ){
			if( killAnimations ){
				$(this).stop(true, true);
			}

			$(this)
				.queue(function(next){
					animationClosure($(this));
					$(this).queue(arguments.callee);
					next();
				})
			;
		}

		return this;
	},



	/**
	 * Sets CSS-rules blindly for all intermediate cross browser variants.
	 * Unknown stuff does not get interpreted, and therefore should not do harm,
	 * but relives one of writing several slightly different rules all the time.
	 *
	 * @param {Object.<String, String>} cssObj - plain object of CSS-rules to apply, according to standard jQuery-standard
	 * @returns {Object} this
	 **/
	cssCrossBrowser : function(cssObj){
		if( $.isPlainObject(cssObj) ){
			var orgCssObj = $.extend({}, cssObj);
			$.each(orgCssObj, function(cssKey, cssValue){
				$.each(['-moz-', '-webkit-', '-o-', '-ms-', '-khtml-'], function(variantIndex, variantValue){
					if(cssKey == 'transition'){
						cssObj[variantValue+cssKey] = $.strReplace('transform', variantValue+'transform', cssValue);
					} else {
						cssObj[variantValue+cssKey] = cssValue;
					}
				});
			});
			$(this).css(cssObj);
		}

		return this;
	},



	/**
	 * Disables selectability as far as possible for elements.
	 *
	 * @returns {Object} this
	 **/
	disableSelection : function(){
		$(this).each(function(){
			this.onselectstart = function(){ return false; };
			this.unselectable = 'on';
			$(this).cssCrossBrowser({'user-select' : 'none'});
			$(this).css('-webkit-touch-callout', 'none');
		});

		return this;
	},



	/**
	 * Register an event handler to open a mailto dialogue without openly writing
	 * down the mail address. Parameters mixed to complicate parsing.
	 *
	 * @param {String} tld - the top level domain to use
	 * @param {String} beforeAt - the address part before the @
	 * @param {String} afterAtWithoutTld - the address part after the @ but before the tld
	 * @param {?String} [subject] - the subject the mail should have
	 * @param {?String} [body] - the body text the mail should have initially
	 * @param {?Boolean} [writeToElem=false] - define if the email should be written back to the element text
	 * @param {?String} [eventType=click] - the event type to register the call to
	 * @returns {Object} this
	 **/
	registerMailto : function(tld, beforeAt, afterAtWithoutTld, subject, body, writeToElem, eventType){
		if( !$.isSet(eventType) ){
			eventType = 'click';
		}

		if( !$.isSet(subject) ){
			subject = '';
		}

		if( !$.isSet(body) ){
			body = '';
		}

		$(this).on(eventType, function(){
			$.redirect('mailto:'+beforeAt+'@'+afterAtWithoutTld+'.'+tld+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body));
		});

		if( $.isSet(writeToElem) && writeToElem ){
			$(this).html((beforeAt+'@'+afterAtWithoutTld+'.'+tld).replace(/(\w{1})/g, '$1&zwnj;'));
		}

		return this;
	},


	/**
	 * Register an event handler to activate a tel-protocol phonecall without openly writing
	 * down the number. Parameters mixed to complicate parsing.
	 *
	 * @param {(Number.Integer|String)} regionPart - the local part of the number after the country part e.g. +49(04)<-this 123 456
	 * @param {(Number.Integer|String)} firstTelPart - first half of the main number +4904 (123)<-this 456
	 * @param {(Number.Integer|String)} countryPart - the country identifactor with or without + this->(+49)04 123 456
	 * @param {(Number.Integer|String)} secondTelPart - second half of the main number +4904 123 (456)<-this
	 * @param {?Boolean} [writeToElem=false] - define if the number should be written back to the element text
	 * @param {?String} [eventType=click] - the event type to register the call to
	 * @returns {Object} this
	 **/
	registerTel : function(regionPart, firstTelPart, countryPart, secondTelPart, writeToElem, eventType){
		if( !$.isSet(eventType) ){
			eventType = 'click';
		}

		if( (''+countryPart).indexOf('+') !== 0 ){
			countryPart = '+'+countryPart;
		}

		$(this).on(eventType, function(){
			$.redirect('tel:'+countryPart+regionPart+$.strReplace(['-', ' '], '', ''+firstTelPart+secondTelPart));
		});

		if( $.isSet(writeToElem) && writeToElem ){
			$(this).html((countryPart+regionPart+' '+firstTelPart+secondTelPart).replace(/(\w{1})/g, '$1&zwnj;'));
		}

		return this;
	},



	/**
	 * Treats touchstart, touchmove and touchend events on the element internally
	 * as mousedown, mousemove and mouseup events and remaps event coordinates correctly.
	 *
	 * @param {Boolean} [ignoreChildren=false] - defines if only the element itself should count and whether to ignore bubbling
	 * @returns {Object} this
	 **/
	simulateTouchEvents : function(ignoreChildren){
		$(this).on('touchstart touchmove touchend', function(e){
			var isTarget = (e.target == this);

			if( isTarget || !$.isSet(ignoreChildren) || !ignoreChildren ){
				var alreadyTested = (!isTarget && e.target.__ajqmeclk);
				var orgEvent = e.originalEvent;

				if(
					(alreadyTested !== true)
					&& $.isSet(orgEvent)
					&& $.isSet(orgEvent.touches)
					&& (orgEvent.touches.length <= 1)
					&& ($.inArray(orgEvent.type.toLowerCase(), $.jqueryAnnexData.touch.types) < 0)
				){
					var objectEvents = ( !isTarget && !$.isA(alreadyTested, 'boolean') ) ? $(e.target).data('events') : false;
					var eventNeedsReplacement = false;
					if( !isTarget ){
						e.target.__ajqmeclk = objectEvents;
						eventNeedsReplacement =
							$.isSet(objectEvents)
							&& ($.isSet(objectEvents['click']) || $.isSet(objectEvents['mousedown']) || $.isSet(objectEvents['mouseup']) || $.isSet(objectEvents['mousemove']))
						;
					} else {
						eventNeedsReplacement = false;
					}

					if( !eventNeedsReplacement && ($.inArray(e.target.tagName.toLowerCase(), $.jqueryAnnexData.touch.inputs) < 0) ){
						var touch = orgEvent.changedTouches[0];
						var mouseEvent = document.createEvent("MouseEvent");
						mouseEvent.initMouseEvent(
							$.jqueryAnnexData.touch.types[e.type.toLowerCase()],
							true,
							true,
							window,
							1,
							touch.screenX,
							touch.screenY,
							touch.clientX,
							touch.clientY,
							false,
							false,
							false,
							false,
							0,
							null
						);
						mouseEvent.synthetic = true;

						touch.target.dispatchEvent(mouseEvent);
						orgEvent.preventDefault();
						e.stopImmediatePropagation();
						e.stopPropagation();
						e.preventDefault();
					}
				}
			}
		});

		return this;
	},



	/**
	 * Creates a neutral, invisible sandbox in the given context, to mess around with.
	 *
	 * @returns {Object} this
	 **/
	sandbox : function(){
		$(this).append($.elem('div', {'id' : 'sandbox', 'style' : 'position:absolute; visibility:hidden; display:block;'}));

		return this;
	},



	/**
	 * Removes the sandbox from given context.
	 *
	 * @returns {Object} this
	 **/
	removeSandbox : function(){
		$(this).find('#sandbox').remove();

		return this;
	}

});



//--|JQUERY-SYNTAX-EXTENSIONS----------

// not needed anymore for the moment, keeping the template for later use ...
/*$.extend($.expr[':'], {

	xxx: function(element) {}

});*/
