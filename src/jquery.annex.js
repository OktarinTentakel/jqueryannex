/**
 * jQueryAnnex
 * Added functions / algorithms / helpers for jQuery.
 * Includes simplifications and streamlined (jQuery-lized) versions of traditional vanilla js-functionality,
 * standard solutions for everyday JS-tasks and little syntax extensions.
 *
 * I'm always trying to fit this add-on with the most current version of jQuery, which could mean, that methods
 * with functionality, that has been integrated into the core, may be replaced or removed, depending on the implemented syntax.
 *
 * Always use the current version of this add-on with the current version of jQuery and keep an eye on the changes.
 *
 * @author Sebastian Schlapkohl <jqueryannex@ifschleife.de>
 * @version Revision 45 developed and tested with jQuery 3.6.1, 2.2.4 and 1.12.4
 **/



// automatically determine if annex should be loaded traditionally, as an AMD-module or via commonjs, if included before anything that
// exposes "define" (require.js e.g.), it will load normally, extending jQuery directly and globally
(function(global, factory){
	var jQuery = global.jQuery || global.$;

	if( (typeof define === 'function') && define.amd ){
		define(['jquery'], factory);
	} else if( (typeof module === 'object') && module.exports ){
		module.exports = jQuery
			? factory(jQuery)
			: function(jQuery){
				return factory(jQuery);
			}
		;
	} else {
		factory(jQuery);
	}
}((typeof window !== 'undefined') ? window : this, function($){

	//--|CHECK-AND-PREPARE-JQUERY----------

	(function(){
		if( !$ || !$.fn || !$().jquery ){
			throw new Error('jQueryAnnex | cannot extend jQuery, since it does not seem to be available as "jQuery" or is missing basic functionality');
		}

		var jQueryVersion = $().jquery.split('.'),
			requiredVersions = {
				'1' : '12.4',
				'2' : '2.4',
				'3' : '6.1'
			},
			versionMayBeDeprecated = false;

		if( requiredVersions[jQueryVersion[0]] ){
			$.each(requiredVersions[jQueryVersion[0]].split('.'), function(index, versionPart){
				if( jQueryVersion[index + 1] ){
					if( parseInt(jQueryVersion[index + 1], 10) < parseInt(versionPart, 10) ){
						versionMayBeDeprecated = true;
						return false;
					} else if( parseInt(jQueryVersion[index + 1], 10) > parseInt(versionPart, 10) ){
						return false;
					}
				} else {
					versionMayBeDeprecated = true;
					return false;
				}
			});
		} else {
			if( window.console && (typeof window.console.warn === 'function') ){
				window.console.warn('jQueryAnnex | the available jQuery version is unknown, use at your own risk');
			}
		}

		if( versionMayBeDeprecated ){
			if( window.console && (typeof window.console.warn === 'function') ){
				window.console.warn('jQueryAnnex | the available jQuery version is older than '+jQueryVersion[0]+'.'+requiredVersions[jQueryVersion[0]]+', use at your own risk');
			}
		}
	}());



	//--|PRIVATE-UTILITY-FUNCTIONS----------

	var _utils = {};

	// generically wraps console functions for chainability even if method is unavailable or fails
	// used in jqueryAnnexData.logging.chainable
	_utils.genericConsoleMethodWrapper = function(name, executeIfLoggingDisabled){
		executeIfLoggingDisabled = executeIfLoggingDisabled ? !!executeIfLoggingDisabled : false;

		if( $.jqueryAnnexData.logging.enabled || executeIfLoggingDisabled ){
			if( $.exists('console') && $.isFunction(console[''+name]) ){
				var args = $.makeArray(arguments).slice(2);

				try {
					if( $.jqueryAnnexData.logging.tryToLogToParent ){
						parent.console[''+name].apply(parent.console, args);
					} else {
						console[''+name].apply(console, args);
					}
				} catch(ex){
					$.warn('console call to "'+name+'" failed, implementation seemingly incompatible');
				}
			} else {
				$.warn('console call to "'+name+'" failed, is seemingly not supported');
			}
		}

		return $.log();
	};

	// prepare an executable wrapper version based on a specific function name
	// used in jqueryAnnexData.logging.chainable
	_utils.genericConsoleMethodWrapperFactory = function(name, executeIfLoggingDisabled){
		executeIfLoggingDisabled = executeIfLoggingDisabled ? !!executeIfLoggingDisabled : false;
		return function(){ return _utils.genericConsoleMethodWrapper.apply(_utils, $.merge([''+name, executeIfLoggingDisabled], $.makeArray(arguments))); };
	};



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
				originalLoggingFunction : ((window.console !== undefined) && $.isFunction(window.console.log)) ? window.console.log : $.noop,
				enabled : true,
				tryToLogToParent : false,
				chainable : {
					__chainable_object_of_log_execute_for_doc__ : function(){
						return 'Use this object to chain logging calls. All standard methods are supported'
							+' (see https://developer.mozilla.org/en-US/docs/Web/API/Console) and are executed'
							+' with silent fails if not supported by the browser. See other methods in this'
							+' object for an overview. Use disable()/enable() to deactivate/activate all debug outputs'
							+' (exceptions are assert, clear, error and warn) to the console centrally'
						;
					},
					disable : function(){
						if( $.jqueryAnnexData.logging.enabled ){
							console.log = $.noop;
							$.jqueryAnnexData.logging.enabled = false;
						}

						return $.log();
					},
					enable : function(){
						if( !$.jqueryAnnexData.logging.enabled ){
							console.log = $.jqueryAnnexData.logging.originalLoggingFunction;
							$.jqueryAnnexData.logging.enabled = true;
						}

						return $.log();
					},
					tryToLogToParent : function(setting){
						setting = (setting === undefined) ? true : !!setting;
						$.jqueryAnnexData.logging.tryToLogToParent = setting;

						return $.log();
					},
					assert : _utils.genericConsoleMethodWrapperFactory('assert', true),
					clear : _utils.genericConsoleMethodWrapperFactory('clear', true),
					count : _utils.genericConsoleMethodWrapperFactory('count'),
					dir : _utils.genericConsoleMethodWrapperFactory('dir'),
					dirxml : _utils.genericConsoleMethodWrapperFactory('dirxml'),
					dirXml : _utils.genericConsoleMethodWrapperFactory('dirxml'),
					error : function(){
						$.err.apply($, $.makeArray(arguments));
						return $.log();
					},
					group : _utils.genericConsoleMethodWrapperFactory('group'),
					groupCollapsed : _utils.genericConsoleMethodWrapperFactory('groupCollapsed'),
					groupEnd : _utils.genericConsoleMethodWrapperFactory('groupEnd'),
					info : _utils.genericConsoleMethodWrapperFactory('info'),
					log : function(){
						return $.log.apply($, $.makeArray(arguments));
					},
					profile : _utils.genericConsoleMethodWrapperFactory('profile'),
					profileEnd : _utils.genericConsoleMethodWrapperFactory('profileEnd'),
					table : _utils.genericConsoleMethodWrapperFactory('table'),
					time : _utils.genericConsoleMethodWrapperFactory('time'),
					timeEnd : _utils.genericConsoleMethodWrapperFactory('timeEnd'),
					timeStamp : _utils.genericConsoleMethodWrapperFactory('timeStamp'),
					trace : _utils.genericConsoleMethodWrapperFactory('trace'),
					warn : function(){
						$.warn.apply($, $.makeArray(arguments));
						return $.log();
					}
				},
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
			slugify : {
				latinMap : {'Á':'A','Ă':'A','Ắ':'A','Ặ':'A','Ằ':'A','Ẳ':'A','Ẵ':'A','Ǎ':'A','Â':'A','Ấ':'A','Ậ':'A','Ầ':'A','Ẩ':'A','Ẫ':'A','Ä':'A','Ǟ':'A','Ȧ':'A','Ǡ':'A','Ạ':'A','Ȁ':'A','À':'A','Ả':'A','Ȃ':'A','Ā':'A','Ą':'A','Å':'A','Ǻ':'A','Ḁ':'A','Ⱥ':'A','Ã':'A','Ꜳ':'AA','Æ':'AE','Ǽ':'AE','Ǣ':'AE','Ꜵ':'AO','Ꜷ':'AU','Ꜹ':'AV','Ꜻ':'AV','Ꜽ':'AY','Ḃ':'B','Ḅ':'B','Ɓ':'B','Ḇ':'B','Ƀ':'B','Ƃ':'B','Ć':'C','Č':'C','Ç':'C','Ḉ':'C','Ĉ':'C','Ċ':'C','Ƈ':'C','Ȼ':'C','Ď':'D','Ḑ':'D','Ḓ':'D','Ḋ':'D','Ḍ':'D','Ɗ':'D','Ḏ':'D','ǲ':'D','ǅ':'D','Đ':'D','Ƌ':'D','Ǳ':'DZ','Ǆ':'DZ','É':'E','Ĕ':'E','Ě':'E','Ȩ':'E','Ḝ':'E','Ê':'E','Ế':'E','Ệ':'E','Ề':'E','Ể':'E','Ễ':'E','Ḙ':'E','Ë':'E','Ė':'E','Ẹ':'E','Ȅ':'E','È':'E','Ẻ':'E','Ȇ':'E','Ē':'E','Ḗ':'E','Ḕ':'E','Ę':'E','Ɇ':'E','Ẽ':'E','Ḛ':'E','Ꝫ':'ET','Ḟ':'F','Ƒ':'F','Ǵ':'G','Ğ':'G','Ǧ':'G','Ģ':'G','Ĝ':'G','Ġ':'G','Ɠ':'G','Ḡ':'G','Ǥ':'G','Ḫ':'H','Ȟ':'H','Ḩ':'H','Ĥ':'H','Ⱨ':'H','Ḧ':'H','Ḣ':'H','Ḥ':'H','Ħ':'H','Í':'I','Ĭ':'I','Ǐ':'I','Î':'I','Ï':'I','Ḯ':'I','İ':'I','Ị':'I','Ȉ':'I','Ì':'I','Ỉ':'I','Ȋ':'I','Ī':'I','Į':'I','Ɨ':'I','Ĩ':'I','Ḭ':'I','Ꝺ':'D','Ꝼ':'F','Ᵹ':'G','Ꞃ':'R','Ꞅ':'S','Ꞇ':'T','Ꝭ':'IS','Ĵ':'J','Ɉ':'J','Ḱ':'K','Ǩ':'K','Ķ':'K','Ⱪ':'K','Ꝃ':'K','Ḳ':'K','Ƙ':'K','Ḵ':'K','Ꝁ':'K','Ꝅ':'K','Ĺ':'L','Ƚ':'L','Ľ':'L','Ļ':'L','Ḽ':'L','Ḷ':'L','Ḹ':'L','Ⱡ':'L','Ꝉ':'L','Ḻ':'L','Ŀ':'L','Ɫ':'L','ǈ':'L','Ł':'L','Ǉ':'LJ','Ḿ':'M','Ṁ':'M','Ṃ':'M','Ɱ':'M','Ń':'N','Ň':'N','Ņ':'N','Ṋ':'N','Ṅ':'N','Ṇ':'N','Ǹ':'N','Ɲ':'N','Ṉ':'N','Ƞ':'N','ǋ':'N','Ñ':'N','Ǌ':'NJ','Ó':'O','Ŏ':'O','Ǒ':'O','Ô':'O','Ố':'O','Ộ':'O','Ồ':'O','Ổ':'O','Ỗ':'O','Ö':'O','Ȫ':'O','Ȯ':'O','Ȱ':'O','Ọ':'O','Ő':'O','Ȍ':'O','Ò':'O','Ỏ':'O','Ơ':'O','Ớ':'O','Ợ':'O','Ờ':'O','Ở':'O','Ỡ':'O','Ȏ':'O','Ꝋ':'O','Ꝍ':'O','Ō':'O','Ṓ':'O','Ṑ':'O','Ɵ':'O','Ǫ':'O','Ǭ':'O','Ø':'O','Ǿ':'O','Õ':'O','Ṍ':'O','Ṏ':'O','Ȭ':'O','Ƣ':'OI','Ꝏ':'OO','Ɛ':'E','Ɔ':'O','Ȣ':'OU','Ṕ':'P','Ṗ':'P','Ꝓ':'P','Ƥ':'P','Ꝕ':'P','Ᵽ':'P','Ꝑ':'P','Ꝙ':'Q','Ꝗ':'Q','Ŕ':'R','Ř':'R','Ŗ':'R','Ṙ':'R','Ṛ':'R','Ṝ':'R','Ȑ':'R','Ȓ':'R','Ṟ':'R','Ɍ':'R','Ɽ':'R','Ꜿ':'C','Ǝ':'E','Ś':'S','Ṥ':'S','Š':'S','Ṧ':'S','Ş':'S','Ŝ':'S','Ș':'S','Ṡ':'S','Ṣ':'S','Ṩ':'S','ẞ':'SS','Ť':'T','Ţ':'T','Ṱ':'T','Ț':'T','Ⱦ':'T','Ṫ':'T','Ṭ':'T','Ƭ':'T','Ṯ':'T','Ʈ':'T','Ŧ':'T','Ɐ':'A','Ꞁ':'L','Ɯ':'M','Ʌ':'V','Ꜩ':'TZ','Ú':'U','Ŭ':'U','Ǔ':'U','Û':'U','Ṷ':'U','Ü':'U','Ǘ':'U','Ǚ':'U','Ǜ':'U','Ǖ':'U','Ṳ':'U','Ụ':'U','Ű':'U','Ȕ':'U','Ù':'U','Ủ':'U','Ư':'U','Ứ':'U','Ự':'U','Ừ':'U','Ử':'U','Ữ':'U','Ȗ':'U','Ū':'U','Ṻ':'U','Ų':'U','Ů':'U','Ũ':'U','Ṹ':'U','Ṵ':'U','Ꝟ':'V','Ṿ':'V','Ʋ':'V','Ṽ':'V','Ꝡ':'VY','Ẃ':'W','Ŵ':'W','Ẅ':'W','Ẇ':'W','Ẉ':'W','Ẁ':'W','Ⱳ':'W','Ẍ':'X','Ẋ':'X','Ý':'Y','Ŷ':'Y','Ÿ':'Y','Ẏ':'Y','Ỵ':'Y','Ỳ':'Y','Ƴ':'Y','Ỷ':'Y','Ỿ':'Y','Ȳ':'Y','Ɏ':'Y','Ỹ':'Y','Ź':'Z','Ž':'Z','Ẑ':'Z','Ⱬ':'Z','Ż':'Z','Ẓ':'Z','Ȥ':'Z','Ẕ':'Z','Ƶ':'Z','Ĳ':'IJ','Œ':'OE','ᴀ':'A','ᴁ':'AE','ʙ':'B','ᴃ':'B','ᴄ':'C','ᴅ':'D','ᴇ':'E','ꜰ':'F','ɢ':'G','ʛ':'G','ʜ':'H','ɪ':'I','ʁ':'R','ᴊ':'J','ᴋ':'K','ʟ':'L','ᴌ':'L','ᴍ':'M','ɴ':'N','ᴏ':'O','ɶ':'OE','ᴐ':'O','ᴕ':'OU','ᴘ':'P','ʀ':'R','ᴎ':'N','ᴙ':'R','ꜱ':'S','ᴛ':'T','ⱻ':'E','ᴚ':'R','ᴜ':'U','ᴠ':'V','ᴡ':'W','ʏ':'Y','ᴢ':'Z','á':'a','ă':'a','ắ':'a','ặ':'a','ằ':'a','ẳ':'a','ẵ':'a','ǎ':'a','â':'a','ấ':'a','ậ':'a','ầ':'a','ẩ':'a','ẫ':'a','ä':'a','ǟ':'a','ȧ':'a','ǡ':'a','ạ':'a','ȁ':'a','à':'a','ả':'a','ȃ':'a','ā':'a','ą':'a','ᶏ':'a','ẚ':'a','å':'a','ǻ':'a','ḁ':'a','ⱥ':'a','ã':'a','ꜳ':'aa','æ':'ae','ǽ':'ae','ǣ':'ae','ꜵ':'ao','ꜷ':'au','ꜹ':'av','ꜻ':'av','ꜽ':'ay','ḃ':'b','ḅ':'b','ɓ':'b','ḇ':'b','ᵬ':'b','ᶀ':'b','ƀ':'b','ƃ':'b','ɵ':'o','ć':'c','č':'c','ç':'c','ḉ':'c','ĉ':'c','ɕ':'c','ċ':'c','ƈ':'c','ȼ':'c','ď':'d','ḑ':'d','ḓ':'d','ȡ':'d','ḋ':'d','ḍ':'d','ɗ':'d','ᶑ':'d','ḏ':'d','ᵭ':'d','ᶁ':'d','đ':'d','ɖ':'d','ƌ':'d','ı':'i','ȷ':'j','ɟ':'j','ʄ':'j','ǳ':'dz','ǆ':'dz','é':'e','ĕ':'e','ě':'e','ȩ':'e','ḝ':'e','ê':'e','ế':'e','ệ':'e','ề':'e','ể':'e','ễ':'e','ḙ':'e','ë':'e','ė':'e','ẹ':'e','ȅ':'e','è':'e','ẻ':'e','ȇ':'e','ē':'e','ḗ':'e','ḕ':'e','ⱸ':'e','ę':'e','ᶒ':'e','ɇ':'e','ẽ':'e','ḛ':'e','ꝫ':'et','ḟ':'f','ƒ':'f','ᵮ':'f','ᶂ':'f','ǵ':'g','ğ':'g','ǧ':'g','ģ':'g','ĝ':'g','ġ':'g','ɠ':'g','ḡ':'g','ᶃ':'g','ǥ':'g','ḫ':'h','ȟ':'h','ḩ':'h','ĥ':'h','ⱨ':'h','ḧ':'h','ḣ':'h','ḥ':'h','ɦ':'h','ẖ':'h','ħ':'h','ƕ':'hv','í':'i','ĭ':'i','ǐ':'i','î':'i','ï':'i','ḯ':'i','ị':'i','ȉ':'i','ì':'i','ỉ':'i','ȋ':'i','ī':'i','į':'i','ᶖ':'i','ɨ':'i','ĩ':'i','ḭ':'i','ꝺ':'d','ꝼ':'f','ᵹ':'g','ꞃ':'r','ꞅ':'s','ꞇ':'t','ꝭ':'is','ǰ':'j','ĵ':'j','ʝ':'j','ɉ':'j','ḱ':'k','ǩ':'k','ķ':'k','ⱪ':'k','ꝃ':'k','ḳ':'k','ƙ':'k','ḵ':'k','ᶄ':'k','ꝁ':'k','ꝅ':'k','ĺ':'l','ƚ':'l','ɬ':'l','ľ':'l','ļ':'l','ḽ':'l','ȴ':'l','ḷ':'l','ḹ':'l','ⱡ':'l','ꝉ':'l','ḻ':'l','ŀ':'l','ɫ':'l','ᶅ':'l','ɭ':'l','ł':'l','ǉ':'lj','ſ':'s','ẜ':'s','ẛ':'s','ẝ':'s','ḿ':'m','ṁ':'m','ṃ':'m','ɱ':'m','ᵯ':'m','ᶆ':'m','ń':'n','ň':'n','ņ':'n','ṋ':'n','ȵ':'n','ṅ':'n','ṇ':'n','ǹ':'n','ɲ':'n','ṉ':'n','ƞ':'n','ᵰ':'n','ᶇ':'n','ɳ':'n','ñ':'n','ǌ':'nj','ó':'o','ŏ':'o','ǒ':'o','ô':'o','ố':'o','ộ':'o','ồ':'o','ổ':'o','ỗ':'o','ö':'o','ȫ':'o','ȯ':'o','ȱ':'o','ọ':'o','ő':'o','ȍ':'o','ò':'o','ỏ':'o','ơ':'o','ớ':'o','ợ':'o','ờ':'o','ở':'o','ỡ':'o','ȏ':'o','ꝋ':'o','ꝍ':'o','ⱺ':'o','ō':'o','ṓ':'o','ṑ':'o','ǫ':'o','ǭ':'o','ø':'o','ǿ':'o','õ':'o','ṍ':'o','ṏ':'o','ȭ':'o','ƣ':'oi','ꝏ':'oo','ɛ':'e','ᶓ':'e','ɔ':'o','ᶗ':'o','ȣ':'ou','ṕ':'p','ṗ':'p','ꝓ':'p','ƥ':'p','ᵱ':'p','ᶈ':'p','ꝕ':'p','ᵽ':'p','ꝑ':'p','ꝙ':'q','ʠ':'q','ɋ':'q','ꝗ':'q','ŕ':'r','ř':'r','ŗ':'r','ṙ':'r','ṛ':'r','ṝ':'r','ȑ':'r','ɾ':'r','ᵳ':'r','ȓ':'r','ṟ':'r','ɼ':'r','ᵲ':'r','ᶉ':'r','ɍ':'r','ɽ':'r','ↄ':'c','ꜿ':'c','ɘ':'e','ɿ':'r','ś':'s','ṥ':'s','š':'s','ṧ':'s','ş':'s','ŝ':'s','ș':'s','ṡ':'s','ṣ':'s','ṩ':'s','ʂ':'s','ᵴ':'s','ᶊ':'s','ȿ':'s','ɡ':'g','ß':'ss','ᴑ':'o','ᴓ':'o','ᴝ':'u','ť':'t','ţ':'t','ṱ':'t','ț':'t','ȶ':'t','ẗ':'t','ⱦ':'t','ṫ':'t','ṭ':'t','ƭ':'t','ṯ':'t','ᵵ':'t','ƫ':'t','ʈ':'t','ŧ':'t','ᵺ':'th','ɐ':'a','ᴂ':'ae','ǝ':'e','ᵷ':'g','ɥ':'h','ʮ':'h','ʯ':'h','ᴉ':'i','ʞ':'k','ꞁ':'l','ɯ':'m','ɰ':'m','ᴔ':'oe','ɹ':'r','ɻ':'r','ɺ':'r','ⱹ':'r','ʇ':'t','ʌ':'v','ʍ':'w','ʎ':'y','ꜩ':'tz','ú':'u','ŭ':'u','ǔ':'u','û':'u','ṷ':'u','ü':'u','ǘ':'u','ǚ':'u','ǜ':'u','ǖ':'u','ṳ':'u','ụ':'u','ű':'u','ȕ':'u','ù':'u','ủ':'u','ư':'u','ứ':'u','ự':'u','ừ':'u','ử':'u','ữ':'u','ȗ':'u','ū':'u','ṻ':'u','ų':'u','ᶙ':'u','ů':'u','ũ':'u','ṹ':'u','ṵ':'u','ᵫ':'ue','ꝸ':'um','ⱴ':'v','ꝟ':'v','ṿ':'v','ʋ':'v','ᶌ':'v','ⱱ':'v','ṽ':'v','ꝡ':'vy','ẃ':'w','ŵ':'w','ẅ':'w','ẇ':'w','ẉ':'w','ẁ':'w','ⱳ':'w','ẘ':'w','ẍ':'x','ẋ':'x','ᶍ':'x','ý':'y','ŷ':'y','ÿ':'y','ẏ':'y','ỵ':'y','ỳ':'y','ƴ':'y','ỷ':'y','ỿ':'y','ȳ':'y','ẙ':'y','ɏ':'y','ỹ':'y','ź':'z','ž':'z','ẑ':'z','ʑ':'z','ⱬ':'z','ż':'z','ẓ':'z','ȥ':'z','ẕ':'z','ᵶ':'z','ᶎ':'z','ʐ':'z','ƶ':'z','ɀ':'z','ﬀ':'ff','ﬃ':'ffi','ﬄ':'ffl','ﬁ':'fi','ﬂ':'fl','ĳ':'ij','œ':'oe','ﬆ':'st','ₐ':'a','ₑ':'e','ᵢ':'i','ⱼ':'j','ₒ':'o','ᵣ':'r','ᵤ':'u','ᵥ':'v','ₓ':'x'}
			},
			uuid : {
				usedSinceReload : {
					'none' : null
				}
			},
			scrolling : {
				cursorKeys : {37 : 1, 38 : 1, 39 : 1, 40 : 1},
				preventDefault : function(e){
					e = e || window.event;
					if( e.preventDefault ){
						e.preventDefault();
					}
					e.returnValue = false;
				},
				preventDefaultForScrollKeys : function(e){
					if( $.jqueryAnnexData.scrolling.cursorKeys[e.keyCode] ){
						$.jqueryAnnexData.scrolling.preventDefault(e);
						return false;
					}
				}
			}
		},



		/**
		 * @namespace Logging:$
		 **/

		/**
		 * @namespace Logging:$.log
		 **/

		/**
		 * Logs a message to the console. Prevents errors in browsers, that don't support this feature.
		 * This method is chainable (always returns a chainable object with all methods) and wraps all
		 * advanced logging methods like dir, assert and count (https://developer.mozilla.org/en-US/docs/Web/API/Console).
		 *
		 * Use the methods disable() and enable() of the chainable object to globally disable/enable logging (controlled by
		 * a debug setting for example). assert, clear, warn and error will still work, the rest will be muted.
		 *
		 * You can use the method tryToLogToParent(true/false) to instruct log to try to log to the parent window also,
		 * which comes in handy if you are developing inside a same domain iframe.
		 *
		 * @param {...*} [...] - any number of arguments you wish to log
		 * @returns {Object} - chainable logging object
		 *
		 * @memberof Logging:$.log
		 * @example
		 * $.log(randomVar, 'string');
		 * $.log(false, true);
		 * $.log().group().log(1).log(2).log(3).groupEnd().error('ouch');
		 * $.log().disable();
		 * $.log('test', {test : 'test'}).disable().warn('oh noez, but printed').log('not printed').enable().clear();
		 * $.log().tryToLogToParent().log('hooray times two').tryToLogToParent(false);
		 **/
		log : function(){
			if( this.exists('console') && $.isFunction(console.log) ){
				$.each(arguments, function(index, obj){
					if( $.isA(obj, 'boolean') ){
						obj = obj ? 'true' : 'false';
					}

					if( $.jqueryAnnexData.logging.tryToLogToParent ){
						parent.console.log(obj);
					} else {
						console.log(obj);
					}
				});
			}

			return $.jqueryAnnexData.logging.chainable;
		},



		/**
		 * @namespace Logging:$.warn
		 **/

		/**
		 * Logs a warning to the console. Prevents errors in browsers, that don't support this feature.
		 *
		 * @param {...*} [...] - add any number of arguments you wish to log
		 *
		 * @memberof Logging:$.warn
		 * @example
		 * $.warn('warning yo!');
		 * $.warn(randomVar, 'string');
		 * $.warn(false);
		 * $.warn(true);
		 **/
		warn : function(){
			if( this.exists('console') && $.isFunction(console.warn) ){
				$.each(arguments, function(index, obj){
					if( $.isA(obj, 'boolean') ){
						obj = obj ? 'true' : 'false';
					}

					if( $.jqueryAnnexData.logging.tryToLogToParent ){
						parent.console.warn(obj);
					} else {
						console.warn(obj);
					}
				});
			}
		},



		/**
		 * @namespace Logging:$.err
		 **/

		/**
		 * Logs an error to the console. Prevents errors in browsers, that don't support this feature.
		 *
		 * This function is not named $.error because that already exists in jQuery for another purpose,
		 * namely for exception handling for jQuery plugins. We're not touching that.
		 *
		 * @param {...*} [...] - add any number of arguments you wish to log
		 *
		 * @memberof Logging:$.err
		 * @example
		 * $.err('error yo!');
		 * $.err(randomVar, 'string');
		 * $.err(false);
		 * $.err(true);
		 **/
		err : function(){
			if( this.exists('console') && $.isFunction(console.error) ){
				$.each(arguments, function(index, obj){
					if( $.isA(obj, 'boolean') ){
						obj = obj ? 'true' : 'false';
					}

					if( $.jqueryAnnexData.logging.tryToLogToParent ){
						parent.console.error(obj);
					} else {
						console.error(obj);
					}
				});
			}
		},



		/**
		 * @namespace Logging:$.x
		 **/

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
		 *
		 * @memberof Logging:$.x
		 * @example
		 * for( var i = 0; i < 10; i++ ){
		 *   $.x();
		 * }
		 **/
		x : function(){
			var context = 'anonymous';

			if( this.exists('callee.caller', arguments) && $.isSet(arguments.callee.caller) ){
				if( this.isSet(arguments.callee.caller.name) && ($.trim(arguments.callee.caller.name) !== '') ){
					context = arguments.callee.caller.name;
				} else {
					var functionSourceLines = arguments.callee.caller.toString().split(/\r?\n/, 3);
					if( functionSourceLines.length === 1 ){
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
		 * @namespace Elements:$
		 **/

		/**
		 * @namespace Elements:$.elem
		 **/

		/**
		 * Creates jQuery-enabled DOM-elements on the fly.
		 *
		 * @param {String} tag - name of the tag/element to create
		 * @param {?Object.<String, String>} [attributes] - tag attributes as key/value-pairs
		 * @param {?String} [content] - content to embed into the element, such as text
		 * @returns {Object} jQuery-enabled DOM-element
		 *
		 * @memberof Elements:$.elem
		 * @example
		 * $('body').append(
		 *   $.elem('div', {id : 'content', style : 'display:none;'}, 'loading...');
		 * );
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
		 * @namespace Elements:$.textContent
		 **/

		/**
		 * Return the de-nodified text content of a node-ridden string or a jQuery object.
		 * Returns the raw text content, with all markup cleanly removed.
		 * Can also be used to return only the concatenated child text nodes.
		 *
		 * @param {(String|Object)} nodeInfested - the node-ridden string or jquery object to "clean"
		 * @param {?Boolean} [onlyFirstLevel=false] - true if only the text of direct child text nodes is to be returned
		 * @returns {String} the escaped string
		 *
		 * @memberof Elements:$.textContent
		 * @example
		 * $('p').html($.textContent('<p onlick="destroyWorld();">red button</p>'));
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
						return this.nodeType === 3;
					}).text()
				;
			} else {
				res = $holder.text();
			}

			return $.trim(res);
		},



		/**
		 * @namespace Inheritance:$
		 **/

		/**
		 * @namespace Inheritance:$#Class
		 **/

		/**
		 * @memberof Inheritance:$#Class
		 * @example
		 * var SuperPoweredFoobar = $.Class.extend({
		 *     init : function(){}
		 * });
		 *
		 * var UltraPoweredFoobar = SuperPoweredFoobar.extend({
		 *   init : function(){ this._super(); }
		 * });
		 *
		 * @class
		 * @classdesc
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
		 * this._super() always calls the super method of the one you are in, so in the constructor it calls the constructor
		 * in foobar() it calls super.foobar() automatically.
		 **/
		Class : function(){
			// see INITIALIZATIONS below for extend() source
		},



		/**
		 * @namespace Basic:$
		 **/

		/**
		 * @namespace Basic:$.assert
		 **/

		/**
		 * Classical assert method. If not condition, throw assert exception.
		 *
		 * @param {Boolean} condition - defines if an assertion is successful
		 * @param {?String} [message='assert exception: assertion failed'] - to display if assertion fails
		 * @throws assert exception
		 *
		 * @memberof Basic:$.assert
		 * @example
		 * function set(name, value){
		 *   $.assert(name.length > 0);
		 *   $.assert($.isPlainObject(value), 'error: value must be plain object');
		 *   ...
		 * }
		 **/
		assert : function(condition, message){
			if( !condition ){
				message = this.orDefault(message, 'assert exception: assertion failed', 'string');
				throw new Error(message);
			}
		},



		/**
		 * @namespace Basic:$.attempt
		 **/

		/**
		 * Attempt to compute contents of closure and catch all occurring exceptions.
		 * The boolean result tells you if the operation was successful or not.
		 *
		 * This is most helpful, when used to test value conversions or other atomic/singluar operations, where it
		 * just is important if something isolated works or not.
		 *
		 * Do not encapsulate complex code in the closure and mind recursively occurring exceptions!
		 *
		 * @param {Function} closure - the code to test
		 * @returns {Boolean} true if no exception occurred
		 *
		 * @memberof Basic:$.attempt
		 * @example
		 * if( !$.attempt(function(){ foobar(); }) ){ $.log('foobar cannot be executed!'); }
		 **/
		attempt : function(closure){
			this.assert($.isFunction(closure), 'attempt | closure is not a function');

			try {
				closure();
			} catch(ex){
				return false;
			}

			return true;
		},



		/**
		 * @namespace Basic:$.isSet
		 **/

		/**
		 * Check if variable(s) is set, by being neither undefined nor null.
		 *
		 * @param {...*} [...] - add any number of variables you wish to check
		 * @returns {Boolean} variable(s) is/are set
		 *
		 * @memberof Basic:$.isSet
		 * @example
		 * function set(name, value){
		 *   if( $.isSet(name, value) ){
		 *     ...
		 *   }
		 * }
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
		 * @namespace Basic:$.isEmpty
		 **/

		/**
		 * Check if variable(s) contain non-empty value
		 * (not undefined, null, '', 0, [], {} or an empy Set/Map).
		 *
		 * You can supply additional non-empty values by providing an array as first parameter of the form
		 * ['__additionalempty__', '0', false]
		 * Where the first item identifies the array as empty values, and starting with the second item providing
		 * additional empy values.
		 *
		 * @param {Array} [additionalEmptyValues] - provide additional empty values, array must contain '__additionalempty__' as first element
		 * @param {...*} [...] - add any number of variables you wish to check
		 * @returns {Boolean} variable(s) is/are non-empty
		 *
		 * @memberof Basic:$.isEmpty
		 * @example
		 * function set(name, value){
		 *   if( $.isEmpty(fooBar) || $.isEmpty(['__additionalempty__', false, '0'], someArray, someSet, someString, value) ){
		 *     ...
		 *   }
		 * }
		 **/
		isEmpty : function(additionalEmptyValues){
			var _this_ = this,
				res = true,
				args = null;

			if(
				$.isArray(additionalEmptyValues)
				&& (additionalEmptyValues.length > 0)
				&& (additionalEmptyValues[0] === '__additionalempty__')
			){
				args = $.makeArray(arguments).slice(1);
				additionalEmptyValues = additionalEmptyValues.slice(1);
			} else {
				args = $.makeArray(arguments);
				additionalEmptyValues = [];
			}

			$.each(args, function(index, obj){
				res = (
					(obj === undefined)
					|| (obj === null)
					|| (obj === '')
					|| (obj === 0)
					|| ($.inArray(obj, additionalEmptyValues) >= 0)
				);

				if( !res ){
					if( $.isArray(obj) ){
						res = (obj.length === 0);
					} else if( $.isPlainObject(obj) ){
						res = $.isEmptyObject(obj);
					} else if(
						_this_.isA(obj, 'object')
						&& ($.inArray(
							Object.prototype.toString.call(obj),
							['[object Set]', '[object Map]']
						) >= 0)
					){
						res = (obj.size === 0);
					}
				}

				if( !res ){
					return false;
				}
			});

			return res;
		},



		/**
		 * @namespace Basic:$.hasMembers
		 **/

		/**
		 * "Validates" an object in a very basic way by checking if all given members are present and are not null.
		 *
		 * @param {Object} obj - the object to check
		 * @param {String[]} memberNames - the names of the members to check
		 * @param {Boolean} [verbose=false] - defines if method should ouput missing members to console
		 * @returns {Boolean} all memberNames present and not null
		 *
		 * @memberof Basic:$.hasMembers
		 * @example
		 * function pat(kitten){
		 *   if( $.hasMembers(kitten, ['fluff', 'meow', 'scratch']) ){
		 *     ...
		 *   }
		 * }
		 **/
		hasMembers : function(obj, memberNames, verbose){
			verbose = this.orDefault(verbose, false, 'bool');

			for( var i = 0; i < memberNames.length; i++ ){
				if( !this.isSet(obj[memberNames[i]]) ){
					if( verbose ){
						this.log().info('hasMembers | missing member '+memberNames[i]);
					}
					return false;
				}
			}

			return true;
		},



		/**
		 * @namespace Basic:$.orDefault
		 **/

		/**
		 * If an expression returns an "empty" value,
		 * use the default value instead.
		 *
		 * @param {*} expression - the expression to evaluate
		 * @param {*} defaultValue - the default value to use if the expression is considered empty
		 * @param {?(String|Function)} caster - either a default caster by name ('string', 'String', 'int', 'integer', 'Integer', 'bool', 'boolean', 'Boolean', 'float', 'Float', 'array', 'Array') or a function getting the value and returning the transformed value
		 * @param {?Array} [additionalEmptyValues] - if set, provides a list of additional values to be considered empty, apart from undefined and null
		 * @returns {*} expression of defaultValue
		 *
		 * @memberof Basic:$.orDefault
		 * @example
		 * function set(name, value){
		 *   name = $.orDefault(name, 'kittens!', 'string', ['', 'none']);
		 *   value = $.orDefault(value, 42, 'int');
		 * }
		 **/
		orDefault : function(expression, defaultValue, caster, additionalEmptyValues){
			if( this.isSet(additionalEmptyValues) ){
				additionalEmptyValues = $.isArray(additionalEmptyValues) ? additionalEmptyValues : [additionalEmptyValues];
			} else {
				additionalEmptyValues = [];
			}

			if( this.isSet(caster) ){
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
		 * @namespace Basic:$.exists
		 **/

		/**
		 * Check if a variable is defined in a certain context (normally globally in window).
		 * Or check if a jquery set contains anything based on its selector,
		 * answering if the query-string exists in its context.
		 *
		 * @param {(String|Object)} target - name of the variable to look for (not the variable itself) or a jquery Object
		 * @param {?*} [context=window] - the context in which to look for the variable, holds no meaning for jquery objects
		 * @returns {Boolean} variable exists in context or jQuery-set has length > 0
		 *
		 * @memberof Basic:$.exists
		 * @example
		 * $.exists('MISC_CONFIG');
		 * $.exists('randomProp', this);
		 * $.exists('foo.bar.boo.far', fancyJsonObj);
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
						res = res && _this_.isSet(context[''+value]) && (_this_.isA(context[''+value], 'object') || _this_.isA(context[''+value], 'array'));
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
		 * @namespace Basic:$.isA
		 **/

		/**
		 * Short form of the standard "type"-method with a more compact syntax.
		 * Can identify "boolean", "number", "string", "function", "array", "date", "regexp" and "object".
		 *
		 * @param {*} target - variable to check the type of
		 * @param {String} typeName - the name of the type to check for, has to be a standard JS-type
		 * @returns {Boolean} target has type
		 *
		 * @memberof Basic:$.isA
		 * @example
		 * var stringBool = ($.isA(test, 'boolean') && test) ? 'true' : 'false';
		 **/
		isA : function(target, typeName){
			if( $.inArray(typeName, ['boolean', 'number', 'string', 'function', 'array', 'date', 'regexp', 'object']) >= 0 ){
				return $.type(target) === ''+typeName;
			} else {
				this.log('isA | not asked for valid JS-type');
				return false;
			}
		},



		/**
		 * @namespace Basic:$.isInt
		 **/

		/**
		 * Returns if a value is truly a real integer value and not just an int-parsable value for example.
		 * Since JS only knows the data type "number" all numbers are usable as floats by default, but not the
		 * other way round.
		 *
		 * @param {*} intVal - the value the check
		 * @returns {Boolean} true if intVal is a true integer value
		 *
		 * @memberof Basic:$.isInt
		 * @example
		 * if( !$.isInt(val) ){
		 *   val = parseInt(val, 10);
		 * }
		 **/
		isInt : function(intVal){
			return parseInt(intVal, 10) === intVal;
		},



		/**
		 * @namespace Basic:$.isFloat
		 **/

		/**
		 * Returns if a value is a numeric value, usable as a float number in any calculation.
		 * Any number that fulfills isInt, is also considered a valid float, which lies in JS's
		 * nature of not differentiating ints and floats by putting them both into a "number"-type.
		 * So ints are always floats, but not necessarily the other way round.
		 *
		 * @param {*} floatVal - the value to check
		 * @returns {Boolean} true if floatVal is usable in a float context
		 *
		 * @memberof Basic:$.isFloat
		 * @example
		 * if( !$.isFloat(val) ){
		 *   alert('val can not be calculated with!');
		 * }
		 **/
		isFloat : function(floatVal){
			return parseFloat(floatVal) === floatVal;
		},



		/**
		 * @namespace Basic:$.isNaN
		 **/

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
		 *
		 * @memberof Basic:$.isNaN
		 * @example
		 * if( !$.isNaN(suspiciousCalculatedValue) ){
		 *   return suspiciousCalculatedValue * 3;
		 * }
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
		 * @namespace Basic:$.minMax
		 **/

		/**
		 * Checks if a value is within bounds of a minimum and maximum and returns
		 * the value or the upper or lower bound respectively.
		 *
		 * @param {Comparable} min - the lower bound
		 * @param {Comparable} value - the value to check
		 * @param {Comparable} max - the upper bound
		 * @throws error if min is not smaller than max
		 * @returns {Comparable} value, min or max
		 *
		 * @memberof Basic:$.minMax
		 * @example
		 * var croppedVal = $.minMax(-100, value, 100);
		 **/
		minMax : function(min, value, max){
			if( min > max ){
				throw new Error('minMax | min must be smaller than max');
			}

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
		 * @namespace Strings:$
		 **/

		/**
		 * @namespace Strings:$.strReplace
		 **/

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
		 *
		 * @memberof Strings:$.strReplace
		 * @example
		 * var sanitizedString = $.strReplace([':', '#', '-'], '_', exampleString);
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
		 * @namespace Strings:$.strTruncate
		 **/

		/**
		 * Truncates a given string after a certain number of characters to enforce length restrictions.
		 *
		 * @param {String} subject - the string to check and truncate
		 * @param {?Number.Integer} [maxLength=30] - the maximum allowed character length for the string
		 * @param {?String} [suffix=...] - the trailing string to end a truncated string with
		 * @throws error if suffix length is bigger than defined maxLength
		 * @returns {String} the (truncated) subject
		 *
		 * @memberof Strings:$.strTruncate
		 * @example
		 * var truncatedString = $.strTruncate(string, 10, '...');
		 **/
		strTruncate : function(subject, maxLength, suffix){
			subject = ''+subject;

			if( !this.isSet(maxLength) ){
				maxLength = 30;
			}

			if( !this.isSet(suffix) ){
				suffix = '...';
			}

			if( suffix.length > maxLength ){
				throw new Error('strTruncate | maxLength must not be smaller then length of suffix (standard suffix is "...")');
			}

			if( subject.length > maxLength ){
				subject = ''+subject.substr(0, maxLength - suffix.length)+suffix;
			}

			return subject;
		},



		/**
		 * @namespace Strings:$.strConcat
		 **/

		/**
		 * Simply concatenates strings with a glue part using array.join in a handy notation.
		 * You can also provide arguments to glue as a prepared array as the second parameter,
		 * in that case other parameters will be ignored.
		 *
		 * @param {?String} [glue=''] - the separator to use between single strings
		 * @returns {String} the concatenated string
		 *
		 * @memberof Strings:$.strConcat
		 * @example
		 * var finalCountdown = $.strConcat(' ... ', 10, 9, 8, 7, 6, '5', '4', '3', '2', '1', 'ZERO!');
		 * var finalCountdown = $.strConcat(' ... ', [10, 9, 8, 7, 6, '5', '4', '3', '2', '1', 'ZERO!']);
		 **/
		strConcat : function(glue){
			glue = this.orDefault(glue, '', 'string');

			var args = $.makeArray(arguments).slice(1);

			if( (args.length > 0) && $.isArray(args[0]) ){
				return args[0].join(glue);
			} else {
				return args.join(glue);
			}
		},



		/**
		 * @namespace Strings:$.strFormat
		 **/

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
		 * @param {String} template [description]
		 * @param {(...*|String[]|Object.<String,String>)} arguments to insert into template, either as a dictionary, an array or a parameter sequence
		 * @throws general exception on syntax errors
		 * @returns {String} the formatted string
		 *
		 * @memberof Strings:$.strFormat
		 * @example
		 * $.strFormat('An elephant is {times:float(0.00)} times smarter than a {animal}', {times : 5.5555, animal : 'lion'})
		 * => 'An elephant is 5.56 times smarter than a lion'
		 * $.strFormat('{0}{0}{0} ... {{BATMAN!}}', 'Nana')
		 * => 'NanaNanaNana ... {BATMAN!}'
		 * $.strFormat('{} {} {} starts the alphabet.', 'A', 'B', 'C')
		 * => 'A B C starts the alphabet.'
		 * $.strFormat('{0:int}, {1:int}, {2:int}: details are for pussies', '1a', 2.222, 3)
		 * => '1, 2, 3: details are for pussies'
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
							throw new Error('strFormat | float precision arg malformed');
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
							throw new Error('strFormat | unknown formatter');
						}
					}

					if( implicit ){
						throw new Error('strFormat | cannot switch from implicit to explicit numbering');
					} else {
						explicit = true;
					}

					ref = fLookup(args, key);
					value = _this_.orDefault(ref, '');
				} else {
					if( explicit ){
						throw new Error ('strFormat | cannot switch from explicit to implicit numbering');
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
		 * @namespace Strings:$.slugify
		 **/

		/**
		 * Slugifies a text for use in an URL or id/class/attribute.
		 * Transforms accented characters to non accented ones.
		 *
		 * @param {String} text - the text to slugify
		 * @returns {String} the slugified string
		 *
		 * @memberof Strings:$.slugify
		 * @example
		 * $.slugify('This is a cömplicated ßtring for URLs!')
		 * => 'this-is-a-complicated-sstring-for-urls'
		 **/
		slugify : function(text){
			text = this.isSet(text) ? ''+text : '';

			var _this_ = this;

			return text.toLowerCase()
				.replace(/\s+/g, '-')           //replace spaces with "-"
				.replace(/[^A-Za-z0-9\[\] ]/g, function(char){ return _this_.jqueryAnnexData.slugify.latinMap[char] || char; })
				.replace(/[^\w\-]+|_+/g, '')    //remove all non-word chars || ^replace accented chars with plain ones
				.replace(/\-\-+/g, '-')         //replace multiple "-" with single "-"
				.replace(/^-+/, '')             //trim "-" from start of text
				.replace(/-+$/, '');            //trim "-" from end of text
		},



		/**
		 * @namespace Strings:$.maskForSelector
		 **/

		/**
		 * Masks all selector-special-characters.
		 * For explanation see: https://learn.jquery.com/using-jquery-core/faq/how-do-i-select-an-element-by-an-id-that-has-characters-used-in-css-notation/
		 *
		 * @param {String} string - the string to mask for use in a selector
		 * @returns {String} the masked string
		 *
		 * @memberof Strings:$.maskForSelector
		 * @example
		 * $('#element_'+$.maskForSelector(elementName)).remove();
		 **/
		maskForSelector : function(string){
			return string.replace(/([\#\;\&\,\.\+\*\~\'\:\"\!\^\$\[\]\(\)\=\>\|\/\@])/g, '\\$&');
		},



		/**
		 * @namespace Strings:$.maskForRegEx
		 **/

		/**
		 * Masks all regex special characters.
		 *
		 * @param {String} string - the string to mask for use in a regexp
		 * @returns {String} the masked string
		 *
		 * @memberof Strings:$.maskForRegEx
		 * @example
		 * if( (new RegExp('^'+$.maskForRegEx(arbitraryString)+'+$')).test('abc') ){
		 *   $('body').remove();
		 * }
		 **/
		maskForRegEx : function(string){
			return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
		},



		/**
		 * @namespace Strings:$.maskForHtml
		 **/

		/**
		 * Masks a string possibly containing reserved HTML chars for HTML output as is
		 * (so a < actually reads on the page).
		 *
		 * Only replaces critical chars like <>& with entities, but
		 * keeps non-critical unicode chars like »/.
		 *
		 * @param {String} text - the string to mask for use in HTML
		 * @returns {String} the masked string
		 *
		 * @memberof Strings:$.maskForHtml
		 * @see unmaskFromHtml
		 * @example
		 * $.maskForHtml('</>&;üäöÜÄÖß– »')
		 * => '&lt;/&gt;&amp;;üäöÜÄÖß– »'
		 **/
		maskForHtml : function(text){
			var escape = document.createElement('textarea');
			escape.textContent = text;
			return escape.innerHTML;
		},



		/**
		 * @namespace Strings:$.unmaskFromHtml
		 **/

		/**
		 * Replaces entities in a html-masked string with the vanilla characters
		 * thereby returning a real HTML string, which could, for example, be used
		 * to construct new elements with tag markup.
		 *
		 * @param {String} html - the string to unmask entities in
		 * @returns {String} the unmasked string
		 *
		 * @memberof Strings:$.unmaskFromHtml
		 * @see maskForHtml
		 * @example
		 * $.unmaskFromHtml('&lt;/&gt;&amp;;üäöÜÄÖß&ndash;&nbsp;&raquo;')
		 * => '</>&;üäöÜÄÖß– »'
		 **/
		unmaskFromHtml : function(html){
			var escape = document.createElement('textarea');
			escape.innerHTML = html;
			return escape.textContent;
		},



		/**
		 * @namespace Arrays:$
		 **/

		/**
		 * @namespace Arrays:$.removeFromArray
		 **/

		/**
		 * Removes Elements from an Array, where to and from are inclusive.
		 * If you only provide "from", that exact index is removed.
		 * Does not modify the original.
		 * Keep in mind, that "from" should normally be smaller than "to" to slice from left to right. This means that the elements
		 * indexed by "to" and "from" should have the right order. For example: [1,2,3,4]. Here to=-1 and from=-3 are illegal since
		 * "to" references a later element than "from", but there are also viable examples where from is numerically bigger. If we
		 * use to=2 and from=-1, "to" is numerically bigger, but references an earlier element than -1 (which is the last element), which
		 * is totally okay. Just make sure "from" comes before "to" in the element's order.
		 *
		 * @param {Array} target - the array to remove elements from
		 * @param {Number.Integer} from - index to start removing from (can also be negative to start counting from back)
		 * @param {Number.Integer} [to=target.length] - index to end removing (can also be negative to end counting from back)
		 * @throws error if target is not an array
		 * @returns {Array} the modified array
		 *
		 * @memberof Arrays:$.removeFromArray
		 * @example
		 * array = $.removeFromArray(array, 0, 2);
		 * array = $.removeFromArray(array, -3, -1);
		 **/
		removeFromArray : function(target, from, to){
			this.assert($.isArray(target), 'removeFromArray | target is no array');

			target = target.slice(0);
			var rest = target.slice((to || from) + 1 || target.length);
			target.length = (from < 0) ? (target.length + from) : from;

			return $.merge(target, rest);
		},



		/**
		 * @namespace Objects:$
		 **/

		/**
		 * @namespace Objects:$.objectLength
		 **/

		/**
		 * Counts enumerable properties of (plain) objects.
		 *
		 * @param {Object} object - the object to count properties in
		 * @throws error if given object is not of type object
		 * @returns {Number.Integer} number of enumerable properties
		 *
		 * @memberof Objects:$.objectLength
		 * @example
		 * var attrCount = $.objectLength({a : 0, b : 2, c : 3});
		 **/
		objectLength : function(object){
			this.assert($.isA(object, 'object'), 'objectLength | other type than object given');

			var count = 0;

			$.each(object, function(){
				count++;
			});

			return count;
		},



		/**
		 * @namespace Objects:$.copyObjectContent
		 **/

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
		 * @param {?Object} [cloneSubObjects=false] - defines if sub-objects of contentObject should be cloned or copied by reference, works for arrays and plain objects
		 * @throws error if target or contentObject are no object
		 * @returns {Object} emptied target with all properties of contentObject
		 *
		 * @memberof Objects:$.copyObjectContent
		 * @example
		 * $.copyObjectContent({ thisWillBe : 'lost'}, {thisWillBe : 'inserted', {thisWillBe : 'cloned not referenced'}}, true)
		 **/
		copyObjectContent : function(target, contentObject, cloneSubObjects){
			this.assert(this.isA(target, 'object') && this.isA(target, 'object'), 'copyObjectContent | target and contentObject both need to be objects');

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
		 * @namespace Objects:$.emptyObject
		 **/

		/**
		 * Removes all enumerable properties of an object, thereby emptying it.
		 *
		 * This method is especially interesting if the target object has to keep its reference for programmatic reasons.
		 *
		 * Modifies the target!
		 *
		 * @param {Object} target - the object remove all properties from
		 * @throws error if target is no object
		 * @returns {Object} emptied target
		 *
		 * @memberof Objects:$.emptyObject
		 * @example
		 * $.emptyObject({removeMe : 'please'})
		 **/
		emptyObject : function(target){
			this.assert(this.isA(target, 'object'), 'emptyObject | target needs to be an object');

			return this.copyObjectContent(target, {});
		},



		/**
		 * @namespace Random:$
		 **/

		/**
		 * @namespace Random:$.randomInt
		 **/

		/**
		 * Special form of Math.random, returning an int value between two ints,
		 * where floor and ceiling are included in the range.
		 *
		 * @param {?Number.Integer} [floor=0] - the lower end of random range
		 * @param {?Number.Integer} [ceiling=10] - the upper end of random range
		 * @returns {Number.Integer} random int between floor and ceiling
		 *
		 * @memberof Random:$.randomInt
		 * @example
		 * var rInt = $.randomInt(23, 42);
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

			return Math.floor(Math.random() * (ceiling - floor + 1) + floor);
		},



		/**
		 * @namespace Random:$.randomUuid
		 **/

		/**
		 * Returns a "UUID", as close as possible with JavaScript (so not really, but looks like one :).
		 *
		 * Is guaranteed to deliver every value only once per reload.
		 *
		 * @param {?Boolean} [withoutDashes=false] - defines if UUID shall include dashes or not
		 * @returns {String} a "UUID"
		 *
		 * @memberof Random:$.randomUuid
		 * @example
		 * var uuid = $.randomUuid(true);
		 **/
		randomUuid : function(withoutDashes){
			withoutDashes = this.isSet(withoutDashes) ? !!withoutDashes : false;

			var uuid = 'none',
				uuidLength = 36;
			if( withoutDashes ){
				uuidLength = 32;
			}

			var s = [],
				itoh = '0123456789ABCDEF',
				i = 0;

			while( this.jqueryAnnexData.uuid.usedSinceReload[uuid] === null ){
				for (i = 0; i < uuidLength; i++) s[i] = Math.floor(Math.random() * 0x10);

				// Conform to RFC-4122, section 4.4
				s[withoutDashes ? 12 : 14] = 4;
				s[withoutDashes ? 16 : 19] = (s[19] & 0x3) | 0x8;

				for (i = 0; i < uuidLength; i++) s[i] = itoh[s[i]];

				if( !withoutDashes ){
					s[8] = s[13] = s[18] = s[23] = '-';
				}

				uuid = s.join('');
			}

			this.jqueryAnnexData.uuid.usedSinceReload[uuid] = null;

			return uuid;
		},



		/**
		 * @namespace Timers:$
		 **/

		/**
		 * @namespace Timers:$.schedule
		 **/

		/**
		 * Setup a timer for one-time execution of a callback, kills old timer if wished
		 * to prevent overlapping timers.
		 *
		 * @param {Number.Integer} ms - time in milliseconds until execution
		 * @param {Function} callback - callback function to execute after ms
		 * @param {?(Object|Number.Integer)} [oldTimer] - if set, kills the timer before setting up new one
		 * @throws error if callback is not a function
		 * @returns {Object} new timer
		 *
		 * @memberof Timers:$.schedule
		 * @see pschedule
		 * @see countermand
		 * @example
		 * var timer = $.schedule(1000, function(){ alert('time for tea'); });
	 	 * var timer = $.schedule(2000, function(){ alert('traffic jam, tea has to wait'); }, timer);
		 **/
		schedule : function(ms, callback, oldTimer){
			ms = this.orDefault(ms, 1, 'int');

			this.assert($.isFunction(callback), 'schedule | callback must be a function');

			if( this.isSet(oldTimer) ){
				this.countermand(oldTimer);
			}

			return {id : window.setTimeout(callback, ms), type : 'timeout'};
		},



		/**
		 * @namespace Timers:$.pschedule
		 **/

		/**
		 * Setup a timer for one-time execution of a callback, kills old timer if wished
		 * to prevent overlapping timers.
		 * This implementation uses Date.getTime() to improve on timer precision for long
		 * running timers. The timers of this method can also be used in countermand().
		 *
		 * Warning: these timers are more precise than normal timer for _long_ time spans and less precise for short ones,
		 * if you are dealing with times at least above 30s (or minutes and hours) this the right choice, if you look to
		 * use precise timers in the second and millisecond range, definitely use schedule/loop instead!
		 *
		 * @param {Number.Integer} ms - time in milliseconds until execution
		 * @param {Function} callback - callback function to execute after ms
		 * @param {?(Object|Number.Integer)} [oldTimer] - if set, kills the timer before setting up new one
		 * @throws error if callback is not a function
		 * @returns {Object} timer (does not create new timer object if oldTimer given, but returns old one)
		 *
		 * @memberof Timers:$.pschedule
		 * @see schedule
		 * @see countermand
		 * @example
		 * var timer = $.pschedule(1000, function(){ alert('time for tea'); });
		 * var timer = $.pschedule(2000, function(){ alert('traffic jam, tea has to wait'); }, timer);
		 **/
		pschedule : function(ms, callback, oldTimer){
			ms = this.orDefault(ms, 1, 'int');

			this.assert($.isFunction(callback), 'pschedule | callback must be a function');

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

			var waitStart = new Date().getTime(),
				waitMilliSecs = ms;

			var fAdjustWait = function(){
				if( waitMilliSecs > 0 ){
					waitMilliSecs -= (new Date().getTime() - waitStart);
					oldTimer.id = window.setTimeout(fAdjustWait, (waitMilliSecs > 10) ? waitMilliSecs : 10);
				} else {
					callback();
				}
			};

			oldTimer.id = window.setTimeout(fAdjustWait, waitMilliSecs);

			return oldTimer;
		},



		/**
		 * @namespace Timers:$.reschedule
		 **/

		/**
		 * Alias for schedule() with more natural param-order for rescheduling.
		 *
		 * @param {(Object|Number.Integer)} timer - the timer to refresh/reset
		 * @param {Number.Integer} ms - time in milliseconds until execution
		 * @param {Function} callback - callback function to execute after ms
		 * @throws error if callback is not a function
		 * @returns {Object} timer (may be the original timer, if given timer is precise from pschedule or ploop)
		 *
		 * @memberof Timers:$.reschedule
		 * @see schedule
		 * @example
		 * var timer = $.reschedule(timer, 3000, function(){ alert('taking even more time'); });
		 **/
		reschedule : function(timer, ms, callback){
			ms = this.orDefault(ms, 1, 'int');

			this.assert($.isFunction(callback), 'reschedule | callback must be a function');

			if( this.isSet(timer) && this.isSet(timer.precise) && timer.precise ){
				return this.pschedule(ms, callback, timer);
			} else {
				return this.schedule(ms, callback, timer);
			}
		},



		/**
		 * @namespace Timers:$.loop
		 **/

		/**
		 * Setup a loop for repeated execution of a callback, kills old loop if wished
		 * to prevent overlapping loops.
		 *
		 * @param {Number.Integer} ms - time in milliseconds until execution
		 * @param {Function} callback - callback function to execute after ms
		 * @param {?(Object|Number.Integer)} [oldLoop] - if set, kills the loop before setting up new one
		 * @throws error if callback is not a function
		 * @returns {Object} new loop
		 *
		 * @memberof Timers:$.loop
		 * @see ploop
		 * @see countermand
		 * @example
		 * var loop = $.loop(250, function(){ $('body').toggleClass('brightred'); });
		 * var loop = $.loop(100, function(){ $('body').toggleClass('brightgreen'); }, loop);
		 **/
		loop : function(ms, callback, oldLoop){
			ms = this.orDefault(ms, 1, 'int');

			this.assert($.isFunction(callback), 'loop | callback must be a function');

			if( this.isSet(oldLoop) ){
				this.countermand(oldLoop, true);
			}

			return {id : window.setInterval(callback, ms), type : 'interval'};
		},



		/**
		 * @namespace Timers:$.ploop
		 **/

		/**
		 * Setup a loop for repeated execution of a callback, kills old loop if wished
		 * to prevent overlapping loops.
		 * This implementation uses Date.getTime() to improve on timer precision for long running loops.
		 *
		 * Warning: these timers are more precise than normal timer for _long_ time spans and less precise for short ones,
		 * if you are dealing with times at least above 30s (or minutes and hours) this the right choice, if you look to
		 * use precise timers in the second and millisecond range, definitely use schedule/loop instead!
		 *
		 * The loops of this method can also be used in countermand().
		 * This method does not actually use intervals internally but timeouts,
		 * so don't wonder if you can't find the ids in JS.
		 *
		 * @param {Number.Integer} ms - time in milliseconds until execution
		 * @param {Function} callback - callback function to execute after ms
		 * @param {?(Object|Number.Integer)} [oldLoop] - if set, kills the loop before setting up new one
		 * @throws error if callback is not a function
		 * @returns {Object} loop (if you give an old loop into the function the same reference will be returned)
		 *
		 * @memberof Timers:$.ploop
		 * @see loop
		 * @see countermand
		 * @example
		 * var loop = $.ploop(250, function(){ $('body').toggleClass('brightred'); });
		 * var loop = $.ploop(100, function(){ $('body').toggleClass('brightgreen'); }, loop);
		 **/
		ploop : function(ms, callback, oldLoop){
			ms = this.orDefault(ms, 1, 'int');

			this.assert($.isFunction(callback), 'ploop | callback must be a function');

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

			var waitStart = new Date().getTime(),
				waitMilliSecs = ms;

			var fAdjustWait = function(){
				if( waitMilliSecs > 0 ){
					waitMilliSecs -= (new Date().getTime() - waitStart);
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
		},



		/**
		 * @namespace Timers:$.countermand
		 **/

		/**
		 * Cancel a timer or loop immediately.
		 *
		 * @param {(Object|Number.Integer)} timer - the timer or loop to end
		 * @param {?Boolean} [isInterval] - defines if a timer or a loop is to be stopped, set in case timer is a GUID
		 *
		 * @memberof Timers:$.countermand
		 * @see schedule
		 * @see pschedule
		 * @see loop
		 * @see ploop
		 * @example
		 * $.countermand(timer);
		 * $.countermand(loop);
		 **/
		countermand : function(timer, isInterval){
			if( this.isSet(timer) ){
				if( $.isPlainObject(timer) && this.hasMembers(timer, ['id', 'type']) ){
					if( timer.type === 'interval' ){
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
		 * @namespace Timers:$.requestAnimationFrame
		 **/

		/**
		 * This is a simple streamlined, vendor-cascading version of window.requestAnimationFrame with a timeout fallback in case the functionality is
		 * missing from the browser.
		 *
		 * @param {Function} callback - the code to execute once the browser has assigned an execution slot for it
		 * @return {Number.Integer} either the id of the requestAnimationFrame or the internal timeout/$.schedule, both are cancellable via $.cancelAnimationFrame
		 *
		 * @memberof Timers:$.requestAnimationFrame
		 * @see raf
		 * @see cancelAnimationFrame
		 * @see caf
		 * @example
		 * var requestId = $.requestAnimationFrame(function(){ $('body').css('opacity', 0); });
		 */
		requestAnimationFrame : function(callback){
			var _this_ = this,
				raf = window.requestAnimationFrame
				|| window.webkitRequestAnimationFrame
				|| window.mozRequestAnimationFrame
				|| window.msRequestAnimationFrame
				|| function(callback){ return _this_.schedule(16, callback); }
			;

			return raf(callback);
		},



		/**
		 * @namespace Timers:$.raf
		 **/

		/**
		 * This is just an alternate name for $.requestAnimationFrame.
		 *
		 * @param {Function} callback - the code to execute once the browser has assigned an execution slot for it
		 * @return {Number.Integer} either the id of the requestAnimationFrame or the internal timeout/$.schedule, both are cancellable via $.cancelAnimationFrame
		 *
		 * @memberof Timers:$.raf
		 * @see requestAnimationFrame
		 * @see cancelAnimationFrame
		 * @see caf
		 * @example
		 * var requestId = $.raf(function(){ $('body').css('opacity', 0); });
		 */
		raf : function(callback){
			return this.requestAnimationFrame(callback);
		},



		/**
		 * @namespace Timers:$.cancelAnimationFrame
		 **/

		/**
		 * This is a simple streamlined, vendor-cascading version of window.cancelAnimationFrame.
		 *
		 * @param {Number.Integer} id - either the id of the requestAnimationFrame or its timeout fallback
		 *
		 * @memberof Timers:$.cancelAnimationFrame
		 * @see requestAnimationFrame
		 * @see raf
		 * @see caf
		 * @example
		 * $.cancelAnimationFrame($.requestAnimationFrame(function(){ $('body').css('opacity', 0); }));
		 */
		cancelAnimationFrame : function(id){
			var raf = window.requestAnimationFrame
				|| window.webkitRequestAnimationFrame
				|| window.mozRequestAnimationFrame
				|| window.msRequestAnimationFrame
				|| null,
				caf = window.cancelAnimationFrame
				|| window.mozCancelAnimationFrame
			;

			if( !this.isSet(raf) ){
				caf = $.proxy(this.countermand, this);
			}

			return caf(id);
		},



		/**
		 * @namespace Timers:$.caf
		 **/

		/**
		 * This is just an alternate name for $.cancelAnimationFrame.
		 *
		 * @param {Number.Integer} id - either the id of the requestAnimationFrame or its timeout fallback
		 *
		 * @memberof Timers:$.caf
		 * @see requestAnimationFrame
		 * @see raf
		 * @see cancelAnimationFrame
		 * @example
		 * $.caf($.raf(function(){ $('body').css('opacity', 0); }));
		 */
		caf : function(id){
			return this.cancelAnimationFrame(id);
		},



		/**
		 * @namespace Timers:$.waitForRepaint
		 **/

		/**
		 * This function has the purpose to offer a safe execution slot for code depending on an up-to-date rendering state of the DOM after a
		 * change to styles for example. Let's say you add a class to an element and right in the next line you'll want to read a layout attribute
		 * like width or height from it. This might fail, because there is no guarantee the browser actually already applied the new styles to
		 * be read from the DOM. To wait safely for the new DOM state this method works with two stacked requestAnimatioFrame calls.
		 * Since requestAnimationFrame always happens _before_ a repaint, two stacked calls ensure, that there has to be a repaint between them.
		 *
		 * @param {Function} callback - the code to execute once the browser performed a repaint
		 * @return {Object} dictionary of ids for the inner and outer request ids, outer gets assigned right away, while inner gets assigned after first callback => {outer : 1, inner : 2}
		 *
		 * @memberof Timers:$.waitForRepaint
		 * @see requestAnimationFrame
		 * @see raf
		 * @example
		 * $element.addClass('special-stuff');
		 * $.waitForRepaint(function(){ alert('the new dimensions after class change are: '+$element.outerWidth()+'x'+$element.outerHeight()); });
		 */
		waitForRepaint : function(callback){
			var _this_ = this,
				ids = {};

			ids.outer = this.requestAnimationFrame(function(){
				ids.inner = _this_.requestAnimationFrame(callback);
			});

			return ids;
		},



		/**
		 * @namespace Polling:$
		 **/

		/**
		 * @namespace Polling:$.poll
		 **/

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
		 *
		 * @memberof Polling:$.poll
		 * @see unpoll
		 * @example
		 * var poll = $.poll('testpoll', function(){ return $('body').height() > 1000; }, function(){ alert('too high!'); }, $.noop, 5000);
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
		 * @namespace Polling:$.unpoll
		 **/

		/**
		 * Removes an active poll from the poll stack via given name.
		 *
		 * @param {String} name - name of the state or event you are waiting/polling for that shall be removed
		 * @returns {Boolean} true if poll has been removed, false if nothing has changed
		 *
		 * @memberof Polling:$.unpoll
		 * @see poll
		 * @example
		 * $.unpoll('testpoll');
		 **/
		unpoll : function(name){
			name = $.trim(''+name);

			if( name !== '' ){
				if( this.exists(name+'.loop', this.jqueryAnnexData.polls.activePolls) ){
					this.countermand(this.jqueryAnnexData.polls.activePolls[name].loop);
				}

				if( this.isSet(this.jqueryAnnexData.polls.activePolls[name]) ){
					delete this.jqueryAnnexData.polls.activePolls[name];
					this.jqueryAnnexData.polls.activePollCount--;

					if( this.jqueryAnnexData.polls.activePollCount <= 0 ){
						this.countermand(this.jqueryAnnexData.polls.defaultLoop);
						this.jqueryAnnexData.polls.defaultLoop = null;
						this.jqueryAnnexData.polls.activePollCount = 0;
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
		 * @namespace Functions:$
		 **/

		/**
		 * @namespace Functions:$.throttleExecution
		 **/

		/**
		 * Throttle the execution of a function to only execute every n ms.
		 *
		 * This is a rather unsharp implementation for basic purposes. For a more precise and battle-tested version
		 * I'd prefer the lodash solution _.throttle()
		 *
		 * @param {Number.Integer} ms - the waiting time between executions in milliseconds
		 * @param {Function} func - the function to throttle
		 * @param {?Boolean} [leadingExecution=true] - defines if the function is executed initially without waiting first
		 * @param {?Boolean} [trailingExecution=false] - defines if the function is executed at the end of the event chain a final time
		 * @returns {Function} the throtteling function (parameters will be handed as is to the throtteled function)
		 *
		 * @memberof Functions:$.throttleExecution
		 * @example
		 * $(window).on('scroll', $.throttleExecution(400, function(){ $('body').toggleClass('foobar'); }, true, true))
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
				lastTriggerTime = new Date().getTime();
				throttleTimer = null;
				func.apply(context, args);
			};

			var fTrailTrigger = function(context, args){
				lastEventTime = null;
				lastTriggerTime = null;
				throttleTimer = null;
				func.apply(context, args);
			};

			return function(){
				var context = this,
					args = $.makeArray(arguments);

				if( !$.isSet(lastEventTime) ){
					lastEventTime = new Date().getTime();

					if( leadingExecution ){
						func.apply(context, args);
						lastTriggerTime = lastEventTime;
					} else {
						_this_.countermand(throttleTimer);
						throttleTimer = _this_.schedule(ms, function(){ fTrigger(context, args); });
					}
				} else {
					var currentEventTime = new Date().getTime(),
						eventDelta = currentEventTime - (($.isSet(lastTriggerTime) && (lastTriggerTime > lastEventTime)) ? lastTriggerTime : lastEventTime),
						waitMs = ((ms - eventDelta) < 0) ? 0 : (ms - eventDelta);

					lastEventTime = currentEventTime;

					if( !$.isSet(throttleTimer) ){
						throttleTimer = _this_.schedule(waitMs, function(){ fTrigger(context, args); });
					}
				}

				if( trailingExecution ){
					_this_.countermand(trailTimer);
					trailTimer = _this_.schedule(ms, function(){ fTrailTrigger(context, args); });
				} else {
					_this_.countermand(trailTimer);
					trailTimer = _this_.schedule(ms, function(){
						lastEventTime = null;
						lastTriggerTime = null;
					});
				}
			};
		},



		/**
		 * @namespace Functions:$.holdExecution
		 **/

		/**
		 * Hold the execution of a function until it has not been called for n ms.
		 *
		 * @param {Number.Integer} ms - timeframe in milliseconds without call before execution
		 * @param {Function} func - the function to hold the execution of
		 * @returns {Function} the holding function (parameters will be handed as is to the held function)
		 *
		 * @memberof Functions:$.holdExecution
		 * @example
		 * $('input[name=search]').on('change', $.holdExecution(1000, function(){ refreshSearch(); }))
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
		 * @namespace Functions:$.deferExecution
		 **/

		/**
		 * Defer the execution of a function until the callstack is empty.
		 * This works identical to setTimeout(function(){}, 1);
		 *
		 * @param {Function} func - the function to defer
		 * @param {?Number.Integer} [delay=1] - the delay to apply to the timeout
		 * @returns {Function} the deferring function
		 *
		 * @memberof Functions:$.deferExecution
		 * @example
		 * $.deferExecution(function(){ doAfterRedraw(); })()
		 **/
		deferExecution : function(func, delay){
			delay = this.orDefault(delay, 1, 'int');

			var _this_ = this;

			return function(){
				var context = this,
					args = $.makeArray(arguments);

				_this_.schedule(delay, function(){ func.apply(context, args); });
			};
		},



		/**
		 * @namespace Functions:$.kwargs
		 **/

		/**
		 * Applies the possiblity to set function parameters by name Python-style like kwargs to a function.
		 * Returns a new function that accepts mixed args, if arg is a plain object it gets treated as a kwargs
		 * dict. If the objects contains a falsy "kwargs" attribute it is applied as a parameter as is.
		 * You can also define parameter defaults from outside by setting the defaults as a dict in this function.
		 *
		 * @param {Function} func - the function to provide kwargs to
		 * @param {?Object} [defaults={}] - the default kwargs to apply to func
		 * @returns {Function} new function accepting mixed args with kwarg dicts
		 *
		 * @memberof Functions:$.kwargs
		 * @example
		 * var fTest = function(tick, trick, track){ console.log(tick, trick, track); };
		 *
		 * $.kwargs(fTest, {track : 'defTrack'})({tick : 'tiick', trick : 'trick'});
		 * => "tiick, trick, defTrack"
		 *
		 * $.kwargs(fTest, {track : 'defTrack'})('argTick', {trick : 'triick', track : 'trACK'});
		 * => "argTick, triick, trACK"
		 *
		 * $.kwargs(fTest, {track : 'defTrack'})('argTick', {trick : 'triick', track : 'track'}, 'trackkkk');
		 * => "argTick, triick, trackkkk"
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

				return func.apply(this, applicableArgs);
			};
		},



		/**
		 * @namespace Navigation:$
		 **/

		/**
		 * @namespace Navigation:$.redirect
		 **/

		/**
		 * Changes the current window-location.
		 * Also offers to only change the hash/anchor or send additional post params via hidden form transport.
		 *
		 * @param {?String} [url=window.location.href] - the location to load, if null current location is reloaded
		 * @param {?Object.<String, String>} [params={}] - GET-parameters to add to the url as key-value-pairs
		 * @param {?String} [anchor] - site anchor to set for called url, has precedence over URL hash
		 * @param {?Object} [postParams] - a dictionary of postParameters to send with the redirect, solved with a hidden form
		 * @param {?String} [target] - name of the window to perform the redirect to/in
		 *
		 * @memberof Navigation:$.redirect
		 * @example
		 * $.redirect('http://www.test.com', {search : 'kittens', order : 'asc'}, 'fluffykittens');
		 * $.redirect(null, {order : 'desc'});
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
					if( paramPair.length === 2 ){
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

				if( url.indexOf('?') === -1 ){
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
		 * @namespace Navigation:$.changeUrlSilently
		 **/

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
		 *
		 * @memberof Navigation:$.changeUrlSilently
		 * @see onHistoryChange
		 * @example
		 * $.changeUrlSilently('/article/important-stuff');
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
		 * @namespace Navigation:$.onHistoryChange
		 **/

		/**
		 * Registers an onpopstate event if history api is available.
		 * Does nothing if api is not present.
		 * Takes a callback, which is provided with two states as plain
		 * objects like {state : ..., title : ..., url : ...}. The first is the
		 * current state before the page change, the second the state after popping.
		 *
		 * @param {Function} callback - method to execute on popstate
		 * @param {?String} [name] - namespace for popstate event, to be able to remove only specific handlers
		 * @param {?Boolean} [clearOld] - defines if old handlers should be removed before setting new one
		 *
		 * @memberof Navigation:$.onHistoryChange
		 * @see changeUrlSilently
		 * @example
		 * $.onHistoryChange(function(){
		 *   alert('Hey, don\'t do this!');
		 * }, 'routingstuff', true);
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
							state : e.originalEvent.state,
							title : e.originalEvent.title,
							host : window.location.host,
							path : window.location.pathname
						}
					);

					_this_.jqueryAnnexData.history.currentState = e.originalEvent.state;
					_this_.jqueryAnnexData.history.currentTitle = e.originalEvent.title;
					_this_.jqueryAnnexData.history.currentHost = window.location.host;
					_this_.jqueryAnnexData.history.currentPath = window.location.pathname;
				});
			}
		},



		/**
		 * @namespace Navigation:$.reload
		 **/

		/**
		 * Reloads the current window-location. Differentiates between cached and cache-refreshing reload.
		 *
		 * @param {?Boolean} [quickLoad=false] - if true, load as fast as possible using everything in cache
		 *
		 * @memberof Navigation:$.reload
		 * @example
		 * $.reload();
		 * $.reload(true);
		 **/
		reload : function(quickLoad){
			window.location.reload(this.isSet(quickLoad) && quickLoad);
		},



		/**
		 * @namespace Navigation:$.openWindow
		 **/

		/**
		 * Opens a subwindow for the current window or another defined parent window.
		 *
		 * @param {String} url - the URL to load into the new window
		 * @param {?Object.<String, String>} [options] - parameters for the new window according to the definitions of window.open + "name" for the window name
		 * @param {?Window} [parentWindow=window] - parent window for the new window
		 * @param {?Boolean} [tryAsPopup=false] - defines if it should be tried to force a new window instead of a tab
		 * @returns {Window} the newly opened window/tab
		 *
		 * @memberof Navigation:$.openWindow
		 * @example
		 * $.openWindow('/img/gallery.html');
		 * $.openWindow('http://www.kittens.com', {name : 'kitten_popup'}, parent);
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
					if( (prop !== 'name') || tryAsPopup ){
						optionArray.push(prop+'='+options[prop]);
					}
				}
			}

			return parentWindow.open(''+url, windowName, optionArray.join(', '));
		},



		/**
		 * @namespace Navigation:$.openTab
		 **/

		/**
		 * Opens a subwindow for the current window as _blank, which should result in a new tab in most browsers.
		 *
		 * This method is just a shortcut for $.redirect with a set target and reasonable parameters.
		 *
		 * @param {?String} [url=window.location.href] - the location to load, if null current location is reloaded
		 * @param {?Object.<String, String>} [params={}] - GET-parameters to add to the url as key-value-pairs
		 * @param {?String} [anchor] - site anchor to set for called url, has precedence over URL hash
		 *
		 * @memberof Navigation:$.openTab
		 * @example
		 * $.openTab('/misc/faq.html');
		 **/
		openTab : function(url, params, anchor){
			this.redirect(url, params, anchor, null, '_blank');
		},



		/**
		 * @namespace Capabilities:$
		 **/

		/**
		 * @namespace Capabilities:$.browserSupportsHistoryManipulation
		 **/

		/**
		 * Detects if the browser supports history manipulation, by checking the most common
		 * methods for presence in the history-object.
		 *
		 * @returns {Boolean} true if browser seems to support history manipulation
		 *
		 * @memberof Capabilities:$.browserSupportsHistoryManipulation
		 * @example
		 * if( $.browserSupportsHistoryManipulation() ){
		 *   $.changeUrlSilently('/article/important-stuff');
		 * }
		 **/
		browserSupportsHistoryManipulation : function(){
			return window.history && window.history.pushState && window.history.replaceState;
		},



		/**
		 * @namespace Capabilities:$.browserSupportsLocalStorage
		 **/

		/**
		 * Detects if the browser supports local storage, by testing if something can be stored in it and removed
		 * afterwards. This test was more or less stolen from modernizr.
		 *
		 * @param {?String} [testKey=!!!foo!!!] - a key to use as a testkey when setting and removing data, use in case of collision
		 * @returns {Boolean} true if browser seems to support local storage
		 *
		 * @memberof Capabilities:$.browserSupportsLocalStorage
		 * @example
		 * if( $.browserSupportsLocalStorage() ){
		 *   localStorage.setItem('foo', 'bar');
		 *   localStorage.removeItem('foo');
		 * }
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
		 * @namespace Capabilities:$.browserSupportsSessionStorage
		 **/

		/**
		 * Detects if the browser supports session storage, by testing if something can be stored in it and removed
		 * afterwards. This test was more or less stolen from modernizr.
		 *
		 * @param {?String} [testKey=!!!foo!!!] - a key to use as a testkey when setting and removing data, use in case of collision
		 * @returns {Boolean} true if browser seems to support session storage
		 *
		 * @memberof Capabilities:$.browserSupportsSessionStorage
		 * @example
		 * if( $.browserSupportsSessionStorage() ){
		 *   sessionStorage.setItem('foo', 'bar');
		 *   sessionStorage.removeItem('foo');
		 * }
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
		 * @namespace Capabilities:$.contextIsTouchDevice
		 **/

		/**
		 * Detects if the current JavaScript-context runs on a touch device.
		 *
		 * Please keep in mind that this is not as safe as it may seem, especially on devices with mixed inputs. The safest way to determine.
		 * A touch device is handler reacting to a touch such as $(window).one('touchstart', function(){ ... });, but this of course means
		 * that you have no idea about the device nature until the first touch.
		 *
		 * If you set this function to check user agents, which is not so by default, it will check the following UAs in
		 * this order: iOS-devices, Android, IE mobile, Opera Mobile, Firefox Mobile, Blackberry and Kindle.
		 *
		 * @param {?Boolean} [inspectUserAgent=false] - defines if the user agent should be inspected additionally to identifying touch events
		 * @param {?String[]} [additionalUserAgentIds] - list of string-ids to search for in the user agent additionally to the basic ones
		 * @param {?Boolean} [onlyConsiderUserAgent=false] - tells the algorithm to ignore feature checks and just go by the user-agent-ids
		 * @returns {Boolean} true if device knows touch events and or sends fitting useragent
		 *
		 * @memberof Capabilities:$.contextIsTouchDevice
		 * @example
		 * if( $.contextIsTouchDevice(true, ['mySpecialUseragent'], true) ){
		 *   ...
		 * }
		 **/
		contextIsTouchDevice : function(inspectUserAgent, additionalUserAgentIds, onlyConsiderUserAgent){
			var _this_ = this,
				touchEventsPresent = onlyConsiderUserAgent ? true : (('ontouchstart' in window) || (!!window.DocumentTouch && document instanceof DocumentTouch)),
				res = touchEventsPresent,
				ua = navigator.userAgent;

			if( this.isSet(inspectUserAgent) && inspectUserAgent ){
				res =
					touchEventsPresent
					&& (
						this.isSet(ua.match(/(iPhone|iPod|iPad|iWatch)/i))
						|| this.isSet(ua.match(/Android/i))
						|| this.isSet(ua.match(/IE\sMobile\s[0-9]{0,2}/i))
						|| this.isSet(ua.match(/Opera Mobi/i))
						|| this.isSet(ua.match(/mobile.+firefox/i))
						|| this.isSet(ua.match(/(BlackBerry|PlayBook)/i))
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
		 * @namespace Capabilities:$.contextHasHighDpi
		 **/

		/**
		 * Checks if the context would benefit from high DPI graphics.
		 *
		 * @returns {Boolean} true if device has high DPI, false if not or browser does not support media queries
		 *
		 * @memberof Capabilities:$.contextHasHighDpi
		 * @example
		 * if( $.contextHasHighDpi ){
		 *   $('img').each(function(){ $(this).attr('src', $.strReplace('.jpg', '@2x.jpg', $(this).attr('src'))); });
		 * }
		 **/
		contextHasHighDpi : function(){
			if( window.matchMedia ){
				var query = 'only screen and (-webkit-min-device-pixel-ratio: 1.5),'
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
		 * @namespace Capabilities:$.contextScrollbarWidth
		 **/

		/**
		 * Returns the current context's scrollbar width. Returns 0 if scrollbar is over content.
		 * There are edge cases in which we might want to calculate positions in respect to the
		 * actual width of the scrollbar. For example when working with elements with a 100vw width.
		 *
		 * This method temporarily inserts three elements into the body while forcing the body to
		 * actually show scrollbars, measuring the difference between 100vw and 100% on the body and
		 * returns the result.
		 *
		 * @returns {Number.Integer} the width of the body scrollbar in pixels
		 *
		 * @memberof Capabilities:$.contextScrollbarWidth
		 * @example
		 * $foobar.css('width', 'calc(100vw - '+$.contextScrollbarWidth()+'px)');
		 **/
		contextScrollbarWidth : function(){
			// firefox needs container to be at least 30px high to display scrollbar
			var $sandbox = $.elem('div').css({
				'position' : 'fixed',
				'top' : 0,
				'right' : 0,
				'left' : 0,
				'height' : 50,
				'visibility' : 'hidden',
				'opacity' : 0,
				'pointer-events' : 'none',
				'overflow' : 'scroll'
			}),
			$scrollbarEnforcer = $.elem('div').css({
				'width' : '100%',
				'height' : 100
			});

			$sandbox.append($scrollbarEnforcer);
			$('body').append($sandbox);

			var scrollbarWidth = $sandbox.outerWidth(true) - $scrollbarEnforcer.outerWidth(true);

			$sandbox.remove();

			return scrollbarWidth;
		},



		/**
		 * @namespace Dynamicloading:$
		 **/

		/**
		 * @namespace Dynamicloading:$.getCss
		 **/

		/**
		 * AJAX-Loads an external CSS-file and includes the contents into the DOM, very similar to getScript.
		 * The method offers the possiblity to include the CSS as a link or a style tag. Includes are marked with a
		 * html5-conform "data-id"-attribute, so additional loads can be removed again unproblematically.
		 *
		 * This function is also available as getCSS() to comply with jQuery notation of these kind of functions.
		 *
		 * @param {String} url - the URL of the CSS-file to load
		 * @param {?Object.<String, *>} [options] - config for the call (styletag : true/false, media : screen/print/all/etc., charset : utf-8/etc., id : {String})
		 * @param {?Function} [callback] - function to call after css is loaded and included into DOM, gets included DOM-element as parameter
		 * @returns {jqXHR} the promise object from the internally used $.get
		 *
		 * @memberof Dynamicloading:$.getCss
		 * @example
		 * $.getCss('/css/addon.css', {styletag : true, id : 'addon'}, function(){ $('script[data-id=addon]').remove(); });
		 **/
		getCss : function(url, options, callback){
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
		 * @namespace Dynamicloading:$.getHtmlBody
		 **/

		/**
		 * Loads HTML from an URL and extracts only the <body> from it and returns it to a callback as a detached
		 * jQuery element.
		 *
		 * @param {String} url - the URL of the HTML-page to load
		 * @param {Function} callback - function to call after HTML is loaded, gets $body-element as parameter
		 * @returns {jqXHR} the promise object from the internally used $.get
		 *
		 * @memberof Dynamicloading:$.getHtmlBody
		 * @example
		 * $.getHtmlBody('/foo/bar.html', function($body){ $('body').append($body.find('.super-special').first()); }).fail(function(){ throw 'could not load HTML!'; });
		 **/
		getHtmlBody : function(url, callback){
			$.assert($.isFunction(callback), 'getHtmlBody | callback is no function');

			return $.get(url, {}, function(rawHtml){
				var rawBody = rawHtml.match(/<body[^>]*>((.|[\n\r])*)<\/body>/i)[1],
					$body = $.elem('body').html(rawBody);

				callback($body);
			}, 'html');
		},



		/**
		 * @namespace Cookies:$
		 **/

		/**
		 * @namespace Cookies:$.cookie
		 **/

		/**
		 * Sets cookies and retrieves them again.
		 *
		 * @param {String} name - name of the cookie
		 * @param {String} [value] - value-string of the cookie, null removes a value, so to retrieve leave undefined
		 * @param {?Object} [options] - config-object for the cookie setting expiries etc., use together with a value, you may set the path, domain, secure and expires (in days or as a date object)
		 * @returns {(void|String|null)} either nothing, when setting a cookie, or the value of a requested cookie
		 *
		 * @memberof Cookies:$.cookie
		 * @example
		 * $.cookie('kittencookie', 'fluffy', {expires : 7});
		 * var kittenCookieValue = $.cookie('kittencookie');
		 **/
		cookie : function(name, value, options) {
			if( value !== undefined ){
				options = options || {};

				if (value === null) {
					value = '';
					options.expires = -1;
				}

				var expires = '';
				if( options.expires && ($.type(options.expires) === 'number' || options.expires.toUTCString) ){
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

						if( cookie.substring(0, name.length + 1) === (name+'=') ){
							cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
							break;
						}
					}
				}

				return cookieValue;
			}
		},



		/**
		 * @namespace Css:$
		 **/

		/**
		 * @namespace Css:$.cssToNumber
		 **/

		/**
		 * Converts a CSS-value to a number without unit. If the base number is an integer the result will also
		 * be an integer, float values will also be converted correctly.
		 *
		 * @param {String} cssVal - the css-value to convert
		 * @returns {Number|NaN} true number representation of the given value or NaN if the value is not parsable
		 *
		 * @memberof Css:$.cssToNumber
		 * @example
		 * $('#content').css('height', ($.cssToNumber(('body').css('height')) * 100)+'px');
		 **/
		cssToNumber : function(cssVal){
			cssVal = ''+cssVal;

			return parseFloat(cssVal.replace(/(em|ex|%|px|cm|mm|in|pt|pc|ch|rem|vh|vw|vmin|vmax)$/, ''));
		},



		/**
		 * @namespace Css:$.cssUrlToSrc
		 **/

		/**
		 * Converts a CSS-URL to a img-src-usable value.
		 *
		 * @param {String} cssUrl - the URL from the css
		 * @param {?String} [relativePathPart] - the relative path part of the URL from the css to cut for src-use
		 * @returns {String|null} src value or null if cssUrl is no CSS-URL-value
		 *
		 * @memberof Css:$.cssUrlToSrc
		 * @example
		 * $('body').append($.elem('img', {src : $.cssUrlToSrc($('#avatar').css('background-image'), '../')}));
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
				return null;
			}
		},



		/**
		 * @namespace Css:$.remByPx
		 **/

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
		 * @param  {Number} px - the pixel value to convert to rem
		 * @param  {?(Number|Object)} [initial=$('html')] - either a pixel value to use as a conversion base or an element to get the initial font-size from
		 * @returns {String|null} the rem value string to use in a css definition
		 *
		 * @memberof Css:$.remByPx
		 * @example
		 * $('#foobar').css('font-size', $.remByPx(20, REM_BASE));
		 **/
		remByPx : function(px, initial){
			px = this.cssToNumber(px);
			initial = this.orDefault(initial, $('html'));

			if( this.isA(initial, 'object') && this.isSet(initial.jquery) ){
				initial = this.cssToNumber(initial.css('font-size'));
			} else {
				initial = this.cssToNumber(initial);
			}

			var remVal = px / initial;
			if( $.isSet(remVal) && !$.isNaN(remVal) ){
				return remVal+'rem';
			} {
				return null;
			}
		},



		/**
		 * @namespace Images:$
		 **/

		/**
		 * @namespace Images:$.preloadImages
		 **/

		/**
		 * Preloads images by URL.
		 * Images can be preloaded by name and are thereby retrievable afterwards or anonymously.
		 * So you can either just use the url again, or, to be super-sure, call the method again, with just the image name to get the URL.
		 *
		 * @param {(String|String[]|Object.<String, String>)} images - an URL, an array of URLs or a plain object containing named URLs. In case the string is an already used name, the image-object is returned.
		 * @param {?Function} [callback] - callback to call when all images have loaded, this also fires on already loaded images if inserted again
		 * @param {?Boolean} [returnCollection=false] - defines if the function should return the collection in which the images where inserted instead of the promise object
		 * @returns {(Promise|Object.<String, String>|Image)} either returns a promise object (does not fail atm), the currently added named/unnamed images as saved (if defined by returnCollection) or a requested cached image
		 *
		 * @memberof Images:$.preloadImages
		 * @example
		 * $.preloadImages([url1, url2, url3], function(){ alert('all loaded'); });
		 * $.preloadImages({name1 : url1, name2 : url2}}).done(function(){ ... });
		 * var imageObj = $.preloadImages('name1');
		 **/
		preloadImages : function(images, callback, returnCollection){
			returnCollection = this.orDefault(returnCollection, false, 'bool');

			var _this_ = this,
				res = null,
				deferred = $.Deferred(),
				$imageList = $(),
				image;

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
						$imageList = $imageList.add($(newImages[key]));
					}
				});

				$.extend(this.jqueryAnnexData.preloadedImages.named, newImages);

				res = this.jqueryAnnexData.preloadedImages.named;
			} else if( $.isArray(images) ){
				$.each(images, function(index, value){
					var newImage = new Image();
					newImage.src = ''+value;
					_this_.jqueryAnnexData.preloadedImages.unnamed.push(newImage);
					$imageList = $imageList.add($(newImage));
				});

				res = this.jqueryAnnexData.preloadedImages.unnamed;
			}

			$imageList.imgLoad(function(targets, e){
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
		 * @namespace Fonts:$
		 **/

		/**
		 * @namespace Fonts:$.waitForWebfonts
		 **/

		/**
		 * Waits for a list of webfonts to load before executing a callback.
		 * Works for fonts already loaded as well.
		 *
		 * @param {String|String[]} fonts - the CSS-names of the fonts to wait upon
		 * @param {?Function} callback - the callback to execute once all given webfonts are loaded
		 * @param {?String} [fallbackFontName=sans-serif] - the system font onto which the page falls back if the webfont is not loaded
		 * @returns {Promise} a promise object (not failing atm)
		 *
		 * @memberof Fonts:$.waitForWebfonts
		 * @example
		 * $.waitForWebfonts(['purr-regular', 'scratch-light'], function(){
		 *   $('.useswebfont').fadeIn();
		 * }, 'helvetica, sans-serif');
		 **/
		waitForWebfonts : function(fonts, callback, fallbackFontName) {
			fonts = $.isArray(fonts) ? fonts : [''+fonts];
			fallbackFontName = this.orDefault(fallbackFontName, 'sans-serif', 'string');

			var _this_ = this,
				deferred = $.Deferred(),
				loadedFonts = 0;

			$.each(fonts, function(index, font){
					var $node = _this_.elem('span')
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
						if( $node && ($node.width() !== systemFontWidth) ){
							loadedFonts++;
							$node.remove();
							$node = null;
						}

						if( loadedFonts >= fonts.length ){
							if( _this_.isSet(tCheckFontLoaded) ){
								_this_.countermand(tCheckFontLoaded);
							}

							if(
								(loadedFonts === fonts.length)
								&& (deferred.state() !== 'resolved')
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
						tCheckFontLoaded = _this_.loop(50, fCheckFont);
					}
			});

			return deferred.promise();
		},



		/**
		 * @namespace Databases:$
		 **/

		/**
		 * @namespace Databases:$.isolateId
		 **/

		/**
		 * Tries to isolate a supposed (DB-)Id from a given String. In case the given string contains several candidates
		 * for an id, the last one will be returned, since such strings tend to have the unique information at the end after a
		 * prefix for grouping purposes.
		 *
		 * You may also provide a regexp object instead of a regex string, but be aware that this regexp will be executed and its
		 * metadata will therefore be updated by iterating its matches. If you need your regexp unchanged, provide a regexp string instead
		 * or create a new object before.
		 *
		 * @param {String} baseString - the string to isolate an id from
		 * @param {?String|Regexp} [idRex='[1-9][0-9]*'] - the regex string or object to use to identify the id part of the baseString
		 * @returns {(String|null)} either the isolated id or null, in case of multiple hits/groups, returns the last hit
		 *
		 * @memberof Databases:$.isolateId
		 * @example
		 * var id = $.isolateId($('#element').attr('id'));
		 * var id = $.isolateId('test_(123;456)', '\\_\\(([0-9]+)\\;[^\\)]+\\)');
		 **/
		isolateId : function(baseString, idRex){
			idRex = this.orDefault(idRex, '[1-9][0-9]*');

			var rex = this.isA(idRex, 'regexp') ? idRex : new RegExp(''+idRex, 'g'),
				occurrences = [],
				matches;


			while( $.isSet(matches = rex.exec(''+baseString)) ){
				if( matches.index === rex.lastIndex){
					rex.lastIndex++;
				}

				$.each(matches, function(groupIndex, match){
					occurrences.push(''+match);
				});
			}

			if( occurrences.length > 0 ){
				return occurrences[occurrences.length-1];
			} else {
				return null;
			}
		},



		/**
		 * @namespace Databases:$.isPossibleId
		 **/

		/**
		 * Determines if a given value could be a valid id, being digits with or without given pre- and postfix.
		 *
		 * @param {(String|Number.Integer)} testVal - the value to test
		 * @param {?String} [prefix=''] - a prefix for the id
		 * @param {?String} [idRex='[0-9]+'] - the regex string to use to identify the id part of the value
		 * @param {?String} [postfix=''] - a postfix for the id
		 * @param {?Boolean} [dontMaskFixes=false] - if you want to use regexs as fixes, set this true
		 * @returns {Boolean} true if value may be id
		 *
		 * @memberof Databases:$.isPossibleId
		 * @example
		 * if( $.isPossibleId(id, 'test_(', '[0-9]+', ')') ){
		 *   $.getJSON('/backend/'+id, function(){ alert('done'); });
		 * }
		 **/
		isPossibleId : function(testVal, prefix, idRex, postfix, dontMaskFixes){
			prefix = this.orDefault(prefix, '', 'string');
			idRex = this.orDefault(idRex, '[1-9][0-9]*', 'string');
			postfix = this.orDefault(postfix, '', 'string');

			var rex = null;
			if( !dontMaskFixes ){
				rex = new RegExp('^'+this.maskForRegEx(prefix)+idRex+this.maskForRegEx(postfix)+'$');
			} else {
				rex = new RegExp('^'+prefix+idRex+postfix+'$');
			}

			return rex.test(''+testVal);
		},



		/**
		 * @namespace Events:$
		 **/

		/**
		 * @namespace Events:$.bindCursorKey
		 **/

		/**
		 * Binds a callback to a cursor key, internally identified by keycode.
		 *
		 * @param {String} keyName - the key to bind => up/down/left/right
		 * @param {Function} callback - callback to call of cursor key use, takes event e
		 * @param {?String} [eventType=keydown] - the event type to use when binding => keypress/keydown/keyup
		 *
		 * @memberof Events:$.bindCursorKey
		 * @see unbindCursorKey
		 * @example
		 * $.bindCursorKey('down', function(){ $('body').css('margin-top', '+=10'); }, 'keyup');
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
				$(document).on(eventType+'.'+keyName, function(e){ if(e.keyCode === keys[keyName]) callback(e); });
			}
		},



		/**
		 * @namespace Events:$.unbindCursorKey
		 **/

		/**
		 * Unbinds a callback to a cursor key, internally identified by keycode.
		 *
		 * @param {String} keyName - the key to unbind => up/down/left/right
		 * @param {?String} [eventType=keydown] - the event type to use when binding => keypress/keydown/keyup
		 *
		 * @memberof Events:$.unbindCursorKey
		 * @see bindCursorKey
		 * @example
		 * $.unbindCursorKey('down', 'keyup');
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
		 * @namespace Interaction:$
		 **/

		/**
		 * @namespace Interaction:$.removeSelection
		 **/

		/**
		 * Removes all textselections from the current frame if possible.
		 * Certain mobile devices like iOS devices might block this behaviour actively.
		 *
		 * @memberof Interaction:$.removeSelection
		 * @see createSelection
		 * @example
		 * $.removeSelection();
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
		 * @namespace Interaction:$.disableScrolling
		 **/

		/**
		 * Tries to suppress all scrolling (via wheel and touch) on the current window.
		 *
		 * The idea here is to disable scrolling only for very short amounts of time, to,
		 * for example, do a pagewide animation the user should not disturb with a scroll.
		 *
		 * This method does _not_ suppress the manual use of a window scrollbar handle.
		 *
		 * Do not disable scrolling generally or for longer amounts of time, that is very
		 * bad style!
		 *
		 * @param {?Boolean} [tryToHideScrollbars=false] - if true, sets overflow hidden on body to hide scrollbars as well and therefore remove possibility to use scrollbar handle manually
		 *
		 * @memberof Interaction:$.disableScrolling
		 * @see enableScrolling
		 * @example
		 * $.disableScrolling();
		 **/
		disableScrolling : function(tryToHideScrollbars){
			tryToHideScrollbars = this.orDefault(tryToHideScrollbars, false, 'bool');

			var $body = $('body').first();

			$body.cssCrossBrowser({'touch-action' : 'none'});

			if( tryToHideScrollbars ){
				$body.css({'overflow' : 'hidden'}).addClass('hidden-scrollbars');
			}

			if (window.addEventListener){
				window.addEventListener('DOMMouseScroll', $.jqueryAnnexData.scrolling.preventDefault, false);
			}

			window.onwheel = $.jqueryAnnexData.scrolling.preventDefault;
			window.onmousewheel = document.onmousewheel = $.jqueryAnnexData.scrolling.preventDefault;
			window.ontouchmove  = $.jqueryAnnexData.scrolling.preventDefault;
			document.onkeydown  = $.jqueryAnnexData.scrolling.preventDefaultForScrollKeys;
		},



		/**
		 * @namespace Interaction:$.enableScrolling
		 **/

		/**
		 * Reenables window scrolling formerly suppressed with $.disableScrolling().
		 *
		 * @memberof Interaction:$.enableScrolling
		 * @see disableScrolling
		 * @example
		 * $.enableScrolling();
		 **/
		enableScrolling : function(){
			var $body = $('body').first();

			$body.cssCrossBrowser({
				'touch-action' : ''
			});

			if( $body.hasClass('hidden-scrollbars') ){
				$body.css({'overflow' : ''}).removeClass('hidden-scrollbars');
			}

			if (window.removeEventListener){
				window.removeEventListener('DOMMouseScroll', $.jqueryAnnexData.scrolling.preventDefault, false);
			}

			window.onmousewheel = document.onmousewheel = null;
			window.onwheel = null;
			window.ontouchmove = null;
			document.onkeydown = null;
		},




		/**
		 * @namespace Urls:$
		 **/

		/**
		 * @namespace Urls:$.urlParameter
		 **/

		/**
		 * Searches for and returns parameters embedded in the provided url containing a query string (make sure all values are url encoded).
		 * You may also just provide the query string, but make sure it starts with a ?
		 *
		 * Return a single parameter if name is given, otherwise returns dict with all values.
		 *
		 * If a parameter has more than one value the values are returned as an array, whether being requested by name
		 * or in the dict containing all params.
		 *
		 * If a parameter is set, but has no defined value (name present, but no = before next param) the value is returned as boolean true.
		 *
		 * @param {String} url - the url containing the parameter string, is expected to be url-encoded (will be decoded), may also be only the query string, may begin with "?" but doesn't have to
		 * @param {?String} [paramName=null] - the name of the parameter to extract
		 * @returns {(null|true|String|String[]|Object)} null in case the parameter doesn't exist, true in case it exists but has no value, a string in case the parameter has one value, or an array of strings, or a dict/object of all available params
		 *
		 * @memberof Urls:$.urlParameter
		 * @example
		 * var hasKittens = $.urlParameter('//foobar.com/bar?has_kittens=true', 'has_kittens');
		 * var hasDoggies = $.urlParameter('has_doggies=yes&has_doggies=true', 'has_doggies');
		 * var allTheData = $.urlParameter('?foo=foo&bar=bar&bar=barbar');
		 **/
		urlParameter : function(url, paramName){
			url = $.orDefault(url, '', 'string');
			paramName = $.orDefault(paramName, null, 'string');

			var qString = url.split('?');
			qString = ( qString.length > 1 ) ? qString[1] : '';
			qString = qString.split('#')[0].split('&');

			var res = [],
				resDict = {},
				paramPair = null,
				paramVal = null;

			for( var i = 0; i < qString.length; i++ ){
				paramPair = qString[i].split('=');
				if( paramPair.length > 1 ){
					paramVal = paramPair[1];
				} else {
					paramVal = true;
				}

				if( $.isSet(paramName) ){
					if( paramPair[0] === paramName ){
						res.push((paramVal !== true) ? decodeURIComponent(paramVal) : true);
					}
				} else if( paramPair[0] !== '' ){
					if( !$.isSet(resDict[paramPair[0]]) ){
						resDict[paramPair[0]] = (paramVal !== true) ? decodeURIComponent(paramVal) : true;
					} else {
						if( !$.isArray(resDict[paramPair[0]]) ){
							resDict[paramPair[0]] = [resDict[paramPair[0]]];
						}
						resDict[paramPair[0]].push((paramVal !== true) ? decodeURIComponent(paramVal) : true);
					}
				}
			}

			if( $.isSet(paramName) ){
				if( res.length === 0 ){
					return null;
				} else if( res.length === 1 ){
					return res[0];
				} else {
					return res;
				}
			} else {
				return resDict;
			}
		},



		/**
		 * @namespace Urls:$.urlParameters
		 **/

		/**
		 * Searches for and returns parameters embedded in provided url with a parameter string.
		 *
		 * Semantic shortcut version of $.urlParameter(); (without parameter name, resulting in all params as dict/object)
		 *
		 * @param {String} url - the url containing the parameter string, is expected to be url-encoded (will be decoded), may also be only the query string, may begin with "?" but doesn't have to
		 * @returns {Object} dict/object of all params, empty if no params
		 *
		 * @memberof Urls:$.urlParameters
		 * @example
		 * var allParams = $.urlParameters('http://www.foobar.com?foo=foo&bar=bar&bar=barbar');
		 **/
		urlParameters : function(url){
			return this.urlParameter(url);
		},



		/**
		 * @namespace Urls:$.urlAnchor
		 **/

		/**
		 * Returns the currently set URL-Anchor on given URL (also works with hash alone, but make sure # is included).
		 *
		 * @param {String} url - the URL, containing a hash
		 * @param {?Boolean} [withoutCaret=false] - defines if anchor value should contain leading "#"
		 * @returns {(String|null)} current anchor value or null if no anchor in url
		 *
		 * @memberof Urls:$.urlAnchor
		 * @example
		 * var hrefAnchorWithoutCaret = $.urlAnchor($('.foobar').attr('href'), true);
		 * var imgAnchorWithCaret = $.urlAnchor($('img:first').atrr('src'));
		 * var anchorFromLocation = $.urlAnchor(window.location.hash, true);
		 **/
		urlAnchor : function(url, withoutCaret){
			var urlParts = url.split('#'),
				anchor = (urlParts.length > 1) ? decodeURIComponent($.trim(urlParts[1])) : null;

			if( $.isSet(anchor) ){
				if( !$.isSet(withoutCaret) || !withoutCaret ){
					anchor = '#'+anchor;
				}

				if( (anchor === '') || (anchor === '#') ){
					anchor = null;
				}
			}

			return anchor;
		}

	});



	//--|ALTERNATE-SIGNATURES-TO-COMPLY-TO-JQUERY-STANDARDS

	$.extend({
		getCSS : $.getCss
	});



	//--|JQUERY-OBJECT-GENERAL-FUNCTIONS----------

	$.fn.extend({

		/**
		 * @namespace Basic:$fn
		 **/

		/**
		 * @namespace Basic:$fn.oo
		 **/

		/**
		 * Returns the original object of a jQuery-enabled object.
		 *
		 * If collection contains one element, returns the original object directly, if more than one element present
		 * an array of original objects is returned. Emtpy collections return null.
		 *
		 * @returns {(Object|Object[]|null)} the original dom object(s) or null in case of empty collection
		 *
		 * @memberof Basic:$fn.oo
		 * @example
		 * $('body').oo().onclick('methodByName');
		 **/
		oo : function(){
			if( $(this).length === 1 ){
				return $(this).get(0);
			} else if( $(this).length > 1 ) {
				return $(this).get();
			} else {
				return null;
			}
		},



		/**
		 * @namespace Basic:$fn.outerHtml
		 **/

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
		 * @returns {String|jQueryCollection} the element's outer HTML markup starting with its own tag or, in case we set the content, the collection of (new) elements
		 *
		 * @memberof Basic:$fn.outerHtml
		 * @example
		 * $('div').append($.elem('span')).outerHtml()
		 * => <div><span></span></div>
		 * $('body > .foobar').outerHtml('<div>kittens, yay!</div>');
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
		 * @namespace Basic:$fn.dataDuo
		 **/

		/**
		 * Sets and retrieves the element's data attributes like jQuery's original data(), but transparently also updates
		 * the corresponding data-*-attr as far as possible with the given value.
		 *
		 * This function operates with slugged/dashed names, camelCased names may not work in all instances.
		 * Just use the names like you would in a data-attribute.
		 *
		 * Returns the current value if attrValue is not set.
		 *
		 * All values in the data-*-attributes and set via attrValue are treated as JSON by default and as a string
		 * as a fallback. To setting "true" in the DOM or as a string as attrValue will return a true boolean on
		 * access. Have a look at this to understand which values will be parsed:
		 * https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
		 *
		 * If you provide complex json values to the data-attribute initially via markup, due to a bug in jQuery's data() it
		 * has to have to following form: data-foobar='[{"a" : "b"}, {"c" : true}]'
		 * Using double quotes on the attribute and masking the double quotes inside the attribute will not work!
		 *
		 * However, all values not being JSON-parsable should go through as strings.
		 *
		 * Functions passed into attrValue are executed and their return values will be used.
		 *
		 * On returning a value the function always returns the data-prop if present, else it tries to parse the attribute.
		 * If that fails the value is returned taken as a string.
		 *
		 * In both cases (attribute parsable or string), if the prop is missing it will be written again from the read result
		 * to the data prop to always keep all presentations available.
		 *
		 * @param  {String} attrName - the data attr/prop name
		 * @param  {?*} attrValue - the value to set
		 * @returns {*} the previously set value (on get) or this (on set) or undefined on missing attribute
		 *
		 * @memberof Basic:$fn.dataDuo
		 * @see removeDataDuo
		 * @example
		 * $('#foobar').dataDuo('thingy', 'foo, bar!');
		 * alert($('#foobar').dataDuo('thingy'));
		 **/
		dataDuo : function(attrName, attrValue){
			attrName = $.orDefault(attrName, null, 'string');

			var res,
				attrValueString = '';

			if( $.isFunction(attrValue) ){
				attrValue = attrValue();
			}

			if( attrValue !== undefined ){
				try {
					attrValueString = JSON.stringify(attrValue);
				} catch(ex){
					attrValueString = ''+attrValue;
				}
			}

			if( $.isSet(attrName) ){
				if( attrValue !== undefined ){
					var vanillaValue;

					try {
						vanillaValue = JSON.parse(attrValue);
					} catch(ex){
						vanillaValue = attrValue;
					}

					$(this).data(attrName, vanillaValue);
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
		 * @namespace Basic:$fn.removeDataDuo
		 **/

		/**
		 * Remove previously set data (with data() or dataDuo()) from the dom as well as from the markup data-*-attr.
		 *
		 * This function operates with slugged/dashed names, camelCased names may not work in all instances.
		 * Just use the names like you would in a data-attribute.
		 *
		 * @param  {String} attrName - the data attr/prop name
		 * @returns {Object} this
		 *
		 * @memberof Basic:$fn.removeDataDuo
		 * @see dataDuo
		 * @example
		 * $('#foobar').removeDataDuo('thingy');
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
		 * @namespace Basic:$fn.isInDom
		 **/

		/**
		 * Returns if the current element is currently part of the dom or detached/removed.
		 *
		 * @returns {Boolean} true if in dom
		 *
		 * @memberof Basic:$fn.isInDom
		 * @example
		 * if( $jqueryObject.isInDom() ){
		 *   ...
		 * }
		 **/
		isInDom : function(){
			return $(this).closest(document.documentElement).length > 0;
		},



		/**
		 * @namespace Basic:$fn.measureHidden
		 **/

		/**
		 * Measures hidden elements by using a sandbox div. In some layout situations you may not be able to measure hidden
		 * or especially detached elements correctly, sometimes simply because they are not rendered, other times because
		 * they are rendered in a context where the browser does not keep correct styling information due to optimizations
		 * considering visibility of the element.
		 *
		 * This method works by cloning a node and inserting it in a well hidden sandbox element for the time of the measurement,
		 * after which the sandbox is immediately removed again. This method allows you to measure "hidden" elements inside the
		 * DOM without the need to actually move elements around or show them visibly.
		 *
		 * Keep in mind, that only measurements inherent to the element itself are measurable if sandbox is inserted into the body.
		 * Layout information from surrounding containers is, of course, not available. You can remedy this by setting the context
		 * correctly. Keep in mind, that direct child selectors may not work in the context since the sanbox itself constitutes a new level
		 * between context and element. In these cases you might have to adapt you selectors.
		 *
		 * @param {String} functionName - name of the function to call on target
		 * @param {?String} [selector] - selector to apply to element to find target
		 * @param {?Object} [$context=$('body')] - context to use as container for measurement
		 * @param {...*} [...] - add any number of parameters to add to the call of functionName (true for outerHeight for example)
		 * @returns {*} result of function applied to target
		 *
		 * @memberof Basic:$fn.measureHidden
		 * @example
		 * var hiddenHeight = $('body > div.hidden:first').measureHidden('outerHeight', null, null, true);
		 * var hiddenWidth = $('body').measureHidden('width', 'div.hidden:first', $('body'));
		 **/
		measureHidden : function(functionName, selector, $context){
			var args = $.makeArray(arguments).slice(3),
				res = null,
				uuid = $.randomUuid(true),
				$sandbox = $.elem(
					'div',
					{
						'id' : 'sandbox-'+uuid,
						'class' : 'sandbox',
						'style' : 'position:absolute; visibility:hidden; display:block;'
					}
				)
			;

			if( !$.isSet($context) ){
				$context = $('body');
			}
			$context.append($sandbox);

			var $measureClone = $(this).clone();
			$sandbox.append($measureClone);

			var $target = null;
			if( $.isSet(selector) ){
				$target = $measureClone.find(''+selector);
			} else {
				$target = $measureClone;
			}

			res = $.proxy.apply($, [$.fn[''+functionName], $target].concat(args))();

			$sandbox.remove();

			return res;
		},



		/**
		 * @namespace Basic:$fn.findTextNodes
		 **/

		/**
		 * Extracts all pure text nodes from an Element, starting directly in the element itself.
		 *
		 * Think of this function as a sort of .find() where the result are not jQuery elements/tags, but vanilla js text nodes.
		 * So recursively you'll get a set of independent text nodes without tags, representing the .text()-content in single elements.
		 * If you define to use onlyFirstLevel on an element, you'll be able to retrieve all text on the first level of an element _not_
		 * included in any tag (paragraph contents without special formats as b/i/em/strong for example).
		 *
		 * @param  {?Function} fFilter - a filter function to restrict the returned set, gets called with (textNode, element), set to null to use default (no filtering) if you need to use next param
		 * @param  {?Boolean} onlyFirstLevel - defines if the function should only return text nodes from the very first level
		 * @return {Object} a jQuery-set of text nodes
		 *
		 * @memberof Basic:$fn.findTextNodes
		 * @example
		 * var unenclosedTextElements = $('.copytext-with-inline-elements').findTextNodes();
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
							if( (this.nodeType === 3) && ($.trim($(this).text()) !== '') ){
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
		 * @namespace Forms:$fn
		 **/

		 /**
		 * @namespace Forms:$fn.disable
		 **/

		/**
		 * Disables a form-element.
		 *
		 * @returns {Object} this
		 *
		 * @memberof Forms:$fn.disable
		 * @see enable
		 * @example
		 * $('#kittenform :input.disabled').disable();
		 * $('#kittenform [disabled]').enable();
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
		 * @namespace Forms:$fn.enable
		 **/

		/**
		 * Enables a form-element.
		 *
		 * @returns {Object} this
		 *
		 * @memberof Forms:$fn.enable
		 * @see disable
		 * @example
		 * $('#kittenform :input.disabled').disable();
		 * $('#kittenform [disabled]').enable();
		 **/
		enable : function(){
			if( $(this).is(':input') ){
				$(this)
					.removeAttr('disabled')
					.prop('disabled', false)
				;
			}

			return this;
		},



		/**
		 * @namespace Forms:$fn.doselect
		 **/

		/**
		 * Sets an option selected or selects the text in a text-field/textarea.
		 *
		 * @returns {Object} this
		 *
		 * @memberof Forms:$fn.doselect
		 * @see deselect
		 * @example
		 * $('select > option:first').doselect();
		 * $('option').deselect(); // see deselect
		 * $('textarea:first').doselect();
		 * $(':text').deselect(); // see deselect
		 **/
		doselect : function(){
			var validTextElementsSelector = 'input:text, input[type=password], '
					+'input[type=email], input[type=number], '
					+'input[type=search], input[type=tel], '
					+'input[type=url], textarea',
				validElementsSelector = 'option, '+validTextElementsSelector
			;

			if( $(this).is(validElementsSelector) ){
				if( $(this).is(validTextElementsSelector) ){
					$(this).each(function(){
						this.focus();
						this.select();
					});
				} else {
					var isSingleSelect = $(this).parent('select[multiple]').length === 0;
					if( isSingleSelect ){
						$(this)
							.siblings('option')
								.removeAttr('selected')
								.prop('selected', false)
							.end()
							.attr('selected', 'selected')
							.prop('selected', true)
						;
					} else {
						$(this)
							.attr('selected', 'selected')
							.prop('selected', true)
						;
					}
				}
			}

			return this;
		},



		/**
		 * @namespace Forms:$fn.deselect
		 **/

		/**
		 * Removes a selection from an option or deselects the text in a text-field/textarea.
		 *
		 * @returns {Object} this
		 *
		 * @memberof Forms:$fn.deselect
		 * @see doselect
		 * @example
		 * $('select > option:first').doselect(); // see doselect
		 * $('option').deselect();
		 * $('textarea:first').doselect(); // see doselect
		 * $(':text').deselect();
		 **/
		deselect : function(){
			var validTextElementsSelector = 'input:text, input[type=password], '
					+'input[type=email], input[type=number], '
					+'input[type=search], input[type=tel], '
					+'input[type=url], textarea',
				validElementsSelector = 'option, '+validTextElementsSelector
			;

			if( $(this).is(validElementsSelector) ){
				if( $(this).is(validTextElementsSelector) ){
					var tmpVal = $(this).val(),
						stopperFunc = function(){ return false; };

					$(this)
						.on('change.deselect', stopperFunc)
						.val('')
						.val(tmpVal)
						.off('change.deselect', stopperFunc)
					;
				} else {
					var isSingleSelect = $(this).parent('select[multiple]').length === 0;
					if( isSingleSelect ){
						$(this)
							.parent()
								.children('option')
									.removeAttr('selected')
									.prop('selected', false)
						;
					} else {
						$(this)
							.removeAttr('selected')
							.prop('selected', false)
						;
					}
				}
			}

			return this;
		},



		/**
		 * @namespace Forms:$fn.check
		 **/

		/**
		 * Checks a checkbox or radiobutton.
		 *
		 * @returns {Object} this
		 *
		 * @memberof Forms:$fn.check
		 * @see uncheck
		 * @example
		 * $(':check, :radio').check().uncheck();
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
		 * @namespace Forms:$fn.uncheck
		 **/

		/**
		 * Removes a check from a checkbox or radiobutton.
		 *
		 * @returns {Object} this
		 *
		 * @memberof Forms:$fn.uncheck
		 * @see check
		 * @example
		 * $(':check, :radio').check().uncheck();
		 **/
		uncheck : function(){
			if( $(this).is(':checkbox, :radio') ){
				$(this)
					.removeAttr('checked')
					.prop('checked', false)
				;
			}

			return this;
		},



		/**
		 * @namespace Forms:$fn.formDataToObject
		 **/

		/**
		 * Parses form-element-values inside the target-object into a simple object.
		 * Basically an extension of jQuery's own serializeArray() with the difference that
		 * this function can handle form-arrays, which are returned under their name without bracket
		 * as an actual JS-Array.
		 *
		 * @returns {Object} form-data-plain-object {name:val, name:[val, val]} (not native FormData object!)
		 *
		 * @memberof Forms:$fn.formDataToObject
		 * @see formDataToFormData
		 * @example
		 * var data = $('form:first').formDataToObject();
		 **/
		formDataToObject : function(){
			var fields = $(this).serializeArray(),
				targetObj = {},
				currentFieldIsArray = false;

			for( var i = 0; i < fields.length; i++ ){
				currentFieldIsArray = false;
				if( fields[i].name.indexOf('[]') !== -1 ){
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
		 * @namespace Forms:$fn.formDataToFormData
		 **/

		/**
		 * Parses form-element-values inside the target-object into a FormData-object.
		 * Uses formDataToObject for retrieving the base values from the form, then adds
		 * additional information for file and blob objects and returns the result as a
		 * FormData-object for use in an Ajax-POST-request for example.
		 *
		 * The strange name stems from the fact that we also have formDataToObject and
		 * "formData" may also be interpreted as a neutral definition of form values.
		 *
		 * @param  {?Array.<String>|String} [files=null] - form field names that contain files, that should be included in the FormData object
		 * @param  {?Array.<Object>|Object.<String,String>} [blobs=null] - additional blob files to include, defined as a single object or an array of {name : '', content: '', mimetype : ''}
		 * @returns {FormData} FormData-object containing the data of the form
		 *
		 * @memberof Forms:$fn.formDataToFormData
		 * @see formDataToObject
		 * @example
		 * var data = $('form:first').formDataToFormData(['superimportantmultiplefilefieldname', 'lessimportantsinglefilefield'], {name : 'htmlblobname', content : '<em>IMPORTANT!</em>', mimetype : 'text/html'});
		 * // should even work in IE10/11! oO
		 * $.ajax({
		 *   url: '/foobar',
		 *   data: data,
		 *   processData: false,
		 *   contentType: false,
		 *   type: 'POST',
		 *   success: function(data){
		 *     alert(data);
		 *   }
		 * });
		 **/
		formDataToFormData : function(files, blobs){
			files = $.orDefault(files, null, 'array');
			blobs = $.orDefault(blobs, null, 'array');

			var _this_ = this,
				baseFormData = $(this).formDataToObject();

			if( $.isSet(files) ){
				$.each(files, function(fileFieldIndex, fileFieldName){
					fileFieldName = ''+fileFieldName;

					var $fileField = $(_this_).find('[name="'+fileFieldName+'"]');
					if( ($fileField.length > 0) && $.isSet($fileField.oo().files) ){
						var files = $fileField.oo().files;

						baseFormData[fileFieldName] = [];
						$.each(files, function(fileIndex, file){
							baseFormData[fileFieldName].push(file);
						});

						if( baseFormData[fileFieldName].length === 1 ){
							baseFormData[fileFieldName] = baseFormData[fileFieldName][0];
						}
					}
				});
			}

			if( $.isSet(blobs) ){
				$.each(blobs, function(blobConfigIndex, blobConfig){
					if( $.hasMembers(blobConfig, ['name', 'content', 'mimetype']) ){
						var content = $.isArray(blobConfig.content) ? blobConfig.content : [blobConfig.content];
						baseFormData[''+blobConfig.name] = new Blob([content], {type: ''+blobConfig.mimetype});
					}
				});
			}

			var formData = new FormData();
			$.each(baseFormData, function(fieldName, fieldValue){
				fieldValue = $.isArray(fieldValue) ? fieldValue : [fieldValue];

				$.each(fieldValue, function(valueIndex, value){
					formData.append(''+fieldName, value);
				});
			});

			return formData;
		},



		/**
		 * @namespace Forms:$fn.makeStylable
		 **/

		/**
		 * Transforms :radio, :checkbox, select and :file to stylable representations of themselves.
		 * This method mostly wraps the inputs in labels, if none is present and sets up event handlers for
		 * interactions between the label and the widget. This method only sets the most basic styling necessary for
		 * the proposed functionality, everything visual has to be defined via CSS.
		 *
		 * Prevents multiple executions on same element.
		 *
		 * :checkbox / :radio (style the label :before or :after as the widget, use .checked-class for status)
		 * - find the closest label*
		 * - toggle class "checked" on the label on input change
		 * - in case of :radio syncs all inputs with same name
		 * - change is triggered automatically since label is connected to (now invisible) input
		 *
		 * select (style the selectproxy for dims and the selectlabel for the rest)
		 * - create a selectProxy-element
		 * - insert a selectLabel into it, displaying the currently selected value text
		 * - insert the select invisible on top
		 * - position select and label fittingly over each other with select on top to catch clicks
		 *
		 * :file (style the label as the button)
		 * - find the closest label*
		 * - position the :file invisibly in the label, receiving clicks from the label
		 * - if the label does not enclose the input at the start, the input will be put into it and for-attrs will be removed
		 *
		 * *finding the closest label first tries to find an existing label by id, then looks at parent()
		 *  and wraps the input in a label if no label could be found
		 *
		 * @param  {?String} [containerClass] - if set, adds this class string to the input's newly created container element
		 * @param  {?String} [labelText] - if set, sets this text as the text content of the input labels if any, for selects this value takes preference over using the value of the first option (may contain styling in that case)
		 * @returns {Object} this
		 *
		 * @memberof Forms:$fn.makeStylable
		 * @example
		 * $(':checkbox, :radio, select').makeStylable('stylable-input');
		 **/
		makeStylable : function(containerClass, labelText){
			containerClass = $.orDefault(containerClass, null, 'string');
			labelText = $.orDefault(labelText, null, 'string');

			var fGetClosestLabel = function($target){
				var hasId = $.isSet($target.attr('id')),
					$label = [];

				if( hasId ){
					$label = $('label[for="'+$target.attr('id')+'"]');
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
				if( !$.isSet($(this).dataDuo('made-stylable')) || !$(this).dataDuo('made-stylable') ){
					var $label, $siblingLabel, $selectProxy;

					if( $(this).is(':checkbox, :radio') ){
						$label = fGetClosestLabel($(this));
						fSetContainerClass($label);
						fSetLabelText($label);

						$(this)
							.on('change.stylableinput init.stylableinput', function(e){
								if( $(this).is(':checked') ){
									$label.addClass('checked');
								} else {
									$label.removeClass('checked');
								}

								if( (e.type === 'change') && $(this).is(':radio') && $.isSet($(this).attr('name')) ){
									$(':radio[name="'+$(this).attr('name')+'"]').not($(this)).each(function(){
										$siblingLabel = fGetClosestLabel($(this));
										$siblingLabel.removeClass('checked');
									});
								}
							})
						;

						$(this)
							.hide()
							.triggerHandler('init.stylableinput')
						;
					} else if( $(this).is('select') ){
						$(this).css({
							'opacity' : 0.01,
							'position' : 'relative',
							'width' : '100%',
							'height' : '100%'
						});
						$(this).cssCrossBrowser({'appearance' : 'none'});

						$label = $.elem('span')
							.addClass('selectlabel')
							.css({
								'position' : 'absolute',
								'top' : 0,
								'right' : 0,
								'bottom' : 0,
								'left' : 0
							})
						;

						if( $.isSet(labelText) ){
							$label.html(labelText);
						} else {
							$label.text($(this).children('option').first().text());
						}

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
							.on('click.stylableinput', function(e){
								e.stopPropagation();
							})
							.on('change.stylableinput init.stylableinput', function(){
								var $selectedOption = $(this).children('option:selected').first();
								if( $selectedOption.length > 0 ){
									$label.text($selectedOption.text());
								}
							})
							.triggerHandler('init.stylableinput')
						;

						$selectProxy.on('click.stylableinput', function(){
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
				}

				$(this).dataDuo('made-stylable', true);
			});

			return this;
		},



		/**
		 * @namespace Events:$fn
		 **/

		/**
		 * @namespace Events:$fn.moveEventData
		 **/

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
		 *
		 * @memberof Events:$fn.moveEventData
		 * @example
		 * $('a.clickbutton').moveEventData('click mousedown', $._data, 'events', $.data, 'jqueryAnnexData_pausedEvents')
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
								(event.type === eventName)
								&& (
									(eventNamespace === '')
									|| (
										(eventNamespace !== '')
										&& (event.namespace === eventNamespace)
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
		 * @namespace Events:$fn.pauseHandlers
		 **/

		/**
		 * Pauses event handlers of an element, by moving them to a different dict temporarily
		 *
		 * @param {String} eventId - jquery event id(s) like in .on() and .off()
		 * @returns {Object} this
		 *
		 * @memberof Events:$fn.pauseHandlers
		 * @see resumeHandlers
		 * @example
		 * $('a.clickbutton').pauseHandlers('click mousedown')
		 **/
		pauseHandlers : function(eventId){
			return $.proxy($.fn.moveEventData, this, eventId, $._data, 'events', $.data, 'jqueryAnnexData_pausedEvents')();
		},



		/**
		 * @namespace Events:$fn.resumeHandlers
		 **/

		/**
		 * Resumes paused event handlers of an element, by moving them back to the element's event handler dict.
		 *
		 * @param {String} eventId - jquery event id(s) like in .on() and .off()
		 * @returns {Object} this
		 *
		 * @memberof Events:$fn.resumeHandlers
		 * @see pauseHandlers
		 * @example
		 * $('a.clickbutton').resumeHandlers('click mousedown')
		 **/
		resumeHandlers : function(eventId){
			return $.proxy($.fn.moveEventData, this, eventId, $.data, 'jqueryAnnexData_pausedEvents', $._data, 'events')();
		},



		/**
		 * @namespace Events:$fn.translateTouchToMouseEvents
		 **/

		/**
		 * Treats touchstart, touchmove and touchend events on the element internally
		 * as mousedown, mousemove and mouseup events and remaps event coordinates correctly.
		 *
		 * @param {?Boolean} [ignoreChildren=false] - defines if only the element itself should count and whether to ignore bubbling
		 * @returns {Object} this
		 *
		 * @memberof Events:$fn.translateTouchToMouseEvents
		 * @example
		 * $elementReactingToTouchAndClickOnlyWithMouseHandlers.translateTouchToMouseEvents().click(function(){ alert('I got touched!'); });
		 **/
		translateTouchToMouseEvents : function(ignoreChildren){
			$(this).on('touchstart touchmove touchend', function(e){
				var isTarget = (e.target === this);

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
								mouseEvent = document.createEvent('MouseEvent');

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
		 * @namespace Events:$fn.bindSwipeGesture
		 **/

		/**
		 * Binds a callback to a swipe gesture (on touch devices by default).
		 * Offers four swipe directions (up/right/down/left), where triggering the callback depends on the distance
		 * between touchstart and touchend in relation to the element's dimensions (multiplied by a factor to
		 * express a percentage).
		 *
		 * You may also set this method to also fire upon mouse swipes, by setting "hasToBeTouchDevice" to false.
		 *
		 * @param {String} direction - the direction to bind => up/down/left/right
		 * @param {Function} callback - callback to call on swipe, takes event e
		 * @param {?String} [eventNameSpace='annexSwipeGesture'] - apply an event namespace, which identifies specific events, helpful for a specific unbind later using the same namespace
		 * @param {?Number.Float} [dimFactor=0.2] - to determine what registers as a swipe we use a percentage of the viewport's width/height, the touch has to move, default is 20%
		 * @param {?Boolean} [hasToBeTouchDevice=true] - if true, makes sure the handlers are only active on touch devices, if false, also reacts to mouse swipes
		 * @returns {Object} this
		 *
		 * @memberof Events:$fn.bindSwipeGesture
		 * @see unbindSwipeGesture
		 * @example
		 * $slider.bindSwipeGesture('up', function(e){ $(e.currentTarget).fadeOut(); });
		 * $slider.bindSwipeGesture('right', function(){ $('body').triggerHandler('load-previous-thing'); }, 'foobarPrev', 0.15, false);
		 **/
		bindSwipeGesture : function(direction, callback, eventNameSpace, dimFactor, hasToBeTouchDevice){
			$.assert($.inArray(direction, ['up', 'right', 'down', 'left']) >= 0, 'bindSwipeGesture | direction is not in up/right/down/left');
			$.assert($.isFunction(callback), 'bindSwipeGesture | callback is not a function');

			eventNameSpace = $.orDefault(eventNameSpace, 'annexSwipeGesture', 'string');
			dimFactor = $.orDefault(dimFactor, 0.2, 'float');
			hasToBeTouchDevice = $.orDefault(hasToBeTouchDevice, true, 'bool');

			if( !hasToBeTouchDevice || $.contextIsTouchDevice() ){
				var $el = $(this),
					touch = {
						startX : 0,
						startY : 0,
						endX : 0,
						endY : 0
					},
					startEvent = 'touchstart.'+eventNameSpace+'-'+direction+(!hasToBeTouchDevice ? ' '+'mousedown.'+eventNameSpace+'-'+direction : ''),
					endEvent = 'touchend.'+eventNameSpace+'-'+direction+(!hasToBeTouchDevice ? ' '+'mouseup.'+eventNameSpace+'-'+direction : '')
				;

				$(this)
					.on(startEvent, function(e){
						if( e.type === 'touchstart' ){
							touch.startX = e.originalEvent.changedTouches[0].screenX;
							touch.startY = e.originalEvent.changedTouches[0].screenY;
						} else {
							touch.startX = e.originalEvent.screenX;
							touch.startY = e.originalEvent.screenY;
						}
					})
					.on(endEvent, function(e){
						var elWidth = $el.outerWidth(),
							elHeight = $el.outerHeight();

						if( e.type === 'touchend' ){
							touch.endX = e.originalEvent.changedTouches[0].screenX;
							touch.endY = e.originalEvent.changedTouches[0].screenY;
						} else {
							touch.endX = e.originalEvent.screenX;
							touch.endY = e.originalEvent.screenY;
						}

						switch( direction ){
							case 'up':
								if( touch.startY > (touch.endY + elHeight * dimFactor) ){
									$.proxy(callback, this, e)();
								}
							break;

							case 'right':
								if( touch.startX < (touch.endX - elWidth * dimFactor) ){
									$.proxy(callback, this, e)();
								}
							break;

							case 'down':
								if( touch.startY < (touch.endY - elHeight * dimFactor) ){
									$.proxy(callback, this, e)();
								}
							break;

							case 'left':
								if( touch.startX > (touch.endX + elWidth * dimFactor) ){
									$.proxy(callback, this, e)();
								}
							break;

							default:break;
						}
					})
				;
			}

			return this;
		},



		/**
		 * @namespace Events:$fn.unbindSwipeGesture
		 **/

		/**
		 * Unbinds a callback to a swipe gesture.
		 *
		 * Normally all directions unbind individually, but if you leave out the direction all directions are unbound
		 * in a loop.
		 *
		 * @param {?String} [direction] - the direction to unbind => up/down/left/right, if null/undefined all directions for namespace are unbound
		 * @param {?String} [eventNameSpace='annexSwipeGesture'] - event namespace to unbind, useful to only unbind a specific group of events
		 * @returns {Object} this
		 *
		 * @memberof Events:$fn.unbindSwipeGesture
		 * @see bindSwipeGesture
		 * @example
		 * $slider.unbindSwipeGesture('right', 'foobarPrev');
		 * $slider.unbindSwipeGesture();
		 **/
		unbindSwipeGesture : function(direction, eventNameSpace){
			eventNameSpace = $.orDefault(eventNameSpace, 'annexSwipeGesture', 'string');

			var _this_ = this;

			if( $.isSet(direction) ){
				$.assert($.inArray(direction, ['up', 'right', 'down', 'left']) >= 0, 'bindSwipeGesture | direction is not in up/right/down/left');
				$(this).off('touchstart.'+eventNameSpace+'-'+direction+' mousedown.'+eventNameSpace+'-'+direction+'  touchend.'+eventNameSpace+'-'+direction+' mouseup.'+eventNameSpace+'-'+direction);
			} else {
				$.each(['up', 'right', 'down', 'left'], function(index, direction){
					$(_this_).off('touchstart.'+eventNameSpace+'-'+direction+' mousedown.'+eventNameSpace+'-'+direction+'  touchend.'+eventNameSpace+'-'+direction+' mouseup.'+eventNameSpace+'-'+direction);
				});
			}

			return this;
		},



		/**
		 * @namespace Preparation:$fn
		 **/

		/**
		 * @namespace Preparation:$fn.setElementIdentity
		 **/

		/**
		 * Creates basic element attributes for an element, providing the possibility to declare another
		 * element as a source to inherit attributes from.
		 *
		 * The basic premise is this: You define all attributes to set in a plain object, where the key is
		 * the attribute name and the value is the value for the attribute. "class" may be provided as an array
		 * and "style" may be provided as a plain object, everything else has to be a string.
		 *
		 * Normally all attributes of the target element will be overwritten with the provided/inherited values, but
		 * you may declare "class" as "+class" and "style" as "+style" to add to the value already being present on the
		 * element.
		 *
		 * If you want to inherit all data-attributes or on-handlers from an element you may declare the fields "data*" and
		 * "on*" as true to inherit all attributes starting with data- or on.
		 *
		 * Keep in mind that attrDefinitions always have precedence over inherited values, so "data*" being true and an additionally
		 * declared data value will result in the element getting the declared value on the field and not having the inherited value.
		 *
		 * @param {Object} attrDefinitions - a plain object declaring attributes to set or inherit from another object of the form {attributeName : attributeValue|true}
		 * @param {?Object} $inheritFrom - the element to inherit attribute values from, all values set to true in attrDefinitions are used for inheritance
		 * @returns {Object} this
		 *
		 * @memberof Preparation:$fn.setElementIdentity
		 * @example
		 * $.elem('div').setElementIdentity({'id' : 'kitten', '+class' : 'cute fluffy', '+style' : 'display:none;'});
		 * $.elem('div').setElementIdentity({'id' : 'kitten', '+class' : true, 'data*' : true, 'data-foo' : 'this will have precedence over data*'}, $anotherDomElement);
		 **/
		setElementIdentity : function(attrDefinitions, $inheritFrom){
			$.assert($.isPlainObject(attrDefinitions), '$.fn.setElementIdentity | attrDefinitions are missing or no plain object');

			var _this_ = this;

			if( $.isSet($inheritFrom) && $.isA($inheritFrom, 'object') ){
				$.each($inheritFrom.get(0).attributes, function(index, attribute){
					if(
						(attribute.name.indexOf('data-') === 0)
						&& (attrDefinitions['data*'] === true)
					){
						$(_this_).attr(attribute.name, attribute.value);
						$(_this_).data(attribute.name.substring(5), attribute.value);
					} else if(
						(attribute.name.indexOf('on') === 0)
						&& (attrDefinitions['on*'] === true)
					){
						$(_this_).attr(attribute.name, attribute.value);
					} else if( attrDefinitions[attribute.name] === true ){
						$(_this_).attr(attribute.name, attribute.value);
					}
				});
			}

			$.each(attrDefinitions, function(attrName, attrValue){
				if( (attrName.indexOf('+') < 0) && (attrName.indexOf('*') < 0) && (attrValue !== true) ){
					if( (attrName === 'class') && $.isArray(attrValue) ){
						$(_this_).attr('class', '');
						$.each(attrValue, function(index, value){
							$(_this_).addClass(''+value);
						});
					} else if( (attrName === 'style') && $.isPlainObject(attrValue) ){
						$(_this_).attr('style', '');
						$(_this_).css(attrValue);
					} else {
						$(_this_).attr(attrName, attrValue);
					}
				}
			});

			if( $.isSet(attrDefinitions['+class']) ){
				if( attrDefinitions['+class'] !== true ){
					if( $.isArray(attrDefinitions['+class']) ){
						$.each(attrDefinitions['+class'], function(index, value){
							$(_this_).addClass(''+value);
						});
					} else {
						$(this).addClass(''+attrDefinitions['+class']);
					}
				} else if( $.isSet($inheritFrom) && $.isA($inheritFrom, 'object') && $.isSet($inheritFrom.attr('class')) ){
					$(this).addClass(''+$inheritFrom.attr('class'));
				}
			}

			if( $.isSet(attrDefinitions['+style']) ){
				if( attrDefinitions['+style'] !== true ){
					if( $.isPlainObject(attrDefinitions['+style']) ){
						$(this).css(attrDefinitions['+style']);
					} else {
						$(this).attr('style', ($.isSet($(this).attr('style')) ? $(this).attr('style')+' ' : '')+attrDefinitions['+style']);
					}
				} else if( $.isSet($inheritFrom) && $.isA($inheritFrom, 'object') && $.isSet($inheritFrom.attr('style')) ){
					$(this).attr('style', ($.isSet($(this).attr('style')) ? $(this).attr('style')+' ' : '')+$inheritFrom.attr('style'));
				}
			}

			return this;
		},



		/**
		 * @namespace Preparation:$fn.prime
		 **/

		/**
		 * Offers an execution frame for element preparation like setting handlers and transforming dom.
		 * Takes a function including the initialization code of a (set of) element(s) and wraps it with
		 * a check if this initialization was already executed (has data-primed="true" then) as well
		 * as a document ready handler to make sure no initializations are executed with a half ready dom.
		 * After document ready has been reached, the element(s) receives data-primed-ready="true" as well.
		 *
		 * The initialization function gets called on each member of the element set individually, setting "this"
		 * inside the function to the individual member.
		 *
		 * If the initialization function returns a promise or deferred and returnPromise is set to "true", prime will return
		 * a promise that resolves, when all individual element promises are resolved and fails if one fails. If your function
		 * does not return a promise or deferred and returnPromise is set to "true", the function will return a promise which resolves
		 * as soon as document ready was reached and all init functions have been executed. So, to be able to work with applied changes
		 * on the element after prime() you have three options:
		 * 1. Either make sure document ready occurred before prime(), so the event handler gets called synchronously by jQuery right
		 * at declaration.
		 * 2. Wrap the code after prime in $(function(){ ... }) as well, to establish a synchronous event order.
		 * 3. Return a promise and wrap your code in .done(function(){ ... })
		 *
		 * @param {Function} fInitialization - the function containing all initialization code for the element(s), this-context is set
		 * @param {?Boolean} [returnPromise=false] - if true, forces the function to return a promise object, if possible the result of fInitialization
		 * @param {?PlainObject} [classChanges=null] - if set, may contain the keys "addClass" and/or "removeClass" with a standard jQuery css class string, defining which classes to add and/or remove on finish, helpful to automatically remove visual cloaking or set ready markers, adding has precedence over removing
		 * @returns {(Object|Promise)} this or a promise
		 *
		 * @memberof Preparation:$fn.prime
		 * @example
		 * $.when($('.widget').prime(function(){ ... return promise; }, true), $('.anotherWidget').prime(function(){ ... return deferred; }, true)).then(function(){ ... })
		 * $('.many-widgets').prime(function(){ ... return deferred; }, true, {removeClass : 'cloaked'}).done(function(){ ... });
		 **/
		prime : function(fInitialization, returnPromise, classChanges){
			returnPromise = $.orDefault(returnPromise, false, 'bool');
			classChanges = $.orDefault(classChanges, {});

			$.assert($.isPlainObject(classChanges), '$.fn.prime | classChanges needs to be empty or a plain object');

			var deferred = $.Deferred();
			deferred.resolve();
			var promises = [deferred.promise()];

			$(this).each(function(){
				if( $(this).dataDuo('primed') !== true ){
					$(this).dataDuo('primed', true);

					var _this_ = this,
						returnPromise = $.Deferred();

					promises.push(returnPromise.promise());

					$(function(){
						var initPromise = $.proxy(fInitialization, _this_)();

						if(
							$.isSet(initPromise)
							&& (
								(
									$.isFunction(initPromise.promise)
									&& $.isFunction(initPromise.done)
									&& $.isFunction(initPromise.fail)
								)
								|| (
									$.isFunction(initPromise.then)
								)
							)
						){
							$.when(initPromise)
								.done(function(){ returnPromise.resolve(); })
								.fail(function(){ returnPromise.reject(); })
							;
						} else {
							returnPromise.resolve();
						}

						$(_this_).dataDuo('primed-ready', true);
					});
				}
			});

			var fFinishedCallback = function(){
				if( $.isSet(classChanges.removeClass) ){
					$(this).removeClass(''+classChanges.removeClass);
				}

				if( $.isSet(classChanges.addClass) ){
					$(this).addClass(''+classChanges.addClass);
				}
			};

			$.when.apply($, promises).then($.proxy(fFinishedCallback, this));
			if( returnPromise ){
				return $.when.apply($, promises).promise();
			} else {
				return this;
			}
		},



		/**
		 * @namespace Urls:$fn
		 **/

		/**
		 * @namespace Urls:$fn.urlParameter
		 **/

		/**
		 * Searches for and returns parameters embedded in URLs, either in the document(-url) or elements
		 * having a src- or href-attributes. You may also use windows as targets or a jQuery object offering
		 * the properties "location", "location.href" and "location.search".
		 *
		 * Return a single parameter if name is given, otherwise returns dict with all values.
		 *
		 * If a parameter has more than one value the values are returned as an array, wether being requested by name
		 * or in the dict containing all params.
		 *
		 * @param {?String} [paramName=null] - the name of the parameter to extract
		 * @returns {(null|true|String|String[]|Object)} null in case the parameter doesn't exist, true in case it exists but has no value, a string in case the parameter has one value, or an array of strings, or a dict/object of all available params
		 *
		 * @memberof Urls:$fn.urlParameter
		 * @example
		 * var hasKittens = $(document).urlParameter('has_kittens');
		 * var hasDoggies = $('img:first').urlParameter('has_doggies');
		 * var hasRabbits = $(parent.window).urlParameter('has_rabbits');
		 * var allTheData = $(window).urlParameter();
		 **/
		urlParameter : function(paramName){
			paramName = $.orDefault(paramName, null, 'string');

			var url = '',
				targetWindow = null;

			if( $(this).prop('nodeName') === '#document' ){
				targetWindow = window;
			} else if( $.isSet($(this).oo().location) && $.isSet($(this).oo().location.search) ){
				targetWindow = $(this).oo();
			}

			if( $.isSet(targetWindow) ){
				url = targetWindow.location.search;
			} else if( $.isSet($(this).attr('src')) ){
				url = $(this).attr('src');
			} else if( $.isSet($(this).attr('href')) ){
				url = $(this).attr('href');
			} else {
				return null;
			}

			return $.urlParameter(url, paramName);
		},



		/**
		 * @namespace Urls:$fn.urlParameters
		 **/

		/**
		 * Searches for and returns parameters embedded in URLs, either in the document(-url) or elements
		 * having a src- or href-attributes.
		 *
		 * Semantic shortcut version of $.fn.urlParameter(); (without parameter name, resulting in all params as dict/object)
		 *
		 * @returns {Object} dict/object of all params, empty if no params
		 *
		 * @memberof Urls:$fn.urlParameters
		 * @example
		 * var allParams = $(document).urlParameters();
		 * var allWindowParams = $(parent.window).urlParameters();
		 * var allImageParams = $('img:first').urlParameters();
		 **/
		urlParameters : function(){
			return $(this).urlParameter();
		},



		/**
		 * @namespace Urls:$fn.urlAnchor
		 **/

		/**
		 * Returns the currently set URL-Anchor on the document(-url) or elements having a src- or href-attribute.
		 *
		 * @param {?Boolean} [withoutCaret=false] - defines if anchor value should contain leading "#"
		 * @returns {(String|null)} current anchor value or null if no anchor in url
		 *
		 * @memberof Urls:$fn.urlAnchor
		 * @example
		 * var windowAnchorWithoutCaret = $(document).urlAnchor(true);
		 * var imgAnchorWithCaret = $('img:first').urlAnchor();
		 **/
		urlAnchor : function(withoutCaret){
			var url = null,
				targetWindow = null;

			if( $(this).prop('nodeName') === '#document' ){
				targetWindow = window;
			} else if( $.isSet($(this).oo().location) && $.isSet($(this).oo().location.hash) ){
				targetWindow = $(this).oo();
			}

			if( $.isSet(targetWindow) ){
				url = targetWindow.location.hash;
			} else if( $.isSet($(this).attr('src')) ){
				url = $(this).attr('src');
			} else if( $.isSet($(this).attr('href')) ){
				url = $(this).attr('href');
			} else {
				return null;
			}

			return $.urlAnchor(url, withoutCaret);
		},



		/**
		 * @namespace Viewport:$fn
		 **/

		/**
		 * @namespace Viewport:$fn.isInViewport
		 **/

		/**
		 * Returns if the current element is visible in the window's viewport at the moment.
		 * This method uses getBoundingClientRect(), which has to be supported by the browser, otherwise
		 * the method will always return true.
		 *
		 * @param {?Boolean} [mustBeFullyInside=false] - defines if the element has to be fully enclosed in the viewport, default is false
		 * @returns {Boolean} true if in viewport
		 *
		 * @memberof Viewport:$fn.isInViewport
		 * @example
		 * if( $('div.moving').isInViewport(true) ){
		 *   ...
		 * }
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
		 * @namespace Viewport:$fn.scrollTo
		 **/

		/**
		 * Scrolls the viewport to the first matched element's position (first pixel at half viewport height).
		 * Does not do anything if target element is already fully in viewport, unless scrollEvenIfFullyInViewport is set to
		 * true. Uses getBoundingClientRect to measure viewport check, scrolls always if missing.
		 *
		 * If you use this function on a window, the offset is directly used as scrollTop, so this function may also be used for
		 * things like back to top buttons.
		 *
		 * Scrolls may be cancelled by setting cancelOnUserScroll to true, but keep in mind, that this will only work
		 * with mousewheels and (maybe) touchpads on modern browsers. No keyboard or scrollbar support yet.
		 * The root of the problem is that a user scroll is indistinguashable from a js-triggered scroll
		 * (with animate in this case), since both trigger the scroll event and look exactly the same. So we have to
		 * use exotic and specific events like mousewheel and DOMMouseScroll. So, please, use cancelOnUserScroll only
		 * as a convenience option and not as a must.
		 *
		 * @param  {?Function} [callback=$.noop] - callback to fire when scrolling is done, also fires if scrolling was not needed
		 * @param  {?Number.Integer} [durationMs=1000] - duration of the scrolling animation
		 * @param  {?Number.Integer} [offset=0] - offset from the viewport center to apply to the end position
		 * @param  {?Boolean} [scrollEvenIfFullyInViewport=false] - if true, forces method to always scroll no matter the element's position
		 * @param  {?Boolean} [cancelOnUserScroll=false] - if true, scrolling animation will immediately be canceled on manual user scroll, callback will not fire in that case
		 * @returns {Object} this
		 *
		 * @memberof Viewport:$fn.scrollTo
		 * @example
		 * $('a.jumpitem').on('click', function(){ $jumpTarget.scrollTo(function(){ alert('scrolled!'); }, 500, -100, true); });
		 * $jumpTarget.scrollTo(function(){ alert('Not triggered if user uses mousewheel.'); }, 5000, -0, false, true);
		 * $(window).scrollTo($.noop, 500, 0, false, true);
		 **/
		scrollTo : function(callback, durationMs, offset, scrollEvenIfFullyInViewport, cancelOnUserScroll){
			callback = $.isFunction(callback) ? callback : $.noop;
			durationMs = $.orDefault(durationMs, 1000, 'int');
			offset = $.orDefault(offset, 0, 'int');
			scrollEvenIfFullyInViewport = $.orDefault(scrollEvenIfFullyInViewport, false, 'bool');
			cancelOnUserScroll = $.orDefault(cancelOnUserScroll, false, 'bool');

			var $target = $(this).first();
			if( $.isSet($target) && $target.length > 0 ){
				var	callbackFired = false,
					vpHeight = window.innerHeight || $(window).height(),
					isInViewport = $.isWindow($target.oo()) ? false : $target.isInViewport(true);

				try {
					$target.oo().getBoundingClientRect();
				} catch(err){
					isInViewport = false;
				}

				if( scrollEvenIfFullyInViewport || !isInViewport ){
					if( cancelOnUserScroll ){
						$(window).on('DOMMouseScroll.scrollTo mousewheel.scrollTo', function(){
							$('html, body').stop(true);
							$(window).off('DOMMouseScroll.scrollTo mousewheel.scrollTo');
						});
					}

					$('html, body')
						.stop(true)
						.animate(
							{scrollTop: $.isWindow($target.oo()) ? offset : $target.offset().top - Math.round(vpHeight / 2) + offset},
							{
								duration : durationMs,
								complete : function(){
									if( !callbackFired ){
										callback();
										callbackFired = true;
									}
								}
							}
						)
					;
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
		 * @namespace Images:$fn
		 **/

		/**
		 * @namespace Images:$fn.imgLoad
		 **/

		/**
		 * Fixes cross-browser problems with image-loads and fires the event even in case the image is already loaded.
		 * So repeated calls to this method on the same, loaded image will result in additional executions.
		 *
		 * Also supports <imgs> inside picture elements, while handling the polyfills respimage and picturefill if
		 * present in window. Make sure to apply this method to the img inside the picture and _not_ on the <picure>
		 * itself.
		 *
		 * @param {Function} callback - callback to call when all images have been loaded
		 * @param {?Boolean} [needsJqueryDims=false] - tells the check if we expect the loaded image to have readable dimensions
		 * @returns {Object} this
		 *
		 * @memberof Images:$fn.imgLoad
		 * @example
		 * $.elem('img', {src : '/img/kitten.png'}).imgLoad(function(){ $(this).removeClass('hidden'); });
		 **/
		imgLoad : function(callback, needsJqueryDims){
			var $targets = $(this).filter('img'),
				$subTargets = $(),
				targetCount = $targets.length;

			var fOnLoad = function(e){
				if( (!needsJqueryDims || (needsJqueryDims && $(this).width() > 0)) ){
					if( (--targetCount <= 0) && $.isFunction(callback) ){
						$targets.off('load.imgload');
						$subTargets.off('load.imgload');
						callback.call($targets, e);
					}
				} else {
					var $target = $(this);
					$.waitForRepaint(function(){ $target.trigger('load.imgload'); });
				}
			};

			$targets.on('load.imgload', fOnLoad).each(function(){
				var src = $(this).oo().src,
					$parent = $(this).parent(),
					isPicture = $parent.is('picture');

				$.assert(!$.isEmpty(src), '$.fn.imgLoad | image has no usable src attribute, src must be filled before registering imgLoad, don\'t worry, it will fire even if the image has already been loaded before');

				if( isPicture || this.complete || this.complete === undefined ){
					if( isPicture ){
						var $img = $();

						if( window.respimage ){
							window.respimage({elements : [$parent.oo()]});
							$img = $parent.children('img').first();
						} else if( window.picturefill ){
							window.picturefill({elements : [$parent.oo()]});
							$img = $parent.children('img').first();
						} else {
							$img = $(this);
						}

						$subTargets = $img;

						$(this).off('load.imgload');
						$img.each(function(){
							var img = $(this).oo();
							$(this).off('load.imgload');

							if( img.complete || img.complete === undefined ){
								var loadImg = new Image();
								$(loadImg).on('load.imgload', $.proxy(fOnLoad, this));
								loadImg.src = src;
							} else {
								$(this).on('load.imgload', $.proxy(fOnLoad, this));
							}
						});
					} else {
						$(this).off('load.imgload');
						var loadImg = new Image();
						$(loadImg).on('load.imgload', $.proxy(fOnLoad, this));
						loadImg.src = src;
					}
				}
			});

			return this;
		},



		/**
		 * @namespace Animation:$fn
		 **/

		/**
		 * @namespace Animation:$fn.cssTransition
		 **/

		/**
		 * WARNING: EXPRIMENTAL FUNCTIONALITY (this method is production proven for simple cases and tests look good, but use
		 * with extra caution, especially on older browsers and with long animation chains)
		 *
		 * This method offers the possibility to apply a css transition via classes or styles and wait for the transition
		 * to finish, which results in the timed execution of a callback or the resolving of a promise. In general, this
		 * method remedies the pain of having to manage transitions manually in JS, entering precise ms for timers waiting
		 * on conclusion of transitions.
		 *
		 * The general principle of this is the parsing of transition css attributes, which may contain transition
		 * timings (transition and transition-duration) and looks for the currently longest running transition. Values
		 * are excepted as millisecond ints or second floats.
		 *
		 * Calling this method successively on the same element replaces the currently running transition, normally
		 * resulting in premature execution of the callback or resolution of the promise and application of the newly
		 * provided cssChanges.
		 *
		 * @param {Object} cssChanges - PlainObject containing the css changes to apply (including transitions), either {addClass : ''}, {removeClass : ''} or {css : {}}, where addClass, removeClass and css follow jQuery's function definitions
		 * @param {Function} [callback=undefined] - the function to call on completion of the transition, will be called with 10ms offset, to prevent unfinished style application before switching to next steps, the callback receives the elements as first parameter
		 * @param {Boolean} [fireRunningTimer=true] - if a new cssTransition is applied while a transition is still running the callback would normally be executed (or the promise resolved) before continuing, to suppress this, set this to false
		 * @return {Object|Promise} in case a callback is defined as parameter the elements will be returned in classic jQuery manner, if no callback is defined, a promise is returned instead, the promise id being rejected if a transition gets interrupted by a successive call and callback are set to not fire
		 *
		 * @memberof Animation:$fn.cssTransition
		 * @example
		 * $target.cssTransition({addClass : 'foobar'}, function($element){ $target.cssTransition({removeClass : 'foobar'}, function($element){ $.log('finished'); }); });
		 * $target.cssTransition({css : {top : 0, left : 0,  background : 'pink', transition : 'all 1500ms'}}, function($element){ $.log('finished'); });
		 * $target.cssTransition({addClass : 'foobar'}).done(function($element){ $.log('finished'); }).fail(function($element){ $.log('cancelled') });
		 */
		cssTransition : function(cssChanges, callback, fireRunningTimer){
			fireRunningTimer = $.orDefault(fireRunningTimer, true, 'bool');

			var deferred = $.Deferred(),
				runningTimer = $(this).data('jqueryAnnexCssTransitionTimer'),
				runningCallback = $(this).data('jqueryAnnexCssTransitionCallback');

			// check if timer of older transition is still running and stop it, in case we want to fire the callback, do that
			if( $.isSet(runningTimer) ){
				$.countermand(runningTimer);
				if( $.isFunction(runningCallback) ){
					runningCallback(fireRunningTimer);
				}
			}
			$(this)
				.removeData('jqueryAnnexCssTransitionTimer')
				.removeData('jqueryAnnexCssTransitionCallback')
			;

			// some sanity checks for params
			$.assert($.isPlainObject(cssChanges), 'cssTransition | cssChanges is not a plain object');
			if( !$.isSet(cssChanges.css) && !$.isSet(cssChanges.addClass) && !$.isSet(cssChanges.removeClass) ){
				$.err('cssTransition | cssChanges lacks "css", "addClass" or "removeClass"');
			}
			if( $.isSet(cssChanges.css, cssChanges.addClass) || $.isSet(cssChanges.css, cssChanges.removeClass) ){
				$.err('cssTransition | cssChanges may not contain "css" and "addClass"/"removeClass" together');
			}
			if( $.isSet(cssChanges.css) && !$.isPlainObject(cssChanges.css) ){
				$.err('cssTransition | cssChanges.css must be a plain object of css attributes compatible to .css()');
			}
			if( $.isSet(callback) ){
				$.assert($.isFunction(callback), 'cssTransition | callback is not a function');
			}

			// definition of css attributes to comb through in correct order, first hit wins, used value gets put
			// into transitionValue for further parsing
			var _this_ = this,
				transitionAttributes = [
					'transition-duration',
					'-webkit-transition-duration',
					'-moz-transition-duration',
					'-o-transition-duration',
					'transition',
					'-webkit-transition',
					'-moz-transition',
					'-o-transition'
				],
				transitionValue = null;

			// if single css attributes were provided
			if( $.isSet(cssChanges.css) ){
				// evaluate transition value to use from provided css attrs
				$.each(transitionAttributes, function(transitionAttributeIndex, transitionAttribute){
					var cssValue = cssChanges.css[transitionAttribute];

					if( $.isSet(cssValue) ){
						$.each(transitionAttributes, function(replacementTransitionAttributeIndex, replacementTransitionAttribute){
							cssChanges.css[replacementTransitionAttribute] = cssChanges.css[transitionAttribute];
						});

						transitionValue = cssValue;

						return false;
					}
				});

				// if css set does not contain a transition try to fall back to general definitions of element
				if( !$.isSet(transitionValue) ){
					$.each(transitionAttributes, function(transitionAttributeIndex, transitionAttribute){
						var cssValue = $(_this_).css(transitionAttribute);

						if( $.isSet(cssValue) ){
							transitionValue = cssValue;
							return false;
						}
					});
				}

				if( !$.isSet(transitionValue) ){
					$.warn('cssTransition | transition value does not contain a transition and element has no base transition defined');

					if( $.isFunction(callback) ){
						$.proxy(callback, this)(this);
						return this;
					} else {
						deferred.resolve(this, [this]);
						return deferred.promise();
					}
				} else {
					$(this).css(cssChanges.css);
				}
			// if addClass or removeClass were provided
			} else {
				if( $.isSet(cssChanges.removeClass) ){
					$(this).removeClass(''+cssChanges.removeClass);
				}

				if( $.isSet(cssChanges.addClass) ){
					$(this).addClass(''+cssChanges.addClass);
				}
			}

			// wait for next free execution slot after rendering css changes
			$.waitForRepaint(function(){
				// if we used addClass or remoteClass we do not have a value yet and we had to wait for application of style changes
				if( !$.isSet(transitionValue) ){
					$.each(transitionAttributes, function(transitionAttributeIndex, transitionAttribute){
						var cssValue = $(_this_).css(transitionAttribute);

						if( $.isSet(cssValue) ){
							transitionValue = cssValue;
							return false;
						}
					});
				}

				// parse transition timings in millisecond or second format and search for longest running one
				var sTimings = transitionValue.match(/(^|\s)(\d+(\.\d+)?)s(\s|\,|$)/g),
					msTimings = transitionValue.match(/(^|\s)(\d+)ms(\s|\,|$)/g),
					currentTiming = 0,
					longestTiming = 0;

				$.each(sTimings, function(timingIndex, timing){
					currentTiming = parseFloat(timing);

					if( !$.isNaN(currentTiming) ){
						currentTiming = Math.floor(currentTiming * 1000);

						if( currentTiming > longestTiming ){
							longestTiming = currentTiming;
						}
					}
				});

				$.each(msTimings, function(timingIndex, timing){
					currentTiming = parseInt(timing, 10);

					if( !$.isNaN(currentTiming) && (currentTiming > longestTiming) ){
						longestTiming = currentTiming;
					}
				});

				// setup timer to wait for completion of transition according to found longest timing, add 10ms for render safety
				// this function needs to cancel and rejection handling, since it's always the success case, where the timer itself fires
				$(_this_).data('jqueryAnnexCssTransitionTimer', $.schedule(longestTiming + 10, function(){
					$(_this_).removeData('jqueryAnnexCssTransitionTimer');
					if( $.isFunction(callback) ){
						$.proxy(callback, _this_)(_this_);
					} else {
						deferred.resolve(_this_, [_this_]);
					}
				}));

				// provide a callback to execute on premature setting of a new transition on the element, receives the
				// info if callback should be fired or cancelled from the calling run of cssTransition, cancellation
				// results in only case where promise gets rejected
				$(_this_).data('jqueryAnnexCssTransitionCallback', function(fireRunningTimer){
					if( fireRunningTimer ){
						if( $.isFunction(callback) ){
							$.proxy(callback, _this_)(_this_);
						} else {
							deferred.resolve(_this_, [_this_]);
						}
					} else if( !fireRunningTimer && !$.isFunction(callback) ){
						deferred.reject(_this_, [_this_]);
					}
				});
			});

			if( $.isFunction(callback) ){
				return this;
			} else {
				return deferred.promise();
			}
		},



		/**
		 * @namespace Css:$fn
		 **/

		/**
		 * @namespace Css:$fn.cssCrossBrowser
		 **/

		/**
		 * Sets CSS-rules blindly for all intermediate cross browser variants.
		 * Unknown stuff does not get interpreted, and therefore should not do harm,
		 * but relieves one of writing several slightly different rules all the time.
		 *
		 * @param {Object.<String, String>} cssObj - plain object of CSS-rules to apply, according to jQuery standard
		 * @returns {Object} this
		 *
		 * @memberof Css:$fn.cssCrossBrowser
		 * @example
		 * $('body').cssCrossBrowser({'box-shadow' : '1px 1px 1px 1px #000'});
		 **/
		cssCrossBrowser : function(cssObj){
			if( $.isPlainObject(cssObj) ){
				var orgCssObj = $.extend({}, cssObj);
				$.each(orgCssObj, function(cssKey, cssValue){
					$.each(['-moz-', '-webkit-', '-o-', '-ms-', '-khtml-'], function(variantIndex, variantValue){
						if(cssKey === 'transition'){
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
		 * @namespace Interaction:$fn
		 **/

		/**
		 * @namespace Interaction:$fn.createSelection
		 **/

		/**
		 * Programmatically create a text selection inside a node, possibly reaching across several child nodes,
		 * but virtually working the only the raw text content. Can also be used to create a selection in text
		 * inputs for example.
		 *
		 * Be aware that the endOffset is neither the length to select nor the last index, but the offset starting
		 * from the last character in the node counting backwards (like a reverse startOffset). The reason for this wonkiness
		 * is the fact that we have to implement three different ways of creating selections in this function, this
		 * notation being the most compatible one. We assume the default use case for this method is to select all contents
		 * of a node with the possibility to skip one or two unwanted chracters on each side of the content.
		 *
		 * Hint: You cannot create a selection spanning normal inline text into an input, ending there. To create a selection in
		 * a text input, please target that element specifically or make sure the selection spans the whole input.
		 * Furthermore, on mobile/iOS devices creation of selection ranges might only be possible in text inputs.
		 *
		 * @param  {?Number.Integer} [startOffset] - characters to leave out at the beginning of the text content
		 * @param  {?Number.Integer} [endOffset] - characters to leave out at the end of the text content
		 * @param  {?Boolean} [returnSelectedText=false] - if true, returns the selected text instead of the element
		 * @return {(Object|String)} Either this or the selected text
		 *
		 * @memberof Interaction:$fn.createSelection
		 * @see removeSelection
		 * @example
		 * var selectedText = $('.copytext').createSelection(12, 6, true);
		 * var $textarea = $('textarea').first().createSelection();
		 **/
		createSelection : function(startOffset, endOffset, returnSelectedText){
			startOffset = $.orDefault(startOffset, null, 'int');
			endOffset = $.orDefault(endOffset, null, 'int');
			returnSelectedText = $.orDefault(returnSelectedText, false, 'bool');

			var selectionText = '';

			$(this).each(function(){
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
		 * @namespace Interaction:$fn.disableSelection
		 **/

		/**
		 * Disables selectability as far as possible for elements.
		 *
		 * @returns {Object} this
		 *
		 * @memberof Interaction:$fn.disableSelection
		 * @example
		 * $('.widget').disableSelection();
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
		 * @namespace Interaction:$fn.enableSelection
		 **/

		/**
		 * Enable selectability again to counteract disabled selectability established with $.fn.disableSelection.
		 *
		 * @returns {Object} this
		 *
		 * @memberof Interaction:$fn.enableSelection
		 * @example
		 * $('.widget').enableSelection();
		 **/
		enableSelection : function(){
			$(this).each(function(){
				this.onselectstart = undefined;
				this.unselectable = 'off';
				$(this).cssCrossBrowser({'user-select' : ''});
				$(this).css('-webkit-touch-callout', '');
			});

			return this;
		},



		/**
		 * @namespace Protocols:$fn
		 **/

		/**
		 * @namespace Protocols:$fn.registerMailTo
		 **/

		/**
		 * Register an event handler to open a mailto dialogue without openly writing
		 * down the mail address. Parameters mixed to complicate parsing.
		 *
		 * @param {?String} [tld] - the top level domain to use
		 * @param {String} beforeAt - the address part before the @
		 * @param {String} afterAtWithoutTld - the address part after the @ but before the tld
		 * @param {?String} [subject] - the subject the mail should have
		 * @param {?String} [body] - the body text the mail should have initially
		 * @param {?Boolean} [writeToElem=false] - define if the email should be written back to the element text (still uses string obfuscation, but weaker against bot with JS execution)
		 * @param {?String} [eventType=click] - the event type to register the call to
		 * @returns {Object} this
		 *
		 * @memberof Protocols:$fn.registerMailTo
		 * @example
		 * $('a:first').registerMailTo('de', 'recipient', 'gmail', 'Hello there!', 'How are you these days?', 'click');
		 **/
		registerMailTo : function(tld, beforeAt, afterAtWithoutTld, subject, body, writeToElem, eventType){
			eventType = $.orDefault(eventType, 'click', 'string');
			subject = $.orDefault(subject, '', 'string');
			body = $.orDefault(body, '', 'string');

			tld = $.isSet(tld) ? '.'+tld : '';

			$(this).on(eventType, function(){
				$.redirect('mailto:'+beforeAt+'\u0040'+afterAtWithoutTld+tld+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body));
			});

			if( $.isSet(writeToElem) && writeToElem ){
				$(this).html((beforeAt+'\u0040'+afterAtWithoutTld+tld).replace(/(\w{1})/g, '$1&zwnj;'));
			}

			return this;
		},


		/**
		 * @namespace Protocols:$fn.registerTel
		 **/

		/**
		 * Register an event handler to activate a tel-protocol phonecall without openly writing
		 * down the number. Parameters mixed to complicate parsing.
		 *
		 * @param {(Number.Integer|String)} regionPart - the local part of the number after the country part e.g. +49(04)<-this 123 456
		 * @param {(Number.Integer|String)} firstTelPart - first half of the main number +4904 (123)<-this 456
		 * @param {(Number.Integer|String)} countryPart - the country identifactor with or without + this->(+49)04 123 456 (do not prefix with a local 0!)
		 * @param {(Number.Integer|String)} secondTelPart - second half of the main number +4904 123 (456)<-this
		 * @param {?Boolean} [writeToElem=false] - define if the number should be written back to the element text (still uses string obfuscation, but weaker against bot with JS execution)
		 * @param {?String} [eventType=click] - the event type to register the call to
		 * @returns {Object} this
		 *
		 * @memberof Protocols:$fn.registerTel
		 * @example
		 * $('input:text:first').registerTel('40', '439', '+49', '123', true, 'change');
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
				$(this).html((countryPart+regionPart+' '+firstTelPart+' '+secondTelPart).replace(/(\w{1})/g, '$1&zwnj;'));
			}

			return this;
		},



		/**
		 * @namespace TextContent:$fn
		 */

		/**
		 * @namespace TextContent:$fn.multiLineTextEllipsis
		 **/

		/**
		 * Iteratively Shortens the text content of an element to a length, where the text fits into the element's size.
		 *
		 * This process is very CPU-heavy and should only be used very sparingly.
		 * There are some preconditions, so that this may work:
		 * 1. We need an area/a container which defines the space available to display text. This element must have
		 *    realistic, readably dimensions at all times. This element may, of course, be the element itself.
		 * 2. We need a holder/container for the text content, encompassing all text content to be checked. The
		 *    dimensions of this holder have to reflect the real width/height of the rendered text. This element
		 *    may not contain further markup, but has to be plain text only.
		 *
		 * In essence, this function saves the original text, then reduces the text content character by character,
		 * until it fits, then removes another set of characters to fit the ellipsis characters at the end.
		 *
		 * Normally you'll call this function repeatedly on an element to reflect changes due to resizing.
		 *
		 * If you need to reset the base text for this operation call removeData('annexMultilineEllipsisOrgText') on
		 * the element.
		 *
		 * @param {?String} [textContentSelector='.text-content'] - jQuery-selector to find the text content element (inside the holder) by
		 * @param {?String} [textContentParentSelector=''] - optional selector to find closest() parent by, if empty or '', just takes parent()
		 * @param {?String} [ellipsis='...'] - the ellipsis replacement to put at end of text in case it's too long
		 * @returns {Object} this
		 *
		 * @memberof TextContent:$fn.multiLineTextEllipsis
		 * @example
		 * $('.tile-holder .tile').multiLineTextEllipsis('.tile-text', '.tile-text-holder');
		 **/
		multiLineTextEllipsis : function(textContentSelector, textContentParentSelector, ellipsis){
			textContentSelector = $.orDefault(textContentSelector, '.text-content', 'string');
			textContentParentSelector = $.orDefault(textContentParentSelector, '', 'string');
			ellipsis = $.orDefault(ellipsis, '...', 'string');

			var _this_ = this;

			$(this).find(textContentSelector).each(function(){
				if( !$(_this_).data('annexMultilineEllipsisOrgText') ){
					$(_this_).data('annexMultilineEllipsisOrgText', $.trim($(this).text()));
				}

				var $parent = ($.trim(textContentParentSelector) !== '') ? $(this).closest(textContentParentSelector) : $(this).parent(),
					lastFittingIndex = 0,
					lastUnfittingIndex = $(_this_).data('annexMultilineEllipsisOrgText').length,
					currentIndex = lastUnfittingIndex - 1,
					parentHeight = Math.round($parent.height()),
					parentWidth = Math.round($parent.width());

				$(this).text($(_this_).data('annexMultilineEllipsisOrgText'));

				while( true ){
					if(
						(Math.round($(this).outerHeight()) > parentHeight)
						|| (Math.round($(this).outerWidth()) > parentWidth)
					){
						lastUnfittingIndex = currentIndex;
						currentIndex = currentIndex - Math.ceil(Math.abs(lastFittingIndex - currentIndex) / 2);
					} else {
						lastFittingIndex = currentIndex;
						currentIndex = currentIndex + Math.floor((lastUnfittingIndex - currentIndex) / 2);
					}

					if( Math.abs(lastFittingIndex - lastUnfittingIndex) <= 1 ){
						$(this).text($.trim($(_this_).data('annexMultilineEllipsisOrgText').slice(0, lastFittingIndex + 1)).slice(0, -(ellipsis.length + 1))+' '+ellipsis);
						break;
					} else {
						$(this).text($.trim($(_this_).data('annexMultilineEllipsisOrgText').slice(0, currentIndex + 1)));
					}
				}
			});

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
					(typeof child[name] === 'function')
					&& (typeof _super[name] === 'function')
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

	return $;

}));
