import test from 'ava';



class FooBar {

	constructor(){
		this.a = 1;
		this.b = 2;
	}



	addC(){
		this.c = 3;
	}

}



$versions.forEach($ => {
	let jqueryVersionString = ' @ jQuery '+$().jquery;



	test('$.objectLength'+jqueryVersionString, (assert) => {
		let foo = {a : 0, b : 2, c : 3},
			bar = new FooBar(),
			foobar = [1, 2, 3],
			boo = 'asd',
			far = 33;

		assert.is($.objectLength(foo), 3);
		delete foo.a;
		assert.is($.objectLength(foo), 2);
		assert.is($.objectLength(bar), 2);
		bar.addC();
		assert.is($.objectLength(bar), 3);
		assert.throws(function(){ $.objectLength(foobar); });
		assert.throws(function(){ $.objectLength(boo); });
		assert.throws(function(){ $.objectLength(far); });
	});



	test('$.copyObjectContent'+jqueryVersionString, (assert) => {
		let foo = {a : 'b', b : [1, 2, 3], c : {a : 1, b : {}, c : 3}, d : true, e : new Date()},
			bar = {will : 'be', lost : 'on copy'},
			barRef = bar,
			foobar = $.extend(true, {}, bar);

		assert.deepEqual($.copyObjectContent(foobar, foo), foo);
		assert.true(barRef === bar);
		assert.true(foo.b === foobar.b && foo.c === foobar.c);
		assert.true(foo.b[1] === foobar.b[1] && foo.c.b === foobar.c.b);
		foobar = $.extend(true, {}, bar);
		assert.deepEqual($.copyObjectContent(foobar, foo, true), foo);
		assert.true(barRef === bar);
		assert.true(foo.b !== foobar.b && foo.c !== foobar.c);
		assert.true(foo.b[1] === foobar.b[1] && foo.c.b !== foobar.c.b && foo.c.c === foobar.c.c);
		assert.throws(function(){ $.copyObjectContent('not an object', {}); });
	});



	test('$.emptyObject'+jqueryVersionString, (assert) => {
		let foo = {a : 'b', b : [1, 2, 3], c : {a : 1, b : {}, c : 3}, d : true, e : new Date()},
			bar = {will : 'be', lost : 'on empty'},
			foobar = 'not an object';

		assert.deepEqual($.emptyObject(foo), {});
		assert.deepEqual($.emptyObject(bar), {});
		assert.throws(function(){ $.emptyObject(foobar); });
	});
});
