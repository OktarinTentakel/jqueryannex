/**
 * jQueryAnnex - SaneDate Plugin
 * This plugin is the attempt to make JS date objects more sane and thereby usable.
 * The Date object is one of the most badly designed parts of the JS core with so many quirks, inconsistencies and traps to fall into
 * as a developer, that I took it upon me to implement a small framework to deal with dates and timestamps in a less headachy way.
 *
 * Think as this as a python inspired little brother of moment.js.
 *
 * The core of this plugin is the SaneDate class, wrapping a vanilla Date object. See class and function definitions for further documentation
 * and have a look at /test/core/dates.js for more usage examples.
 *
 * This plugin automatically gets unit-tested via Ava ob build (tests are in /test/core/dates.js).
 *
 * @author Sebastian Schlapkohl <jqueryannex@ifschleife.de>
 * @version Revision 44 developed and tested with jQuery 3.3.1, 2.2.4 and 1.12.4
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
			throw 'jQueryAnnex SaneDate Plugin | cannot extend jQuery, since it does not seem to be available as "jQuery" or is missing basic functionality';
		}

		if( !$.jqueryAnnexData ){
			throw 'jQueryAnnex SaneDate Plugin | cannot extend jQuery Annex, since it does not seem to be available yet';
		}
	}());



	//--|SOLUTIONS-EXTENSION----------

	/*$.extend($.jqueryAnnexData, {

	});*/



	//--|JQUERY-$-GENERAL-FUNCTIONS----------

	$.extend({

		/**
		 * @namespace Dates:$
		 **/

		/**
		 * @namespace Dates:$#SaneDate
		 **/

		/**
	 	 * Constructor. Instantiate with new $.SaneDate();
	 	 *
	 	 * @param {(Date|String|Number.Integer)} dateOrIsoStringOrYear - either a date object, an iso date(time) string to parse into a date or a year int
	 	 * @param {?Number.Integer} [month] - month int between 1 and 12, if date is not built via iso string
	 	 * @param {?Number.Integer} [date] - date int between 1 and 31, if date is not built via iso string
	 	 * @param {?Number.Integer} [hours] - hours int between 0 and 23, if date is not built via iso string
	 	 * @param {?Number.Integer} [minutes] - minutes int between 0 and 59, if date is not built via iso string
	 	 * @param {?Number.Integer} [seconds] - seconds int between 0 and 59, if date is not built via iso string
	 	 * @param {?Number.Integer} [milliseconds] - milliseconds int between 0 and 999, if date is not built via iso string
	 	 * @return {SaneDate} the newly constructed SaneDate, either being valid or not
	 	 *
	 	 * @memberof Dates:$#SaneDate
		 * @example
		 * var date = new $.SaneDate('1-2-3 4:5:6.7');
		 * date = new $.SaneDate('2016-4-7');
		 * date = new $.SaneDate('2016-04-07 13:37:00');
		 * date = new $.SaneDate(2016, 4, 7);
		 * date = new $.SaneDate(2016, 4, 7, 13, 37, 0, 999);
		 * date.year = 2000;
		 * date.forward('hours', 42);
	 	 *
		 * @class SaneDate
		 * @property {Boolean} valid - defines if the date is currently usable and represents a real date, not settable
		 * @property {Boolean} utc - defines if the date is currently in utc mode, if used as setter, will call setUtc()
		 * @property {Number.Integer} year - the current year of the date, settable (normally throws exception if change results in invalid date)
		 * @property {Number.Integer} month - the current month of the date, settable (normally throws exception if change results in invalid date)
		 * @property {Number.Integer} date - the currently day of the month of the date, settable (normally throws exception if change results in invalid date)
		 * @property {Number.Integer} hours - the current hours of the date, settable (normally throws exception if change results in invalid date)
		 * @property {Number.Integer} minutes - the current minutes of the date, settable (normally throws exception if change results in invalid date)
		 * @property {Number.Integer} seconds - the current seconds of the date, settable (normally throws exception if change results in invalid date)
		 * @property {Number.Integer} milliseconds - the current milliseconds of the date, settable (normally throws exception if change results in invalid date)
		 *
		 * @classdesc
		 * SaneDate is a reimplementation of JavaScript date objects, trying to iron out all the small fails
		 * which make you want to pull your hair while keeping the cool stuff in a streamlined manner.
		 *
		 * SaneDates operate between the years 0 and 9999 and, for the time being, don't deal with timezones apart
		 * from the local one and UTC. Every SaneDate is local per se, even if created via an iso-string. To get
		 * UTC-values just set the SaneDate to utc via .setUtc(true).
		 *
		 * The relevant date parts of a SaneDate, which are also available as attributes to get and set are:
		 * year, month, date (not day!), hours, minutes, seconds and milliseconds.
		 *
		 * SaneDates are exception-happy and won't allow actions after instantiation that alter the date in automatic
		 * ways, for example by setting a month to 13. You can alter this behaviour via .setIgnoreInvalidPartChanged(true).
		 *
		 * The constructor however should not except and will always return a sane date, whose .valid-attribute tells
		 * you if the date has been buildable with the data you provided and is usable.
		 *
		 * Months and week days are not zero based in SaneDates but begin with 1. Week days are not an attribute
		 * (and not settable), but accessible via .getWeekDay().
		 *
		 * This whole implementation is heavily built around iso strings, so building a date with one and getting one
		 * to transfer should be forgiving, easy and robust. Something like '1-2-3 4:5:6.7' is a usable iso string
		 * for SaneDate, but getIsoString() will return correctly formatted '0001-02-03T04:05:06.700'.
		 **/

		SaneDate : function(){
			// see SANEDATE-IMPLEMENTATION below
		}

	});



	//--|JQUERY-OBJECT-GENERAL-FUNCTIONS----------

	/*$.fn.extend({



	});*/



	//--|SANEDATE-IMPLEMENTATION----------

	$.SaneDate = $.Class.extend(
		/**
		 * @lends Dates:$#SaneDate.SaneDate.prototype
		 **/
		{

			// ***
			_date : null,
			_compareDate : null,
			_utc : false,
			_ignoreInvalidPartChanged : false,
			_valid : true,

			// documentation in $.SaneDate signature above
			init : function(dateOrIsoStringOrYear, month, date, hours, minutes, seconds, milliseconds){
				if( !$.isA(dateOrIsoStringOrYear, 'date') ){
					dateOrIsoStringOrYear = $.orDefault(dateOrIsoStringOrYear, null, 'string');
				}

				var valid = true,
					parts = {
						type : 'date',
						year : null,
						month : $.orDefault(month, null, 'int'),
						date : $.orDefault(date, null, 'int'),
						hours : $.orDefault(hours, null, 'int'),
						minutes : $.orDefault(minutes, null, 'int'),
						seconds : $.orDefault(seconds, null, 'int'),
						milliseconds : $.orDefault(milliseconds, null, 'int')
					}
				;

				this._setupDatePartGettersAndSetters();

				if( !$.isSet(dateOrIsoStringOrYear) ){
					this._date = new Date();
				} else if( $.isA(dateOrIsoStringOrYear, 'date') ){
					if( $.isNaN(dateOrIsoStringOrYear.getDate()) ){
						this._setInvalid();
					} else {
						this._date = dateOrIsoStringOrYear;
					}
				} else {
					if( !$.isA(dateOrIsoStringOrYear, 'date') ){
						if( (''+dateOrIsoStringOrYear).indexOf('-') < 0 ){
							parts.year = parseInt(dateOrIsoStringOrYear, 10);

							if( $.isSet(parts.hours) ){
								parts.type = 'datetime';
							}
						} else {
							try {
								parts = this._parseIsoString(dateOrIsoStringOrYear);
							} catch(ex){
								parts = null;
							}
						}
					}

					if( $.isSet(parts) ){
						try {
							valid = this._verifyDateParts(parts);
						} catch(ex){
							valid = false;
						}
					}

					if( !$.isSet(parts) || !valid ){
						this._setInvalid();
					} else {
						this._date = this._partsToDate(parts);
					}
				}
			},



			_setupDatePartGettersAndSetters : function(){
				var _this_ = this,
					propertyConfig = {
						enumerable : true
					}
				;

				// documented as property in signature above
				Object.defineProperty(this, 'valid', $.extend({}, propertyConfig, {
					set : function(){
						throw new Error('SaneDate set valid | valid is not settable');
					},
					get : function(){
						return this._valid;
					}
				}));

				// documented as property in signature above
				Object.defineProperty(this, 'utc', $.extend({}, propertyConfig, {
					set : function(utc){
						this.setUtc(utc);
					},
					get : function(){
						return this._utc;
					}
				}));

				// documented as property in signature above
				Object.defineProperty(this, 'year', $.extend({}, propertyConfig, {
					set : function(year){
						year = parseInt(year, 10);
						$.assert(!$.isNaN(year), 'SaneDate set year | value is not usable as int');
						$.assert((year >= 0 && year <= 9999), 'SaneDate set year | this implementation works with years between 0 and 9999');

						if( _this_.utc ){
							_this_._tryDatePartChange(year, 'setUTCFullYear', 'getUTCFullYear', !_this_._ignoreInvalidPartChanged);
						} else {
							_this_._tryDatePartChange(year, 'setFullYear', 'getFullYear', !_this_._ignoreInvalidPartChanged);
						}
					},
					get : function(){
						if( $.isSet(_this_._date) && _this_._valid ){
							return _this_._utc ? _this_._date.getUTCFullYear() : _this_._date.getFullYear();
						}
					}
				}));

				// documented as property in signature above
				Object.defineProperty(this, 'month', $.extend({}, propertyConfig, {
					set : function(month){
						month = parseInt(month, 10);
						$.assert(!$.isNaN(month), 'SaneDate set month | value is not usable as int');

						if( _this_.utc ){
							_this_._tryDatePartChange(month - 1, 'setUTCMonth', 'getUTCMonth', !_this_._ignoreInvalidPartChanged);
						} else {
							_this_._tryDatePartChange(month - 1, 'setMonth', 'getMonth', !_this_._ignoreInvalidPartChanged);
						}
					},
					get : function(){
						if( $.isSet(_this_._date) && _this_._valid ){
							return _this_._utc ? _this_._date.getUTCMonth() + 1 : _this_._date.getMonth() + 1;
						}
					}
				}));

				// documented as property in signature above
				Object.defineProperty(this, 'date', $.extend({}, propertyConfig, {
					set : function(date){
						date = parseInt(date, 10);
						$.assert(!$.isNaN(date), 'SaneDate set date | value is not usable as int');

						if( _this_.utc ){
							_this_._tryDatePartChange(date, 'setUTCDate', 'getUTCDate', !_this_._ignoreInvalidPartChanged);
						} else {
							_this_._tryDatePartChange(date, 'setDate', 'getDate', !_this_._ignoreInvalidPartChanged);
						}
					},
					get : function(){
						if( $.isSet(_this_._date) && _this_._valid ){
							return _this_._utc ? _this_._date.getUTCDate() : _this_._date.getDate();
						}
					}
				}));

				// documented as property in signature above
				Object.defineProperty(this, 'hours', $.extend({}, propertyConfig, {
					set : function(hours){
						hours = parseInt(hours, 10);
						$.assert(!$.isNaN(hours), 'SaneDate set hours | value is not usable as int');

						if( _this_.utc ){
							_this_._tryDatePartChange(hours, 'setUTCHours', 'getUTCHours', !_this_._ignoreInvalidPartChanged);
						} else {
							_this_._tryDatePartChange(hours, 'setHours', 'getHours', !_this_._ignoreInvalidPartChanged);
						}
					},
					get : function(){
						if( $.isSet(_this_._date) && _this_._valid ){
							return _this_._utc ? _this_._date.getUTCHours() : _this_._date.getHours();
						}
					}
				}));

				// documented as property in signature above
				Object.defineProperty(this, 'minutes', $.extend({}, propertyConfig, {
					set : function(minutes){
						minutes = parseInt(minutes, 10);
						$.assert(!$.isNaN(minutes), 'SaneDate set minutes | value is not usable as int');

						if( _this_.utc ){
							_this_._tryDatePartChange(minutes, 'setUTCMinutes', 'getUTCMinutes', !_this_._ignoreInvalidPartChanged);
						} else {
							_this_._tryDatePartChange(minutes, 'setMinutes', 'getMinutes', !_this_._ignoreInvalidPartChanged);
						}
					},
					get : function(){
						if( $.isSet(_this_._date) && _this_._valid ){
							return _this_._utc ? _this_._date.getUTCMinutes() : _this_._date.getMinutes();
						}
					}
				}));

				// documented as property in signature above
				Object.defineProperty(this, 'seconds', $.extend({}, propertyConfig, {
					set : function(seconds){
						seconds = parseInt(seconds, 10);
						$.assert(!$.isNaN(seconds), 'SaneDate set seconds | value is not usable as int');

						if( _this_.utc ){
							_this_._tryDatePartChange(seconds, 'setUTCSeconds', 'getUTCSeconds', !_this_._ignoreInvalidPartChanged);
						} else {
							_this_._tryDatePartChange(seconds, 'setSeconds', 'getSeconds', !_this_._ignoreInvalidPartChanged);
						}
					},
					get : function(){
						if( $.isSet(_this_._date) && _this_._valid ){
							return _this_._utc ? _this_._date.getUTCSeconds() : _this_._date.getSeconds();
						}
					}
				}));

				// documented as property in signature above
				Object.defineProperty(this, 'milliseconds', $.extend({}, propertyConfig, {
					set : function(milliseconds){
						milliseconds = parseInt(milliseconds, 10);
						$.assert(!$.isNaN(milliseconds), 'SaneDate set milliseconds | value is not usable as int');

						if( _this_.utc ){
							_this_._tryDatePartChange(milliseconds, 'setUTCMilliseconds', 'getUTCMilliseconds', !_this_._ignoreInvalidPartChanged);
						} else {
							_this_._tryDatePartChange(milliseconds, 'setMilliseconds', 'getMilliseconds', !_this_._ignoreInvalidPartChanged);
						}
					},
					get : function(){
						if( $.isSet(_this_._date) && _this_._valid ){
							return _this_._utc ? _this_._date.getUTCMilliseconds() : _this_._date.getMilliseconds();
						}
					}
				}));
			},
			// ***



			/**
			 * Define if the date should return UTC-info or local info.
			 * The default are local values, set this to true to automatically retrieve UTC-values.
			 *
			 * @method
			 * @param {Boolean} utc - define if date should behave as UTC date
			 * @return {SaneDate} this
			 * @example
			 * var d = new $.SaneDate();
			 * d.setUtc(true);
			 **/
			setUtc : function(utc){
				this._utc = !!utc;

				return this;
			},



			/**
			 * Define if the date should ignore changes to date parts and keep the old value or throw an exception.
			 * Normally those changes result in an exception to be immediately notified of changes that make the date invalid.
			 *
			 * @method
			 * @param {Boolean} ignoreInvalidPartChanged - define if date should ignore invalid changes to the date or throw exception
			 * @return {SaneDate} this
			 * @example
			 * var d = new $.SaneDate();
			 * d.setIgnoreInvalidPartChanged(true);
			 **/
			setIgnoreInvalidPartChanged : function(ignoreInvalidPartChanged){
				this._ignoreInvalidPartChanged = !!ignoreInvalidPartChanged;

				return this;
			},



			/**
			 * Returns the current day of the week as a number between 1 and 7.
			 * This method counts days the European way, starting with monday normally, but you can change this
			 * behaviour using the first parameter.
			 *
			 * @method
			 * @param {?Boolean} [startingWithMonday=true] - set false if you want sunday to be the first day of the week
			 * @return {Number.Integer} weekday index between 1 and 7
			 * @example
			 * var d = new $.SaneDate();
			 * if( d.getWeekDay() == 5 ){
			 *   alert('Thank god it\'s friday!');
			 * }
			 **/
			getWeekDay : function(startingWithMonday){
				startingWithMonday = $.orDefault(startingWithMonday, true, 'bool');

				if( $.isSet(this._date) && this._valid ){
					var day = this._utc ? this._date.getUTCDay() : this._date.getDay();

					if( startingWithMonday && (day === 0) ){
						day = 7;
					}

					if( !startingWithMonday ){
						day += 1;
					}

					return day;
				}
			},



			/**
			 * Returns the date's current date related data as a date iso-string.
			 *
			 * @method
			 * @return {String} date iso-string of the format '2016-04-07'
			 * @example
			 * var d = new $.SaneDate();
			 * $thatDatePicker.setValue(d.getIsoDateString());
			 **/
			getIsoDateString : function(){
				if( $.isSet(this._date) && this._valid ){
					var year = this._utc ? this._date.getUTCFullYear() : this._date.getFullYear(),
						month = this._utc ? this._date.getUTCMonth() + 1 : this._date.getMonth() + 1,
						date = this._utc ? this._date.getUTCDate() : this._date.getDate();

					year = ''+year;
					month = (month < 10) ? '0'+month : ''+month;
					date = (date < 10) ? '0'+date : ''+date;

					if( year < 1000 ){
						year = this._padValueWithZero(year, 4);
					}

					return $.strFormat('{year}-{month}-{date}', {year : year, month : month, date : date});
				} else {
					return null;
				}
			},



			/**
			 * Returns the date as an iso-string.
			 *
			 * @method
			 * @param {?Boolean} [withSeparator=true] - defines if date and time should be separated with a "T"
			 * @return {String} iso-string of the format '2016-04-07T13:37:00.222'
			 * @example
			 * var d = new $.SaneDate();
			 * $thatDateTimePicker.setValue(d.getIsoString());
			 **/
			getIsoString : function(withSeparator){
				withSeparator = $.orDefault(withSeparator, true, 'bool');

				var dateString = this.getIsoDateString();

				if( $.isSet(dateString) ){
					var hours = this._utc ? this._date.getUTCHours() : this._date.getHours(),
						minutes = this._utc ? this._date.getUTCMinutes() : this._date.getMinutes(),
						seconds = this._utc ? this._date.getUTCSeconds() : this._date.getSeconds(),
						milliseconds = this._utc ? this._date.getUTCMilliseconds() : this._date.getMilliseconds();

						hours = (hours < 10) ? '0'+hours : ''+hours;
						minutes = (minutes < 10) ? '0'+minutes : ''+minutes;
						seconds = (seconds < 10) ? '0'+seconds : ''+seconds;
						milliseconds = ''+milliseconds;

						return dateString+(withSeparator ? 'T' : ' ')+$.strFormat('{hours}:{minutes}:{seconds}.{milliseconds}', {
							hours : hours,
							minutes : minutes,
							seconds : seconds,
							milliseconds : milliseconds
						});
				} else {
					return null;
				}
			},



			/**
			 * Return the current original JavaScript date object wrapped by the SameDate.
			 * Use this to do special things.
			 *
			 * @method
			 * @return {(null|Date)} the original JavaScript date object or null if the date is not valid
			 * @example
			 * var d = new $.SaneDate();
			 * var timezoneOffset = d.getVanillaDate().getTimezoneOffset();
			 **/
			getVanillaDate : function(){
				if( this._valid ){
					return this._date;
				} else {
					return null;
				}
			},



			/**
			 * Compares the date to another SaneDate or an iso string.
			 * Returns a classical comparator value (-1/0/1), being -1 if the date is smaller than the parameter.
			 * Normally checks date and time. Set type to "date" to only check date.
			 *
			 * @method
			 * @param {(String|Date)} isoStringOrSaneDate - either an iso string or another SaneDate to compare to
			 * @param {?String} [type='datetime'] - either 'datetime' or 'date', telling the method if time should be considered
			 * @param {?Boolean} [withMilliseconds=true] - tells the method if milliseconds should be considered if type is 'datetime'
			 * @return {Number.Integer} -1 if this is smaller/earlier, 0 if identical, 1 if parameter if bigger/later
			 * @throws on unusable base or compare date
			 * @example
			 * var d = new $.SaneDate();
			 * if( d.compareTo('2016-04-07', 'date') === 0 ){
			 *   alert('congratulations, that\'s the same date!');
			 * }
			 **/
			compareTo : function(isoStringOrSaneDate, type, withMilliseconds){
				type = $.orDefault(type, 'datetime', 'string');
				withMilliseconds = $.orDefault(withMilliseconds, true, 'bool');

				var _this_ = this;

				if( $.isSet(this._date) && this._valid ){
					var saneDate = null;
					if( $.isA(isoStringOrSaneDate, 'object') && $.hasMembers(isoStringOrSaneDate, ['_date', '_valid']) ){
						saneDate = isoStringOrSaneDate;
					} else {
						saneDate = new $.SaneDate(''+isoStringOrSaneDate);
					}

					if( saneDate._valid ){
						var comparator = 0,
							dateCompareGetters = ['getFullYear', 'getMonth', 'getDate'],
							timeCompareGetters = ['getHours', 'getMinutes', 'getSeconds'],
							millisecondsCompareGetters = ['getMilliseconds'],
							compareGetters = [];

						$.merge(compareGetters, dateCompareGetters);
						if( type === 'datetime' ){
							$.merge(compareGetters, timeCompareGetters);

							if( withMilliseconds ){
								$.merge(compareGetters, millisecondsCompareGetters);
							}
						}

						var ownValue, compareValue;
						$.each(compareGetters, function(index, compareGetter){
							ownValue = _this_._date[compareGetter]();
							compareValue = saneDate._date[compareGetter]();
							comparator =
								(compareValue > ownValue)
								? -1
								: (
									(ownValue > compareValue)
									? 1
									: 0
								)
							;

							if( comparator !== 0 ){
								return false;
							}
						});

						return comparator;
					} else {
						throw new Error('SaneDate compareTo | invalid compare date');
					}
				} else {
					throw new Error('SaneDate compareTo | date currently not comparable');
				}
			},



			/**
			 * Moves the date's time a certain offset.
			 *
			 * @method
			 * @param {(String|Object)} part - the name of the date part to change, one of 'years', 'months', 'days', 'hours', 'minutes', 'seconds'and 'milliseconds' or a dictionary of part/amount pairs ({hours : -1, seconds : 30})
			 * @param {?Number.Integer} [amount=0] - negative or positive integer defining the offset from the current date
			 * @return {SaneDate} this
			 * @throws on unusable base date or invalid part name
			 * @example
			 * var d = new $.SaneDate();
			 * d.move('years', 10).move('milliseconds', -1);
			 **/
			move : function(part, amount){
				amount = $.orDefault(amount, 0, 'int');

				var _this_ = this,
					parts = ['years', 'months', 'days', 'hours', 'minutes', 'seconds', 'milliseconds'];

				if( $.isSet(this._date) && this._valid ){
					var partDict = {};
					if( !$.isPlainObject(part) ){
						partDict[''+part] = amount;
					} else {
						partDict = part;
					}

					$.each(partDict, function(part, amount){
						if( $.inArray(''+part, parts) >= 0 ){
							switch( ''+part ){
								case 'years':
									_this_._date.setFullYear(_this_._date.getFullYear() + amount);
								break;

								case 'months':
									_this_._date.setMonth(_this_._date.getMonth() + amount);
								break;

								case 'days':
									_this_._date.setDate(_this_._date.getDate() + amount);
								break;

								case 'hours':
									_this_._date.setHours(_this_._date.getHours() + amount);
								break;

								case 'minutes':
									_this_._date.setMinutes(_this_._date.getMinutes() + amount);
								break;

								case 'seconds':
									_this_._date.setSeconds(_this_._date.getSeconds() + amount);
								break;

								case 'milliseconds':
									_this_._date.setMilliseconds(_this_._date.getMilliseconds() + amount);
								break;
							}
						} else {
							throw new Error('SaneDate _move | part must be one of years, months, days, hours, minutes, seconds, milliseconds');
						}
					});

					return this;
				} else {
					throw new Error('SaneDate _move | current date is not usable');
				}
			},



			/**
			 * Moves the date's time forward a certain offset.
			 *
			 * @method
			 * @param {(String|Object)} part - the name of the date part to change, one of 'years', 'months', 'days', 'hours', 'minutes', 'seconds'and 'milliseconds' or a dictionary of part/amount pairs ({hours : 1, seconds : 30})
			 * @param {?Number.Integer} [amount=0] - integer defining the positve offset from the current date, '-' is dropped if present
			 * @return {SaneDate} this
			 * @throws on unusable base date or invalid part name
			 * @example
			 * var d = new $.SaneDate();
			 * d.forward('hours', 8);
			 **/
			forward : function(part, amount){
				amount = $.orDefault(amount, 0, 'int');

				var partDict = {};
				if( !$.isPlainObject(part) ){
					partDict[''+part] = Math.abs(amount);
				} else {
					partDict = part;
					$.each(partDict, function(part, amount){
						partDict[part] = Math.abs(amount);
					});
				}

				return this.move(partDict);
			},



			/**
			 * Moves the date's time back a certain offset.
			 *
			 * @method
			 * @param {(String|Object)} part - the name of the date part to change, one of 'years', 'months', 'days', 'hours', 'minutes', 'seconds'and 'milliseconds' or a dictionary of part/amount pairs ({hours : 1, seconds : 30})
			 * @param {?Number.Integer} [amount=0] - integer defining the negative offset from the current date, '-' is dropped if present
			 * @return {SaneDate} this
			 * @throws on unusable base date or invalid part name
			 * @example
			 * var d = new $.SaneDate();
			 * d.back('years', 1000);
			 **/
			back : function(part, amount){
				amount = $.orDefault(amount, 0, 'int');

				var partDict = {};
				if( !$.isPlainObject(part) ){
					partDict[''+part] = ((amount === 0) ? 0 : -Math.abs(amount));
				} else {
					partDict = part;
					$.each(partDict, function(part, amount){
						partDict[part] = ((amount === 0) ? 0 : -Math.abs(amount));
					});
				}

				return this.move(partDict);
			},



			/**
			 * Calculates a timedata between two SaneDates.
			 *
			 * The result is a plain object with the delta's units up to the defined "largestUnit". All values are ints.
			 * The largest unit are days, since above neither months nor years are calculable via a fixed divisor and therefore
			 * useless.
			 *
			 * By default the order does not matter and only the absolute value is used, but you can change this
			 * through the parameter "absolute".
			 *
			 * @method
			 * @param {(String|SaneDate)} isoStringOrSaneDate - the date to calculate the delta against as an iso-string or a SaneDate
			 * @param {?String} [largestUnit='days'] - the largestUnit to differentiate in the result
			 * @param {?Boolean} [absolute=true] - if set false, returns negative values if first parameter is later than this date
			 * @return {Object} timedelta in the format {days : 1, hours : 2, minutes : 3, seconds : 4, milliseconds : 5}
			 * @throws on unknown largestUnit
			 * @example
			 * var now = new $.SaneDate();
			 * var theFuture = now.clone().forward({days : 1, hours : 2, minutes : 3, seconds : 4, milliseconds : 5});
			 * now.delta(theFuture)
			 * => {days : 1, hours : 2, minutes : 3, seconds : 4, milliseconds : 5}
			 * now.delta(theFuture, 'hours', false)
			 * => {hours : -26, minutes : -3, seconds : -4, milliseconds : -5}
			 **/
			delta : function(isoStringOrSaneDate, largestUnit, absolute){
				largestUnit = $.orDefault(largestUnit, 'days', 'string');
				if( $.inArray(largestUnit, ['days', 'hours', 'minutes', 'seconds', 'milliseconds']) < 0 ){
					throw new Error('SaneDate delta | largestUnit must be one of "days", "hours", "minutes", "seconds" or "milliseconds"');
				}
				absolute = $.orDefault(absolute, true, 'bool');

				if( $.isSet(this._date) && this._valid ){
					var saneDate = null,
						delta = null,
						parts = {};

					if( $.isA(isoStringOrSaneDate, 'object') && $.hasMembers(isoStringOrSaneDate, ['_date', '_valid']) ){
						saneDate = isoStringOrSaneDate;
					} else {
						saneDate = new $.SaneDate(''+isoStringOrSaneDate);
					}

					delta =
						absolute
						? Math.abs(this._date.getTime() - saneDate._date.getTime())
						: (this._date.getTime() - saneDate._date.getTime())
					;

					var negativeDelta = delta < 0;
					delta = Math.abs(delta);

					if( largestUnit === 'days' ){
						parts.days = Math.floor(delta / 1000 / 60 / 60 / 24);
						delta -= parts.days * 1000 * 60 * 60 * 24;
						largestUnit = 'hours';
					}

					if( largestUnit === 'hours' ){
						parts.hours = Math.floor(delta / 1000 / 60 / 60);
						delta -= parts.hours * 1000 * 60 * 60;
						largestUnit = 'minutes';
					}

					if( largestUnit === 'minutes' ){
						parts.minutes = Math.floor(delta / 1000 / 60);
						delta -= parts.minutes * 1000 * 60;
						largestUnit = 'seconds';
					}

					if( largestUnit === 'seconds' ){
						parts.seconds = Math.floor(delta / 1000);
						delta -= parts.seconds * 1000;
						largestUnit = 'milliseconds';
					}

					if( largestUnit === 'milliseconds' ){
						parts.milliseconds = delta;
					}

					if( negativeDelta ){
						$.each(parts, function(partName, partValue){
							parts[partName] = (partValue === 0) ? 0 : -partValue;
						});
					}

					return parts;
				}
			},



			/**
			 * Returns a copy of the current SaneDate.
			 * Might be very handy for creating dates based on another with an offset for example.
			 * Keeps UTC mode.
			 *
			 * @method
			 * @return {SaneDate} copy of this
			 * @example
			 * var d = new $.SaneDate();
			 * var theFuture = d.clone().forward('hours', 8);
			 **/
			clone : function(){
				var clonedSaneDate = new $.SaneDate(new Date(this.getVanillaDate().getTime()));
				clonedSaneDate.setUtc(this._utc);

				return clonedSaneDate;
			},



			_setInvalid : function(){
				this._date = null;
				this._valid = false;
			},



			_padValueWithZero : function(value, digitCount){
				digitCount = $.orDefault(digitCount, 2, 'int');
				value = parseInt(value, 10);
				$.assert(!$.isNaN(value), 'SaneDate _padValueWithZero | value is not usable as int');
				value = ''+value;

				var valueLength = value.length;
				if( valueLength < digitCount ){
					for( var i = 0; i < (digitCount - valueLength); i++ ){
						value = '0'+value;
					}
				}

				return value;
			},



			_partsToDate : function(parts, localTime){
				localTime = $.orDefault(localTime, false, 'bool');

				var dateParts = $.extend({}, parts);
				dateParts.year = this._padValueWithZero(dateParts.year, 4);
				dateParts.month = this._padValueWithZero(dateParts.month);
				dateParts.date = this._padValueWithZero(dateParts.date);

				if( dateParts.type === 'date' ){
					return new Date($.strFormat('{year}-{month}-{date}T00:00:00.0', dateParts));
				} else if( dateParts.type === 'datetime' ){
					dateParts.hours = this._padValueWithZero(dateParts.hours);
					dateParts.minutes = this._padValueWithZero(dateParts.minutes);
					dateParts.seconds = this._padValueWithZero(dateParts.seconds);

					if( $.isSet(dateParts.milliseconds) ){
						dateParts.seconds += '.'+dateParts.milliseconds;
					}

					var dateWithoutOffset = new Date($.strFormat('{year}-{month}-{date}T{hours}:{minutes}:{seconds}', dateParts));

					if( !localTime ){
						return dateWithoutOffset;
					} else {
						return new Date(dateWithoutOffset.getTime() - (dateWithoutOffset.getTimezoneOffset() * 60000));
					}
				} else {
					throw new Error('_partsToDate | unknown type');
				}
			},



			_verifyDateParts : function(parts){
				var date = this._partsToDate(parts);
				if( parts.type === 'date' ){
					return (parseInt(parts.year, 10) === (this._utc ? date.getUTCFullYear() : date.getFullYear()))
						&& (parseInt(parts.month, 10) === (this._utc ? date.getUTCMonth() + 1 : date.getMonth() + 1))
						&& (parseInt(parts.date, 10) === (this._utc ? date.getUTCDate() : date.getDate()));
				} else if( parts.type === 'datetime' ){
					return (parseInt(parts.year, 10) === (this._utc ? date.getUTCFullYear() : date.getFullYear()))
						&& (parseInt(parts.month, 10) === (this._utc ? date.getUTCMonth() + 1 : date.getMonth() + 1))
						&& (parseInt(parts.date, 10) === (this._utc ? date.getUTCDate() : date.getDate()))
						&& (parseInt(parts.hours, 10) === (this._utc ? date.getUTCHours() : date.getHours()))
						&& (parseInt(parts.minutes, 10) === (this._utc ? date.getUTCMinutes() : date.getMinutes()))
						&& (parseInt(parts.seconds, 10) === (this._utc ? date.getUTCSeconds() : date.getSeconds()))
						&& ($.isSet(parts.milliseconds) ? (parseInt(parts.milliseconds, 10) === (this._utc ? date.getUTCMilliseconds() : date.getMilliseconds())) : true);
				} else {
					throw new Error('_verifyDateParts | unknown type');
				}
			},



			_parseIsoString : function(isoString){
				isoString = ''+isoString;

				var parts = {
					type : 'date',
					year : null,
					month : null,
					date : null,
					hours : null,
					minutes : null,
					seconds : null,
					milliseconds : null
				};

				var isoStringParts = isoString.split('T');

				if( isoStringParts.length === 1 ){
					isoStringParts = isoStringParts[0].split(' ');
				}

				if( isoStringParts.length >= 2 ){
					var isoStringTimeParts = isoStringParts[1].split(':');

					if( isoStringTimeParts.length >= 3 ){
						var hours = parseInt(isoStringTimeParts[0], 10);
						$.assert(!$.isNaN(hours), 'SaneDate _parseIsoString | hours not usable as int');
						parts.hours = this._padValueWithZero(hours);

						var minutes = parseInt(isoStringTimeParts[1], 10);
						$.assert(!$.isNaN(minutes), 'SaneDate _parseIsoString | minutes not usable as int');
						parts.minutes = this._padValueWithZero(minutes);

						var isoStringSecondsParts = isoStringTimeParts[2];
						isoStringSecondsParts = $.strReplace('Z', '', isoStringSecondsParts);
						isoStringSecondsParts = isoStringSecondsParts.split('+')[0];
						isoStringSecondsParts = isoStringSecondsParts.split('-')[0];
						isoStringSecondsParts = isoStringSecondsParts.split('.');

						if( isoStringSecondsParts.length >= 2 ){
							var milliseconds = parseInt(isoStringSecondsParts[1], 10);
							$.assert(!$.isNaN(milliseconds), 'SaneDate _parseIsoString | milliseconds not usable as int');
							parts.milliseconds = ''+milliseconds;

							if( parts.milliseconds.length > 3 ){
								parts.milliseconds = parts.milliseconds.substr(0, 3);
							} else if( parts.milliseconds.length === 2 ){
								parts.milliseconds = ''+(milliseconds * 10);
							} else if( parts.milliseconds.length === 1 ){
								parts.milliseconds = ''+(milliseconds * 100);
							}
						}
						var seconds = parseInt(isoStringSecondsParts[0], 10);
						$.assert(!$.isNaN(seconds), 'SaneDate _parseIsoString | seconds not usable as int');
						parts.seconds = this._padValueWithZero(seconds);
					} else {
						return null;
					}

					parts.type = 'datetime';
				}

				var isoStringDateParts = isoStringParts[0].split('-');
				if( isoStringDateParts.length >= 3 ){
					var year = parseInt(isoStringDateParts[0], 10);
					$.assert(!$.isNaN(year), 'SaneDate _parseIsoString | year not usable as int');
					$.assert((year >= 0 && year <= 9999), 'SaneDate _parseIsoString | this implementation works with years between 0 and 9999');
					parts.year = this._padValueWithZero(year, 4);

					var month = parseInt(isoStringDateParts[1], 10);
					$.assert(!$.isNaN(month), 'SaneDate _parseIsoString | month not usable as int');
					parts.month = this._padValueWithZero(month);

					var date = parseInt(isoStringDateParts[2], 10);
					$.assert(!$.isNaN(date), 'SaneDate _parseIsoString | date not usable as int');
					parts.date = this._padValueWithZero(date);
				} else {
					return null;
				}

				return this._verifyDateParts(parts) ? parts : null;
			},



			_tryDatePartChange : function(value, setter, getter, throwExceptionOnFail){
				throwExceptionOnFail = $.orDefault(throwExceptionOnFail, false, 'bool');

				var _this_ = this,
					allDatePartGetters = [
					'getFullYear',
					'getMonth',
					'getDate',
					'getHours',
					'getMinutes',
					'getSeconds',
					'getMilliseconds'
				],
				allDatePartGettersUTC = [
					'getUTCFullYear',
					'getUTCMonth',
					'getUTCDate',
					'getUTCHours',
					'getUTCMinutes',
					'getUTCSeconds',
					'getUTCMilliseconds'
				];

				if( $.isSet(this._date) ){
					this._compareDate = new Date(this._date.getTime());
					this._date[setter](value);

					var changed = false;
					$.each(this._utc ? allDatePartGettersUTC : allDatePartGetters, function(index, datePartGetter){
						if( datePartGetter !== getter ){
							changed = changed || (_this_._date[datePartGetter]() !== _this_._compareDate[datePartGetter]());
						}

						if( changed ){
							return false;
						}
					});

					if( changed ){
						this._date = this._compareDate;
					}

					this._compareDate = null;

					if( !throwExceptionOnFail ){
						return changed;
					} else if( changed ){
						throw new Error('SaneDate _tryDatePartChange | date part change is invalid or would change other parts');
					}
				} else {
					if( !throwExceptionOnFail ){
						return false;
					} else {
						throw new Error('SaneDate _tryDatePartChange | no date to change the part of');
					}
				}
			}

		}
	);

	return $;

}));
