import test from 'ava';



$versions.forEach($ => {
	let jqueryVersionString = ' @ jQuery '+$().jquery;



	test('$.log'+jqueryVersionString, (assert) => {
		let excepted = false;

		try {
			let randomVar = 5;

			$.log(randomVar, 'string');
			$.log(false, true);
			$.log().group().log(1).log(2).log(3).groupEnd().error('ouch');
			// for some reason the jsdom implementation of console.log, does not like .enable(), resulting in an exception not happening in browser
			// I guess this happens because we are changing function pointers for console.log itself
			//$.log().disable().warn('oh noez, but printed').log('not printed').enable()
			$.log('test', {test : 'test'}).clear();
			$.log().tryToLogToParent().log('hooray times two').tryToLogToParent(false);
		} catch(ex){
			console.log(ex);
			excepted = true;
		}

		assert.false(excepted);
	});



	test('$.warn'+jqueryVersionString, (assert) => {
		let excepted = false;

		try {
			let randomVar = 5;

			$.warn('warning yo!');
			$.warn(randomVar, 'string');
			$.warn(false);
			$.warn(true);
		} catch(ex){
			console.log(ex);
			excepted = true;
		}

		assert.false(excepted);
	});



	test('$.err'+jqueryVersionString, (assert) => {
		let excepted = false;

		try {
			let randomVar = 5;

			$.err('error yo!');
			$.err(randomVar, 'string');
			$.err(false);
			$.err(true);
		} catch(ex){
			console.log(ex);
			excepted = true;
		}

		assert.false(excepted);
	});



	test('$.x'+jqueryVersionString, (assert) => {
		let excepted = false;

		try {
			for( var i = 0; i < 10; i++ ){
				$.x();
			}
		} catch(ex){
			console.log(ex);
			excepted = true;
		}

		assert.false(excepted);
	});
});
