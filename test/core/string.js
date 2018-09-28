import test from 'ava';


$versions.forEach($ => {
	let jqueryVersionString = ' @ jQuery '+$().jquery;



	test('$.strReplace'+jqueryVersionString, (assert) => {
		let foo = 'this:is#a-very:unclean-string',
			bar = '<\'transform\' ; <\'me\' ; \'to json\'>>',
			foobar = 'ßßß';

		assert.is($.strReplace([':', '#', '-'], '_', foo), 'this_is_a_very_unclean_string');
		assert.is($.strReplace(['<', '>', ';', '\''], ['{', '}', ':', '"'], bar), '{"transform" : {"me" : "to json"}}');
		assert.is($.strReplace('ß', 'sz', foobar), 'szszsz');
	});



	test('$.strTruncate'+jqueryVersionString, (assert) => {
		let foo = 'abc',
			bar = 'abcdefghijklmnopqrstuvwxyz',
			foobar = 'üäöÜÄÖß';

		assert.is($.strTruncate(foo), foo);
		assert.is($.strTruncate(bar), bar);
		assert.is($.strTruncate(bar, 6), 'abc...');
		assert.is($.strTruncate(bar, 3, '---'), '---');
		assert.throws(function(){ $.strTruncate(bar, 1, '---'); });
		assert.is($.strTruncate(foobar, 6, '.'), 'üäöÜÄ.');
		assert.is($.strTruncate(foobar, 7), foobar);
	});



	test('$.strConcat'+jqueryVersionString, (assert) => {
		let foo = [10, 9, 8, 7, 6, '5', '4', '3', '2', '1', 'ZERO!'];

		assert.is(
			$.strConcat(' ... ', 10, 9, 8.8, 7, 6.6, '5', '4', '3', '2', '1', 'ZERO!'),
			'10 ... 9 ... 8.8 ... 7 ... 6.6 ... 5 ... 4 ... 3 ... 2 ... 1 ... ZERO!'
		);
		assert.is(
			$.strConcat('...', foo),
			'10...9...8...7...6...5...4...3...2...1...ZERO!'
		);
		assert.is($.strConcat(null, 1, ['2', 3.3], {a : 1, b : 2}), '12,3.3[object Object]');
		assert.is($.strConcat(null, [1,'2', 3.3], 1, 2, 3), '123.3');
	});



	test('$.strFormat'+jqueryVersionString, (assert) => {
		assert.is(
			$.strFormat(
				'An elephant is {times:float(0.00)} times smarter than a {animal}',
				{times : 5.5555, animal : 'lion'}
			),
			'An elephant is 5.56 times smarter than a lion'
		);
		assert.is(
			$.strFormat('{0}{0}{0} ... {{BATMAN!}}', 'Nana'),
			'NanaNanaNana ... {BATMAN!}'
		);
		assert.is(
			$.strFormat('{} {} {} starts the alphabet.', 'A', 'B', 'C'),
			'A B C starts the alphabet.'
		);
		assert.is(
			$.strFormat('{0:int}, {1:int}, {2:int}: details are for pussies', '1a', 2.222, 3),
			'1, 2, 3: details are for pussies'
		);
		assert.is(
			$.strFormat(
				'This is {4}: We need just {1.2:int} {foo} {3} kill {1.0} humans {2:float(0.0)} times over.',
				{foo : 'ape'}, [function(){ return 3; }, 2, 1.1], 42.45, 'to', function(){ return true; }
			),
			'This is true: We need just 1 ape to kill 3 humans 42.5 times over.'
		);
		assert.throws(function(){ $.strFormat('{0} {1} {2} {}', 1, 2, 3, 4); });
		assert.throws(function(){ $.strFormat('{} {1} {2} {3}', 1, 2, 3, 4); });
	});



	test('$.slugify'+jqueryVersionString, (assert) => {
		assert.is(
			$.slugify('---This is a cömplicated ßtring for URLs!---'),
			'this-is-a-complicated-sstring-for-urls'
		);
		assert.is(
			$.slugify('Ꝼ__ __ꝽꞂ__ __Ꞅ'),
			'f-gr-s'
		);
	});



	test('$.maskForSelector'+jqueryVersionString, (assert) => {
		assert.is(
			$.maskForSelector('#cmsValueWithProblematicChars([1*1])'),
			'\\#cmsValueWithProblematicChars\\(\\[1\\*1\\]\\)'
		);
		assert.is(
			$.maskForSelector('&cms,Value,With.Problematic,Chars;++'),
			'\\&cms\\,Value\\,With\\.Problematic\\,Chars\\;\\+\\+'
		);
		assert.is(
			$.maskForSelector('~:cms"ValueWith***Problematic"Chars:~'),
			'\\~\\:cms\\"ValueWith\\*\\*\\*Problematic\\"Chars\\:\\~'
		);
		assert.is(
			$.maskForSelector('cmsValueWithProblematicChars'),
			'cmsValueWithProblematicChars'
		);
	});



	test('$.maskForRegEx'+jqueryVersionString, (assert) => {
		assert.is(
			$.maskForRegEx('/(string-With+Regex-Chars[{*}])/?'),
			'\\/\\(string\\-With\\+Regex\\-Chars\\[\\{\\*\\}\\]\\)\\/\\?'
		);
		assert.is(
			$.maskForRegEx('^\\stringWith|...|RegexChars\\$'),
			'\\^\\\\stringWith\\|\\.\\.\\.\\|RegexChars\\\\\\$'
		);
		assert.is(
			$.maskForRegEx('stringWithRegexChars'),
			'stringWithRegexChars'
		);
	});
});
