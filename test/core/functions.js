import test from 'ava';



$versions.forEach($ => {
	let jqueryVersionString = ' @ jQuery '+$().jquery;



	test.cb('$.throttleExecution'+jqueryVersionString, (assert) => {
		let foo = 0,
			bar = 0;

		let fTestInc = $.throttleExecution(100, function(inc){
			foo += inc;
		});

		let fTestInc2 = $.throttleExecution(200, function(inc){
			bar += inc;
		}, true, true);

		let i = window.setInterval(() => {
			fTestInc(2);
		}, 30);

		let i2 = window.setInterval(() => {
			fTestInc2(4);
		}, 30);

		window.setTimeout(() => {
			window.clearInterval(i);
			window.clearInterval(i2);

			assert.true(foo >= 38 && foo <= 42);
			assert.true(bar >= 38 && bar <= 42);
			assert.end();
		}, 2000);
	});



	test.cb('$.holdExecution'+jqueryVersionString, (assert) => {
		let foo = 0,
			bar = 0;

		let fTestInc = $.holdExecution(500, function(inc){
			foo += inc;
		});

		let fTestInc2 = $.holdExecution(1000, function(inc){
			bar += inc;
		});

		window.setTimeout(() => {
			fTestInc(1);
			fTestInc2(2);
		}, 0);

		window.setTimeout(() => {
			fTestInc(3);
			fTestInc2(4);
		}, 600);

		window.setTimeout(() => {
			fTestInc(5);
			fTestInc2(6);
		}, 800);

		window.setTimeout(() => {
			fTestInc(7);
			fTestInc2(8);
		}, 990);

		window.setTimeout(() => {
			fTestInc(9);
			fTestInc2(10);
		}, 1998);

		window.setTimeout(() => {
			assert.is(foo, 8);
			assert.is(bar, 8);
			assert.end();
		}, 2000);
	});



	test.cb('$.deferExecution'+jqueryVersionString, (assert) => {
		let foo = 0;

		let fTestInc = $.deferExecution(function(inc){
			foo += inc;
		});

		fTestInc(2);
		assert.is(foo, 0);
		$.deferExecution(function(){
			assert.is(foo, 2);
			assert.end();
		})();
	});



	test('$.kwargs'+jqueryVersionString, (assert) => {
		let fTest = function(tick, trick, track){ return tick+', '+trick+', '+track; };
		 
		assert.is($.kwargs(fTest, {track : 'defTrack'})({tick : 'tiick', trick : 'trick'}), 'tiick, trick, defTrack');
		assert.is($.kwargs(fTest, {track : 'defTrack'})('argTick', {trick : 'triick', track : 'trACK'}), 'argTick, triick, trACK');
		assert.is($.kwargs(fTest, {track : 'defTrack'})('argTick', {trick : 'triick', track : 'track'}, 'trackkkk'), 'argTick, triick, trackkkk');
	});
});
