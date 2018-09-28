import test from 'ava';



$versions.forEach($ => {
	let jqueryVersionString = ' @ jQuery '+$().jquery;



	test('$.fn.setElementIdentity'+jqueryVersionString, (assert) => {
		let $foo = $('<div></div>'),
			$bar = $('<select class="dropdown special" data-placeholder="placeholder" data-selected="bar" onclick="javascript:alert(\'click\');" onmouseover="javascript:alert(\'hover\');" style="color:red; background:blue;"><option value="bar">bar</option></select>');
		

		$foo.setElementIdentity({
			'id' : 'foo',
			'class' : 'these are',
			'+class' : ['my', 'classes'],
			'data-foo' : 'foo',
			'data-bar' : true,
			'style' : {'color' : 'yellow', 'cursor' : 'pointer'},
			'+style' : 'color:green; background:yellow;'
		});

		assert.is($foo.attr('id'), 'foo');
		assert.true($foo.hasClass('these'));
		assert.true($foo.hasClass('are'));
		assert.true($foo.hasClass('my'));
		assert.true($foo.hasClass('classes'));
		assert.is($foo.data('foo'), 'foo');
		assert.is($foo.attr('data-foo'), 'foo');
		assert.is($foo.css('color'), 'green');
		assert.is($foo.css('cursor'), 'pointer');
		assert.is($foo.css('background'), 'yellow');


		$foo = $('<div class="foo" style="color:blue;"></div>');

		assert.throws(() => {
			$foo.setElementIdentity('I am not a plain object.');
		});

		$foo.setElementIdentity({
			'id' : 'foo',
			'+class' : true,
			'data-selected' : 'foo',
			'data*' : true,
			'on*' : true,
			'style' : true
		}, $bar);

		assert.is($foo.attr('id'), 'foo');
		assert.true($foo.hasClass('foo'));
		assert.true($foo.hasClass('dropdown'));
		assert.true($foo.hasClass('special'));
		assert.is($foo.data('placeholder'), 'placeholder');
		assert.is($foo.attr('data-placeholder'), 'placeholder');
		assert.is($foo.data('selected'), 'bar');
		assert.is($foo.attr('data-selected'), 'foo');
		assert.is($foo.attr('onclick'), 'javascript:alert(\'click\');');
		assert.is($foo.attr('onmouseover'), 'javascript:alert(\'hover\');');
		assert.is($foo.attr('style'), 'color:red; background:blue;');
		assert.is($foo.css('color'), 'red');
		assert.is($foo.css('background'), 'blue');


		$foo = $('<div></div>');
		
		$foo.setElementIdentity({
			'id' : 'foo',
			'+class' : true,
			'data-selected' : 'foo',
			'data*' : true,
			'on*' : true
		}, $('<p></p>'));

		assert.is($foo.attr('id'), 'foo');
		assert.is($foo.data('selected'), 'foo');
		assert.is($foo.attr('data-selected'), 'foo');
	});



	test.cb('$.fn.prime'+jqueryVersionString, (assert) => {
		let $foo = $('<p></p>'),
			$bar = $('<span class="foo bar boo"></span>'),
			$boo = $('<input type="hidden" name="boo" value="boo"/>'),
			promisesResolvedCount = 0;

		let fWaitForPromises = () => {
			promisesResolvedCount++;

			if( promisesResolvedCount >= 4 ){
				assert.true($foo.data('primed'));
				assert.is($foo.attr('id'), 'foo');
				assert.is($foo.text(), 'foo');
				assert.true($bar.data('primed-ready'));
				assert.true($bar.hasClass('foo'));
				assert.true($bar.hasClass('far'));
				assert.false($bar.hasClass('boo'));
				assert.false($bar.hasClass('bar'));
				assert.true($boo.hasClass('far'));

				assert.end();
			}
		};

		$foo
			.prime(function(){
				$(this)
					.attr('id', 'foo')
					.text('foo')
				;
			}, true)
			.done(() => {
				fWaitForPromises();
			})
		;


		$bar
			.prime(function(){
				let promise = $.Deferred();

				window.setTimeout(() => {
					promise.resolve();
				}, 1000);

				return promise;
			}, true, {addClass : 'far', removeClass : 'far boo bar'})
			.done(() => {
				fWaitForPromises();
			})
		;


		$foo = $('<p></p>');
		$bar = $('<span class="foo bar boo"></span>');

		$.when(
			$foo.prime(function(){
				let promise = $.Deferred();

				$(this)
					.attr('id', 'foo')
					.text('foo')
				;

				window.setTimeout(() => {
					promise.resolve();
				}, 250);

				return promise.promise();
			}, true),
			$bar.add($boo).prime(function(){
				let promise = $.Deferred();

				window.setTimeout(() => {
					promise.resolve();
				}, 750);

				return promise;
			}, true, {addClass : 'far', removeClass : 'far boo bar'})
		).done(() => {
			fWaitForPromises();
		});


		$foo = $('<p></p>');
		$bar = $('<span class="foo bar boo"></span>');

		$.when(
			$foo.prime(function(){
				let promise = $.Deferred();

				$(this)
					.attr('id', 'foo')
					.text('foo')
				;

				window.setTimeout(() => {
					promise.reject();
				}, 500);

				return promise.promise();
			}, true),
			$bar.add($boo).prime(function(){
				let promise = $.Deferred();

				window.setTimeout(() => {
					promise.resolve();
				}, 300);

				return promise;
			}, true, {addClass : 'far', removeClass : 'far boo bar'})
		).fail(() => {
			fWaitForPromises();
		});


		assert.throws(() => {
			$boo.prime(function(){}, false, 5);
		});
	});
});
