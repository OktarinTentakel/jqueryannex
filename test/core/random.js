import test from 'ava';



$versions.forEach($ => {
	let jqueryVersionString = ' @ jQuery '+$().jquery;



	test('$.randomInt'+jqueryVersionString, (assert) => {
		let i,
			j,
			check,
			epsilon = 100 * 2,
			foo,
			bar = [];

		check = true;
		for( i = 0; i < 10000; i++ ){
			foo = $.randomInt(42, 6666);
			check = check && (foo >= 42 && foo <= 6666);
			if( !check ){
				break;
			}
		}
		assert.true(check);

		check = true;
		for( i = 0; i < 100; i++ ){
			foo = $.randomInt(42, 42);
			check = check && (foo === 42);
			if( !check ){
				break;
			}
		}
		assert.true(check);

		check = true;
		for( i = 0; i < 10000; i++ ){
			foo = $.randomInt(0, 9);
			bar[foo] = bar[foo] ? bar[foo]+1 : 1;
		}
		for( i = 0; i < 10; i++ ){
			for( j = 0; j < 10; j++ ){
				check = check && Math.abs(bar[i] - bar[j]) <= epsilon;
				if( !check ){
					break;
				}
			}
			if( !check ){
				break;
			}
		}
		assert.true(check);

		assert.throws(function(){ $.randomInt(10, 1); });
	});



	test('$.randomUuid'+jqueryVersionString, (assert) => {
		let i, check, foo;

		check = true;
		for( i = 0; i < 100; i++ ){
			foo = $.randomUuid();
			check = check && (foo.length === 36) && /[0-9A-F]{8}\-[0-9A-F]{4}\-[0-9A-F]{4}\-[0-9A-F]{4}\-[0-9A-F]{12}/.test(foo);
			if( !check ){
				break;
			}
		}
		assert.true(check);

		check = true;
		for( i = 0; i < 100; i++ ){
			foo = $.randomUuid(true);
			check = check && (foo.length === 32) && /[0-9A-F]{32}/.test(foo);
			if( !check ){
				break;
			}
		}
		assert.true(check);
	});
});
