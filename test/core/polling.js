import test from 'ava';



$versions.forEach($ => {
	let jqueryVersionString = ' @ jQuery '+$().jquery;



	test.cb('$.poll'+jqueryVersionString, (assert) => {
		let foo = 0,
			bar = 0,
			firedCounter = 0,
			changedCounter = 0,
			elseCounter = 0,
			elseChangedCounter = 0;

		$.poll(
			'foo-poll',
			function(){
				return (foo > 0) && (foo < 3);
			},
			function(changed){
				firedCounter++;
				if( changed ){
					changedCounter++;
				}
			},
			function(changed){
				elseCounter++;
				if( changed ){
					elseChangedCounter++;
				}
			},
			240
		);

		$.poll(
			'bar-poll',
			function(){
				return foo > 0;
			},
			function(changed){
				bar++;
				if( foo > 1 ){
					return true;
				}
			},
			$.noop,
			110,
			true
		);

		window.setTimeout(function(){
			foo++;
		}, 250);

		window.setTimeout(function(){
			foo++;
		}, 500);

		window.setTimeout(function(){
			foo++;
		}, 750);

		window.setTimeout(function(){
			assert.is(foo, 3);
			assert.is(firedCounter, 2);
			assert.is(changedCounter, 1);
			assert.is(elseCounter, 6);
			assert.is(elseChangedCounter, 1);
			assert.is(bar, 3);
			assert.end();
		}, 2000);
	});



	test.cb('$.unpoll'+jqueryVersionString, (assert) => {
		let foo = 0,
			bar = false,
			foobar = false,
			boo = 0;

		$.poll(
			'foo-poll2',
			function(){
				return (foo > 0) && (foo < 3);
			},
			function(){
				boo++;
			},
			$.noop,
			240
		);

		window.setTimeout(function(){
			foo++;
			bar = $.unpoll('bar-poll2');
		}, 250);

		window.setTimeout(function(){
			foobar = $.unpoll('foo-poll2');
			foo++;
		}, 500);

		window.setTimeout(function(){
			foo++;
		}, 750);

		window.setTimeout(function(){
			assert.is(foo, 3);
			assert.is(boo, 1);
			assert.false(bar);
			assert.true(foobar);
			assert.end();
		}, 2000);
	});

});
