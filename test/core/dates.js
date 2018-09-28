import test from 'ava';

import SaneDatePlugin from '../../src/jquery.annex.sanedate-plugin.js';



$versions.forEach($ => {
	$ = SaneDatePlugin($);

	let jqueryVersionString = ' @ jQuery '+$().jquery;



	test('$.SaneDate'+jqueryVersionString, (assert) => {
		let foo = new $.SaneDate('1-2-3 4:5:6.7'),
			bar = new $.SaneDate('2018-02-28 13:37:00'),
			foobar = new $.SaneDate('2016-4-7'),
			boo = new $.SaneDate(2016, 4, 7),
			far = new $.SaneDate(2016, 13, 33, 13, 37, 0, 999),
			tmp;

		assert.true(foo.valid);
		assert.false(far.valid);
		assert.is(foo.year, 1);
		assert.is(foo.date, 3);
		assert.is(foo.milliseconds, 700);
		assert.throws(function(){ foo.date = 32; });
		assert.throws(function(){ foo.year = 10001; });

		foo.year = 2012;
		foo.date = 29;
		assert.throws(function(){ foo.year = 2013; });
		assert.notThrows(function(){ foo.year = 2016; });

		foo.forward('days', 3);
		foo.back('hours', 12);
		foo.move('seconds', -30);
		assert.is(foo.getIsoDateString(), '2016-03-02');
		assert.is(foo.getIsoString(), '2016-03-02T16:04:36.700');
		assert.is(foo.getIsoString(false), '2016-03-02 16:04:36.700');

		foo.setUtc();
		assert.false(foo.utc);
		foo.setUtc(true);
		assert.true(foo.utc);
		foo.utc = false;
		assert.false(foo.utc);
		foo.utc = true;
		assert.is(foo.getIsoString(), '2016-03-02T15:04:36.700');

		assert.is(bar.getWeekDay(), 3);

		assert.is(foo.compareTo(bar), -1);
		assert.is(bar.compareTo(foobar), 1);
		assert.is(foobar.compareTo(boo), 0);
		tmp = foo.clone();
		tmp.milliseconds = tmp.milliseconds + 1;
		assert.is(foo.compareTo(tmp), -1);
		assert.true(tmp.utc);

		assert.deepEqual(bar.delta(foo), {days : 727, hours : 21, minutes : 32, seconds : 23, milliseconds : 300});
		assert.deepEqual(foo.delta(bar, 'hours', false), {hours : -17469, minutes : -32, seconds : -23, milliseconds : -300});
		assert.deepEqual(foo.delta(tmp, 'minutes'), {minutes : 0, seconds : 0, milliseconds : 1});
		assert.deepEqual(foo.delta(tmp, 'milliseconds'), {milliseconds : 1});
	});
});
