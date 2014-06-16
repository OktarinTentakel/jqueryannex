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
 * @version Revision 14 developed and tested with jQuery 1.11.0
 **/



//--|JQUERY-$-GENERAL-FUNCTIONS----------

$.extend({

	// general dictionary to hold internal data and offer data space for plugins
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
	 * @param {String} enabled OPTIONAL enable/disable logging globally, including console.log, use tokens __enable__ and __disable__
	 * @param {*} .. OPTIONAL add any number of arguments you wish to log
	 **/
	log : function(enabled){
		if( this.isSet(enabled) && ($.inArray(enabled, ['__enable__', '__disable__']) >= 0) ){
			arguments = Array.prototype.slice.call(arguments, 1);

			if( enabled == '__enable__' ){
				if( !this.jqueryAnnexData.logging.enabled ){
					console.log = this.jqueryAnnexData.logging.originalLoggingFunction;
				}
			} else {
				this.jqueryAnnexData.logging.originalLoggingFunction = console.log;
				console.log = $.noop;
			}

			this.jqueryAnnexData.logging.enabled = enabled;
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
	 * @param {String} tag name of the tag/element to create
	 * @param {Object} attributes OPTIONAL tag attributes as key/value-pairs
	 * @param {String} content OPTIONAL content to embed into the element, such as text
	 * @return {Object} jQuery-enabled DOM-element
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
	 * @param {Boolean} condition defines if an assertion is successful
	 * @param {String} message OPTIONAL to display if assertion fails
	 * @return {Boolean} result of the assertion
	 * @throws assert exception
	 **/
	assert : function(condition, message){
		if( !condition ){
			message = this.isSet(message) ? ''+message : 'assert exception: assertion failed';
			throw message;
		}
	},



	/**
	 * Check if variable(s) is set at all.
	 *
	 * @param {*} .. OPTIONAL add any number of targets you wish to check
	 * @return {Boolean} true / false
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
	 * Check if a variable is defined in a certain context (normally globally in window).
	 * Or check if a jquery set contains anything, answering if the query-string exists in its context.
	 *
	 * @param {String|Object} target name of the variable to look for, not the variable itself, or a jquery Object
	 * @param {*} context OPTIONAL the context in which to look for the variable, window by default, holds no meaning for jquery objects
	 * @return {Boolean} true / false
	 */
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
	 * @param {*} target variable to check the type of
	 * @param {String} typeName the name of the type to check for, has to be a standard JS-type
	 * @return {Boolean} true / false
	 **/
	isA : function(target, typeName){
		if( $.inArray(typeName, ['boolean', 'number', 'string', 'function', 'array', 'date', 'regexp', 'object']) >= 0 ){
			return $.type(target) == ''+typeName;
		} else {
			this.log('type-identification exception: not asked for valid JS-type');
			return false;
		}
	},



	/**
	 * Offers similar functionality to phps str_replace and avoids RegExps for this task.
	 *
	 * @param {String|Array} search the string(s) to replace
	 * @param {String|Array} replace the string(s) to replace the search string(s)
	 * @param {String} subject the string to replace in
	 * @return {String} the modified string
	 */
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
	 * @param {String} subject the string to check and truncate
	 * @param {Integer} maxLength OPTIONAL the maximum allowed character length for the string
	 * @param {String} suffix OPTIONAL the trailing string to end a truncated string with
	 * @return {String} the original or truncated subject
	 */
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
	 * Removes Elements from an Array. Removes Elements from an Array. Modifies the original array.
	 *
	 * @param {Array} array the array to remove elements from
	 * @param {Integer} from index to start removing (can also be negative to start from back)
	 * @param {Integer} to OPTIONAL index to end removing (can also be negative to start from back)
	 * @return {Array} the modified array
	 */
	removeFromArray : function(array, from, to){
		var rest = array.slice((to || from) + 1 || array.length);
		array.length = (from < 0) ? (array.length + from) : from;
		return array.push.apply(array, rest);
	},



	/**
	 * Counts enumerable properties of (plain) objects.
	 *
	 * @param {Objects} object the object to count properties in
	 * @return {Integer} number of enumerable properties
	 **/
	objectLength : function(object){
		var count = 0;

		$.each(object, function(key, value){
			count++;
		});

		return count;
	},



	/**
	 * Special form of Math.random, returning an int value between two ints, where floor and ceiling are included in the range.
	 *
	 * @param {Integer} floor the lower end of random range
	 * @param {Integer} ceiling the upper end of random range
	 * @return {Integer} random int between floor and ceiling
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
			this.log('random value exception: ceiling may not be smaller than floor');
			return null;
		}

		return Math.round(Math.random() * (ceiling - floor) + floor);
	},



	/**
	 * Returns a UUID, as close as possible with JavaScript.
	 *
	 * @param {Boolean} withoutDashes OPTIONAL defines if UUID shall include dashes or not, default is true
	 * @return {String} a UUID
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
	 * Checks if a value is within bounds of a minimum and maximum and returns the value or minimum/maximum if out of bounds.
	 *
	 * @param {Boolean} value the lower bound, has to be comparable with < and >
	 * @param {Boolean} value the value to check, has to be comparable with < and >
	 * @param {Boolean} value the upper bound, has to be comparable with < and >
	 * @return {*} value, min or max
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
	 * @param {Integer} ms time in milliseconds till execution
	 * @param {Function} callback callback function to execute after ms
	 * @param {Object|GUID} oldTimer OPTIONAL if set, kills the timer before setting up new one
	 * @return {Object|null} new timer or null in case of a param-error
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
	 * to prevent overlapping timers. This implementation uses Date.getTime() to
	 * improve on timer precision for long running timers. The timers of this method
	 * can also be used in countermand().
	 *
	 * @param {Integer} ms time in milliseconds till execution
	 * @param {Function} callback callback function to execute after ms
	 * @param {Object|GUID} oldTimer OPTIONAL if set, kills the timer before setting up new one
	 * @return {Object|null} timer or null in case of a param-error (does not create new timer object if oldTimer given)
	 **/
	pschedule : function(ms, callback, oldTimer){
		if(
			this.isSet(oldTimer)
			&& $.isPlainObject(oldTimer)
			&& this.validate(oldTimer, ['id', 'type'])
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
	 * @param {Object|GUID} timer the timer to refresh/reset
	 * @param {Integer} ms time in milliseconds till execution
	 * @param {Function} callback callback function to execute after ms
	 * @return {Object|null} new timer or null in case of a param-error
	 **/
	reschedule : function(timer, ms, callback){
		if(
			$.isPlainObject(timer)
			&& this.validate(timer, ['id', 'type'])
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
	 * @param {Integer} ms time in milliseconds till execution
	 * @param {Function} callback callback function to execute after ms
	 * @param {Object|GUID} oldLoop OPTIONAL if set, kills the loop before setting up new one
	 * @return {Object|null} new loop or null in case of a param-error
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
	 * to prevent overlapping loops. This implementation uses Date.getTime() to
	 * improve on timer precision for long running loops. The loops of this method
	 * can also be used in countermand(). This method does not actually use intervals
	 * internally but timeouts, so don't wonder if you can't find the ids in JS.
	 *
	 * @param {Integer} ms time in milliseconds till execution
	 * @param {Function} callback callback function to execute after ms
	 * @param {Object|GUID} oldLoop OPTIONAL if set, kills the loop before setting up new one
	 * @return {Object|null} new loop or null in case of a param-error
	 **/
	ploop : function(ms, callback, oldLoop){
		if(
			this.isSet(oldLoop)
			&& $.isPlainObject(oldLoop)
			&& this.validate(oldLoop, ['id', 'type'])
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
	 * @param {Object|GUID} timer the timer or loop to end
	 * @param {Boolean} isInterval OPTIONAL defines if a timer or a loop is to be stopped, in case timer is a GUID
	 **/
	countermand : function(timer, isInterval){
		if( this.isSet(timer) ){
			if( $.isPlainObject(timer) && this.validate(timer, ['id', 'type']) ){
				if( timer.id == 'interval' ){
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
	 * @param {String} name name of the state or event you are waiting/polling for
	 * @param {Function} fCondition closure to define the state to wait for, returns true if state exists and false if not
	 * @param {Function} fAction closure to define action to take place if contition exists, poll removes itself if this evaluates to true e.g.
	 * @param {Integer} newLoopMs OPTIONAL new loop wait time in ms, resets global timer if useOwnTimer is not set, otherwise sets local timer for poll
	 * @param {Boolean} useOwnTimer OPTIONAL has to be set and true to tell the poll to use an independent local timer instead of the global one.
	 * @return {Object|null} new poll or null in case of param error
	 **/
	poll : function(name, fCondition, fAction, newLoopMs, useOwnTimer){
		name = $.trim(''+name);

		if( (name !== '') && $.isFunction(fCondition) && $.isFunction(fAction) ){
			var newPoll = {
				name : name,
				condition: fCondition,
				action : fAction,
				loop : null
			};

			if( this.isSet(useOwnTimer) && useOwnTimer ){
				newPoll.loop = this.loop(!this.isSet(newLoopMs) ? 250 : parseInt(newLoopMs, 10), function(){
					if( newPoll.condition() ){
						if( newPoll.action() ){
							this.countermand(newPoll.loop);
							newPoll.loop = null;
							delete this.jqueryAnnexData.polls.activePolls[newPoll.name];
							this.jqueryAnnexData.polls.activePollCount--;
						}
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
					if( this.jqueryAnnexData.polls.activePollCount > 0 ){
						$.each(this.jqueryAnnexData.polls.activePolls, function(name, poll){
							if( !$.isSet(poll.loop) && poll.condition() ){
								if( poll.action() ){
									delete $.jqueryAnnexData.polls.activePolls[name];
									$.jqueryAnnexData.polls.activePollCount--;
								}
							}
						});
					} else {
						this.countermand(this.jqueryAnnexData.polls.defaultLoop);
						this.jqueryAnnexData.polls.defaultLoop = null;
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
	 * @param {String} name name of the state or event you are waiting/polling for
	 * @return {Boolean} true if poll has been removed, false if nothing has changed
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
	 * Changes the current window-location.
	 *
	 * @param {String} url OPTIONAL the location to load, if null current location is reloaded
	 * @param {Object} params OPTIONAL parameters to add to the url
	 * @param {String} anchor OPTIONAL site anchor to set for called url, must be set via parameter, won't work reliably in URL only
	 * @param {Object} postParams OPTIONAL a dictionary of postParameters to send with the redirect, solved with a hidden form
	 * @param {String} target OPTIONAL name of the window to perform the redirect to/in
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
	 * Changes the current URL silently by manipulating the browser history.
	 * Be aware that this replaces the current URL in the history _without_ any further loads.
	 * This method only works if window.history is supported by the browser.
	 *
	 * @param {String} url an absolute or relative url to change the current address to
	 * @param {Object} state OPTIONAL a serializable object to supply to the popState-event
	 * @param {String} title OPTIONAL a name/title for the new state, not used in browsers atm
	 **/
	changeUrlSilently : function(url, state, title){
		if( !this.isSet(state) ){
			state = '';
		}

		if( !this.isSet(title) ){
			title = '';
		}

		if ( window.history && window.history.replaceState ) {
			window.history.replaceState(state, ''+title, ''+url);
		}
	},



	/**
	 * Reloads the current window-location. Differentiates between cached and cache-refreshing reload.
	 *
	 * @param {Boolean} quickLoad OPTIONAL defines if cache-data should be ignored
	 **/
	reload : function(quickLoad){
		window.location.reload(this.isSet(quickLoad) && quickLoad);
	},



	/**
	 * Opens a subwindow for the current window or another defined parent window.
	 *
	 * @param {String} url the URL to load into the new window
	 * @param {Object} options OPTIONAL parameters for the new window according to the definitions of window.open + name for the window name
	 * @param {Window} parentWindow OPTIONAL(default=window) parent window for the new window
	 * @param {Boolean} tryAsPopup OPTIONAL(default=false) defines if it should be tried to force a new window instead of a tab
	 * @return {Window} the newly opened window/tab
	 */
	openWindow : function(url, options, parentWindow, tryAsPopup){
		parentWindow = this.isSet(parentWindow) ? parentWindow : window;
		tryAsPopup = this.isSet(tryAsPopup) ? (tryAsPopup ? true : false) : false;

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
	 * @param {String} url the URL of the CSS-file to load
	 * @param {Object} options OPTIONAL config for the call (styletag : true/false, media : screen/print/all/etc., charset : utf-8/etc., id : {String})
	 * @param {Function} callback OPTIONAL function to call after css is loaded and included into DOM, gets included DOM-element as parameter
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
	 * @param {String} name name of the cookie
	 * @param {String} value OPTIONAL value-string of the cookie
	 * @param {Object} options OPTIONAL config-object for the cookie setting expiries etc.
	 * @return {void|String} either nothing, when setting a cookie, or the value of a requested cookie
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
	 * Converts a css-value to an integer without unit.
	 *
	 * @param {String} cssVal the css-value to convert
	 * @return {Integer} true integer representation of the given value
	 **/
	cssToInt : function(cssVal){
		return parseInt(cssVal.replace(/(px|em|%)$/, ''), 10);
	},



	/**
	 * Coverts a CSS-URL to a img-src-usable value.
	 *
	 * @param {String} cssUrl the URL from the css
	 * @param {String} relativePathPart OPTIONAL the relative path part of the URL from the css to cut for src-use
	 * @return {String} src value
	 */
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
	 * Preloads images by URL. Images can be preloaded by name and are thereby retrievable afterwards or anonymously.
	 *
	 * @param {String|Array|Object} images an URL, an array of URLS or a plain object containing named URLs. In case the string is a used name, the image-object is returned.
	 * @param {Function} callback OPTIONAL callback to call when all images have loaded, this also fires on already loaded images if inserted again
	 * @return {Image|Object} either returns a requested cached image or the currently added named/unnamed images as saved
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
	 * Validates an object by checking if all given members are present and are not empty.
	 *
	 * @param {Object} obj the object to check
	 * @param {Array} memberNames the names of the members to check
	 * @return {Boolean} true / false
	 **/
	validate : function(obj, memberNames){
		if( !this.isSet(obj) || !this.isA(obj, 'object') ){
			this.log('type exception: obj not an Object');
			return false;
		}

		if( !this.isSet(memberNames) || !this.isArray(memberNames) ){
			this.log('param exception: no valid memberNames');
			return false;
		}

		for( var i = 0; i < memberNames.length; i++ ){
			if( !this.isSet(obj[memberNames[i]]) ){
				this.log('validity exception: missing member '+memberNames[i]);
				return false;
			}
		}

		return true;
	},



	/**
	 * Tries to isolate a supposed (DB-)Id from a given String
	 *
	 * @param {String} baseString the string to isolate an id from
	 * @return {String|null} either the isolated id or null
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
	 * @param {String|Integer} testVal the value to test
	 * @param {String} prefix OPTIONAL(default='') a prefix for the id
	 * @param {String} postfix OPTIONAL(default='') a postfix for the id
	 * @param {Boolean} dontMaskFixes OPTIONAL(default=false) if you want to use regexs as fixes, set this true
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
	 * @param {String} string the string to mask for use in a selector
	 * @return {String} the masked string
	 **/
	maskForSelector : function(string){
		return string.replace(/([\#\;\&\,\.\+\*\~\'\:\"\!\^\$\[\]\(\)\=\>\ß\|\/\@])/, '\\$1');
	},



	/**
	 * Masks all regex special characters.
	 *
	 * @param {String} string the string to mask for use in a regexp
	 * @return {String} the masked string
	 **/
	maskForRegEx : function(string){
		return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	},



	/**
	 * Escapes a string for use in an elements htmlContent. This might
	 * come in handy if you need to combine insecure db-contents with dynamic markup.
	 *
	 * @param {String} html the html-ridden string to escape
	 * @return {String} the escaped string
	 **/
	escapeHTML : function(html){
		return this.elem('p').html(''+html).text();
	},



	/**
	 * Binds a callback to a cursor key, internally identified by keycode.
	 *
	 * @param {String} keyName the key to bind, one of up, down, left, right
	 * @param {Function} callback OPTIONAL callback to call of cursor key use, takes event e
	 * @param {String} eventType OPTIONAL the event type to use when binding, one of keypress, keydown, keyup, default is keydown
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
	 * @param {String} keyName the key to bind, one of up, down, left, right
	 * @param {String} eventType OPTIONAL the event type to use when binding, one of keypress, keydown, keyup, default is keydown
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
	 *
	 * @param {Boolean} inspectUserAgent defines if the user agent should be inspected additionally to identifying touch events
	 * @param {Array} additionalUserAgentIds list of string-ids to search for in the user agent additionally to the basic ones
	 * @param {Boolean} onlyConsiderUserAgent tells the algorithm to ignore feature checks and just go by the user-agent-ids
	 * @return {Boolean} true / false
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
	}

});



//--|JQUERY-OBJECT-GENERAL-FUNCTIONS----------

$.fn.extend({

	/**
	 * Returns the original object of a jQuery-enabled object.
	 *
	 * @return {Object|null} the original dom object or null in case of empty collection
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
	 * @return {Object} the target object
	 **/
	doselect : function(){
		if( $(this).is('option, :text, textarea') ){
			if( $(this).is(':text, textarea') ){
				$(this).each(function(){
					this.focus();
					this.select();
				});
			} else {
				$(this).attr('selected', 'selected');
			}
		}

		return this;
	},



	/**
	 * Removes a selection from an option or deselects the text in a text-field/textarea.
	 *
	 * @return {Object} the target object
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
			$(this).removeAttr('selected');
		}

		return this;
	},



	/**
	 * Checks a checkbox or radiobutton.
	 *
	 * @return {Object} the target object
	 **/
	check : function(){
		if( $(this).is(':checkbox, :radio') ){
			$(this).attr('checked', 'checked');
		}

		return this;
	},



	/**
	 * Removes a check from a checkbox or radiobutton.
	 *
	 * @return {Object} the target object
	 **/
	uncheck : function(){
		$(this).removeAttr('checked');

		return this;
	},



	/**
	 * Enables a form-element.
	 *
	 * @return {Object} the target object
	 **/
	enable : function(){
		$(this).removeAttr('disabled');

		return this;
	},



	/**
	 * Disables a form-element.
	 *
	 * @return {Object} the target object
	 **/
	disable : function(){
		if( $(this).is(':input') ){
			$(this).attr('disabled', 'disabled');
		}

		return this;
	},



	/**
	 * Creates the basic attributes for a DOM-element that define it's DOM- and CSS-identity.
	 * Namely id, class and style. An element may be used a source to inherit values from.
	 * If identity is inherited from another element html5-data-attributes are also transferred.
	 *
	 * @param {String} id OPTIONAL the html-id the element should have
	 * @param {String|Array} classes OPTIONAL the html-classes the element should have
	 * @param {String|Object} style OPTIONAL the html-style properties the element should have
	 * @param {Object} $inheritFrom OPTIONAL the element to inherit identity values from
	 * @return {Object} the target object
	 */
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
	 * @return {*} null in case the parameter doesn't exist, true in case it exists but has no value, a string in case the parameter has one value, or an array of strings
	 */
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
	 * @param {Boolean} withoutCaret OPTIONAL defines if anchor value should contain leading "#"
	 * @return {String|null} current anchor value or null if no anchor in url
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
	 * @return {Object} form-data-object {name:val, name:[val, val]}
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
	 * @return {Boolean}
	 **/
	isInDom : function(){
		return $(this).closest(document.documentElement).length > 0;
	},



	/**
	 * Returns if the current element is visible in the window's viewport at the moment.
	 * This method uses getBoundingClientRect(), which has to be supported by the browser, otherwise
	 * the method will always return true.
	 *
	 * @param {Boolean} mustBeFullyInside OPTIONAL defines if the element has to be fully enclosed in the viewport, default is false
	 * @return {Boolean}
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
	 * Replaces hidden-class with the jQuery-state hidden, which is a little different :D
	 *
	 * @return {Object} the target object
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
	 * @param {String} functionName name of the function to call on target
	 * @param {String} selector OPTIONAL selector to apply to element to find target
	 * @param {Object} context OPTIONAL context to use as container for measurement, normally body
	 * @return {*} result of function applied to target
	 */
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
	 * @param {Function} callback OPTIONAL callback to call when all images have been loaded
	 * @return {Object} the target object
	 */
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
	 * @param {Function} animationClosure closure in which all animation is included, takes the jQuery-Element as first parameter, needs to do something queue-building
	 * @param {Function} killAnimations OPTIONAL defines if all current animation should be immediately finished before proceeding
	 * @return {Object} the target object
	 */
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
	 * @param {Object} cssObj plain object of CSS-rules to apply, according to standard jQuery-standard
	 * @return {Object} the target object
	 */
	cssCrossBrowser : function(cssObj){
		if( $.isPlainObject(cssObj) ){
			$.each(cssObj, function(cssKey, cssValue){
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
	 * @return {Object} the target object
	 */
	disableSelection : function(){
		$(this).each(function(){
			this.onselectstart = function(){ return false; };
			this.unselectable = 'on';
			$(this).cssCrossBrowser({'user-select' : 'none'});
		});

		return this;
	},



	/**
	 * Register an event handler to open a mailto dialogue without openly writing
	 * down the mail address. Parameters mixed to complicate parsing.
	 *
	 * @param {String} tld the top level domain to use
	 * @param {String} beforeAt the address part before the @
	 * @param {String} afterAtWithoutTld the address part after the @ but before the tld
	 * @param {String} subject OPTIONAL the subject the mail should have
	 * @param {String} body OPTIONAL the body text the mail should have initially
	 * @param {Boolean} writeToElem OPTIONAL define if the email should be written back to the element text, default is false
	 * @param {String} eventType OPTIONAL the event type to register the call to, default is click
	 * @return {Object} the target object
	 */
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
	 * @param {Integer|String} regionPart the local part of the number after the country part e.g. +49(04)<-this 123 456
	 * @param {Integer|String} first half of the main number +4904 (123)<-this 456
	 * @param {Integer|String} countryPart the country identifactor with or without + this->(+49)04 123 456
	 * @param {Integer|String} secondTelPart second half of the main number +4904 123 (456)<-this
	 * @param {Boolean} writeToElem OPTIONAL define if the number should be written back to the element text, default is false
	 * @param {String} eventType OPTIONAL the event type to register the call to, default is click
	 * @return {Object} the target object
	 */
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
	 * @param {Boolean} ignoreChildren OPTIONAL defines if only the element itself should count and whether to ignore bubbling
	 * @return {Object} the target object
	 */
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
	 * @return {Object} the target object
	 */
	sandbox : function(){
		$(this).append($.elem('div', {'id' : 'sandbox', 'style' : 'position:absolute; visibility:hidden; display:block;'}));

		return this;
	},



	/**
	 * Removes the sandbox from given context.
	 *
	 * @return {Object} the target object
	 */
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