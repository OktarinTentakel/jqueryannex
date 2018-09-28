!function(e,t){var a=e.jQuery||e.$;if("function"==typeof define&&define.amd)define(["jqueryannex"],t);else if("object"==typeof module&&module.exports){if(!e.__AVA_ENV__)try{a||(a=require("jquery")),a.jqueryAnnexData||(a=require("jqueryannex"))}catch(s){}module.exports=a?t(a):function(e){return t(e)}}else t(a)}("undefined"!=typeof window?window:this,function(e){return function(){if(!e||!e.fn||!e().jquery)throw'jQueryAnnex SaneDate Plugin | cannot extend jQuery, since it does not seem to be available as "jQuery" or is missing basic functionality';if(!e.jqueryAnnexData)throw"jQueryAnnex SaneDate Plugin | cannot extend jQuery Annex, since it does not seem to be available yet"}(),e.extend({SaneDate:function(){}}),e.SaneDate=e.Class.extend({_date:null,_compareDate:null,_utc:!1,_ignoreInvalidPartChanged:!1,_valid:!0,init:function(t,a,s,n,i,r,o){e.isA(t,"date")||(t=e.orDefault(t,null,"string"));var l=!0,u={type:"date",year:null,month:e.orDefault(a,null,"int"),date:e.orDefault(s,null,"int"),hours:e.orDefault(n,null,"int"),minutes:e.orDefault(i,null,"int"),seconds:e.orDefault(r,null,"int"),milliseconds:e.orDefault(o,null,"int")};if(this._setupDatePartGettersAndSetters(),e.isSet(t))if(e.isA(t,"date"))e.isNaN(t.getDate())?this._setInvalid():this._date=t;else{if(!e.isA(t,"date"))if((""+t).indexOf("-")<0)u.year=parseInt(t,10),e.isSet(u.hours)&&(u.type="datetime");else try{u=this._parseIsoString(t)}catch(d){u=null}if(e.isSet(u))try{l=this._verifyDateParts(u)}catch(d){l=!1}e.isSet(u)&&l?this._date=this._partsToDate(u):this._setInvalid()}else this._date=new Date},_setupDatePartGettersAndSetters:function(){var t=this,a={enumerable:!0};Object.defineProperty(this,"valid",e.extend({},a,{set:function(){throw new Error("SaneDate set valid | valid is not settable")},get:function(){return this._valid}})),Object.defineProperty(this,"utc",e.extend({},a,{set:function(e){this.setUtc(e)},get:function(){return this._utc}})),Object.defineProperty(this,"year",e.extend({},a,{set:function(a){a=parseInt(a,10),e.assert(!e.isNaN(a),"SaneDate set year | value is not usable as int"),e.assert(a>=0&&a<=9999,"SaneDate set year | this implementation works with years between 0 and 9999"),t.utc?t._tryDatePartChange(a,"setUTCFullYear","getUTCFullYear",!t._ignoreInvalidPartChanged):t._tryDatePartChange(a,"setFullYear","getFullYear",!t._ignoreInvalidPartChanged)},get:function(){if(e.isSet(t._date)&&t._valid)return t._utc?t._date.getUTCFullYear():t._date.getFullYear()}})),Object.defineProperty(this,"month",e.extend({},a,{set:function(a){a=parseInt(a,10),e.assert(!e.isNaN(a),"SaneDate set month | value is not usable as int"),t.utc?t._tryDatePartChange(a-1,"setUTCMonth","getUTCMonth",!t._ignoreInvalidPartChanged):t._tryDatePartChange(a-1,"setMonth","getMonth",!t._ignoreInvalidPartChanged)},get:function(){if(e.isSet(t._date)&&t._valid)return t._utc?t._date.getUTCMonth()+1:t._date.getMonth()+1}})),Object.defineProperty(this,"date",e.extend({},a,{set:function(a){a=parseInt(a,10),e.assert(!e.isNaN(a),"SaneDate set date | value is not usable as int"),t.utc?t._tryDatePartChange(a,"setUTCDate","getUTCDate",!t._ignoreInvalidPartChanged):t._tryDatePartChange(a,"setDate","getDate",!t._ignoreInvalidPartChanged)},get:function(){if(e.isSet(t._date)&&t._valid)return t._utc?t._date.getUTCDate():t._date.getDate()}})),Object.defineProperty(this,"hours",e.extend({},a,{set:function(a){a=parseInt(a,10),e.assert(!e.isNaN(a),"SaneDate set hours | value is not usable as int"),t.utc?t._tryDatePartChange(a,"setUTCHours","getUTCHours",!t._ignoreInvalidPartChanged):t._tryDatePartChange(a,"setHours","getHours",!t._ignoreInvalidPartChanged)},get:function(){if(e.isSet(t._date)&&t._valid)return t._utc?t._date.getUTCHours():t._date.getHours()}})),Object.defineProperty(this,"minutes",e.extend({},a,{set:function(a){a=parseInt(a,10),e.assert(!e.isNaN(a),"SaneDate set minutes | value is not usable as int"),t.utc?t._tryDatePartChange(a,"setUTCMinutes","getUTCMinutes",!t._ignoreInvalidPartChanged):t._tryDatePartChange(a,"setMinutes","getMinutes",!t._ignoreInvalidPartChanged)},get:function(){if(e.isSet(t._date)&&t._valid)return t._utc?t._date.getUTCMinutes():t._date.getMinutes()}})),Object.defineProperty(this,"seconds",e.extend({},a,{set:function(a){a=parseInt(a,10),e.assert(!e.isNaN(a),"SaneDate set seconds | value is not usable as int"),t.utc?t._tryDatePartChange(a,"setUTCSeconds","getUTCSeconds",!t._ignoreInvalidPartChanged):t._tryDatePartChange(a,"setSeconds","getSeconds",!t._ignoreInvalidPartChanged)},get:function(){if(e.isSet(t._date)&&t._valid)return t._utc?t._date.getUTCSeconds():t._date.getSeconds()}})),Object.defineProperty(this,"milliseconds",e.extend({},a,{set:function(a){a=parseInt(a,10),e.assert(!e.isNaN(a),"SaneDate set milliseconds | value is not usable as int"),t.utc?t._tryDatePartChange(a,"setUTCMilliseconds","getUTCMilliseconds",!t._ignoreInvalidPartChanged):t._tryDatePartChange(a,"setMilliseconds","getMilliseconds",!t._ignoreInvalidPartChanged)},get:function(){if(e.isSet(t._date)&&t._valid)return t._utc?t._date.getUTCMilliseconds():t._date.getMilliseconds()}}))},setUtc:function(e){return this._utc=!!e,this},setIgnoreInvalidPartChanged:function(e){return this._ignoreInvalidPartChanged=!!e,this},getWeekDay:function(t){if(t=e.orDefault(t,!0,"bool"),e.isSet(this._date)&&this._valid){var a=this._utc?this._date.getUTCDay():this._date.getDay();return t&&0===a&&(a=7),t||(a+=1),a}},getIsoDateString:function(){if(e.isSet(this._date)&&this._valid){var t=this._utc?this._date.getUTCFullYear():this._date.getFullYear(),a=this._utc?this._date.getUTCMonth()+1:this._date.getMonth()+1,s=this._utc?this._date.getUTCDate():this._date.getDate();return t=""+t,a=a<10?"0"+a:""+a,s=s<10?"0"+s:""+s,t<1e3&&(t=this._padValueWithZero(t,4)),e.strFormat("{year}-{month}-{date}",{year:t,month:a,date:s})}return null},getIsoString:function(t){t=e.orDefault(t,!0,"bool");var a=this.getIsoDateString();if(e.isSet(a)){var s=this._utc?this._date.getUTCHours():this._date.getHours(),n=this._utc?this._date.getUTCMinutes():this._date.getMinutes(),i=this._utc?this._date.getUTCSeconds():this._date.getSeconds(),r=this._utc?this._date.getUTCMilliseconds():this._date.getMilliseconds();return s=s<10?"0"+s:""+s,n=n<10?"0"+n:""+n,i=i<10?"0"+i:""+i,r=""+r,a+(t?"T":" ")+e.strFormat("{hours}:{minutes}:{seconds}.{milliseconds}",{hours:s,minutes:n,seconds:i,milliseconds:r})}return null},getVanillaDate:function(){return this._valid?this._date:null},compareTo:function(t,a,s){a=e.orDefault(a,"datetime","string"),s=e.orDefault(s,!0,"bool");var n=this;if(e.isSet(this._date)&&this._valid){var i=null;if(i=e.isA(t,"object")&&e.hasMembers(t,["_date","_valid"])?t:new e.SaneDate(""+t),i._valid){var r=0,o=["getFullYear","getMonth","getDate"],l=["getHours","getMinutes","getSeconds"],u=["getMilliseconds"],d=[];e.merge(d,o),"datetime"===a&&(e.merge(d,l),s&&e.merge(d,u));var h,c;return e.each(d,function(e,t){if(h=n._date[t](),c=i._date[t](),r=c>h?-1:h>c?1:0,0!==r)return!1}),r}throw new Error("SaneDate compareTo | invalid compare date")}throw new Error("SaneDate compareTo | date currently not comparable")},move:function(t,a){a=e.orDefault(a,0,"int");var s=this,n=["years","months","days","hours","minutes","seconds","milliseconds"];if(e.isSet(this._date)&&this._valid){var i={};return e.isPlainObject(t)?i=t:i[""+t]=a,e.each(i,function(t,a){if(!(e.inArray(""+t,n)>=0))throw new Error("SaneDate _move | part must be one of years, months, days, hours, minutes, seconds, milliseconds");switch(""+t){case"years":s._date.setFullYear(s._date.getFullYear()+a);break;case"months":s._date.setMonth(s._date.getMonth()+a);break;case"days":s._date.setDate(s._date.getDate()+a);break;case"hours":s._date.setHours(s._date.getHours()+a);break;case"minutes":s._date.setMinutes(s._date.getMinutes()+a);break;case"seconds":s._date.setSeconds(s._date.getSeconds()+a);break;case"milliseconds":s._date.setMilliseconds(s._date.getMilliseconds()+a)}}),this}throw new Error("SaneDate _move | current date is not usable")},forward:function(t,a){a=e.orDefault(a,0,"int");var s={};return e.isPlainObject(t)?(s=t,e.each(s,function(e,t){s[e]=Math.abs(t)})):s[""+t]=Math.abs(a),this.move(s)},back:function(t,a){a=e.orDefault(a,0,"int");var s={};return e.isPlainObject(t)?(s=t,e.each(s,function(e,t){s[e]=0===t?0:-Math.abs(t)})):s[""+t]=0===a?0:-Math.abs(a),this.move(s)},delta:function(t,a,s){if(a=e.orDefault(a,"days","string"),e.inArray(a,["days","hours","minutes","seconds","milliseconds"])<0)throw new Error('SaneDate delta | largestUnit must be one of "days", "hours", "minutes", "seconds" or "milliseconds"');if(s=e.orDefault(s,!0,"bool"),e.isSet(this._date)&&this._valid){var n=null,i=null,r={};n=e.isA(t,"object")&&e.hasMembers(t,["_date","_valid"])?t:new e.SaneDate(""+t),i=s?Math.abs(this._date.getTime()-n._date.getTime()):this._date.getTime()-n._date.getTime();var o=i<0;return i=Math.abs(i),"days"===a&&(r.days=Math.floor(i/1e3/60/60/24),i-=1e3*r.days*60*60*24,a="hours"),"hours"===a&&(r.hours=Math.floor(i/1e3/60/60),i-=1e3*r.hours*60*60,a="minutes"),"minutes"===a&&(r.minutes=Math.floor(i/1e3/60),i-=1e3*r.minutes*60,a="seconds"),"seconds"===a&&(r.seconds=Math.floor(i/1e3),i-=1e3*r.seconds,a="milliseconds"),"milliseconds"===a&&(r.milliseconds=i),o&&e.each(r,function(e,t){r[e]=0===t?0:-t}),r}},clone:function(){var t=new e.SaneDate(new Date(this.getVanillaDate().getTime()));return t.setUtc(this._utc),t},_setInvalid:function(){this._date=null,this._valid=!1},_padValueWithZero:function(t,a){a=e.orDefault(a,2,"int"),t=parseInt(t,10),e.assert(!e.isNaN(t),"SaneDate _padValueWithZero | value is not usable as int"),t=""+t;var s=t.length;if(s<a)for(var n=0;n<a-s;n++)t="0"+t;return t},_partsToDate:function(t,a){a=e.orDefault(a,!1,"bool");var s=e.extend({},t);if(s.year=this._padValueWithZero(s.year,4),s.month=this._padValueWithZero(s.month),s.date=this._padValueWithZero(s.date),"date"===s.type)return new Date(e.strFormat("{year}-{month}-{date}T00:00:00.0",s));if("datetime"===s.type){s.hours=this._padValueWithZero(s.hours),s.minutes=this._padValueWithZero(s.minutes),s.seconds=this._padValueWithZero(s.seconds),e.isSet(s.milliseconds)&&(s.seconds+="."+s.milliseconds);var n=new Date(e.strFormat("{year}-{month}-{date}T{hours}:{minutes}:{seconds}",s));return a?new Date(n.getTime()-6e4*n.getTimezoneOffset()):n}throw new Error("_partsToDate | unknown type")},_verifyDateParts:function(t){var a=this._partsToDate(t);if("date"===t.type)return parseInt(t.year,10)===(this._utc?a.getUTCFullYear():a.getFullYear())&&parseInt(t.month,10)===(this._utc?a.getUTCMonth()+1:a.getMonth()+1)&&parseInt(t.date,10)===(this._utc?a.getUTCDate():a.getDate());if("datetime"===t.type)return parseInt(t.year,10)===(this._utc?a.getUTCFullYear():a.getFullYear())&&parseInt(t.month,10)===(this._utc?a.getUTCMonth()+1:a.getMonth()+1)&&parseInt(t.date,10)===(this._utc?a.getUTCDate():a.getDate())&&parseInt(t.hours,10)===(this._utc?a.getUTCHours():a.getHours())&&parseInt(t.minutes,10)===(this._utc?a.getUTCMinutes():a.getMinutes())&&parseInt(t.seconds,10)===(this._utc?a.getUTCSeconds():a.getSeconds())&&(!e.isSet(t.milliseconds)||parseInt(t.milliseconds,10)===(this._utc?a.getUTCMilliseconds():a.getMilliseconds()));throw new Error("_verifyDateParts | unknown type")},_parseIsoString:function(t){t=""+t;var a={type:"date",year:null,month:null,date:null,hours:null,minutes:null,seconds:null,milliseconds:null},s=t.split("T");if(1===s.length&&(s=s[0].split(" ")),s.length>=2){var n=s[1].split(":");if(!(n.length>=3))return null;var i=parseInt(n[0],10);e.assert(!e.isNaN(i),"SaneDate _parseIsoString | hours not usable as int"),a.hours=this._padValueWithZero(i);var r=parseInt(n[1],10);e.assert(!e.isNaN(r),"SaneDate _parseIsoString | minutes not usable as int"),a.minutes=this._padValueWithZero(r);var o=n[2];if(o=e.strReplace("Z","",o),o=o.split("+")[0],o=o.split("-")[0],o=o.split("."),o.length>=2){var l=parseInt(o[1],10);e.assert(!e.isNaN(l),"SaneDate _parseIsoString | milliseconds not usable as int"),a.milliseconds=""+l,a.milliseconds.length>3?a.milliseconds=a.milliseconds.substr(0,3):2===a.milliseconds.length?a.milliseconds=""+10*l:1===a.milliseconds.length&&(a.milliseconds=""+100*l)}var u=parseInt(o[0],10);e.assert(!e.isNaN(u),"SaneDate _parseIsoString | seconds not usable as int"),a.seconds=this._padValueWithZero(u),a.type="datetime"}var d=s[0].split("-");if(!(d.length>=3))return null;var h=parseInt(d[0],10);e.assert(!e.isNaN(h),"SaneDate _parseIsoString | year not usable as int"),e.assert(h>=0&&h<=9999,"SaneDate _parseIsoString | this implementation works with years between 0 and 9999"),a.year=this._padValueWithZero(h,4);var c=parseInt(d[1],10);e.assert(!e.isNaN(c),"SaneDate _parseIsoString | month not usable as int"),a.month=this._padValueWithZero(c);var _=parseInt(d[2],10);return e.assert(!e.isNaN(_),"SaneDate _parseIsoString | date not usable as int"),a.date=this._padValueWithZero(_),this._verifyDateParts(a)?a:null},_tryDatePartChange:function(t,a,s,n){n=e.orDefault(n,!1,"bool");var i=this,r=["getFullYear","getMonth","getDate","getHours","getMinutes","getSeconds","getMilliseconds"],o=["getUTCFullYear","getUTCMonth","getUTCDate","getUTCHours","getUTCMinutes","getUTCSeconds","getUTCMilliseconds"];if(!e.isSet(this._date)){if(n)throw new Error("SaneDate _tryDatePartChange | no date to change the part of");return!1}this._compareDate=new Date(this._date.getTime()),this._date[a](t);var l=!1;if(e.each(this._utc?o:r,function(e,t){if(t!==s&&(l=l||i._date[t]()!==i._compareDate[t]()),l)return!1}),l&&(this._date=this._compareDate),this._compareDate=null,!n)return l;if(l)throw new Error("SaneDate _tryDatePartChange | date part change is invalid or would change other parts")}}),e});
//# sourceMappingURL=jquery.annex.sanedate-plugin.js.map
