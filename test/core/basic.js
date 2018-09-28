import test from 'ava';


$versions.forEach($ => {
	let jqueryVersionString = ' @ jQuery '+$().jquery;



	test('$.assert'+jqueryVersionString, (assert) => {
		let foo = 'bar',
			bar = [],
			foobar = {a : 1};

		assert.notThrows(function(){
			$.assert(foo.length === 3, 'not the right length');
		});

		assert.throws(function(){
			$.assert(function(){ return foo.length < 3; }(), 'not the right length');
		}, null, 'not the right length');

		assert.throws(function(){
			$.assert($.isPlainObject(bar), 'this is not a plain object dude');
		}, null, 'this is not a plain object dude');

		assert.notThrows(function(){
			$.assert($.isPlainObject(foobar), 'this is not a plain object dude');
		});
	});



	test('$.attempt'+jqueryVersionString, (assert) => {
		let noJsonString = '{a : new Date()}',
			jsonString = '[{"a" : {"b" : "c"}}]',
			json;

		if( !$.attempt(function(){ json = JSON.parse(noJsonString) }) ){
			json = {};
		}
		assert.deepEqual(json, {});

		if( !$.attempt(function(){ json = JSON.parse(jsonString) }) ){
			json = {};
		}
		assert.deepEqual(json, [{a : {b : 'c'}}]);

		assert.true($.attempt(function(){ json = 42 * 42; }));
		assert.false($.attempt(function(){ return foo + bar; }));
	});



	test('$.isSet'+jqueryVersionString, (assert) => {
		let foo,
			bar = 1,
			foobar = 'abc';

		assert.false($.isSet(foo));
		assert.false($.isSet(null));
		assert.false($.isSet(undefined));
		assert.false($.isSet(foo, bar, foobar));
		assert.true($.isSet(bar));
		assert.true($.isSet(bar, foobar));
	});



	test('$.isEmpty'+jqueryVersionString, (assert) => {
		let foo,
			bar = 0,
			foobar = '',
			boofar = {},
			farbar = [],
			barfoo = new Set(),
			boo = 'none',
			far = 1;

		assert.true($.isEmpty(foo));
		assert.true($.isEmpty(foo, bar, foobar, boofar, farbar, barfoo));
		assert.true($.isEmpty(['__additionalempty__', false, 'none'], foo, bar, foobar, farbar, boofar, barfoo, boo, false));
		assert.false($.isEmpty(bar, foobar, far));

		boofar.a = 'a';
		barfoo.add(42);
		farbar.push(true);

		assert.false($.isEmpty(boofar));
		assert.false($.isEmpty(barfoo));
		assert.false($.isEmpty(farbar));
	});



	test('$.hasMembers'+jqueryVersionString, (assert) => {
		let foo = {
			a : 1,
			b : 2,
			c : 3
		};

		assert.true($.hasMembers(foo, ['a', 'b', 'c']));
		assert.false($.hasMembers(foo, ['a', 'b', 'd']));
		assert.true($.hasMembers(console, ['log']));
		assert.true($.hasMembers(window, ['location', 'parent']));
		assert.false($.hasMembers(window, ['foobar']));
	});



	test('$.orDefault'+jqueryVersionString, (assert) => {
		let foo = $.orDefault('none', 'kittens!', 'string', ['', 'none']),
			bar = $.orDefault('2', 42, 'int'),
			foobar = $.orDefault(null, 'fluffy', 'string'),
			barfoo = $.orDefault(0, true, 'bool'),
			boo = $.orDefault('a', [1, 2, 3], 'array'),
			far = $.orDefault(42, 1.1, 'float');

		assert.is(foo, 'kittens!');
		assert.is(bar, 2);
		assert.is(foobar, 'fluffy');
		assert.false(barfoo);
		assert.deepEqual(boo, ['a']);
		assert.is(far, 42.0);
	});



	test('$.exists'+jqueryVersionString, (assert) => {
		window.MISC_CONFIG = {};
		let $foo = $('<p>foobar</p>'),
			foo = {foo : {far : 1, boo : [1, 2, {bar : 'test'}, 4], bar : {boo: {far : 'foobar', bar : null}}}};

		assert.true($.exists('MISC_CONFIG'));
		assert.false($.exists('MISC_CONFIGGG'));
		assert.true($.exists($foo));
		assert.false($.exists($foo.find('span')));
		assert.true($.exists('foo.bar.boo.far', foo));
		assert.true($.exists('foo.bar.boo.bar', foo));
		assert.false($.exists('foo.bar.boo.boo', foo));
		assert.false($.exists('foo.far.boo.far', foo));
		assert.true($.exists('foo.boo.2.bar', foo));
		assert.false($.exists('foo.boo.4.bar', foo));
		assert.false($.exists('foo.boo.1.bar', foo));
	});



	test('$.isA'+jqueryVersionString, (assert) => {
		let foo = true,
			bar = {a : 'b'},
			foobar = function(){ return 42.42; },
			boo = new Date(),
			far = [1, 2, 3],
			boofar = /[a-z0-9]/g;

		assert.is(($.isA(foo, 'boolean') && foo) ? 'true' : 'false', 'true');
		assert.true($.isA(bar, 'object'));
		assert.true($.isA(bar.a, 'string'));
		assert.true($.isA(foobar, 'function'));
		assert.true($.isA(foobar(), 'number'));
		assert.true($.isA(boo, 'date'));
		assert.true($.isA(far, 'array'));
		assert.true($.isA(far[1], 'number'));
		assert.true($.isA(boofar, 'regexp'));
		assert.false($.isA(boofar, 'boofar'));
		assert.false($.isA(bar.a, 'date'));
	});



	test('$.isInt'+jqueryVersionString, (assert) => {
		let foo = 42,
			bar = 42.42,
			foobar = '42';

		assert.true($.isInt(foo));
		assert.false($.isInt(bar));
		assert.false($.isInt(foobar));
	});



	test('$.isFloat'+jqueryVersionString, (assert) => {
		let foo = 42.42,
			bar = 42,
			foobar = '42.42';

		assert.true($.isFloat(foo));
		assert.true($.isFloat(bar));
		assert.false($.isFloat(foobar));
	});



	test('$.isNaN'+jqueryVersionString, (assert) => {
		let foo = NaN,
			bar = parseInt('abc', 10),
			foobar = 'abc',
			boo = '42',
			far = new Date(),
			boofar = /abc/g;

		assert.true($.isNaN(foo));
		assert.true($.isNaN(bar));
		assert.false($.isNaN(foobar));
		assert.false($.isNaN(boo));
		assert.false($.isNaN(far));
		assert.false($.isNaN(boofar));
	});



	test('$.minMax'+jqueryVersionString, (assert) => {
		let foo = $.minMax(1, 5, 10),
			bar = $.minMax(42.42, 100000000000, 666.66),
			foobar = $.minMax('a', 'zzz', 'b'),
			boo = [-100, -150, -200],
			far = $.minMax(-150.5, -200, -3),
			boofar = $.minMax(13, 13, 13),
			brafoo = $.minMax(-42.42, 666, -42.42);

		assert.is(foo, 5);
		assert.is(bar, 666.66);
		assert.is(foobar, 'b');
		assert.throws(function(){ $.minMax(boo[0], boo[1], boo[2]); });
		assert.is(far, -150.5);
		assert.is(boofar, 13);
		assert.is(brafoo, -42.42);
	});



	test('$.fn.oo'+jqueryVersionString, (assert) => {
		let foo = 'foo-'+(new Date()).getTime(),
			bar = 'bar-'+(new Date()).getTime();

		$('body')
			.append($('<div class="'+foo+'">foo</div>'))
			.append($('<span class="'+foo+'">bar</span>'))
			.append($('<p class="'+bar+'">foobar</p>'))
		;

		assert.true($.isSet($('body > div').oo().style));
		assert.is($('body > div').oo().innerHTML, 'foo');
		assert.is($('body .'+foo).oo().length, 2);
		assert.true($.isArray($('body .'+foo).oo()));
		assert.is($('body .boo').oo(), null);
		assert.true($.isSet($('body > *').oo()[1].style));

		$('body > .'+foo+', body > .'+bar).remove();
	});



	test('$.fn.outerHtml'+jqueryVersionString, (assert) => {
		let foo = 'foo-'+(new Date()).getTime(),
			bar = 'bar-'+(new Date()).getTime();

		$('body')
			.append(
				$('<div class="'+foo+'">foo</div>')
					.append(
						$('<span class="'+foo+'">bar</span>').append($('<p class="'+bar+'">foobar</p>'))
					)
			)
			.append($('<div class="'+foo+'">foo</div>'))
		;

		assert.is($('body > .'+foo).first().outerHtml(), '<div class="'+foo+'">foo<span class="'+foo+'">bar<p class="'+bar+'">foobar</p></span></div>');
		assert.is($('body > .'+foo).outerHtml('<div class="'+bar+'">boofar</div>').last().text(), 'boofar');
		assert.is($('body > .'+foo+', body > .'+bar).outerHtml('<div class="'+bar+'">boofar</div>').length, 2);

		$('body > .'+foo+', body > .'+bar).remove();
	});



	test('$.fn.dataDuo'+jqueryVersionString, (assert) => {
		let foo = 'foo-'+(new Date()).getTime(),
			bar = 'bar-'+(new Date()).getTime(),
			$foo = $('<div class="'+foo+'" data-foobar=\'[{"a" : "abc", "b" : true}, {"c" : {"d" : [1, 2, 3]}}, {"e" : 42.42}]\'></div>'),
			$bar = $('<span class="'+bar+'" data-boofar=\'{a : new Date()}\'></span>'),
			timeStamp = new Date();

		$('body').append($foo);

		assert.deepEqual($foo.dataDuo('foobar'), [{a : 'abc', b : true}, {c : {d : [1, 2, 3]}}, {e : 42.42}]);
		assert.is($bar.dataDuo('boofar'), '{a : new Date()}');

		$('body').append($bar);

		$foo.dataDuo('foobar', function(){ return 'hello kittens!'; });
		assert.is($foo.dataDuo('foobar'), 'hello kittens!');
		assert.is($foo.attr('data-foobar'), '"hello kittens!"');
		$foo.removeAttr('data-foobar');
		assert.is($foo.dataDuo('foobar'), 'hello kittens!');
		assert.is($foo.attr('data-foobar'), undefined);
		$foo.dataDuo('foobar', 'hello kittens!');
		assert.is($foo.dataDuo('foobar'), 'hello kittens!');
		assert.is($foo.attr('data-foobar'), '"hello kittens!"');

		$foo.dataDuo('foobar', {a : 'foo', b : [1, 2, 3], c : {d : true}});
		assert.deepEqual($foo.dataDuo('foobar'), {a : 'foo', b : [1, 2, 3], c : {d : true}});
		assert.is($foo.attr('data-foobar'), '{\"a\":\"foo\",\"b\":[1,2,3],\"c\":{\"d\":true}}');

		$bar.dataDuo('boofar', null);
		assert.is($bar.dataDuo('boofar'), null);
		$bar.dataDuo('boofar', [timeStamp, 1, true]);
		assert.deepEqual($bar.dataDuo('boofar'), [timeStamp, 1, true]);
		assert.is($bar.attr('data-boofar'), '["'+timeStamp.toISOString()+'",1,true]');

		assert.is($foo.dataDuo('abcd'), undefined);

		$foo.remove();
		$bar.remove();
	});



	test('$.fn.removeDataDuo'+jqueryVersionString, (assert) => {
		let foo = 'foo-'+(new Date()).getTime(),
			bar = 'bar-'+(new Date()).getTime(),
			$foo = $('<div class="'+foo+'" data-foobar=\'[{"a" : "abc", "b" : true}, {"c" : {"d" : [1, 2, 3]}}, {"e" : 42.42}]\'></div>'),
			$bar = $('<span class="'+bar+'" data-boofar="{a : new Date()}"></span>');

		assert.deepEqual($foo.dataDuo('foobar'), [{a : 'abc', b : true}, {c : {d : [1, 2, 3]}}, {e : 42.42}]);
		assert.is($bar.dataDuo('boofar'), '{a : new Date()}');

		$('body')
			.append($foo)
			.append($bar)
		;

		$foo.removeDataDuo('foobar');
		$bar.removeDataDuo('boofar');

		assert.is($foo.attr('data-foobar'), undefined);
		assert.is($foo.data('foobar'), undefined);
		assert.is($bar.attr('data-boofar'), undefined);
		assert.is($bar.data('boofar'), undefined);

		assert.notThrows(function(){
			$foo.removeDataDuo('abcd');
		});

		$foo.remove();
		$bar.remove();
	});



	test('$.fn.isInDom'+jqueryVersionString, (assert) => {
		let foo = 'foo-'+(new Date()).getTime(),
			$foo = $('<div class="'+foo+'"></div>');

		assert.false($foo.isInDom());

		$('body').append($foo);

		assert.true($foo.isInDom());

		$foo.detach();

		assert.false($foo.isInDom());

		$foo.remove();
	});



	test('$.fn.findTextNodes'+jqueryVersionString, (assert) => {
		let foo = 'foo-'+(new Date()).getTime(),
			$foo = $('<div class="'+foo+'">arigatou <p>gozaimasu <span>deshita</span></p> mr. roboto<p>!<span>!!</span></p></div>!'),
			test = '';

		assert.is($foo.findTextNodes().length, 6);
		assert.is($foo.findTextNodes(null, true).length, 2);
		assert.is($foo.findTextNodes((textNode) => { return textNode.textContent.length < 9; }).length, 3);
		
		$.each($foo.findTextNodes(), (index, node) => {
			test += ''+node.textContent;
		});
		assert.is(test, 'arigatou gozaimasu deshita mr. roboto!!!');

		test = '';
		$.each($foo.findTextNodes(null, true), (index, node) => {
			test += ''+node.textContent;
		});
		assert.is(test, 'arigatou  mr. roboto');

		test = '';
		$.each($foo.findTextNodes((textNode) => { return textNode.textContent.length < 9; }), (index, node) => {
			test += ''+node.textContent;
		});
		assert.is(test, 'deshita!!!');
	});
});
