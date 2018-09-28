import test from 'ava';



$versions.forEach($ => {
    let jqueryVersionString = ' @ jQuery '+$().jquery;



	test('$.fn.pauseHandlers / $.fn.resumeHandlers / $.fn.moveEventData'+jqueryVersionString, (assert) => {
	   let $foo = $('<button></button>'),
			$bar = $('<div></div>'),
			foobar = '';

		$foo.on('test.app', function(){
			foobar = 'hooray';
		});
		$foo.on('click.app', function(){
			foobar = 'boo!';
			$(this).trigger('test');
		});
		$bar.on('foo.bar', function(){
			foobar = 'oops...';
		});
		$bar.pauseHandlers('foo.bar');

		$foo.trigger('click');
		$bar.trigger('foo');
		assert.is(foobar, 'hooray');

		$foo.pauseHandlers('test');
		$foo.trigger('click');
		$bar.trigger('foo');
		assert.is(foobar, 'boo!');

		$foo.resumeHandlers('test');
		$foo.trigger('click');
		$bar.trigger('foo');
		assert.is(foobar, 'hooray');

		$foo.pauseHandlers('click test.app');
		$foo.trigger('click');
		$bar.trigger('foo');
		assert.is(foobar, 'hooray');

		$bar.resumeHandlers('foo');
		$foo.trigger('click');
		$bar.trigger('foo');
		assert.is(foobar, 'oops...');

		$foo.resumeHandlers('test.app click.app');
		$bar.pauseHandlers('foo.bar');
		$foo.trigger('click');
		$bar.trigger('foo');
		assert.is(foobar, 'hooray');
	});
});
