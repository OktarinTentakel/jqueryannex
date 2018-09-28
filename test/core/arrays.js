import test from 'ava';



$versions.forEach($ => {
	let jqueryVersionString = ' @ jQuery '+$().jquery;



	test('$.removeFromArray'+jqueryVersionString, (assert) => {
		let foo = [1, 2, {a : 'b'}, [1, 2, 3], 4];

		assert.deepEqual($.removeFromArray(foo, 0, 2), [[1, 2, 3], 4]);
		assert.deepEqual($.removeFromArray(foo, -3, -2), [1, 2, 4]);
		assert.deepEqual($.removeFromArray(foo, -1), [1, 2, {a : 'b'}, [1, 2, 3]]);
		assert.deepEqual($.removeFromArray(foo, 3), [1, 2, {a : 'b'}, 4]);
		assert.deepEqual($.removeFromArray(foo, 3, -1), [1, 2, {a : 'b'}]);
		assert.throws(function(){ $.removeFromArray({a : 1}, -1); });
	});
});
