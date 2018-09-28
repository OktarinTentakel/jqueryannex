/**
 * jQueryAnnex - Validation Plugin
 * Provides the means to validate (form-)values on the fly in the client.
 * This is especially useful if you develop JS-driven apps without classical forms and reloads.
 *
 * All methods in this plugin are derived from my PHP5-framework "HtmlForm", which also includes
 * JS-validation (coupled with server-side validation) for forms. The validation capabilities aim to
 * as convenient and complete as possible.
 *
 * There are generally two methods of defining validation: either use jQuery to select value-bearing tags and
 * objects and register a/several validator(s) on it, or write the registration(s) directly into the markup via
 * data attributes.
 *
 * Have a look at the plugin-validation-example.html in the repository for example usage and test it locally in
 * your browser.
 *
 * @author Sebastian Schlapkohl <jqueryannex@ifschleife.de>
 * @version Revision 41 developed and tested with jQuery 3.3.1, 2.2.4 and 1.12.4
 **/



// automatically determine if annex should be loaded traditionally, as an AMD-module or via commonjs, if included before anything that
// exposes "define" (require.js e.g.), it will load normally, extending jQuery directly and globally
// if loaded as AMD-module it expects Annex to be available as "jqueryannex"
(function(global, factory){
	var jQuery = global.jQuery || global.$;

	if( (typeof define === 'function') && define.amd ){
		define(['jqueryannex'], factory);
	} else if( (typeof module === 'object') && module.exports ){
		if( !global.__AVA_ENV__ ){
			try {
				if( !jQuery ){
					jQuery = require('jquery');
				}

				if( !jQuery.jqueryAnnexData ){
					jQuery = require('jqueryannex');
				}
			} catch(ex){}
		}

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
			throw 'jQueryAnnex Validation Plugin | cannot extend jQuery, since it does not seem to be available as "jQuery" or is missing basic functionality';
		}

		if( !$.jqueryAnnexData ){
			throw 'jQueryAnnex Validation Plugin | cannot extend jQuery Annex, since it does not seem to be available yet';
		}
	}());



	//--|JQUERYANNEXDATA----------

	$.extend($.jqueryAnnexData, {

		// plugin is stored as part of jqueryAnnexData-dictionary
		validation : {

			// general state of page wide validation and basic validation data structure for elements
			config : {
				isValid : true,
				messages : [],

				registeredTargets : {
					all : []
				},

				globalCallback : $.noop,

				additionalWidgetEvents : '',
				validateOnWidgetEvents : true,

				defaultValidationData : {
					isValid : true,
					isDirty : false,

					isOptional : false,
					hasNonOptionalValue : false,
					optionalValues : [''],

					asyncError : false,
					asyncCount : 0,
					asyncLeft : 0,

					messages : [],

					values : []
				}
			},

			// helper functions for internal plugin use
			functions : {
				validate : function(targets, isTriggeredByWidget){

					if( !$.isSet(isTriggeredByWidget) ){
						isTriggeredByWidget = false;
					}

					if( !isTriggeredByWidget || (isTriggeredByWidget && $.jqueryAnnexData.validation.config.validateOnWidgetEvents) ){
						var validationRest = targets.length;

						$.jqueryAnnexData.validation.config.isValid = true;
						$.jqueryAnnexData.validation.config.messages = [];

						$.each(targets, function(index, $target){
							if( $.isSet($target) ){
								var validationData = $target.data('validationdata');

								// catch trailing elements, not cleaned properly
								if( $.isSet(validationData) ){
									if( !isTriggeredByWidget || validationData.status.isDirty ){
										$target.first().one('finished.validation', function(e, isValid){
											e.stopPropagation();

											$.jqueryAnnexData.validation.config.isValid = $.jqueryAnnexData.validation.config.isValid && isValid;

											if( !isValid ){
												$.merge($.jqueryAnnexData.validation.config.messages, $(e.target).data('validationdata').status.messages);
											}

											validationRest--;
											if( validationRest <= 0 ){
												$.jqueryAnnexData.validation.config.globalCallback($.jqueryAnnexData.validation.config.isValid, $.jqueryAnnexData.validation.config.messages);
												$(document).trigger('finished.validation', $.jqueryAnnexData.validation.config.isValid);
											}
										});

										var isOptional = validationData.status.isOptional;
										var asyncCount = validationData.status.asyncCount;
										validationData.status = $.extend(true, {}, $.jqueryAnnexData.validation.config.defaultValidationData);
										validationData.status.isDirty = true;
										validationData.status.isOptional = isOptional;
										validationData.status.asyncCount = asyncCount;
										validationData.status.asyncLeft = asyncCount;

										validationData.status.values = validationData.container.formDataToObject()[$target.attr('name').replace(/\[\]/, '')];

										if( $.isSet(validationData.status.values) ){
											if( !$.isArray(validationData.status.values) ){
												validationData.status.values = [validationData.status.values];
											}
										} else {
											validationData.status.values = [];
										}

										if( validationData.status.isOptional ){
											$.each(validationData.status.values, function(index, value){
												if( $.inArray(value, validationData.status.optionalValues) === -1 ){
													validationData.status.hasNonOptionalValue = true;
													return false;
												}
											});
										}

										$target.data('validationdata', validationData);

										$.jqueryAnnexData.validation.functions.unmarkValidationError($target);

										if(
											(!validationData.status.isOptional
											|| validationData.status.hasNonOptionalValue)
											&& !$.isSet($target.attr('disabled'))
										){
											$.each(validationData.rules, function(key, value){
												validationData.status.isValid = value() && validationData.status.isValid;
											});

											if( !validationData.status.isValid ){
												$.jqueryAnnexData.validation.functions.markValidationError($target);

												if( validationData.status.asyncLeft <= 0 ){
													if( $.isSet(validationData.callback) && $.isFunction(validationData.callback) ){
														validationData.callback(false, validationData.status.messages, $target);
													}

													$target.trigger('error.validation', validationData.status.messages);
												}
											}
										} else {
											validationData.status.asyncLeft = 0;
										}

										if( validationData.status.asyncLeft <= 0 ){
											if( validationData.status.isValid ){
												if( $.isSet(validationData.callback) && $.isFunction(validationData.callback) ){
													validationData.callback(true, [], $target);
												}
												$target.trigger('success.validation');
											}
											$target.trigger('finished.validation', validationData.status.isValid);
										}
									}
								} else {
									// manually kill validation for elements with lost validation data
									$target.unsetValidation(true);
								}
							}
						});
					}
				},



				markValidationError : function($target){
					var $errorContainer = $target.data('validationdata').errorContainer;

					if( $.isSet($errorContainer) ){
						$errorContainer.addClass('validationerror');
					}

					$target.addClass('validationerror');
				},



				unmarkValidationError : function($target){
					var $errorContainer = $target.data('validationdata').errorContainer;

					if( $.isSet($errorContainer) ){
						$errorContainer.removeClass('validationerror');
					}

					$target.removeClass('validationerror');
				},



				asyncCallbackFactory : function($target, msg){
					var context = $target.data('validationdata').status;
					var callback = $target.data('validationdata').callback;

					var asyncCallBack = function(asyncRes){
						var res =
							$.isA(asyncRes, 'boolean')
							? asyncRes
							: ($.trim(''+asyncRes) === '')
						;

						context.asyncError = context.asyncError && !res;
						context.isValid = context.isValid && res;
						context.asyncLeft--;

						if( !context.isValid ){
							$.jqueryAnnexData.validation.functions.markValidationError($target);

							if( !res ){
								if( $.isA(asyncRes, 'string') && ($.trim(''+asyncRes) !== '') ){
									context.messages.push($.trim(''+asyncRes));
								} else {
									context.messages.push(msg);
								}
							}

							if( context.asyncLeft <= 0 ){
								if( $.isSet(callback) && $.isFunction(callback) ){
									callback(false, context.messages, $target);
								}

								$target.trigger('error.validation', context.messages);
							}
						} else if( context.asyncLeft <= 0 ){
							if( $.isSet(callback) && $.isFunction(callback) ){
								callback(true, [], $target);
							}

							$target.trigger('success.validation');
						}

						if( context.asyncLeft <= 0 ){
							$target.trigger('finished.validation', context.isValid);
						}
					};

					return asyncCallBack;
				},



				asyncErrorCallbackFactory : function($target){
					var context = $target.data('validationdata').status;
					var callback = $target.data('validationdata').callback;

					var asyncErrorCallBack = function(){
						context.asyncLeft--;
						context.asyncError = true;

						context.isValid = context.isValid && !context.asyncError;

						$.jqueryAnnexData.validation.functions.markValidationError($target);
						context.messages.push('communication error, could not retrieve data from server');
						$.log('communication error, could not retrieve data from server');

						if( context.asyncLeft <= 0 ){
							if( $.isSet(callback) && $.isFunction(callback) ){
								callback(false, context.messages, $target);
							}

							$target.trigger('error.validation', context.messages);
							$target.trigger('finished.validation', false);
						}
					};

					return asyncErrorCallBack;
				}
			},

			// rule methods to apply validation to values
			validators : {
				customcase : function(msg, customRes){
					var res = true;
					var context = $(this).data('validationdata').status;
					var dynamicMessage = null;

					if( $.isArray(customRes) && (customRes.length < 2) ){
						customRes = customRes[0];
					}

					if( !$.isFunction(customRes) ){
						if( $.isA(customRes, 'boolean') ){
							res = customRes;
						} else if( $.trim(''+customRes) !== '' ){
							res = false;
							dynamicMessage =  $.trim(''+customRes);
						}
					} else {
						var tmpRes = customRes(
							$(this),
							$.jqueryAnnexData.validation.functions.asyncCallbackFactory($(this), msg),
							$.jqueryAnnexData.validation.functions.asyncErrorCallbackFactory($(this))
						);

						if( $.isSet(tmpRes) ){
							if( $.isA(tmpRes, 'boolean') ){
								res = tmpRes;
							} else if( $.trim(''+tmpRes) !== '' ){
								res = false;
								dynamicMessage = $.trim(''+tmpRes);
							}
						}
					}

					if( !$.isSet(dynamicMessage) ){
						if( !res && $.isSet(msg) && ($.trim(msg) !== '') ){
							context.messages.push(msg);
						}
					} else {
						context.messages.push(msg);
					}

					return res;
				},



				required : function(msg){
					var res = true;
					var context = $(this).data('validationdata').status;

					if( context.values.length === 1 ){
						res = context.values[0] !== '';
					} else {
						res = context.values.length > 0;
					}

					if( !res && $.isSet(msg) && (msg !== '') ){
						context.messages.push(msg);
					}

					return res;
				},



				notempty : function(msg){
					var additionalEmptyValues = Array.prototype.slice.call(arguments, 1);

					var res = true;
					var context = $(this).data('validationdata').status;

					var emptyValues = [''];
					$.merge(emptyValues, additionalEmptyValues);

					if( context.values.length === 1 ){
						res = ($.inArray($.trim(context.values[0]), emptyValues) === -1);
					} else {
						res = context.values.length !== 0;
					}

					if( !res && $.isSet(msg) && ($.trim(msg) !== '') ){
						context.messages.push(msg);
					}

					return res;
				},



				optional : function(){
					return true;
				},



				minlength : function(msg, minlength){
					minlength = parseInt(minlength, 10);

					var res = true;
					var context = $(this).data('validationdata').status;

					if( context.values.length === 1 ){
						res = context.values[0].length >= minlength;
					} else {
						res = (context.values.length >= minlength);
					}

					if( !res && $.isSet(msg) && ($.trim(msg) !== '') ){
						context.messages.push(msg);
					}

					return res;
				},



				maxlength : function(msg, maxlength){
					maxlength = parseInt(maxlength, 10);

					var res = true;
					var context = $(this).data('validationdata').status;

					if( context.values.length === 1 ){
						res = context.values[0].length <= maxlength;
					} else {
						res = (context.values.length <= maxlength);
					}

					if( !res && $.isSet(msg) && ($.trim(msg) !== '') ){
						context.messages.push(msg);
					}

					return res;
				},



				rangelength : function(msg, rangemin, rangemax){
					var res = true;
					var context = $(this).data('validationdata').status;

					if( $.isSet(rangemin, rangemax) ){
						res =
							$.proxy($.jqueryAnnexData.validation.validators.minlength, $(this), null, rangemin)()
							&& $.proxy($.jqueryAnnexData.validation.validators.maxlength, $(this), null, rangemax)()
						;
					}

					if( !res && $.isSet(msg) && ($.trim(msg) !== '') ){
						context.messages.push(msg);
					}

					return res;
				},



				min : function(msg, min){
					var res = true;
					var context = $(this).data('validationdata').status;

					$.each(context.values, function(index, value){
						res = res && ($.isNumeric(value) && (parseInt(value, 10) >= min));
						if( !res ) return false;
					});

					if( !res && $.isSet(msg) && ($.trim(msg) !== '') ){
						context.messages.push(msg);
					}

					return res;
				},



				max : function(msg, max){
					var res = true;
					var context = $(this).data('validationdata').status;

					$.each(context.values, function(index, value){
						res = res && ($.isNumeric(value) && (parseInt(value, 10) <= max));
						if( !res ) return false;
					});

					if( !res && $.isSet(msg) && ($.trim(msg) !== '') ){
						context.messages.push(msg);
					}

					return res;
				},



				range : function(msg, min, max){
					var res = true;
					var context = $(this).data('validationdata').status;

					if( $.isSet(min, max) ){
						res =
							$.proxy($.jqueryAnnexData.validation.validators.min, $(this), null, min)()
							&& $.proxy($.jqueryAnnexData.validation.validators.max, $(this), null, max)()
						;
					}

					if( !res && $.isSet(msg) && ($.trim(msg) !== '') ){
						context.messages.push(msg);
					}

					return res;
				},



				email : function(msg){
					var res = true;
					var context = $(this).data('validationdata').status;

					$.each(context.values, function(index, value){
						var ruleRes = /^[^@]{1,64}@[^@]{1,255}$/.test(value);

						if( ruleRes ){
							var email_array = value.split('@');
							var local_array = email_array[0].split('.');

							for ( var i = 0; i < local_array.length; i++) {
								if( !(/^(([A-Za-z0-9!#$%&'*+\/=?^_`{|}~-][A-Za-z0-9!#$%&'*+\/=?^_`{|}~\.-]{0,63})|(\\\"[^(\\|\\\")]{0,62}\\\"))$/.test(local_array[i])) ){
									ruleRes = false;
								}
							}

							var domain_array = '';
							if( !(/^\[?[0-9\.]+\]?$/.test(email_array[1])) ){
								domain_array = email_array[1].split('.');

								if( domain_array.length < 2 ){
									ruleRes = false;
								}

								for( i = 0; i < domain_array.length; i++ ){
									if( !(/^(([A-Za-z0-9][A-Za-z0-9-]{0,61}[A-Za-z0-9])|([A-Za-z0-9]{2,5}))$/.test(domain_array[i])) ){
										ruleRes = false;
									}
								}
							}
						}

						res = res && ruleRes;

						if( !res ) return false;
					});

					if( !res && $.isSet(msg) && ($.trim(msg) !== '') ){
						context.messages.push(msg);
					}

					return res;
				},



				url : function(msg){
					var res = true;
					var context = $(this).data('validationdata').status;

					$.each(context.values, function(index, value){
						res = res && /^(https?|ftp)\:\/\/([a-z0-9+!*(),;?&=$_.-]+(\:[a-z0-9+!*(),;?&=$_.-]+)?@)?([a-z0-9+$_-]+\.)*[a-z0-9+$_-]{2,3}(\:[0-9]{2,5})?(\/([a-z0-9+$_-]\.?)+)*\/?(\?[a-z+&$_.-][a-z0-9;:@\/&%=+$_.-]*)?(#[a-z_.-][a-z0-9+$_.-]*)?$/.test(value);
						if( !res ) return false;
					});

					if( !res && $.isSet(msg) && ($.trim(msg) !== '') ){
						context.messages.push(msg);
					}

					return res;
				},



				date : function(msg, __internal__){
					var res = true;
					var context = $(this).data('validationdata').status;

					$.each(context.values, function(index, value){
						if( $.isSet(__internal__) && (__internal__ === '__internal__') ){
							var datetimeParts = value.split(' ');
							if( datetimeParts.length >= 2 ){
								value = $.trim(datetimeParts[0]);
							} else {
								value = '';
							}
						}

						var formatValid = /^(0?[1-9]|1[0-2])\/(0?[1-9]|[1-2][0-9]|3[0-1])\/([1-2][0-9]{3})$/.test(value);
						var splitValue = formatValid ? value.split('/') : null;

						if( formatValid ){
							for( var i = 0; i < 2; i++ ){
								if( splitValue[i].length  < 2 ){
									splitValue[i] = '0'+splitValue[i];
								}
							}
						}

						var date = formatValid ? new Date(splitValue[2]+'-'+splitValue[0]+'-'+splitValue[1]) : null;
						var ruleRes =
							((date !== null) && (splitValue !== null))
							? (
								!/Invalid|NaN/.test(date)
								&& (parseInt(splitValue[0], 10) === (date.getMonth() + 1))
								&& (parseInt(splitValue[1], 10) === (date.getDate()))
								&& (parseInt(splitValue[2], 10) === (date.getFullYear()))
							)
							: false
						;

						res = res && ruleRes;

						if( !res ) return false;
					});

					if( !res && $.isSet(msg) && ($.trim(msg) !== '') ){
						context.messages.push(msg);
					}

					return res;
				},



				time : function(msg, __internal__){
					var res = true;
					var context = $(this).data('validationdata').status;

					$.each(context.values, function(index, value){
						if( $.isSet(__internal__) && (__internal__ === '__internal__') ){
							var datetimeParts = value.split(' ');
							if( datetimeParts.length >= 2 ){
								value = $.trim(datetimeParts[1]);
								if( datetimeParts.length >= 3 ){
									value += ' '+$.trim(datetimeParts[2]);
								}
							} else {
								value = '';
							}
						}

						var ruleRes = /^((0?[0-9]|1[0-1])\:[0-5][0-9](\:[0-5][0-9])? ?(am|AM|pm|PM)|12\:[0-5][0-9](\:[0-5][0-9])? ?(pm|PM))$/.test(value);
						res = res && ruleRes;
						if( !res ) return false;
					});

					if( !res && $.isSet(msg) && ($.trim(msg) !== '') ){
						context.messages.push(msg);
					}

					return res;
				},



				datetime : function(msg){
					var res = true;
					var context = $(this).data('validationdata').status;

					res =
						$.proxy($.jqueryAnnexData.validation.validators.date, $(this), null, '__internal__')()
						&& $.proxy($.jqueryAnnexData.validation.validators.time, $(this), null, '__internal__')()
					;

					if( !res && $.isSet(msg) && ($.trim(msg) !== '') ){
						context.messages.push(msg);
					}

					return res;
				},



				dateISO : function(msg, __internal__){
					var res = true;
					var context = $(this).data('validationdata').status;

					$.each(context.values, function(index, value){
						if( $.isSet(__internal__) && (__internal__ === '__internal__') ){
							var datetimeParts = value.replace(/T/, ' ').split(' ');
							if( datetimeParts.length >= 2 ){
								value = $.trim(datetimeParts[0]);
							} else {
								value = '';
							}
						}

						var formatValid = /^([1-2][0-9]{3})\-(0?[1-9]|1[0-2])\-(0?[1-9]|[1-2][0-9]|3[0-1])$/.test(value);
						var splitValue = formatValid ? value.split('-') : null;

						if( formatValid ){
							for( var i = 1; i < 3; i++ ){
								if( splitValue[i].length  < 2 ){
									splitValue[i] = '0'+splitValue[i];
								}
							}
						}

						var date = formatValid ? new Date(parseInt(splitValue[0], 10), parseInt(splitValue[1], 10) - 1,  parseInt(splitValue[2], 10)) : null;
						var ruleRes =
							((date !== null) && (splitValue !== null))
							? (
								!/Invalid|NaN/.test(date)
								&& (parseInt(splitValue[0], 10) === (date.getFullYear()))
								&& (parseInt(splitValue[1], 10) === (date.getMonth() + 1))
								&& (parseInt(splitValue[2], 10) === (date.getDate()))
							)
							: false
						;

						res = res && ruleRes;
						if( !res ) return false;
					});

					if( !res && $.isSet(msg) && ($.trim(msg) !== '') ){
						context.messages.push(msg);
					}

					return res;
				},



				timeISO : function(msg, __internal__){
					var res = true;
					var context = $(this).data('validationdata').status;

					$.each(context.values, function(index, value){
						if( $.isSet(__internal__) && (__internal__ === '__internal__') ){
							var datetimeParts = value.replace(/T/, ' ').split(' ');
							if( datetimeParts.length >= 2 ){
								value = $.trim(datetimeParts[1]);
							} else {
								value = '';
							}
						}

						var ruleRes = /^([0-1][0-9]|2[0-3])\:[0-5][0-9]\:[0-5][0-9]$/.test(value);
						res = res && ruleRes;
						if( !res ) return false;
					});

					if( !res && $.isSet(msg) && ($.trim(msg) !== '') ){
						context.messages.push(msg);
					}

					return res;
				},



				datetimeISO : function(msg){
					var res = true;
					var context = $(this).data('validationdata').status;

					res =
						$.proxy($.jqueryAnnexData.validation.validators.dateISO, $(this), null, '__internal__')()
						&& $.proxy($.jqueryAnnexData.validation.validators.timeISO, $(this), null, '__internal__')()
					;

					if( !res && $.isSet(msg) && ($.trim(msg) !== '') ){
						context.messages.push(msg);
					}

					return res;
				},



				dateDE : function(msg, __internal__){
					var res = true;
					var context = $(this).data('validationdata').status;

					$.each(context.values, function(index, value){
						if( $.isSet(__internal__) && (__internal__ === '__internal__') ){
							var datetimeParts = value.split(' ');
							if( datetimeParts.length >= 2 ){
								value = $.trim(datetimeParts[0]);
							} else {
								value = '';
							}
						}

						var formatValid = /^(0?[1-9]|[1-2][0-9]|3[0-1])\.(0?[1-9]|1[0-2])\.([1-2][0-9]{3})$/.test(value);
						var splitValue = formatValid ? value.split('.') : null;

						if( formatValid ){
							for( var i = 0; i < 2; i++ ){
								if( splitValue[i].length  < 2 ){
									splitValue[i] = '0'+splitValue[i];
								}
							}
						}

						var date = formatValid ? new Date(parseInt(splitValue[2], 10), parseInt(splitValue[1], 10) - 1,  parseInt(splitValue[0], 10)) : null;
						var ruleRes =
							((date !== null) && (splitValue !== null))
							? (
								!/Invalid|NaN/.test(date)
								&& (parseInt(splitValue[0], 10) === (date.getDate()))
								&& (parseInt(splitValue[1], 10) === (date.getMonth() + 1))
								&& (parseInt(splitValue[2], 10) === (date.getFullYear()))
							)
							: false
						;

						res = res && ruleRes;
						if( !res ) return false;
					});

					if( !res && $.isSet(msg) && ($.trim(msg) !== '') ){
						context.messages.push(msg);
					}

					return res;
				},



				timeDE : function(msg, __internal__){
					var res = true;
					var context = $(this).data('validationdata').status;

					$.each(context.values, function(index, value){
						if( $.isSet(__internal__) && (__internal__ === '__internal__') ){
							var datetimeParts = value.split(' ');
							if( datetimeParts.length >= 2 ){
								value = $.trim(datetimeParts[1]);
							} else {
								value = '';
							}
						}

						var ruleRes = /^([0-1][0-9]|2[0-3])\:[0-5][0-9](\:[0-5][0-9])?h?$/.test(value);
						res = res && ruleRes;
						if( !res ) return false;
					});

					if( !res && $.isSet(msg) && ($.trim(msg) !== '') ){
						context.messages.push(msg);
					}

					return res;
				},



				datetimeDE : function(msg){
					var res = true;
					var context = $(this).data('validationdata').status;

					res =
						$.proxy($.jqueryAnnexData.validation.validators.dateDE, $(this), null, '__internal__')()
						&& $.proxy($.jqueryAnnexData.validation.validators.timeDE, $(this), null, '__internal__')()
					;

					if( !res && $.isSet(msg) && ($.trim(msg) !== '') ){
						context.messages.push(msg);
					}

					return res;
				},



				number : function(msg){
					var res = true;
					var context = $(this).data('validationdata').status;

					$.each(context.values, function(index, value){
						res = res && ((value === ''+parseInt(value, 10)) || (value === ''+parseFloat(value)));
						if( !res ) return false;
					});

					if( !res && $.isSet(msg) && ($.trim(msg) !== '') ){
						context.messages.push(msg);
					}

					return res;
				},



				numberDE : function(msg){
					var res = true;
					var context = $(this).data('validationdata').status;

					$.each(context.values, function(index, value){
						var ruleRes = /^[0-9]+(\,[0-9]+)?$/.test(value);

						if( ruleRes ){
							value = value.replace(/\,/g, '.');
							ruleRes = ((value === ''+parseInt(value, 10)) || (value === ''+parseFloat(value)));
						}

						res = res && ruleRes;
						if( !res ) return false;
					});

					if( !res && $.isSet(msg) && ($.trim(msg) !== '') ){
						context.messages.push(msg);
					}

					return res;
				},



				digits : function(msg){
					var res = true;
					var context = $(this).data('validationdata').status;

					$.each(context.values, function(index, value){
						res = res && /^[0-9]+$/.test(value);
						if( !res ) return false;
					});

					if( !res && $.isSet(msg) && ($.trim(msg) !== '') ){
						context.messages.push(msg);
					}

					return res;
				},



				creditcard : function(msg){
					var res = true;
					var context = $(this).data('validationdata').status;

					$.each(context.values, function(index, value){
						res = res && /^[0-9]{3,4}\-[0-9]{4}\-[0-9]{4}\-[0-9]{4}$/.test(value);
						if( !res ) return false;
					});

					if( !res && $.isSet(msg) && ($.trim(msg) !== '') ){
						context.messages.push(msg);
					}

					return res;
				},



				characterclass : function(msg, characterclass){
					var res = true;
					var context = $(this).data('validationdata').status;

					var characterClassRegEx = new RegExp('^['+characterclass+']*$');

					$.each(context.values, function(index, value){
						res = res && characterClassRegEx.test(value);
						if( !res ) return false;
					});

					if( !res && $.isSet(msg) && ($.trim(msg) !== '') ){
						context.messages.push(msg);
					}

					return res;
				}
			}
		}

	});



	//--|JQUERY-$-GENERAL-FUNCTIONS----------

	$.extend({

		triggerValidation : function(targetGroup){
			targetGroup = $.orDefault(targetGroup, 'all', 'string');
			$.jqueryAnnexData.validation.functions.validate($.jqueryAnnexData.validation.config.registeredTargets[targetGroup]);
		},



		executeOnValidation : function(callback){
			$.assert($.isFunction(callback), 'executeOnValidation | callback is no function');

			$.jqueryAnnexData.validation.config.globalCallback = callback;
		},



		validationIsTriggeredByWidgetEvents : function(doValidate){
			doValidate = !!doValidate;
			$.jqueryAnnexData.validation.config.validateOnWidgetEvents = doValidate;
		},



		setAdditionalValidationWidgetEvents : function(events){
			$.assert($.isArray(events), 'events need to be an array');

			var eventString = '';
			$.each(events, function(index, value){
				eventString += value+'.validation ';
			});
			eventString = ' '+$.trim(eventString);

			$.jqueryAnnexData.validation.config.additionalWidgetEvents = eventString;
		},



		setValidationFromTags : function(){
			$(':input[data-validation]').each(function(){
				if( $.isPlainObject($(this).data('validation')) || $.isArray($(this).data('validation')) ){
					var callback = ($.isSet($(this).data('validation-callback')) && $.isFunction($(this).data('validation-callback'))) ? $(this).data('validation-callback') : null;
					var errorContainer = ($.isSet($(this).data('validation-errorcontainer')) && $.exists($(this).data('validation-errorcontainer'))) ? $(this).data('validation-errorcontainer') : null;
					var container = ($.isSet($(this).data('validation-container')) && $.exists($(this).data('validation-container'))) ? $(this).data('validation-container') : null;
					var targetGroup = ($.isSet($(this).data('validation-targetgroup'))) ? $(this).data('validation-targetgroup') : null;
					var suppressSubmit = ($.isSet($(this).data('validation-suppresssubmit'))) ? ($(this).data('validation-suppresssubmit') === 'true') : false;
					$(this).setValidation($(this).data('validation'), callback, errorContainer, container, targetGroup, suppressSubmit);
				}
			});
		}

	});



	//--|JQUERY-OBJECT-GENERAL-FUNCTIONS----------

	$.fn.extend({

		setValidation : function(validators, callback, $errorContainer, $container, targetGroup, suppressSubmit){
			validators = $.orDefault(validators, [], 'array');
			targetGroup = $.orDefault(targetGroup, 'all', 'string');
			suppressSubmit = $.orDefault(suppressSubmit, false, 'bool');

			if( !$.isSet($container) ){
				$container = $(this).closest('form');

				if( !$.exists($container) ){
					$container = $(this);
				} else {
					$container.off('submit.validation');
					$container.on('submit.validation', function(e, validated){
						if( !$.isSet(validated) ){
							e.preventDefault();

							$(document).one('finished.validation', function(e, isValid){
								$container.trigger('submit.validation', isValid);
							});
							$.jqueryAnnexData.validation.functions.validate($.jqueryAnnexData.validation.config.registeredTargets[targetGroup]);
						} else if( !validated || suppressSubmit ){
							e.preventDefault();
						}
					});
				}
			} else {
				$container = $container.find(':input');
			}

			// apply to each set member individually to avoid setting data for whole set
			$(this).each(function(){
				$.assert($(this).is(':input'), 'setValidation | element is no value-bearing form element');
				$.assert($.isSet($(this).attr('name')), 'setValidation | element has no attribute "name"');

				var that = this;

				$(this).removeData('validationdata');
				var validationData = {
					status : $.extend({}, $.jqueryAnnexData.validation.config.defaultValidationData),
					rules : {},
					callback : callback,
					container : $container,
					errorContainer : $errorContainer
				};

				var asyncRulesCount = 0;
				$.each(validators, function(index, rule){
					var ruleLength = $.objectLength(rule);
					if( $.isPlainObject(rule) && (ruleLength >= 1) && (ruleLength <= 2) ){
						if( ruleLength === 2 ){
							$.assert($.exists('args', rule));
						}

						var ruleName = null;
						var ruleMessage = null;
						var ruleArgs = $.exists('args', rule) ? ($.isArray(rule.args) ? rule.args : [rule.args]) : [];
						$.each(rule, function(rulePartKey, rulePartValue){
							if( rulePartKey !== 'args' ){
								ruleName = rulePartKey;
								ruleMessage = rulePartValue;
								return false;
							}
						});

						if( $.isSet(ruleName) ){
							ruleName = ruleName.split('_async');
							var hasAsyncMarker = (ruleName.length > 1);
							ruleName = ruleName[0];

							if( ruleName === 'optional' ){
								validationData.status.isOptional = true;
								$.merge(validationData.status.optionalValues, ruleArgs);
							}

							if( $.isFunction($.jqueryAnnexData.validation.validators[ruleName]) ){
								if( hasAsyncMarker ){
									asyncRulesCount++;
								}

								validationData.rules[ruleName+'_'+$.randomUuid(true)] = $.proxy.apply($, $.merge([], $.merge([$.jqueryAnnexData.validation.validators[ruleName], $(that), ''+$.trim(ruleMessage)], ruleArgs)));
							}
						}
					}
				});
				validationData.status.asyncCount = asyncRulesCount;

				$.jqueryAnnexData.validation.config.registeredTargets.all.push($(this));
				if( targetGroup !== 'all' ){
					if( !$.isSet($.jqueryAnnexData.validation.config.registeredTargets[targetGroup]) ){
						$.jqueryAnnexData.validation.config.registeredTargets[targetGroup] = [];
					}
					$.jqueryAnnexData.validation.config.registeredTargets[targetGroup].push($(this));
				}

				var blurChangeTimeout = null,
					focusTimeout = null,
					$elements = $container.find('[name="'+$(this).attr('name')+'"]');

				if( $elements.length === 0 ){
					$elements = $container.filter('[name="'+$(this).attr('name')+'"]');
				}

				$elements.each(function(){
					$(this)
						.data('validationdata', validationData)
						.off('change.validation blur.validation focus.validation'+$.jqueryAnnexData.validation.config.additionalWidgetEvents)
						.on('change.validation blur.validation'+$.jqueryAnnexData.validation.config.additionalWidgetEvents, function(){
							var _this_ = this;

							$.countermand(blurChangeTimeout);
							blurChangeTimeout = $.schedule(10, function(){
								$(_this_).data('validationdata').status.isDirty = true;
								$.jqueryAnnexData.validation.functions.validate($.jqueryAnnexData.validation.config.registeredTargets[targetGroup], true);
							});
						})
						.on('focus.validation', function(){
							var _this_ = this;

							$.countermand(focusTimeout);
							focusTimeout = $.schedule(10, function(){
								$(_this_).data('validationdata').status.isDirty = true;
							});
						})
					;
				});
			});

			return this;
		},


		unsetValidation : function(ignoreMissingValidationData, targetGroup){
			ignoreMissingValidationData = $.orDefault(ignoreMissingValidationData, false, 'bool');
			targetGroup = ($.isSet(targetGroup) && $.jqueryAnnexData.validation.config.registeredTargets[targetGroup]) ? ''+targetGroup : null;

			// handle all set members individually to clearly identify them in registeredTarget-array
			$(this).each(function(){
				$.assert($(this).is(':input'), 'unsetValidation | element is no value-bearing form element');
				$.assert($.isSet($(this).attr('name')), 'unsetValidation | element has no attribute "name"');

				var _this_ = this;

				if( $.isSet($(this).data('validationdata')) || ignoreMissingValidationData ){
					$(this).removeData('validationdata');

					var groupsToSearch = {};

					if( $.isSet(targetGroup) ){
						groupsToSearch.all = $.jqueryAnnexData.validation.config.registeredTargets.all;
						groupsToSearch[targetGroup] = $.jqueryAnnexData.validation.config.registeredTargets[targetGroup];
					} else {
						groupsToSearch = $.jqueryAnnexData.validation.config.registeredTargets;
					}

					$.each(groupsToSearch, function(key, targetGroup){
						if( $.isSet(targetGroup) ){
							var elementIndex = -1;
							for( var i = 0; i < targetGroup.length; i++ ){
								if( $(_this_).attr('name') === targetGroup[i].attr('name') ){
									elementIndex = i;
									break;
								}
							}

							if( elementIndex >= 0 ){
								$.jqueryAnnexData.validation.config.registeredTargets[key] = $.removeFromArray($.jqueryAnnexData.validation.config.registeredTargets[key], elementIndex);
							}

							if( $.jqueryAnnexData.validation.config.registeredTargets[key].length === 0 ){
								$(this).closest('form').off('submit.validation');

								if( key !== 'all' ){
									delete $.jqueryAnnexData.validation.config.registeredTargets[key];
								}
							}
						}
					});

					$(this).off('change.validation blur.validation'+$.jqueryAnnexData.validation.config.additionalWidgetEvents);
				}
			});

			return this;
		}

	});

	return $;

}));
