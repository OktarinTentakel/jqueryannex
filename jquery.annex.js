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
 * @version 0.75 alpha
 **/



//--|JQUERY-$-GENERAL-FUNCTIONS----------

$.extend({

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
				attrString += ' '+attribute+'="'+attributes[attribute]+'"'
			}
		}
	
		if( this.isSet(content) ){
			return $('<'+tag+(this.isSet(attrString) ? attrString : '')+'>'+content+'</'+tag+'>');
		} else {
			return $('<'+tag+(this.isSet(attrString) ? attrString : '')+'/>');
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
	 * Check if variable is set at all.
	 * 
	 * @param {*} target variable to check
	 * @return {Boolean} true / false
	 **/
	isSet : function(target){
		return ((target !== undefined) && (target !== null));
	},
	
	
	
	/**
	 * Check if a variable is defined in a certain context (normally globally in window).
	 *
	 * @param {String} varName name of the variable to look for, not the variable itself
	 * @param {*} context OPTIONAL the context in which to look for the variable, window by default
	 * @return {Boolean} true / false
	 */
	exists : function(varName, context){
		if( !this.isSet(context) ){
			context = window;
		}
		
		return (undefined !== context[''+varName]);
	},
	
	
	
	/**
	 * Short form of the standard "type"-method with a more compact syntax.
	 * Can identify "boolean", "number", "string", "function", "array", "date", "regexp" and "object".
	 * 
	 * @param {*} target variable to check the type of
	 * @param {String} typeName the name of the type to check for, has to be a standard JS-type
	 * @return {Boolean} true / false
	 * @throws type-identification exception
	 **/
	isA : function(target, typeName){
		if( $.inArray(typeName, ['boolean', 'number', 'string', 'function', 'array', 'date', 'regexp', 'object']) ){
			return $.type(target) == ''+typeName;
		} else {
			throw 'type-identification exception: not asked for valid JS-type';
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
	 * Alias for schedule() with more natural param-order for rescheduling.
	 * 
	 * @param {Object|GUID} timer the timer to refresh/reset
	 * @param {Integer} ms time in milliseconds till execution
	 * @param {Function} callback callback function to execute after ms
	 * @return {Object|null} new timer or null in case of a param-error
	 **/
	reschedule : function(timer, ms, callback){
		return this.schedule(ms, callback, timer);
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
	 * Changes the current window-location.
	 * 
	 * @param {String} url OPTIONAL the location to load, if null current location is reloaded
	 * @param {Object} params OPTIONAL parameters to add to the url
	 * @param {String} anchor OPTIONAL site anchor to set for called url, must be set via parameter, won't work reliably in URL only
	 **/
	redirect : function(url, params, anchor){
		var reload = !this.isSet(url); 
		if( !this.isSet(url) ){
			url = window.location.href;
		}
		
		if( this.isSet(this.urlAnchor()) ){
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
			anchor = reload ? this.urlAnchor(true) : null;
		}
		
		window.location.href = url+((paramString.length > 0) ? paramString : '')+(this.isSet(anchor) ? '#'+anchor : '');
	},
	
	
	
	/**
	 * Reloads the current window-location. Differentiates between cached and cache-refreshing reload.
	 * 
	 * @param {Boolean} quickLoad OPTIONAL defines if cache-data should be ignored
	 **/
	reload : function(quickLoad){
		window.location.reload(this.isSet(quickload) && quickload);
	},
	
	
	
	/**
	 * Opens a subwindow for the current window or another defined parent window.
	 * 
	 * @param {String} url the URL to load into the new window
	 * @param {Object} options OPTIONAL parameters for the new window according to the definitions of window.open + name for the window name
	 * @param {Window} parentWindow OPTIONAL parent window for the new window
	 * @return {Window} the newly opened window
	 */
	openWindow : function(url, options, parentWindow){
		if( !this.isSet(parentWindow) ){
			parentWindow = window;
		}
		
		var windowName = '';
		var optionArray = [];
		
		if( this.isSet(options) ){
			if( this.isSet(options.name) ){
				windowName = ''+options.name;
			}
			
			for( prop in options ){
				optionArray.push(prop+'='+options[prop]);
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
		    	if( that.isSet(callback) ){
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
			    
			    if( that.isSet(callback) ){
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
				
				if( that.isSet(callback) ){
					callback($res);
				}
			}
		});
	},
	
	
	
	/**
	 * Returns the currently set URL-Anchor.
	 * 
	 * @param {Boolean} withoutCaret OPTIONAL defines if anchor value should contain leading "#"
	 * @return {String|null} current anchor value or null if no anchor in url
	 **/
	urlAnchor : function(withoutCaret){
		var anchor = '';
		
		if( this.isSet(withoutCaret) && withoutCaret ){
			anchor = window.location.hash.replace('#', '');
		} else {
			anchor = window.location.hash;
		}
		
		return (anchor != '') ? anchor : null;
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
	        if( document.cookie && document.cookie != '' ){
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
		return parseInt(cssVal.replace(/(px|em|%)$/, ''));
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
	 * Basic reimplementation and extension on jQuery's own proxy.
	 * Accepts any number of parameters for the closure, lacks the higher
	 * reverse functionality of proxy()
	 * 
	 * @param {Function} func function to call in the closure function
	 * @param {*} context context to call func in
	 * @param {*} .. OPTIONAL add any number of arguments you wish to add to the closure call of func
	 * @return {Function} constructed closure function
	 **/
	argproxy : function(func, context){
		var args = Array.prototype.slice.call(arguments, 2);
		
		return function(){
			func.apply(context, args);
		};
	},
	
	
	
	/**
	 * Validates an object by checking if all given members are present and are not empty.
	 * 
	 * @param {Object} obj the object to check
	 * @param {Array} memberNames the names of the members to check
	 * @return {Boolean} true / false
	 * @throws type exception / param exception / validity exception
	 **/
	validate : function(obj, memberNames){
		if( !this.isSet(obj) || !this.isA(obj, 'object') ){
			throw 'type exception: obj not an Object';
			return false;
		}
		
		if( !this.isSet(memberNames) || !$.isArray(memberNames) ){
			throw 'param exception: no valid memberNames';
			return false;
		}
		
		for( var i = 0; i < memberNames.length; i++ ){
			if( !this.isSet(obj[memberNames[i]]) ){
				throw 'validity exception: missing member '+memberNames[i];
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
	 * @throws id-isolation exception
	 **/
	isolateId : function(baseString){
		var occurrences = String(baseString).match(/[0-9]+/);
		
		if( this.isSet(occurrences) && occurrences.length > 0 ){
			return occurrences[0];
		} else {
			throw 'id-isolation exception: no valid id in string';
			return null;
		}
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
	 * Removes all textselections from the current frame if possible.
	 **/
	removeSelection : function(){
		if( window.getSelection ){
			window.getSelection().removeAllRanges();
		}else if( document.getSelection ){
			document.getSelection().removeAllRanges();
		}
	}
	
});



//--|JQUERY-OBJECT-GENERAL-FUNCTIONS----------

/**
 * Sets an option selected or selects the text in a text-field/textarea.
 * 
 * @return {Object} the target object
 **/
$.fn.doselect = function(){
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
	
	return $(this);
};



/**
 * Removes a selection from an option or deselects the text in a text-field/textarea.
 * 
 * @return {Object} the target object
 **/
$.fn.deselect = function(){
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
	
	return $(this);
};



/**
 * Checks a checkbox or radiobutton.
 * 
 * @return {Object} the target object
 **/
$.fn.check = function(){
	if( $(this).is(':checkbox, :radio') ){
		$(this).attr('checked', 'checked');
	}
	
	return $(this);
};



/**
 * Removes a check from a checkbox or radiobutton.
 * 
 * @return {Object} the target object
 **/
$.fn.uncheck = function(){
	$(this).removeAttr('checked');
	
	return $(this);
};



/**
 * Enables a form-element.
 * 
 * @return {Object} the target object
 **/
$.fn.enable = function(){
	$(this).removeAttr('disabled');
	
	return $(this);
};



/**
 * Disables a form-element.
 * 
 * @return {Object} the target object
 **/
$.fn.disable = function(){
	if( $(this).is(':input') ){
		$(this).attr('disabled', 'disabled');
	}
	
	return $(this);
};



/**
 * Adds a css-class to an element, but only when not already present.
 * 
 * @param {String} uClass the css-class to add
 * @return {Object} the target object
 **/
$.fn.addClassUnique = function(uClass){
	if( !$(this).hasClass(''+uClass) ){
		$(this).addClass(''+uClass);
	}
	
	return $(this);
};



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
$.fn.setElementIdentity = function(id, classes, style, $inheritFrom){
	var that = this;
	var copyAttrs = ['id', 'class', 'style'];
	
	if( $.isSet($inheritFrom) && $.isA($inheritFrom, 'object') ){			
		$.each($inheritFrom[0].attributes, function(index, attribute){
			if( attribute.specified ){
				if( $.inArray(attribute.name, copyAttrs) != -1 ){
					$(that).attr(attribute.name, attribute.value);
				} else if( attribute.name.indexOf('data-') == 0 ){
					$(that)
						.attr(attribute.name, attribute.value)
						.data($.strReplace('data-', '', attribute.name), attribute.value)
					;
				}
			}
		});
	}

	if( $.isSet(id) ){
		$(this).attr('id', ''+id);
	}
	
	if( $.isSet(classes) ){
		if( $.isArray(classes) ){
			$.each(classes, function(index, value){
				$(that).addClassUnique(value);
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
	
	return $(this);
};



/**
 * Parses form-element-values inside the target-object into a simple object.
 * Basically an extension of jQuery's own serializeArray() with the difference that
 * this function can handle form-arrays, which are returned under their name without bracket
 * as an actual JS-Array.
 * 
 * @return {Object} form-data-object {name:val, name:[val, val]}
 **/
$.fn.formDataToObject = function(){
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
};



/**
 * Replaces hidden-class with the jQuery-state hidden, which is a little different :D
 * 
 * @return {Object} the target object
 **/
$.fn.rehide = function(){
	$(this).each(function(){
		if( $(this).hasClass('hidden') ){
			$(this).removeClass('hidden').hide();
		}
	});
	
	return $(this);
};



/**
 * Measures hidden elements by using a sandbox div.
 *
 * @param {String} functionName name of the function to call on target
 * @param {String} selector OPTIONAL selector to apply to element to find target
 * @param {Object} context OPTIONAL context to use as container for measurement, normally body
 * @return {*} result of function applied to target
 */
$.fn.measureHidden = function(functionName, selector, $context){
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
};



/**
 * Fixes cross-browser problems with image-loads and fires the event even in case the image is already loaded.
 * 
 * @return {Object} the target object
 */
$.fn.imgLoad = function(callback){
	var targets = this.filter('img');
	var targetCount = targets.length;

	targets.load(function(){
		if (--targetCount <= 0){
			callback.call(targets, this);
		}
	}).each(function(){
		if( this.complete || this.complete === undefined ){
			var src = this.src;
			this.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
			this.src = src;
		}
	});

	return this;
};



/**
 * Disables selectability as far as possible for elements.
 *
 * @return {Object} the target object
 */
$.fn.disableSelection = function(){ 
	$(this).each(function(){
		this.onselectstart = function(){ return false; }; 
		this.unselectable = 'on'; 
		$(this).css({
			'user-select' : 'none',
			'-o-user-select' : 'none',
			'-moz-user-select' : 'none',
			'-khtml-user-select' : 'none',
			'-webkit-user-select' : 'none'
		}); 
	}); 
	
	return $(this);
};



/**
 * Create a Popup-Message in a Box-Element.
 * 
 * @param {String} message the message to display in the overlay
 * @param {String} style OPTIONAL additional element-style for the message-text
 * @param {String|Integer} animationDuration OPTIONAL time for fade-in-animation in ms
 * @param {Boolean} unclosable OPTIONAL makes message manually unclosable if set to true
 * @return {Object} the target object
 **/
$.fn.boxMessage = function(message, style, animationDuration, unclosable){
	var msgContainer = null;
	if( $(this).children('div.boxmessage').length > 0 ){
		msgContainer = $(this).children('div.boxmessage:first');
	} else {
		msgContainer = this.elem('div', {'class' : 'boxmessage'})
			.append(this.elem('div', {'class' : 'boxmessagebg'}))
			.append(this.elem('div', {'class' : 'boxmessagetextcontainer'}))
			.children('.boxmessagetextcontainer')
				.append(this.elem('div', {'class' : 'boxmessagetext'}))
			.end()
		;
		msgContainer.hide();
		
		$(this).append(msgContainer);
		
		msgContainer.click(function(){ $(this).fadeOut(); });
	}
	
	if( !this.isSet(style) ){
		msgContainer.find('.boxmessagetext:first').attr('style', ''+style);
	}
	
	if( this.isSet(unclosable) ){
		msgContainer.off('click');
		msgContainer.css('cursor', 'default');
	}
	
	msgContainer.find('.boxmessagetext:first').html(''+message);
	msgContainer.fadeIn(this.isSet(animationDuration) ? animationDuration : 400);
	
	return $(this);
};



/**
 * Removes a boxmessage completely from a container-element.
 * 
 * @param {String|Integer} animationDuration OPTIONAL time for fade-in-animation in ms
 * @return {Object} the target object
 **/
$.fn.removeBoxMessage = function(animationDuration){
	$(this).children('div.boxmessage').fadeOut(
		this.isSet(animationDuration) ? animationDuration : 400,
		function(){ $(this).remove(); }
	);
	
	return $(this);
};



/**
 * Creates a neutral, invisible sandbox in the given context, to mess around with.
 *
 * @return {Object} the target object
 */
$.fn.sandbox = function(){
	$(this).append($.elem('div', {'id' : 'sandbox', 'style' : 'position:absolute; visibility:hidden; display:block;'}));
	
	return $(this);
};



/**
 * Removes the sandbox from given context.
 *
 * @return {Object} the target object
 */
$.fn.removeSandbox = function(){
	$(this).find('#sandbox').remove();
	
	return $(this);
};



//--|JQUERY-SYNTAX-EXTENSIONS----------

$.extend($.expr[':'], {
	focus: function(element) { 
		return element == document.activeElement; 
	}
});
