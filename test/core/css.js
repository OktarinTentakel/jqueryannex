import test from 'ava';



$versions.forEach($ => {
	let jqueryVersionString = ' @ jQuery '+$().jquery;



	test('$.cssToNumber'+jqueryVersionString, (assert) => {
		assert.is($.cssToNumber(123), 123);
		assert.is($.cssToNumber('0123a'), 123);
		assert.is($.cssToNumber('5000px'), 5000);
		assert.is($.cssToNumber('1.5'), 1.5);
		assert.is($.cssToNumber('5em'), 5);
		assert.is($.cssToNumber('1.5ex'), 1.5);
		assert.is($.cssToNumber('1000%'), 1000);
		assert.is($.cssToNumber('42.42em'), 42.42);
		assert.is($.cssToNumber('0.1cm'), 0.1);
		assert.true($.isNaN($.cssToNumber('EINSWEIcm')));
	});



	test('$.cssUrlToSrc'+jqueryVersionString, (assert) => {
		assert.is($.cssUrlToSrc('url("../img/foo/bar/foobar.jpg")'), '../img/foo/bar/foobar.jpg');
		assert.is($.cssUrlToSrc('url(../img/foo/bar/foobar.jpg)', '..'), '/img/foo/bar/foobar.jpg');
		assert.is($.cssUrlToSrc('url(\'../img/foo/bar/foobar.jpg\')', '../img/foo'), '/bar/foobar.jpg');
		assert.is($.cssUrlToSrc('../img/foo/bar/foobar.jpg', '../img/foo'), null);
	});



	test('$.remByPx'+jqueryVersionString, (assert) => {
		$('html, body').css('font-size', 16);

		assert.is($.remByPx(10, 20), '0.5rem');
		assert.is($.remByPx('10px', '20px'), '0.5rem');
		assert.is($.remByPx(32), '2rem');

		$('html, body').css('font-size', '');
	});
});
