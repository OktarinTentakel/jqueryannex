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
 * @author Sebastian Schlapkohl <jqueryannex@ifschleife.de>
 * @version Revision 21 developed and tested with jQuery 1.11.3
 **/



/**
 * This version needs real world testing! Consider the current state being alpha.
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
			originalLoggingFunction : ((window.console !== undefined) && $.isFunction(console.log)) ? console.log : $.noop,
			enabled : true,
			xlog : {}
		},
		inheritance : {
			initializing : false,
			fnTest : /xyz/.test(function(){ return 'xyz'; }) ? /\b_super\b/ : /.*/
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
		},
		highDpiBackgroundImages : {
			targetClosures : [],
			checkTimer : {id : window.setTimeout($.noop, 1), type : 'timeout'}
		},
		slugify : {
			latinMap : {'Á':'A','Ă':'A','Ắ':'A','Ặ':'A','Ằ':'A','Ẳ':'A','Ẵ':'A','Ǎ':'A','Â':'A','Ấ':'A','Ậ':'A','Ầ':'A','Ẩ':'A','Ẫ':'A','Ä':'A','Ǟ':'A','Ȧ':'A','Ǡ':'A','Ạ':'A','Ȁ':'A','À':'A','Ả':'A','Ȃ':'A','Ā':'A','Ą':'A','Å':'A','Ǻ':'A','Ḁ':'A','Ⱥ':'A','Ã':'A','Ꜳ':'AA','Æ':'AE','Ǽ':'AE','Ǣ':'AE','Ꜵ':'AO','Ꜷ':'AU','Ꜹ':'AV','Ꜻ':'AV','Ꜽ':'AY','Ḃ':'B','Ḅ':'B','Ɓ':'B','Ḇ':'B','Ƀ':'B','Ƃ':'B','Ć':'C','Č':'C','Ç':'C','Ḉ':'C','Ĉ':'C','Ċ':'C','Ƈ':'C','Ȼ':'C','Ď':'D','Ḑ':'D','Ḓ':'D','Ḋ':'D','Ḍ':'D','Ɗ':'D','Ḏ':'D','ǲ':'D','ǅ':'D','Đ':'D','Ƌ':'D','Ǳ':'DZ','Ǆ':'DZ','É':'E','Ĕ':'E','Ě':'E','Ȩ':'E','Ḝ':'E','Ê':'E','Ế':'E','Ệ':'E','Ề':'E','Ể':'E','Ễ':'E','Ḙ':'E','Ë':'E','Ė':'E','Ẹ':'E','Ȅ':'E','È':'E','Ẻ':'E','Ȇ':'E','Ē':'E','Ḗ':'E','Ḕ':'E','Ę':'E','Ɇ':'E','Ẽ':'E','Ḛ':'E','Ꝫ':'ET','Ḟ':'F','Ƒ':'F','Ǵ':'G','Ğ':'G','Ǧ':'G','Ģ':'G','Ĝ':'G','Ġ':'G','Ɠ':'G','Ḡ':'G','Ǥ':'G','Ḫ':'H','Ȟ':'H','Ḩ':'H','Ĥ':'H','Ⱨ':'H','Ḧ':'H','Ḣ':'H','Ḥ':'H','Ħ':'H','Í':'I','Ĭ':'I','Ǐ':'I','Î':'I','Ï':'I','Ḯ':'I','İ':'I','Ị':'I','Ȉ':'I','Ì':'I','Ỉ':'I','Ȋ':'I','Ī':'I','Į':'I','Ɨ':'I','Ĩ':'I','Ḭ':'I','Ꝺ':'D','Ꝼ':'F','Ᵹ':'G','Ꞃ':'R','Ꞅ':'S','Ꞇ':'T','Ꝭ':'IS','Ĵ':'J','Ɉ':'J','Ḱ':'K','Ǩ':'K','Ķ':'K','Ⱪ':'K','Ꝃ':'K','Ḳ':'K','Ƙ':'K','Ḵ':'K','Ꝁ':'K','Ꝅ':'K','Ĺ':'L','Ƚ':'L','Ľ':'L','Ļ':'L','Ḽ':'L','Ḷ':'L','Ḹ':'L','Ⱡ':'L','Ꝉ':'L','Ḻ':'L','Ŀ':'L','Ɫ':'L','ǈ':'L','Ł':'L','Ǉ':'LJ','Ḿ':'M','Ṁ':'M','Ṃ':'M','Ɱ':'M','Ń':'N','Ň':'N','Ņ':'N','Ṋ':'N','Ṅ':'N','Ṇ':'N','Ǹ':'N','Ɲ':'N','Ṉ':'N','Ƞ':'N','ǋ':'N','Ñ':'N','Ǌ':'NJ','Ó':'O','Ŏ':'O','Ǒ':'O','Ô':'O','Ố':'O','Ộ':'O','Ồ':'O','Ổ':'O','Ỗ':'O','Ö':'O','Ȫ':'O','Ȯ':'O','Ȱ':'O','Ọ':'O','Ő':'O','Ȍ':'O','Ò':'O','Ỏ':'O','Ơ':'O','Ớ':'O','Ợ':'O','Ờ':'O','Ở':'O','Ỡ':'O','Ȏ':'O','Ꝋ':'O','Ꝍ':'O','Ō':'O','Ṓ':'O','Ṑ':'O','Ɵ':'O','Ǫ':'O','Ǭ':'O','Ø':'O','Ǿ':'O','Õ':'O','Ṍ':'O','Ṏ':'O','Ȭ':'O','Ƣ':'OI','Ꝏ':'OO','Ɛ':'E','Ɔ':'O','Ȣ':'OU','Ṕ':'P','Ṗ':'P','Ꝓ':'P','Ƥ':'P','Ꝕ':'P','Ᵽ':'P','Ꝑ':'P','Ꝙ':'Q','Ꝗ':'Q','Ŕ':'R','Ř':'R','Ŗ':'R','Ṙ':'R','Ṛ':'R','Ṝ':'R','Ȑ':'R','Ȓ':'R','Ṟ':'R','Ɍ':'R','Ɽ':'R','Ꜿ':'C','Ǝ':'E','Ś':'S','Ṥ':'S','Š':'S','Ṧ':'S','Ş':'S','Ŝ':'S','Ș':'S','Ṡ':'S','Ṣ':'S','Ṩ':'S','ẞ':'SS','Ť':'T','Ţ':'T','Ṱ':'T','Ț':'T','Ⱦ':'T','Ṫ':'T','Ṭ':'T','Ƭ':'T','Ṯ':'T','Ʈ':'T','Ŧ':'T','Ɐ':'A','Ꞁ':'L','Ɯ':'M','Ʌ':'V','Ꜩ':'TZ','Ú':'U','Ŭ':'U','Ǔ':'U','Û':'U','Ṷ':'U','Ü':'U','Ǘ':'U','Ǚ':'U','Ǜ':'U','Ǖ':'U','Ṳ':'U','Ụ':'U','Ű':'U','Ȕ':'U','Ù':'U','Ủ':'U','Ư':'U','Ứ':'U','Ự':'U','Ừ':'U','Ử':'U','Ữ':'U','Ȗ':'U','Ū':'U','Ṻ':'U','Ų':'U','Ů':'U','Ũ':'U','Ṹ':'U','Ṵ':'U','Ꝟ':'V','Ṿ':'V','Ʋ':'V','Ṽ':'V','Ꝡ':'VY','Ẃ':'W','Ŵ':'W','Ẅ':'W','Ẇ':'W','Ẉ':'W','Ẁ':'W','Ⱳ':'W','Ẍ':'X','Ẋ':'X','Ý':'Y','Ŷ':'Y','Ÿ':'Y','Ẏ':'Y','Ỵ':'Y','Ỳ':'Y','Ƴ':'Y','Ỷ':'Y','Ỿ':'Y','Ȳ':'Y','Ɏ':'Y','Ỹ':'Y','Ź':'Z','Ž':'Z','Ẑ':'Z','Ⱬ':'Z','Ż':'Z','Ẓ':'Z','Ȥ':'Z','Ẕ':'Z','Ƶ':'Z','Ĳ':'IJ','Œ':'OE','ᴀ':'A','ᴁ':'AE','ʙ':'B','ᴃ':'B','ᴄ':'C','ᴅ':'D','ᴇ':'E','ꜰ':'F','ɢ':'G','ʛ':'G','ʜ':'H','ɪ':'I','ʁ':'R','ᴊ':'J','ᴋ':'K','ʟ':'L','ᴌ':'L','ᴍ':'M','ɴ':'N','ᴏ':'O','ɶ':'OE','ᴐ':'O','ᴕ':'OU','ᴘ':'P','ʀ':'R','ᴎ':'N','ᴙ':'R','ꜱ':'S','ᴛ':'T','ⱻ':'E','ᴚ':'R','ᴜ':'U','ᴠ':'V','ᴡ':'W','ʏ':'Y','ᴢ':'Z','á':'a','ă':'a','ắ':'a','ặ':'a','ằ':'a','ẳ':'a','ẵ':'a','ǎ':'a','â':'a','ấ':'a','ậ':'a','ầ':'a','ẩ':'a','ẫ':'a','ä':'a','ǟ':'a','ȧ':'a','ǡ':'a','ạ':'a','ȁ':'a','à':'a','ả':'a','ȃ':'a','ā':'a','ą':'a','ᶏ':'a','ẚ':'a','å':'a','ǻ':'a','ḁ':'a','ⱥ':'a','ã':'a','ꜳ':'aa','æ':'ae','ǽ':'ae','ǣ':'ae','ꜵ':'ao','ꜷ':'au','ꜹ':'av','ꜻ':'av','ꜽ':'ay','ḃ':'b','ḅ':'b','ɓ':'b','ḇ':'b','ᵬ':'b','ᶀ':'b','ƀ':'b','ƃ':'b','ɵ':'o','ć':'c','č':'c','ç':'c','ḉ':'c','ĉ':'c','ɕ':'c','ċ':'c','ƈ':'c','ȼ':'c','ď':'d','ḑ':'d','ḓ':'d','ȡ':'d','ḋ':'d','ḍ':'d','ɗ':'d','ᶑ':'d','ḏ':'d','ᵭ':'d','ᶁ':'d','đ':'d','ɖ':'d','ƌ':'d','ı':'i','ȷ':'j','ɟ':'j','ʄ':'j','ǳ':'dz','ǆ':'dz','é':'e','ĕ':'e','ě':'e','ȩ':'e','ḝ':'e','ê':'e','ế':'e','ệ':'e','ề':'e','ể':'e','ễ':'e','ḙ':'e','ë':'e','ė':'e','ẹ':'e','ȅ':'e','è':'e','ẻ':'e','ȇ':'e','ē':'e','ḗ':'e','ḕ':'e','ⱸ':'e','ę':'e','ᶒ':'e','ɇ':'e','ẽ':'e','ḛ':'e','ꝫ':'et','ḟ':'f','ƒ':'f','ᵮ':'f','ᶂ':'f','ǵ':'g','ğ':'g','ǧ':'g','ģ':'g','ĝ':'g','ġ':'g','ɠ':'g','ḡ':'g','ᶃ':'g','ǥ':'g','ḫ':'h','ȟ':'h','ḩ':'h','ĥ':'h','ⱨ':'h','ḧ':'h','ḣ':'h','ḥ':'h','ɦ':'h','ẖ':'h','ħ':'h','ƕ':'hv','í':'i','ĭ':'i','ǐ':'i','î':'i','ï':'i','ḯ':'i','ị':'i','ȉ':'i','ì':'i','ỉ':'i','ȋ':'i','ī':'i','į':'i','ᶖ':'i','ɨ':'i','ĩ':'i','ḭ':'i','ꝺ':'d','ꝼ':'f','ᵹ':'g','ꞃ':'r','ꞅ':'s','ꞇ':'t','ꝭ':'is','ǰ':'j','ĵ':'j','ʝ':'j','ɉ':'j','ḱ':'k','ǩ':'k','ķ':'k','ⱪ':'k','ꝃ':'k','ḳ':'k','ƙ':'k','ḵ':'k','ᶄ':'k','ꝁ':'k','ꝅ':'k','ĺ':'l','ƚ':'l','ɬ':'l','ľ':'l','ļ':'l','ḽ':'l','ȴ':'l','ḷ':'l','ḹ':'l','ⱡ':'l','ꝉ':'l','ḻ':'l','ŀ':'l','ɫ':'l','ᶅ':'l','ɭ':'l','ł':'l','ǉ':'lj','ſ':'s','ẜ':'s','ẛ':'s','ẝ':'s','ḿ':'m','ṁ':'m','ṃ':'m','ɱ':'m','ᵯ':'m','ᶆ':'m','ń':'n','ň':'n','ņ':'n','ṋ':'n','ȵ':'n','ṅ':'n','ṇ':'n','ǹ':'n','ɲ':'n','ṉ':'n','ƞ':'n','ᵰ':'n','ᶇ':'n','ɳ':'n','ñ':'n','ǌ':'nj','ó':'o','ŏ':'o','ǒ':'o','ô':'o','ố':'o','ộ':'o','ồ':'o','ổ':'o','ỗ':'o','ö':'o','ȫ':'o','ȯ':'o','ȱ':'o','ọ':'o','ő':'o','ȍ':'o','ò':'o','ỏ':'o','ơ':'o','ớ':'o','ợ':'o','ờ':'o','ở':'o','ỡ':'o','ȏ':'o','ꝋ':'o','ꝍ':'o','ⱺ':'o','ō':'o','ṓ':'o','ṑ':'o','ǫ':'o','ǭ':'o','ø':'o','ǿ':'o','õ':'o','ṍ':'o','ṏ':'o','ȭ':'o','ƣ':'oi','ꝏ':'oo','ɛ':'e','ᶓ':'e','ɔ':'o','ᶗ':'o','ȣ':'ou','ṕ':'p','ṗ':'p','ꝓ':'p','ƥ':'p','ᵱ':'p','ᶈ':'p','ꝕ':'p','ᵽ':'p','ꝑ':'p','ꝙ':'q','ʠ':'q','ɋ':'q','ꝗ':'q','ŕ':'r','ř':'r','ŗ':'r','ṙ':'r','ṛ':'r','ṝ':'r','ȑ':'r','ɾ':'r','ᵳ':'r','ȓ':'r','ṟ':'r','ɼ':'r','ᵲ':'r','ᶉ':'r','ɍ':'r','ɽ':'r','ↄ':'c','ꜿ':'c','ɘ':'e','ɿ':'r','ś':'s','ṥ':'s','š':'s','ṧ':'s','ş':'s','ŝ':'s','ș':'s','ṡ':'s','ṣ':'s','ṩ':'s','ʂ':'s','ᵴ':'s','ᶊ':'s','ȿ':'s','ɡ':'g','ß':'ss','ᴑ':'o','ᴓ':'o','ᴝ':'u','ť':'t','ţ':'t','ṱ':'t','ț':'t','ȶ':'t','ẗ':'t','ⱦ':'t','ṫ':'t','ṭ':'t','ƭ':'t','ṯ':'t','ᵵ':'t','ƫ':'t','ʈ':'t','ŧ':'t','ᵺ':'th','ɐ':'a','ᴂ':'ae','ǝ':'e','ᵷ':'g','ɥ':'h','ʮ':'h','ʯ':'h','ᴉ':'i','ʞ':'k','ꞁ':'l','ɯ':'m','ɰ':'m','ᴔ':'oe','ɹ':'r','ɻ':'r','ɺ':'r','ⱹ':'r','ʇ':'t','ʌ':'v','ʍ':'w','ʎ':'y','ꜩ':'tz','ú':'u','ŭ':'u','ǔ':'u','û':'u','ṷ':'u','ü':'u','ǘ':'u','ǚ':'u','ǜ':'u','ǖ':'u','ṳ':'u','ụ':'u','ű':'u','ȕ':'u','ù':'u','ủ':'u','ư':'u','ứ':'u','ự':'u','ừ':'u','ử':'u','ữ':'u','ȗ':'u','ū':'u','ṻ':'u','ų':'u','ᶙ':'u','ů':'u','ũ':'u','ṹ':'u','ṵ':'u','ᵫ':'ue','ꝸ':'um','ⱴ':'v','ꝟ':'v','ṿ':'v','ʋ':'v','ᶌ':'v','ⱱ':'v','ṽ':'v','ꝡ':'vy','ẃ':'w','ŵ':'w','ẅ':'w','ẇ':'w','ẉ':'w','ẁ':'w','ⱳ':'w','ẘ':'w','ẍ':'x','ẋ':'x','ᶍ':'x','ý':'y','ŷ':'y','ÿ':'y','ẏ':'y','ỵ':'y','ỳ':'y','ƴ':'y','ỷ':'y','ỿ':'y','ȳ':'y','ẙ':'y','ɏ':'y','ỹ':'y','ź':'z','ž':'z','ẑ':'z','ʑ':'z','ⱬ':'z','ż':'z','ẓ':'z','ȥ':'z','ẕ':'z','ᵶ':'z','ᶎ':'z','ʐ':'z','ƶ':'z','ɀ':'z','ﬀ':'ff','ﬃ':'ffi','ﬄ':'ffl','ﬁ':'fi','ﬂ':'fl','ĳ':'ij','œ':'oe','ﬆ':'st','ₐ':'a','ₑ':'e','ᵢ':'i','ⱼ':'j','ₒ':'o','ᵣ':'r','ᵤ':'u','ᵥ':'v','ₓ':'x'}
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
	 * Simple Base function for inheritance-capable JS-objects.
	 * Adapted from: Simple JavaScript Inheritance By John Resig http://ejohn.org/ MIT Licensed. Inspired by base2 and Prototype.
	 *
	 * To create an object from which you may further inherit, instantiate an object by extending $.Class.
	 *
	 * var SuperPoweredFoobar = $.Class.extend({
	 *     init : function(){}
	 * });
	 *
	 * After this you can create a new SuperPoweredFoobar by simply instantiating
	 *
	 * var foobar1 = new SuperPoweredFoobar();
	 *
	 * .init() is the default constructor and will automatically be called with the given parameters.
	 *
	 * Inherit from SuperPoweredFoobar by using SuperPoweredFoobar.extend() the same way.
	 *
	 * Use _super to reference the parent class or call the parent constructor via this._super();
	 **/
	Class : function(){
		// see INITIALIZATIONS below for extend() source
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
			message = this.orDefault(message, 'assert exception: assertion failed', 'string');
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
	 * @param {?(String|Function)} caster - either a default caster by name ('string', 'String', 'int', 'integer', 'Integer', 'bool', 'boolean', 'Boolean', 'float', 'Float', 'array', 'Array') or a function getting the value and returning the transformed value
	 * @param {?Array} [additionalEmptyValues] - if set, provides a list of additional values to be considered empty, apart from undefined and null
	 * @returns {*} expression of defaultValue
	 **/
	orDefault : function(expression, defaultValue, caster, additionalEmptyValues){
		additionalEmptyValues = $.isArray(additionalEmptyValues) ? additionalEmptyValues : [additionalEmptyValues];

		if( $.isSet(caster) ){
			if(
				!$.isFunction(caster)
				&& ($.inArray(caster, [
					'string', 'String',
					'int', 'integer', 'Integer',
					'bool', 'boolean', 'Boolean',
					'float', 'Float',
					'array', 'Array'
				]) >= 0)
			){
				if( $.inArray(caster, ['string', 'String']) >= 0 ){
					caster = function(value){ return ''+value; };
				} else if( $.inArray(caster, ['int', 'integer', 'Integer']) >= 0 ){
					caster = function(value){ return parseInt(value, 10); };
				} else if( $.inArray(caster, ['bool', 'boolean', 'Boolean']) >= 0 ){
					caster = function(value){ return !!value; };
				} else if( $.inArray(caster, ['float', 'Float']) >= 0 ){
					caster = function(value){ return parseFloat(value); };
				} else if( $.inArray(caster, ['array', 'Array']) >= 0 ){
					caster = function(value){ return !$.isArray(value) ? [value] : value; };
				}
			} else if( !$.isFunction(caster) ){
				caster = function(value){ return value; };
			}
		} else {
			caster = function(value){ return value; };
		}

		if( !this.isSet(expression) || ($.inArray(expression, additionalEmptyValues) >= 0) ){
			return defaultValue;
		} else {
			return caster(expression);
		}
	},



	/**
	 * Check if a variable is defined in a certain context (normally globally in window).
	 * Or check if a jquery set contains anything based on its selector,
	 * answering if the query-string exists in its context.
	 *
	 * @param {(String|Object)} target - name of the variable to look for (not the variable itself) or a jquery Object
	 * @param {?*} [context=window] - the context in which to look for the variable, holds no meaning for jquery objects
	 * @returns {Boolean} variable exists in context or jQuery-set has length > 0
	 **/
	exists : function(target, context){
		var _this_ = this,
			res = true;

		if( this.isA(target, 'object') && this.isSet(target.jquery) ){
			return target.length > 0;
		} else {
			target = ''+target;

			if( !this.isSet(context) ){
				context = window;
			}

			var targetChain = target.split('.');
			$.each(targetChain, function(index, value){
				if( index < (targetChain.length - 1) ){
					res = res && _this_.isSet(context[''+value]);
					if( res ){
						context = context[''+value];
					} else {
						return false;
					}
				} else {
					res = res && (undefined !== context[''+value]);
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
		checkForIdentity = this.orDefault(checkForIdentity, true, 'bool');

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
	 * @param {?String} [glue=''] - the separator to use between single strings
	 * @returns {String} the concatenated string
	 **/
	strConcat : function(glue){
		glue = this.orDefault(glue, '', 'string');

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
	 * @param {String} template [description]
	 * @param {(...*|String[]|Object.<String,String>)} arguments to insert into template, either as a dictionary, an array of a parameter sequence
	 * @throws general exception on syntax errors
	 * @returns {String} the formatted string
	 **/
	strFormat : function(template){
		var _this_ = this,
			args = (arguments.length > 1) ? $.makeArray(arguments).slice(1) : [],
			idx = 0,
			explicit = false,
			implicit = false;

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

			var match = /(.+?)[.](.+)/.exec(key);
			while( match ){
				object = fResolve(object, match[1]);
				key = match[2];
				match = /(.+?)[.](.+)/.exec(key);
			}

			return fResolve(object, key);
		};

		var formatters = {
			int : function(value, radix){
				radix = _this_.orDefault(radix, 10, 'int');
				var res = parseInt(value, radix);
				return !_this_.isNaN(res) ? ''+res : '';
			},
			float : function(value, format){
				format = _this_.orDefault(format, null, 'string');

				var res = null;

				if( _this_.isSet(format) ){
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

				return !_this_.isNaN(res) ? ''+res : '';
			}
		};

		return template.replace(/([{}])\1|[{](.*?)(?:!(.+?))?[}]/g, function(match, literal, key) {
			var ref = null,
				value = '',
				formatter = null,
				formatterArg = null;

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
						formatterArg = _this_.strReplace(')', '', formatterParts[1]);
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
				value = _this_.orDefault(ref, '');
			} else {
				if( explicit ){
					throw 'strFormat | cannot switch from explicit to implicit numbering';
				} else {
					implicit = true;
				}

				ref = args[idx];
				value = _this_.orDefault(ref, '');
				idx++;
			}

			return _this_.isSet(formatter) ? formatter(value, formatterArg) : value;
		});
	},



	/**
	 * Slugifies a text for use in an URL or id/class/attribute.
	 * Transforms accented characters to non accented ones.
	 *
	 * @param {String} text - the text to slugify
	 * @returns {String} the slugified string
	 **/
	slugify : function(text){
		text = this.isSet(text) ? ''+text : '';

		var _this_ = this;

		return text.toLowerCase()
			.replace(/\s+/g, '-')           //replace spaces with "-"
			.replace(/[^A-Za-z0-9\[\] ]/g, function(char){ return _this_.jqueryAnnexData.slugify.latinMap[char] || char; })
			.replace(/[^\w\-]+/g, '')       //remove all non-word chars || ^replace accented chars with plain ones
			.replace(/\-\-+/g, '-')         //replace multiple "-" with single "-"
			.replace(/^-+/, '')             //trim "-" from start of text
			.replace(/-+$/, '');            //trim "-" from end of text
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
	 * Copies all enumerable properties from one object to the target object.
	 * The target object will be emptied beforehand, therefore behaving differently from
	 * $.extend.
	 *
	 * This method is especially interesting if the target object, to which the content is
	 * copied has to keep its reference for programmatic reasons.
	 *
	 * Modifies the target!
	 *
	 * @param {Object} target - the object to copy all properties of contentObject to
	 * @param {Object} contentObject - the object to copy all properties of to target
	 * @param {?Object} [cloneSubObjects=false] - defines if sub-objects of contentObject should be cloned or copied by reference
	 * @returns {Object} emptied target with all properties of contentObject
	 **/
	copyObjectContent : function(target, contentObject, cloneSubObjects){
		cloneSubObjects = this.orDefault(cloneSubObjects, false, 'boolean');

		var propName, copyValue;

		for( propName in target ){
			delete target[propName];
		}

		for( propName in contentObject ){
			if( cloneSubObjects ){
				copyValue = contentObject[propName];

				if( !$.isArray(copyValue) && !$.isPlainObject(copyValue) ){
					target[propName] = copyValue;
				} else if( $.isArray(copyValue) ) {
					target[propName] = $.extend(true, [], copyValue);
				} else if( $.isPlainObject(copyValue) ){
					target[propName] = $.extend(true, {}, copyValue);
				}
			} else {
				target[propName] = contentObject[propName];
			}
		}

		return target;
	},



	/**
	 * Removes all enumerable properties of an object, thereby emptying it.
	 *
	 * This method is especially interesting if the target object has to keep its reference for programmatic reasons.
	 *
	 * Modifies the target!
	 *
	 * @param {Object} target - the object to copy all properties of contentObject to
	 * @returns {Object} emptied target
	 **/
	emptyObject : function(target){
		return this.copyObjectContent(target, {});
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
			floor = parseInt(floor, 10);
		}

		if( !this.isSet(ceiling) ){
			ceiling = 10;
		} else {
			ceiling = parseInt(ceiling, 10);
		}

		this.assert((ceiling >= floor), 'randomInt | ceiling may not be smaller than floor');

		return Math.round(Math.random() * (ceiling - floor) + floor);
	},



	/**
	 * Returns a "UUID", as close as possible with JavaScript (so not really, but looks like one :).
	 *
	 * @param {?Boolean} [withoutDashes=false] - defines if UUID shall include dashes or not
	 * @returns {String} a "UUID"
	 **/
	randomUUID : function(withoutDashes){
		withoutDashes = this.isSet(withoutDashes) ? !!withoutDashes : false;

		var uuidLength = 36;
		if( withoutDashes ){
			uuidLength = 32;
		}

		var s = [],
			itoh = '0123456789ABCDEF',
			i = 0;

		for (i = 0; i < uuidLength; i++) s[i] = Math.floor(Math.random() * 0x10);

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
	 * @param {?(Object|Number.Integer)} [oldTimer] - if set, kills the timer before setting up new one
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
	 * @param {?(Object|Number.Integer)} [oldTimer] - if set, kills the timer before setting up new one
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
			var waitStart = new Date().getTime(),
				waitMilliSecs = ms;

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
	 * @param {?(Object|Number.Integer)} [oldLoop] - if set, kills the loop before setting up new one
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
	 * @param {?(Object|Number.Integer)} [oldLoop] - if set, kills the loop before setting up new one
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
			var waitStart = new Date().getTime(),
				waitMilliSecs = ms;

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
	 * @param {?Boolean} [isInterval] - defines if a timer or a loop is to be stopped, set in case timer is a GUID
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
	 * @param {?Function} fElseAction - closure to define action to take place if contition is not fulfilled, receives Boolean parameter defining if result has changed
	 * @param {?Number.Integer} [newLoopMs=250] - new loop wait time in ms, resets global timer if useOwnTimer is not set, otherwise sets local timer for poll
	 * @param {?Boolean} [useOwnTimer=false] - has to be set and true to tell the poll to use an independent local timer instead of the global one.
	 * @returns {(Object|null)} new poll or null in case of param error
	 **/
	poll : function(name, fCondition, fAction, fElseAction, newLoopMs, useOwnTimer){
		name = $.trim(''+name);

		var _this_ = this;

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
				newPoll.loop = this.loop(this.orDefault(newLoopMs, 250, 'int'), function(){
					if( newPoll.condition() ){
						if( newPoll.action(newPoll.lastPollResult === false) ){
							_this_.countermand(newPoll.loop);
							newPoll.loop = null;
							delete _this_.jqueryAnnexData.polls.activePolls[newPoll.name];
							_this_.jqueryAnnexData.polls.activePollCount--;
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

				this.jqueryAnnexData.polls.defaultLoop = this.loop(this.orDefault(newLoopMs, 250, 'int'), function(){
					if( _this_.jqueryAnnexData.polls.activePollCount > 0 ){
						$.each(_this_.jqueryAnnexData.polls.activePolls, function(name, poll){
							if( !_this_.isSet(poll.loop) ){
								if( poll.condition() ){
									if( poll.action(poll.lastPollResult === false) ){
										delete _this_.jqueryAnnexData.polls.activePolls[name];
										_this_.jqueryAnnexData.polls.activePollCount--;
									}
									poll.lastPollResult = true;
								} else {
									poll.elseAction(poll.lastPollResult === true);
									poll.lastPollResult = false;
								}
							}
						});
					} else {
						_this_.countermand(_this_.jqueryAnnexData.polls.defaultLoop);
						_this_.jqueryAnnexData.polls.defaultLoop = null;
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
	 * @param {Number.Integer} ms - the waiting time between executions in milliseconds
	 * @param {Function} func - the function to throttle
	 * @param {?Boolean} [leadingExecution=true] - defines if the function is executed initially without waiting first
	 * @param {?Boolean} [trailingExecution=false] - defines if the function is executed at the end of the event chain a final time
	 * @returns {Function} the throtteling function (parameters will be handed as is to the throtteled function)
	 **/
	throttleExecution : function(ms, func, leadingExecution, trailingExecution){
		leadingExecution = this.orDefault(leadingExecution, true, 'bool');
		trailingExecution = this.orDefault(trailingExecution, false, 'bool');

		var _this_ = this,
			throttleTimer = null,
			trailTimer = null,
			lastEventTime = null,
			lastTriggerTime = null;

		var fTrigger = function(context, args){
			lastEventTime = null;
			lastTriggerTime = new Date().getTime();
			throttleTimer = null;
			func.apply(context, args);
		};

		var fTrailTrigger = function(context, args){
			func.apply(context, args);
		};

		return function(){
			var context = this,
				args = $.makeArray(arguments);

			if( $.isSet(lastEventTime) && !$.isSet(throttleTimer) ){
				var currentEventTime = new Date().getTime(),
					eventDelta = currentEventTime - (($.isSet(lastTriggerTime) && (lastTriggerTime > lastEventTime)) ? lastTriggerTime : lastEventTime),
					waitMs = (ms - eventDelta < 0) ? 0 : (ms - eventDelta);

				_this_.countermand(throttleTimer);
				throttleTimer = _this_.schedule(waitMs, function(){ fTrigger(context, args); });

				lastEventTime = currentEventTime;
			} else {
				lastTriggerTime = null;
				lastEventTime = new Date().getTime();

				if( !$.isSet(throttleTimer) ){
					if( leadingExecution ){
						func.apply(context, args);
						lastTriggerTime = lastEventTime;
					} else {
						throttleTimer = _this_.schedule(ms, function(){ fTrigger(context, args); });
					}
				}
			}

			if( trailingExecution ){
				if( $.isSet(trailTimer) ){
					_this_.countermand(trailTimer);
				}
				trailTimer = _this_.schedule(ms, function(){ fTrigger(context, args); });
			}
		};
	},



	/**
	 * Hold the execution of a function until it has not been called for n ms.
	 *
	 * @param {Number.Integer} ms - timeframe in milliseconds without call before execution
	 * @param {Function} func - the function to hold the execution of
	 * @returns {Function} the holding function (parameters will be handed as is to the held function)
	 **/
	holdExecution : function(ms, func){
		var _this_ = this,
			holdTimer = this.schedule(1, $.noop);

		return function(){
			var context = this,
				args = $.makeArray(arguments);

			holdTimer = _this_.reschedule(holdTimer, ms, function(){ func.apply(context, args); });
		};
	},



	/**
	 * Defer the execution of a function until the callstack is empty.
	 * This works identical to setTimeout(function(){}, 1);
	 *
	 * @param {Function} func - the function to defer
	 * @param {?Number.Integer} [delay=1] - the delay to apply to the timeout
	 * @returns {Function} the deferring function
	 **/
	deferExecution : function(func, delay){
		delay = this.orDefault(delay, 1, 'int');

		var _this_ = this;

		return function(){
			_this_.schedule(delay, func);
		};
	},



	/**
	 * Applies the possiblity to set function parameters by name Python-style like kwargs to a function.
	 * Returns a new function that accepts mixed args, if arg is a plain object it gets treated as a kwargs
	 * dict. If the objects contains a falsy "kwargs" attribute it is applied as a parameter as is.
	 * You can also define parameter defaults from outside by setting the defaults as a dict in this function.
	 *
	 * Examples:
	 * With * var fTest = function(tick, trick, track){ console.log(tick, trick, track); };
	 *
	 * $.kwargs(fTest, {track : 'defTrack'})({tick : 'tiick', trick : 'trick'});
	 * will output "tiick, trick, defTrack"
	 *
	 * $.kwargs(fTest, {track : 'defTrack'})('argTick', {trick : 'triick', track : 'trACK'});
	 * will output "argTick, triick, trACK"
	 *
	 * $.kwargs(fTest, {track : 'defTrack'})('argTick', {trick : 'triick', track : 'track'}, 'trackkkk');
	 * will output "argTick, triick, trackkkk"
	 *
	 * @param {Function} func - the function to provide kwargs to
	 * @param {?Object} [defaults={}] - the default kwargs to apply to func
	 * @returns {Function} new function accepting mixed args with kwarg dicts
	 **/
	kwargs : function(func, defaults){
		defaults = $.isPlainObject(defaults) ? defaults : {};

		var _this_ = this,
			argNames = func.toString().match(/\(([^\)]+)/)[1];

		argNames = argNames ? $.map(argNames.split(','), function(item){ return $.trim(item); }) : [];

		return function(){
			var args = $.makeArray(arguments),
				applicableArgs = [];

			$.each(args, function(argIndex, arg){
				if(
					$.isPlainObject(arg)
					// if object contains falsy property "kwargs" leave it as is
					&& (!_this_.isSet(arg.kwargs) || !!arg.kwargs)
				){
					$.each(argNames, function(argNameIndex, argName){
						if( _this_.isSet(arg[argName]) ){
							applicableArgs[argNameIndex] = arg[argName];
						}
					});
				} else {
					applicableArgs[argIndex] = arg;
				}
			});

			$.each(argNames, function(argNameIndex, argName){
				if(
					!_this_.isSet(applicableArgs[argNameIndex])
					&& _this_.isSet(defaults[argName])
				){
					applicableArgs[argNameIndex] = defaults[argName];
				}
			});

			func.apply(this, applicableArgs);
		};
	},



	/**
	 * Changes the current window-location.
	 * Also offers to only change the hash/anchor or send additional post params via hidden form transport.
	 *
	 * @param {?String} [url=window.location.href] - the location to load, if null current location is reloaded
	 * @param {?Object.<String, String>} [params={}] - GET-parameters to add to the url as key-value-pairs
	 * @param {?String} [anchor] - site anchor to set for called url, has precedence over URL hash
	 * @param {?Object} [postParams] - a dictionary of postParameters to send with the redirect, solved with a hidden form
	 * @param {?String} [target] - name of the window to perform the redirect to/in
	 **/
	redirect : function(url, params, anchor, postParams, target){
		var _this_ = this,
			reload = !this.isSet(url);

		if( !this.isSet(url) ){
			url = window.location.href;

			if( this.isSet($(document).urlAnchor()) ){
				anchor = this.orDefault(anchor, $(document).urlAnchor(true), 'string');
				url = url.replace(/\#.+$/, '');
			}
		} else {
			var anchorFromUrlParts = url.split('#');

			if( anchorFromUrlParts.length > 1 ){
				anchor = this.orDefault(anchor, anchorFromUrlParts[1], 'string');
				url = url.replace(/\#.+$/, '');
			}
		}

		var urlParts = url.split('?', 2);
		url = urlParts[0];
		var presentParamString = this.orDefault(urlParts[1], '');

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

		if( reload && !this.isSet(anchor) ){
			anchor = $(document).urlAnchor(true);
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
						redirectForm.append(_this_.elem('input', {type : 'hidden', name : index+'[]', value : ''+_value_}));
					});
				} else {
					redirectForm.append(_this_.elem('input', {type : 'hidden', name : ''+index, value : ''+value}));
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
	 * @param {?String} [testKey=!!!foo!!!] - a key to use as a testkey when setting and removing data, use in case of collision
	 * @returns {Boolean} true if browser seems to support local storage
	 **/
	browserSupportsLocalStorage : function(testKey){
		testKey = this.orDefault(testKey, '!!!foo!!!', 'string');

	    try {
	        window.localStorage.setItem(testKey, 'bar');
	        window.localStorage.removeItem(testKey);
	        return true;
	    } catch(e) {
	        return false;
	    }
	},



	/**
	 * Detects if the browser supports session storage, by testing if something can be stored in it and removed
	 * afterwards. This test was more or less stolen from modernizr.
	 *
	 * @param {?String} [testKey=!!!foo!!!] - a key to use as a testkey when setting and removing data, use in case of collision
	 * @returns {Boolean} true if browser seems to support session storage
	 **/
	browserSupportsSessionStorage : function(testKey){
		testKey = this.orDefault(testKey, '!!!foo!!!', 'string');

	    try {
	        window.sessionStorage.setItem(testKey, 'bar');
	        window.sessionStorage.removeItem(testKey);
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
	 * @param {?Boolean} [usePushState] - push new state instead of replacing current
	 **/
	changeUrlSilently : function(url, state, title, usePushState){
		state = this.orDefault(state, '');
		title = this.orDefault(title, '');

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
	 * @param {?Boolean} [clearOld] - defines if old handlers should be removed before setting new one
	 **/
	onHistoryChange : function(callback, name, clearOld){
		var _this_ = this;

		if ( this.browserSupportsHistoryManipulation() ) {
			name = this.isSet(name) ? '.'+name : '';
			if( clearOld ){
				$(window).off('popstate'+name);
			}
			$(window).on('popstate'+name, function(e){
				callback(
					{
						state : _this_.jqueryAnnexData.history.currentState,
						title : _this_.jqueryAnnexData.history.currentTitle,
						host : _this_.jqueryAnnexData.history.currentHost,
						path : _this_.jqueryAnnexData.history.currentPath
					},
					{
						state : e.state,
						title : e.title,
						host : window.location.host,
						path : window.location.pathname
					}
				);

				_this_.jqueryAnnexData.history.currentState = e.state;
				_this_.jqueryAnnexData.history.currentTitle = ''+e.title;
				_this_.jqueryAnnexData.history.currentHost = window.location.host;
				_this_.jqueryAnnexData.history.currentPath = window.location.pathname;
			});
		}
	},



	/**
	 * Reloads the current window-location. Differentiates between cached and cache-refreshing reload.
	 *
	 * @param {?Boolean} [quickLoad=false] - if true, load as fast as possible using everything in cache
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
		parentWindow = this.orDefault(parentWindow, window);
		tryAsPopup = this.orDefault(tryAsPopup, false, 'bool');

		var windowName = '',
			optionArray = [];

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
	 * @param {?Function} [callback] - function to call after css is loaded and included into DOM, gets included DOM-element as parameter
	 * @returns {jqXHR} the promise object from the internally used $.get
	 **/
	getCSS : function(url, options, callback){
		var _this_ = this,
			$res = null;

		var defaultOptions = {
			styletag : false,
			media : 'all',
			charset : 'utf-8'
		};

		if( this.isSet(options) ){
			$.extend(defaultOptions, options);
		}

		options = defaultOptions;

		return $.get(url, function(data){
			if( !options.styletag ){
				$res = _this_.elem('link', {
					'rel' : 'stylesheet',
					'type' : 'text/css',
					'media' : options.media || 'screen',
					'href' : ''+url
				});
			} else {
				$res = _this_.elem('style', {'type' : 'text/css'}, data);
			}

			if( _this_.isSet(options.charset) ){
				$res.attr('charset', ''+options.charset);
			}

			if( _this_.isSet(options.id) ){
				if( $.isFunction(callback) ){
					callback = (function(callback){
						return function(){
							$res.dataDuo('id', ''+options.id);
							callback($res);
						};
					})(callback);
				} else {
					callback = function(){
						$res.dataDuo('id', ''+options.id);
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
					_this_.schedule(100, function(){ callback($res); });
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
	 * @param {String} [value] - value-string of the cookie, null removes a value, so to retrieve leave undefined
	 * @param {?Object} [options] - config-object for the cookie setting expiries etc., use together with a value
	 * @returns {(void|String|null)} either nothing, when setting a cookie, or the value of a requested cookie
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

			var path = options.path ? '; path='+(options.path) : '',
				domain = options.domain ? '; domain='+(options.domain) : '',
				secure = options.secure ? '; secure' : '';

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
		cssVal = ''+cssVal;

		return parseInt(cssVal.replace(/(px|em|%)$/, ''), 10);
	},



	/**
	 * Converts a CSS-URL to a img-src-usable value.
	 *
	 * @param {String} cssUrl - the URL from the css
	 * @param {?String} [relativePathPart] - the relative path part of the URL from the css to cut for src-use
	 * @returns {String} src value or empty string if cssUrl is no CSS-URL-value
	 **/
	cssUrlToSrc : function(cssUrl, relativePathPart){
		var urlRex = new RegExp('^url\\((?:\'|\")?([^\'\"]+)(?:\'|\")?\\)$', 'i'),
			matches = urlRex.exec(cssUrl);

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
	 * Calculates a rem value based on a given px value.
	 * As a default this method takes the font-size (supposedly being in px) of the html-container.
	 * You can overwrite this behaviour by setting initial to an int to use as a base px value or
	 * to a string, which then defines a new selector to get the initial font-size.
	 *
	 * In most cases you will have to define the initial value via a constant or a selector to a container
	 * with non-changing font-size, since you can never be sure which relative font-size applies atm, even on first
	 * call, after dom ready.
	 *
	 * @param  {Number.Integer} px - the pixel value to convert to rem
	 * @param  {?(Number.Integer|String)} [initial='html'] - either a pixel value to use as a conversion base or a selector to an element to get the initial font-size from
	 * @returns {String} the rem value string to use in a css definition
	 **/
	remByPx : function(px, initial){
		px = parseInt(px, 10);
		initial = this.orDefault(initial, 'html');

		return (px / (this.isInt(initial) ? initial : this.cssToInt($(''+initial).css('font-size')))) + 'rem';
	},



	/**
	 * Preloads images by URL.
	 * Images can be preloaded by name and are thereby retrievable afterwards or anonymously.
	 * So you can either just use the url again, or, to be super-sure, call the method again, with just the image name to get the URL.
	 *
	 * @param {(String|String[]|Object.<String, String>)} images - an URL, an array of URLS or a plain object containing named URLs. In case the string is an already used name, the image-object is returned.
	 * @param {?Function} [callback] - callback to call when all images have loaded, this also fires on already loaded images if inserted again
	 * @param {?Boolean} [returnCollection=false] - defines if the function should return the collection in which the images where inserted instead of the promise object
	 * @returns {(Promise|Object.<String, String>|Image)} either returns a promise object (does not fail atm), the currently added named/unnamed images as saved (if defined by returnCollection) or a requested cached image
	 **/
	preloadImages : function(images, callback, returnCollection){
		returnCollection = this.orDefault(returnCollection, false, 'bool');

		var _this_ = this,
			res = null,
			deferred = $.Deferred();

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

				if( !_this_.exists(key, _this_.jqueryAnnexData.preloadedImages.named) ){
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
				_this_.jqueryAnnexData.preloadedImages.unnamed.push(newImage);
			});

			res = this.jqueryAnnexData.preloadedImages.unnamed;
		}

		var imageList = [];
		$.each(this.jqueryAnnexData.preloadedImages.named, function(key, value){
			imageList.push(value);
		});
		$.merge(imageList, this.jqueryAnnexData.preloadedImages.unnamed);

		var targetCount = imageList.length,
			blank = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

		// xxx remove if imgLoad solution proves robust
		/*$.each(imageList, function(index, value){
			$(value).on('load.preload', function(e){
				if( this.src != blank ){
					if( (--targetCount <= 0) && $.isFunction(callback) ){
						$.each(imageList, function(index, value){ $(this).off('load.preload'); });
						callback(imageList, e);
						deferred.resolve();
					}
				} else {
					var $target = $(this);
					_this_.schedule(10, function(){ $target.trigger('load.preload'); });
				}
			});

			if( value.complete || value.complete === undefined ){
				var src = value.src;
				value.src = blank;
				value.src = src;
			}
		});*/

		$(imageList).imgLoad(function(targets, e){
			if( $.isFunction(callback) ){
				callback(targets, e);
			}
			deferred.resolve();
		});

		if( returnCollection ){
			return res;
		} else {
			return deferred.promise();
		}
	},



	/**
	 * Waits for a list of webfonts to load before executing a callback.
	 * Works for fonts already loaded as well.
	 *
	 * @param {String|String[]} fonts - the CSS-names of the fonts to wait upon
	 * @param {?Function} callback - the callback to execute once all given webfonts are loaded
	 * @param {?String} [fallbackFontName=sans-serif] - the system font onto which the page falls back if the webfont is not loaded
	 * @returns {Promise} a promise object (not failing atm)
	 **/
	waitForWebfonts : function(fonts, callback, fallbackFontName) {
		fonts = $.isArray(fonts) ? fonts : [''+fonts];
		fallbackFontName = this.orDefault(fallbackFontName, 'sans-serif', 'string');

		var _this_ = this,
			deferred = $.Deferred(),
			loadedFonts = 0;

		$.each(fonts, function(index, font){
				var $node = this.elem('span')
					.html('giItT1WQy@!-/#')
					.css({
						'position' : 'absolute',
						'visibility' : 'hidden',
						'left' : '-10000px',
						'top' : '-10000px',
						'font-size' : '300px',
						'font-family' : fallbackFontName,
						'font-variant' : 'normal',
						'font-style' : 'normal',
						'font-weight' : 'normal',
						'letter-spacing' : '0',
						'white-space' : 'pre'
					})
				;
				$('body').append($node);

				var systemFontWidth = $node.width();
				$node.css('font-family', font+', '+fallbackFontName);

				var tCheckFontLoaded = null;
				var fCheckFont = function(){
					if( $node && ($node.width() != systemFontWidth) ){
						loadedFonts++;
						$node.remove();
						$node = null;
					}

					if( loadedFonts >= fonts.length ){
						if( _this_.isSet(tCheckFontLoaded) ){
							_this_.countermand(tCheckFontLoaded);
						}

						if(
							(loadedFonts == fonts.length)
							&& (deferred.state() != 'resolved')
						){
							if( $.isFunction(callback) ){
								callback();
							}
							deferred.resolve();
							return true;
						}
					}

					return false;
				};

				if( !fCheckFont() ){
					tCheckFontLoaded = this.loop(50, fCheckFont);
				}
		});

		return deferred.promise();
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
		prefix = this.orDefault(prefix, '', 'string');
		postfix = this.orDefault(postfix, '', 'string');

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
	 * @param {(String|Object)} nodeInfested - the node-ridden string or jquery object to "clean"
	 * @param {?Boolean} [onlyFirstLevel=false] - true if only the text of direct child text nodes is to be returned
	 * @returns {String} the escaped string
	 **/
	textContent : function(nodeInfested, onlyFirstLevel){
		onlyFirstLevel = this.orDefault(onlyFirstLevel, false, 'bool');

		var res = '';
		var $holder = (this.isA(nodeInfested, 'object') && this.isSet(nodeInfested.jquery))
			? nodeInfested
			: this.elem('p').html(''+nodeInfested);

		if( onlyFirstLevel ){
			res = $holder
				.contents()
				.filter(function(){
					return this.nodeType == 3;
				})
					.text()
				.end()
			;
		} else {
			res = $holder.text();
		}

		return $.trim(res);
	},



	/**
	 * Binds a callback to a cursor key, internally identified by keycode.
	 *
	 * @param {String} keyName - the key to bind => up/down/left/right
	 * @param {Function} callback - callback to call of cursor key use, takes event e
	 * @param {?String} [eventType=keydown] - the event type to use when binding => keypress/keydown/keyup
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
	 * @param {?String} [eventType=keydown] - the event type to use when binding => keypress/keydown/keyup
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
		if( this.exists('getSelection') ){
			window.getSelection().removeAllRanges();
		} else if( this.exists('getSelection', document) ){
			document.getSelection().removeAllRanges();
		}

		// remove left over input selections for old IEs remaining after proper removeAllRanges
		if( this.exists('selection', document) ){
			document.selection.empty();
		}
	},



	/**
	 * Detects if the current JavaScript-context runs on a (dedicated) touch device.
	 * Checks these UserAgents by default: iOS-devices, Blackberry, Android, IE mobile, Opera Mobilem Firefox Mobile and Kindle.
	 *
	 * @param {?Boolean} [inspectUserAgent=false] - defines if the user agent should be inspected additionally to identifying touch events
	 * @param {?String[]} [additionalUserAgentIds] - list of string-ids to search for in the user agent additionally to the basic ones
	 * @param {?Boolean} [onlyConsiderUserAgent=false] - tells the algorithm to ignore feature checks and just go by the user-agent-ids
	 * @returns {Boolean} true if device knows touch events and or sends fitting useragent
	 **/
	contextIsTouchDevice : function(inspectUserAgent, additionalUserAgentIds, onlyConsiderUserAgent){
		var _this_ = this,
			touchEventsPresent = 'createTouch' in document,
			res = onlyConsiderUserAgent ? true : touchEventsPresent,
			ua = navigator.userAgent;

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
					res = (touchEventsPresent && res) || (touchEventsPresent && _this_.isSet(matches));
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
	},



	/**
	 * Defines the default logic for an innerpage hashnav, where the currently visible section should automatically
	 * be highlighted while scrolling. This solution is based on elements containing a headline stating the nav title,
	 * being in a container constituting a nav section. The section has to bear the id, referenced in the nav items
	 * href. The href may be with or without leading path, but may only include _one_ #.
	 *
	 * @param {Object} $navElements - the jQuery-collection of nav elements to highlight, each bearing the href and getting the activeClass
	 * @param {Object} [$sectionElements] - the jQuery-collection of section elements, containing some kind of headline and bearing the id
	 * @param {?String} [headlineSelector='h2:first'] - the jQuery selector to find the headline element by in a section
	 * @param {?('first-visible-headline'|'headline-at-top')} [algorithm='first-visible-headline'] - defines the algorithm by which $navElements are set active
	 * @param {?Number.Integer} [throttleMs=250] - the minimum interval in which the scroll handler is fired, 0 disables throttling
	 * @param {?String} [activeClass='active'] - the class to set upon the active nav element
	 **/
	setupHashNavHighlighting : function($navElements, $sectionElements, headlineSelector, algorithm, throttleMs, activeClass){
		headlineSelector = this.orDefault(headlineSelector, 'h2:first', 'string');
		algorithm = this.orDefault(algorithm, 'first-visible-headline');
		throttleMs = this.orDefault(throttleMs, 250, 'int');
		activeClass = this.orDefault(activeClass, 'active', 'string');

		var fHandler = function(){
			var found = false;

			switch( algorithm ){
				case 'first-visible-headline':
					$navElements.removeClass(activeClass);
					$sectionElements.each(function(){
						var $headline = $(this).find(headlineSelector).first();

						if( ($headline.length > 0) &&  $headline.isInViewport(true) ){
							$navElements.filter('[href*=#'+$(this).attr('id')+']').first().addClass(activeClass);
							found = true;
							return false;
						}
					});

					if( !found ){
						$sectionElements.each(function(){
							if( $(this).isInViewport() ){
								$navElements.filter('[href*=#'+$(this).attr('id')+']').first().addClass(activeClass);
								found = true;
								return false;
							}
						});
					}
				break;

				case 'headline-at-top':
					var viewportHeight = window.innerHeight || $(window).height(),
			            userHasScrolledToPageBottom = ($(window).scrollTop() + viewportHeight) > ($('body').height() - Math.round(viewportHeight / 10));

					$navElements.removeClass(activeClass);
					if( !userHasScrolledToPageBottom ){
			            $sectionElements.each(function(){
			                var $headline = $(this).find(headlineSelector),
								headlineTop = $.isFunction($headline.oo().getBoundingClientRect) ? $headline.oo().getBoundingClientRect().top : $headline.offset().top;

			                if( headlineTop < Math.round(viewportHeight / 10) ){
								$navElements.removeClass(activeClass);
								$navElements.filter('[href*=#'+$(this).attr('id')+']').first().addClass(activeClass);
			                }
			            });
			        } else {
						$navElements.filter('[href*=#'+$sectionElements.last().attr('id')+']').first().addClass(activeClass);
			        }
				break;
			}
		};

		$(window).off('scroll.dynamichashnav resize.dynamichashnav');
		if( throttleMs > 0 ){
			$(window).on('scroll.dynamichashnav resize.dynamichashnav', this.throttleExecution(throttleMs, fHandler, true, true));
		} else {
			$(window).on('scroll.dynamichashnav resize.dynamichashnav', fHandler);
		}
		$(window).triggerHandler('scroll.dynamichashnav');
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
			var tmpVal = $(this).val(),
				stopperFunc = function(e){ return false; };

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
	 * Handles the movement of jQuery event data from one dict to another.
	 * This is mainly a helper function for pauseHandlers and resumeHandlers, in which the target dicts are just
	 * switched, but may also be used manually if you need anther dict to move event data to, or if the core
	 * implementation of $._data and $.data for event access changes again.
	 *
	 * @param {String} eventId - jquery event id(s) like in .on() and .off()
	 * @param {?Function} [getter=$._data] - function to retrieve element event data, takes element as first param and access key of dict in second
	 * @param {?String} [getterKey='events'] - the dict access key to use in getter calls on $(this)
	 * @param {?Function} [setter=$.data] - function to set element event data, takes element as first param and access key of dict in second
	 * @param {?String} [setterKey='jqueryAnnexData_pausedEvents'] - the dict access key to use in setter calls on $(this)
	 * @returns {Object} this
	 **/
	moveEventData : function(eventId, getter, getterKey, setter, setterKey){
		eventId = $.orDefault(eventId, '', 'string');

		var _this_ = this,
			eventIds = eventId.split(' ');

		$.each(eventIds, function(eventIdIndex, eventId){
			eventId = $.trim(eventId);
			getter = $.isFunction(getter) ? getter : $._data;
			getterKey = $.orDefault(getterKey, 'events', 'string');
			setter = $.isFunction(setter) ? setter : $.data;
			setterKey = $.orDefault(setterKey, 'jqueryAnnexData_pausedEvents', 'string');

			var elem = $(_this_).oo(),
				events = getter(elem, getterKey);

			if( $.isSet(events) ){
				var targetEventGuids = [],
					eventIdParts = eventId.split('.'),
					eventName = eventIdParts[0],
					eventNamespace = (eventIdParts.length > 1) ? eventIdParts[1] : '',
					eventNameArray = (eventName === '')
						? Object.keys(events)
						: ($.isSet(events[eventName]) ? [eventName] : [])
				;

				$.each(eventNameArray, function(eventNameIndex, eventName){
					$.each(events[eventName], function(eventIndex, event){
						if(
							(event.type == eventName)
							&& (
								(eventNamespace === '')
								|| (
									(eventNamespace !== '')
									&& (event.namespace == eventNamespace)
								)
							)
						){
							if( !$.isSet(setter(elem, setterKey)) ){
								setter(elem, setterKey, {});
							}

							var targetDict = setter(elem, setterKey);

							if( !$.isSet(targetDict[eventName]) ){
								targetDict[eventName] = [];
								targetDict[eventName].delegateCount = events[eventName].delegateCount;
							}

							targetDict[eventName].push(event);
							targetEventGuids.push(event.guid);
						}
					});
				});

				var newEvents = {};
				$.each(getter(elem, getterKey), function(eventKey, eventArray){
					$.each(eventArray, function(eventIndex, event){
						if( $.inArray(event.guid, targetEventGuids) < 0 ){
							if( !$.isSet(newEvents[event.type]) ){
								newEvents[event.type] = [];
								newEvents[event.type].delegateCount = eventArray.delegateCount;
							}

							newEvents[event.type].push(event);
						}
					});
				});
				getter(elem, getterKey, newEvents);
			}
		});

		return this;
	},



	/**
	 * Pauses event handlers of an element, by moving them to a different dict temporarily
	 *
	 * @param {String} eventId - jquery event id(s) like in .on() and .off()
	 * @returns {Object} this
	 **/
	pauseHandlers : function(eventId){
		return $.proxy($.fn.moveEventData, this, eventId, $._data, 'events', $.data, 'jqueryAnnexData_pausedEvents')();
	},



	/**
	 * Resumes paused event handlers of an element, by moving them back to the element's event handler dict.
	 *
	 * @param {String} eventId - jquery event id(s) like in .on() and .off()
	 * @returns {Object} this
	 **/
	resumeHandlers : function(eventId){
		return $.proxy($.fn.moveEventData, this, eventId, $.data, 'jqueryAnnexData_pausedEvents', $._data, 'events')();
	},



	/**
	 * Returns an element's outerHTML instead of innerHTML, which .html() provides. Avoids clone() for this purpose.
	 * If htmlContent parameter is given the this parameter will be set as the new outerHTML.
	 * Should act analogous to .html().
	 *
	 * This method tries to keep valid references on the results, so setting outerHTML on elements should result
	 * in the set of newly created elements in the dom.
	 *
	 * Retrieving and setting does not work on HTML itself if outerHTML is not supported natively by the browser!
	 *
	 * @param {?String} [htmlContent] - html content to set as new outerHTML for selected elements
	 * @returns {String} the element's outer HTML markup starting with its own tag
	 **/
	outerHtml : function(htmlContent){
		var outerHTMLAvailable = !$(this).oo().outerHTML;

		if( !$.isSet(htmlContent) ){
			if( outerHTMLAvailable ){
				return $(this).oo().outerHTML;
			} else {
				var outerHtml = $(this).first().wrap('<div/>').parent().html();
				$(this).first().unwrap();

				return outerHtml;
			}
		} else {
			var $elements = $([]);

			$(this).each(function(){
				if( !outerHTMLAvailable ){
					var $tmpParent = $(this).wrap('<div/>').parent();
					$tmpParent.html(htmlContent);

					var $newElement = $tmpParent.children().first();
					$newElement.unwrap();

					$elements = $elements.add($newElement);
				} else {
					var $element = null,
						$parent = null,
						elementIndex = -1;

					if( $(this).parent().parent().length === 0 ){
						$element = $('html');
					} else {
						$parent = $(this).parent();
						elementIndex = $(this).index();
					}

					$(this).oo().outerHTML = ''+htmlContent;

					if( !$.isSet($element) ){
						$element = $parent.children().eq(elementIndex);
					}

					$elements = $elements.add($element);
				}
			});

			return $elements;
		}
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
		var _this_ = this,
			copyAttrs = ['id', 'class', 'style'];

		if( $.isSet($inheritFrom) && $.isA($inheritFrom, 'object') ){
			$.each($inheritFrom[0].attributes, function(index, attribute){
				if( $.inArray(attribute.name, copyAttrs) != -1 ){
					$(_this_).attr(attribute.name, attribute.value);
				} else if( attribute.name.indexOf('data-') === 0 ){
					$(_this_).dataDuo(attribute.name, attribute.value);
				} else if( attribute.name.indexOf('on') === 0 ){
					$(_this_).on(attribute.name.substring(2)+'.frommarkup', function(){ eval(attribute.value); });
				}
			});
		}

		if( $.isSet(id) ){
			$(this).attr('id', ''+id);
		}

		if( $.isSet(classes) ){
			if( $.isArray(classes) ){
				$.each(classes, function(index, value){
					$(_this_).addClass(value);
				});
			} else {
				$(this).attr('class', ($.isSet($(this).attr('class')) ? $(this).attr('class')+' ' : '')+classes);
			}
		}

		if( $.isSet(style) ){
			if( $.isPlainObject(style) ){
				$(this).css(style);
			} else {
				$(this).attr('style', ($.isSet($(this).attr('style')) ? $(this).attr('style')+' ' : '')+style);
			}
		}

		return this;
	},



	/**
	 * Offers an execution frame for element preparation like setting handlers and transforming dom.
	 * Takes a function including the initialization code of a (set of) element(s) and wraps it with
	 * a check if this initialization was already executed (has data-hooked-up="true" then) as well
	 * as a document ready handler to make sure no initializations are executed with a half ready dom.
	 *
	 * If the initialization returns a promise, this promise will be returned if returnPromise is set true.
	 * If returnPromise is set true without fInitialization returning a promise the promise is always immediately resolved.
	 *
	 * @param {Function} fInitialization - the function containing all initialization code for the element(s), this-context is set
	 * @param {?Boolean} [returnPromise=false] - if true, forces the function to return a promise object, if possible the result of fInitialization
	 * @returns {(Object|Promise)} this or a promise
	 **/
	hookUp : function(fInitialization, returnPromise){
		returnPromise = $.orDefault(returnPromise, false, 'bool');

		var deferred = $.Deferred();
		deferred.resolve();
		var promise = deferred.promise();

		$(this).each(function(){
			if( $(this).dataDuo('hooked-up') !== true ){
				var _this_ = this;

				$(function(){
					var initPromise = $.proxy(fInitialization, _this_)();

					if(
						$.isSet(initPromise)
						&& $.isFunction(initPromise.promise)
						&& $.isFunction(initPromise.done)
						&& $.isFunction(initPromise.fail)
					){
						promise = initPromise;
					}

					$(_this_).dataDuo('hooked-up', true);
				});
			}
		});

		if( returnPromise ){
			return promise;
		} else {
			return this;
		}
	},



	/**
	 * Sets and retrieves the element's data attributes like jQuery's original data(), but transparently also updates
	 * the corresponding data-*-attr as far as possible with the given value.
	 *
	 * Returns the current value if attrValue is not set. For the attribute representation everything not an object or
	 * array gets casted to string. Objects and arrays are JSON.stringifyed. Functions are executed and their return
	 * values are used. The prop always keeps the raw value.
	 *
	 * On returning a value the function always returns the prop if present, else it tries to parse the attribute from
	 * JSON. If that fails the value is returned as a string. If the prop is missing it will be restored on read with
	 * the return value.
	 *
	 * @param  {String} attrName - the data attr/prop name
	 * @param  {?*} attrValue - the value to set
	 * @returns {*} the previously set value (on get) or this (on set)
	 **/
	dataDuo : function(attrName, attrValue){
		attrName = $.orDefault(attrName, null, 'string');

		var res = null,
			attrValueString = '';

		if( $.isFunction(attrValue) ){
			attrValue = attrValue();
		}

		if( attrValue !== undefined ){
			if( $.isA(attrValue, 'object') || $.isA(attrValue, 'array') ){
				try {
					attrValueString = JSON.stringify(attrValue);
				} catch(ex){
					attrValueString = ''+attrValue;
				}
			} else {
				attrValueString = ''+attrValue;
			}
		}

		if( $.isSet(attrName) ){
			if( attrValue !== undefined ){
				$(this).data(attrName, attrValue);
				$(this).attr('data-'+attrName, attrValueString);
				res = this;
			} else {
				res = $(this).data(attrName);
				if( !$.isSet(res) ){
					try {
						res = JSON.parse($(this).attr('data-'+attrName));
					} catch(ex){
						res = $(this).attr('data-'+attrName);
					}

					$(this).data(attrName, res);
				}
			}
		}

		return res;
	},



	/**
	 * Remove previously set data (with data() or dataDuo()) from the dom as well as from the markup data-*-attr.
	 *
	 * @param  {String} attrName - the data attr/prop name
	 * @returns {Object} this
	 **/
	removeDataDuo : function(attrName){
		attrName = $.orDefault(attrName, null, 'string');

		if( $.isSet(attrName) ){
			$(this)
				.removeAttr('data-'+attrName)
				.removeData(attrName)
			;
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

		var paramExists = false,
			res = [],
			qString = null,
			url = '';

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
	 * @param {?Boolean} [withoutCaret=false] - defines if anchor value should contain leading "#"
	 * @returns {(String|null)} current anchor value or null if no anchor in url
	 **/
	urlAnchor : function(withoutCaret){
		var anchor = null,
			anchorParts = [];

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
		var fields = $(this).serializeArray(),
			targetObj = {},
			currentFieldIsArray = false;

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
	 * @param {?Boolean} [mustBeFullyInside=false] - defines if the element has to be fully enclosed in the viewport, default is false
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

		var viewportBounds = null,
			windowWidth = window.innerWidth || $(window).width(),
			windowHeight = window.innerHeight || $(window).height();

		if( mustBeFullyInside ){
			viewportBounds = {
				top: 0,
				right : windowWidth,
				bottom : windowHeight,
				left : 0
			};
		} else {
			viewportBounds = {
				top : -( bb.bottom - bb.top ) + 1,
				right : ( windowWidth + ( bb.right - bb.left ) ) + 1,
				bottom : ( windowHeight + ( bb.bottom - bb.top ) ) + 1,
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
	 * Scrolls the viewport to the first matched element's position.
	 * Does not do anything if target element is already fully in viewport, unless scrollEvenIfFullyInViewport is set to
	 * true. Uses getBoundingClientRect to measure viewport check, scrolls always if missing.
	 *
	 * @param  {?Function} [callback=$.noop] - callback to fire when scrolling is done, also fires if scrolling was not needed
	 * @param  {?Number.Integer} [durationMs=1000] - duration of the scrolling animation
	 * @param  {?Number.Integer} [offset=0] - offset from the viewport center to apply to the end position
	 * @param  {?Boolean} [scrollEvenIfFullyInViewport=false] - if true, forces method to always scroll no matter the element's position
	 * @returns {Object} this
	 */
	scrollTo : function(callback, durationMs, offset, scrollEvenIfFullyInViewport){
		callback = $.isFunction(callback) ? callback : $.noop;
		durationMs = $.orDefault(durationMs, 1000, 'int');
		offset = $.orDefault(offset, 0, 'int');
		scrollEvenIfFullyInViewport = $.orDefault(scrollEvenIfFullyInViewport, false, 'bool');

		var $target = $(this).first();
		if( $.isSet($target) && $target.length > 0 ){
			var	callbackFired = false,
				vpHeight = window.innerHeight || $(window).height(),
				isInViewport = $target.isInViewport(true);

			try {
				$target.oo().getBoundingClientRect();
			} catch(err){
				isInViewport = false;
			}

			if( scrollEvenIfFullyInViewport || !isInViewport ){
				$('html, body')
					.stop(true)
					.animate(
						{scrollTop: $target.offset().top - Math.round(vpHeight / 2) + offset},
						durationMs,
						function(){
							if( !callbackFired ){
								callback();
								callbackFired = true;
							}
						}
					);
			} else {
				if( !callbackFired ){
					callback();
					callbackFired = true;
				}
			}
		}

		return this;
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
	 * @param {?Boolean} [needsJqueryDims=false] - tells the check if we expect the loaded image to have readable dimensions
	 * @returns {Object} this
	 **/
	imgLoad : function(callback, needsJqueryDims){
		var targets = $(this).filter('img'),
			targetCount = targets.length,
			blank = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

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
	 * Extracts all pure text nodes from an Element, starting directly in the element itself.
	 *
	 * @param  {?Function} fFilter - a filter function to restrict the returned set, gets called with (textNode, element)
	 * @param  {?Boolean} onlyFirstLevel - defines if the function should only return text nodes from the very first level
	 * @return {Object} a jQuery-set of text nodes
	 **/
	findTextNodes : function(fFilter, onlyFirstLevel) {
		fFilter = $.isFunction(fFilter) ? fFilter : function(){ return true; };
		onlyFirstLevel = $.orDefault(onlyFirstLevel, false, 'bool');

		var $res = $();

		$.each($(this), function(){
			var _this_ = this,
				$set = $(this);

			if( !onlyFirstLevel ){
				$set = $set.add($set.find('*'));
			}

			$set.each(function(){
				$res = $res.add($(this)
					.contents()
					.filter(function(){
						if( (this.nodeType == 3) && ($.trim($(this).text()) !== '') ){
							return !!fFilter(this, _this_);
						} else {
							return false;
						}
					})
				);
			});
		});

		return $res;
	},



	/**
	 * Programmatically create a text selection inside a node, possibly reaching across several child nodes,
	 * but virtually working the only the raw text content. Can also be used to create a selection in text
	 * inputs for example.
	 *
	 * Hint: At the moment there seems to be a problem with Firefox when trying to create any selection inside a
	 * textarea or input:text. Still working on that...
	 *
	 * @param  {?Number.Integer} [startOffset] - characters to leave out at the beginning of the text content
	 * @param  {?Number.Integer} [endOffset] - characters to leave out at the end of the text content
	 * @param  {?Boolean} [returnSelectedText=false] - if true, returns the selected text instead of the element
	 * @return {(Object|String)} Either this or the selected text
	 **/
	createSelection : function(startOffset, endOffset, returnSelectedText){
		startOffset = $.orDefault(startOffset, null, 'int');
		endOffset = $.orDefault(endOffset, null, 'int');
		returnSelectedText = $.orDefault(returnSelectedText, false, 'bool');

		var selectionText = '';

	    $.each($(this), function(){
			var range, selection, rangeText;

		    if( $.exists('selectionStart', this) && $.exists('selectionEnd', this) ){
				$(this).doselect();
				rangeText = $(this).val();
				this.selectionStart = startOffset;
				this.selectionEnd = rangeText.length - endOffset;
				selectionText = rangeText.substring(this.selectionStart, this.selectionEnd);
			} else if( $.exists('getSelection') ){
		        selection = window.getSelection();
		        range = document.createRange();

				range.selectNodeContents($(this).oo());

				if( $.isSet(startOffset) || $.isSet(endOffset) ){
					var $textNodes = $(this).findTextNodes(),
						startNode = $textNodes.first().oo(),
						startNodeIndex = 0,
						endNode = $textNodes.last().oo(),
						endNodeIndex = $textNodes.length - 1;

					if( $.isSet(startOffset) ){
						var remainingStartOffset = startOffset,
							startOffsetNodeFound = (remainingStartOffset <= startNode.length);

						while( !startOffsetNodeFound ){
							startNodeIndex++;
							remainingStartOffset -= startNode.length;
							startNode = $textNodes.eq(startNodeIndex).oo();

							startOffsetNodeFound = (remainingStartOffset <= startNode.length);
						}

						range.setStart(startNode, remainingStartOffset);
					}

					if( $.isSet(endOffset) ){
						var remainingEndOffset = endOffset,
							endOffsetNodeFound = (remainingEndOffset <= endNode.length);

						while( !endOffsetNodeFound ){
							endNodeIndex--;
							remainingEndOffset -= endNode.length;
							endNode = $textNodes.eq(endNodeIndex).oo();

							endOffsetNodeFound = (remainingEndOffset <= endNode.length);
						}

						range.setEnd(endNode, endNode.length - remainingEndOffset);
					}
				}

		        selection.removeAllRanges();
		        selection.addRange(range);

				selectionText = range.toString();
		    } else if( $.exists('body.createTextRange', document) ){
		        range = document.body.createTextRange();
		        range.moveToElementText($(this).oo());

				if( $.isSet(startOffset) ){
					range.moveStart('character', startOffset);
				}

				if( $.isSet(endOffset) ){
					range.moveEnd('character', -endOffset);
				}

		        range.select();

				selectionText = range.text;
			}
		});


		if( !returnSelectedText ){
			return this;
		} else {
			return selectionText;
		}
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
		eventType = $.orDefault(eventType, 'click', 'string');
		subject = $.orDefault(subject, '', 'string');
		body = $.orDefault(body, '', 'string');

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
		eventType = $.orDefault(eventType, 'click', 'string');

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
	 * Transforms :radio, :checkbox, select and :file to stylable representations of themselves.
	 * This method mostly wraps the inputs in labels, if none is present and sets up event handlers for
	 * interactions between the label and the widget. This method only sets the most basic styling necessary for
	 * the proposed functionality, everything visual has to be defined via CSS.
	 *
	 * :checkbox / :radio
	 * - find the closest label*
	 * - toggle class "checked" on the label on input change
	 * - in case of :radio syncs all inputs with same name
	 * - change is triggered automatically since label is connected to (now invisible) input
	 *
	 * select
	 * - create a selectProxy-element
	 * - insert a selectLabel into it, displaying the currently selected value text
	 * - insert the select invisible on top
	 * - position select and label fittingly over each other with select on top to catch clicks
	 *
	 * :file
	 * - find the closest label*
	 * - position the :file invisibly in the label, receiving clicks from the label
	 * - if the label does not enclose the input at the start, the input will be put into it and for-attrs will be removed
	 *
	 * *finding the closest label first tries to find an existing label by id, then looks at parent()
	 *  and wraps the input in a label if no label could be found
	 *
	 * @param  {?String} [containerClass] - if set, adds this class string to the input's newly created container element
	 * @param  {?String} [labelText] - if set, sets this text as the text content of the input labels if any, does nothing for select
	 * @returns {Object} this
	 **/
	makeStylable : function(containerClass, labelText){
		containerClass = $.orDefault(containerClass, null, 'string');
		labelText = $.orDefault(labelText, null, 'string');

		var _this_ = this;

		var fGetClosestLabel = function($target){
			var hasId = $.isSet($target.attr('id')),
				$label = [];

			if( hasId ){
				$label = $('label[for='+$target.attr('id')+']');
			}

			if( $label.length === 0 ){
				$label = $target.parent('label');
			}

			if( $label.length === 0 ){
				$target.wrap('<label></label>');
				$label = $target.parent('label');
			}

			return $label;
		};

		var fSetContainerClass = function($container){
			if( $.isSet(containerClass) ){
				$container.addClass(containerClass);
			}
		};

		var fSetLabelText = function($label){
			if( $.isSet(labelText) ){
				var $textNodes = $label.findTextNodes();

				if( $textNodes.length > 0 ){
					$textNodes.each(function(){
						$(this).oo().textContent = labelText;
					});
				} else {
					$label.append(labelText);
				}
			}
		};

		$(this).each(function(){
			var $label, $siblingLabel, $selectProxy;

			if( $(this).is(':checkbox, :radio') ){
				$label = fGetClosestLabel($(this));
				fSetContainerClass($label);
				fSetLabelText($label);

				$(this)
					.on('change', function(){
						if( $(this).is(':checked') ){
							$label.addClass('checked');
						} else {
							$label.removeClass('checked');
						}

						if( $(this).is(':radio') && $.isSet($(this).attr('name')) ){
							$(':radio[name='+$(this).attr('name')+']').not($(this)).each(function(){
								$siblingLabel = fGetClosestLabel($(this));
								$siblingLabel.removeClass('checked');
							});
						}
					})
				;

				if( $(this).is(':visible') ){
					$(this).hide();
				}
			} else if( $(this).is('select') ){
				$(this).css({
					'opacity' : 0.01,
					'position' : 'relative',
					'width' : '100%',
					'height' : '100%'
				});

				$label = $.elem('span')
					.addClass('selectlabel')
					.css({
						'position' : 'absolute',
						'top' : 0,
						'right' : 0,
						'bottom' : 0,
						'left' : 0
					})
					.text($(this).children('option').first().text())
				;

				$selectProxy = $.elem('div')
					.addClass('selectproxy')
					.css('position', 'relative')
				;
				fSetContainerClass($selectProxy);

				if( $.isSet($(this).attr('id')) ){
					$selectProxy.attr('id', 'selectproxy-for-'+$(this).attr('id'));
				}

				$(this).before($selectProxy);
				$selectProxy
					.append($label)
					.append($(this))
				;

				$(this)
					.on('click', function(e){
						e.stopPropagation();
					})
					.on('change', function(){
						var $selectedOption = $(this).children('option:selected').first();
						if( $selectedOption.length > 0 ){
							$label.text($selectedOption.text());
						}
					})
					.triggerHandler('change')
				;

				$selectProxy.on('click', function(){
					$(this).children('select').click();
				});
			} else if( $(this).is(':file') ){
				$label = fGetClosestLabel($(this));
				$label
					.append($(this))
					.removeAttr('for')
				;
				fSetContainerClass($label);
				fSetLabelText($label);

				$label.css('position', 'relative');

				$(this).css({
					'opacity' : 0.01,
					'position' : 'absolute',
					'width' : 1,
					'height' : 1,
					'top' : 0,
					'left' : 0
				});
			}
		});

		return this;
	},



	/**
	 * Treats touchstart, touchmove and touchend events on the element internally
	 * as mousedown, mousemove and mouseup events and remaps event coordinates correctly.
	 *
	 * @param {?Boolean} [ignoreChildren=false] - defines if only the element itself should count and whether to ignore bubbling
	 * @returns {Object} this
	 **/
	simulateTouchEvents : function(ignoreChildren){
		$(this).on('touchstart touchmove touchend', function(e){
			var isTarget = (e.target == this);

			if( isTarget || !$.isSet(ignoreChildren) || !ignoreChildren ){
				var alreadyTested = (!isTarget && e.target.__ajqmeclk),
					orgEvent = e.originalEvent;

				if(
					(alreadyTested !== true)
					&& $.isSet(orgEvent)
					&& $.isSet(orgEvent.touches)
					&& (orgEvent.touches.length <= 1)
					&& ($.inArray(orgEvent.type.toLowerCase(), $.jqueryAnnexData.touch.types) < 0)
				){
					var objectEvents = ( !isTarget && !$.isA(alreadyTested, 'boolean') ) ? $(e.target).data('events') : false,
						eventNeedsReplacement = false;

					if( !isTarget ){
						e.target.__ajqmeclk = objectEvents;
						eventNeedsReplacement =
							$.isSet(objectEvents)
							&& ($.isSet(objectEvents.click) || $.isSet(objectEvents.mousedown) || $.isSet(objectEvents.mouseup) || $.isSet(objectEvents.mousemove))
						;
					} else {
						eventNeedsReplacement = false;
					}

					if( !eventNeedsReplacement && ($.inArray(e.target.tagName.toLowerCase(), $.jqueryAnnexData.touch.inputs) < 0) ){
						var touch = orgEvent.changedTouches[0],
							mouseEvent = document.createEvent("MouseEvent");

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
	 * Configures and sets the element's background image to a normal or highdpi-version depending on the display context.
	 *
	 * images is an array of the form [{}, {}, ...], where each object should look like this (widths and heights being optional):
	 * {standard : {url : '...', width : 150, height : 150}, highdpi : {url : '...', width : 150, height : 150}}
	 * To supply a single background you can also just provide one object.
	 *
	 * This function tries to implement a smart way of selecting the right image version.
	 * If image/container dimensions are set the highdpi-version is chosen based on contextHasHighDpi(), but if
	 * dimensions were not defined, it's tried to determine the maxpage width, either per pageMaxWidth or by looking
	 * at css max-width of body and the high dpi is only applied if the viewport is larger than half the max size, so
	 * we'll never load giant images unnecessarily on small devices, although they may have high dpi. You can force this
	 * behaviour with ignoreDims.
	 *
	 * All images hooked via this function are polled and adapted with a delay after each resize.
	 *
	 * If no dimensions are set on the image the element's css is resposible to set a background-size value.
	 *
	 * @param  {(Object|Array)} images - the image(s) to apply, see definition in description above
	 * @param  {?(Number.Integer|String)} [pageMaxWidth=*max-width of body or 0*] - either the page max size directly or a selector to get the max-size from via css
	 * @param  {?Boolean} [ignoreDims=false] - if set, always tries to keep viewport vs. page max size in mind before setting image version, even if dims are set
	 * @param  {?Number.Integer} [reactionDelayMs=500] - the delay after each window resize before the images are checked and adapted
	 * @returns {Object} this
	 **/
	highDpiBackgroundImage : function(images, pageMaxWidth, ignoreDims, reactionDelayMs){
		images = $.isPlainObject(images) ? [images] : images;
		pageMaxWidth = $.isInt(pageMaxWidth) ? pageMaxWidth : ($.isSet(pageMaxWidth) ? $.cssToInt($(''+pageMaxWidth).css('max-width')) : null);
		ignoreDims = $.orDefault(ignoreDims, false, 'bool');
		reactionDelayMs = $.orDefault(reactionDelayMs, 500, 'int');

		if( !$.isSet(pageMaxWidth) ){
			pageMaxWidth = $.cssToInt($('body').css('max-width'));

			if( $.isNaN(pageMaxWidth) ){
				pageMaxWidth = 0;
			}
		}

		var _this_ = this;

		var fSelectImageVersion = function(){
			if( $(_this_).isInDom() ){
				var imagesToPreload = [],
					cssImgUrls = '',
					cssImgSizes = '',
					highDpi = $.contextHasHighDpi(),
					vpWidth = window.innerWidth || $(window).width();

				for( var imageIndex = 0; imageIndex < images.length; imageIndex++ ){
					var image = images[imageIndex];

					if( $.exists('standard.url', image) ){
						if( !$.exists('highdpi', image)  ){
							image.highdpi = $.extend({}, image.standard);
						}

						var smartAdapt = !$.isSet(image.standard.width, image.standard.height, image.highdpi.width, image.highdpi.height) || ignoreDims,
							imageToUse = {
								url : image.standard.url,
								width: image.standard.width,
								height : image.standard.height
							}
						;

						if(
							(smartAdapt && (vpWidth > (pageMaxWidth / 2)) && highDpi)
							|| (!smartAdapt && highDpi)
						){
							imageToUse.url = image.highdpi.url;
							imageToUse.width = parseInt(image.highdpi.width, 10);
							imageToUse.height = parseInt(image.highdpi.height, 10);
						}

						imagesToPreload.push(imageToUse.url);
						cssImgUrls += ((cssImgUrls !== '') ? ', ' : '') + 'url('+imageToUse.url+')';
						if( $.isSet(imageToUse.width, imageToUse.height) && (imageToUse.width > 0) && (imageToUse.height > 0) ){
							cssImgSizes += ((cssImgSizes !== '') ? ', ' : '') + imageToUse.width+'px '+imageToUse.height+'px';
						}
					} else {
						$.log('highDpiBackgroundImage | image is missing a standard dict:', image);
					}
				}

				var preloadImage = null,
					preloadedCount = 0;

				for( var imageToPreloadIndex = 0; imageToPreloadIndex < imagesToPreload.length; imageToPreloadIndex++ ){
					preloadImage = new Image();
					$(preloadImage).imgLoad(function(){
						preloadedCount++;
						if( preloadedCount >= imagesToPreload.length ){
							$(_this_)
								.css('background-image', cssImgUrls)
								.cssCrossBrowser({'background-size' : cssImgSizes})
							;
						}
					});
					preloadImage.src = imagesToPreload[imageToPreloadIndex];
				}
			}
		};

		fSelectImageVersion();
		$.jqueryAnnexData.highDpiBackgroundImages.targetClosures.push(fSelectImageVersion);

		$(window)
			.off('resize.highDpiBackgroundImages')
			.on('resize.highDpiBackgroundImages', function(){
				$.jqueryAnnexData.highDpiBackgroundImages.checkTimer = $.reschedule(
					$.jqueryAnnexData.highDpiBackgroundImages.checkTimer,
					reactionDelayMs,
					function(){
						for( var i = 0; i < $.jqueryAnnexData.highDpiBackgroundImages.targetClosures.length; i++ ){
							$.jqueryAnnexData.highDpiBackgroundImages.targetClosures[i]();
						}
					}
				);
			})
		;

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



//--|PROPERTY-INITIALIZATIONS----------

// see $.Class above for signature
$.Class.extend = function(child){
	var _super = this.prototype;

	$.jqueryAnnexData.inheritance.initializing = true;
	var prototype = new this();
	$.jqueryAnnexData.inheritance.initializing = false;

	for( var name in child ){
		prototype[name] =
			(
				(typeof child[name] == 'function')
				&& (typeof _super[name] == 'function')
				&& $.jqueryAnnexData.inheritance.fnTest.test(child[name])
			)
			? (
				(function(name, fn){
					return function(){
						var tmp = this._super;

						this._super = _super[name];

						var ret = fn.apply(this, arguments);
						this._super = tmp;

						return ret;
					};
				})(name, child[name])
			)
			: child[name]
		;
	}

	function Class(){
		if( !$.jqueryAnnexData.inheritance.initializing && this.init ){
			this.init.apply(this, arguments);
		}
	}

	Class.prototype = prototype;
	Class.prototype.constructor = Class;
	Class.extend = arguments.callee;

	return Class;
};
