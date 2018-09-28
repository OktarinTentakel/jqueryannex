import test from 'ava';



$versions.forEach($ => {
	let jqueryVersionString = ' @ jQuery '+$().jquery;



	test('$.isolateId'+jqueryVersionString, (assert) => {
		assert.is($.isolateId('prefix09-foo_bar#1234_boo'), '1234');
		assert.is($.isolateId('prefix00-foo_bar#0000_boo'), null);
		assert.is($.isolateId('test_(123;456)', /\_\(([0-9]+)\;[^\)]+\)/g), '123');
		assert.is($.isolateId('test_(123;456)', '\\_\\(([0-9]+)\\;[^\\)]+\\)'), '123');
		assert.is($.isolateId('foobar-barfoo_foo'), null);
	});



	test('$.isPossibleId'+jqueryVersionString, (assert) => {
		assert.true($.isPossibleId('666'));
		assert.false($.isPossibleId('0666'));
		assert.true($.isPossibleId('prefix-42', 'prefix-'));
		assert.true($.isPossibleId('prefix-042', 'prefix-', '[0-9]+'));
		assert.true($.isPossibleId('prefix-042_postfix', 'prefix-', '[0-9]+', '_postfix'));
		assert.false($.isPossibleId('prefix-042_postfix', 'prefix-', null, '_postfix'));
		assert.true($.isPossibleId('42_postfix', null, null, '_postfix'));
	});
});
