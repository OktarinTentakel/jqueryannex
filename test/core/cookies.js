import test from 'ava';



$versions.forEach($ => {
	let jqueryVersionString = ' @ jQuery '+$().jquery;



	test('$.cookie'+jqueryVersionString, (assert) => {
		assert.notThrows(() => { $.cookie('kittencookie', 'fluffy', {expires : 7}); });
		assert.is($.cookie('kittencookie'), 'fluffy');
		assert.notThrows(() => { $.cookie('foobarcookie', 'üäöÜÄÖß:::///___abc123', {expires : new Date()}); });
		assert.is($.cookie('foobarcookie'), null);
		assert.notThrows(() => { $.cookie('foobarcookie', 'üäöÜÄÖß:::///___abc123', {expires : 1}); });
		assert.is($.cookie('foobarcookie'), 'üäöÜÄÖß:::///___abc123');
		assert.notThrows(() => { $.cookie('foobarcookie', null); });
		assert.is($.cookie('foobarcookie'), null);
	});
});
