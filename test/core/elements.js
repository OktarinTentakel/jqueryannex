import test from 'ava';



$versions.forEach($ => {
	let jqueryVersionString = ' @ jQuery '+$().jquery;



	test('$.elem'+jqueryVersionString, (assert) => {
		let $el = $.elem('div', {id : 'content', style : 'display:none;'}, 'loading...');

		assert.is($el.attr('id'), 'content');
	});



	test('$.textContent'+jqueryVersionString, (assert) => {
		let source = '<p onlick="destroyWorld();">red button <a>meow<span>woof</span></a></p>';

		assert.is($.textContent(source), 'red button meowwoof');
		assert.is($.textContent($(source)), 'red button meowwoof');
		assert.is($.textContent($(source), true), 'red button');
	});
});
