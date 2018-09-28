import test from 'ava';



$versions.forEach($ => {
	let jqueryVersionString = ' @ jQuery '+$().jquery;



	test('$.Class'+jqueryVersionString, (assert) => {
		let SuperPoweredFoobar = $.Class.extend({
			init : function(){
				this.a = 1;
				this.b = 2;
			},

			incrementC : function(){
				if( this.c ){
					this.c++;
				}
			},

			incrementD : function(){
				if( this.d ){
					this.d++;
				}
			}
		});

		let UltraPoweredFoobar = SuperPoweredFoobar.extend({
			init : function(c){
				this.a = 3;

				this._super();

				this.b = 4;
				this.c = c;
				this.d = 6;
			},

			incrementD : function(){
				this._super();

				if( this.d ){
					this.d = this.d + 2;
				}
			}
		});

		let foobar1 = new SuperPoweredFoobar(),
			foobar2 = new UltraPoweredFoobar(5);

		assert.is(foobar1.a, foobar2.a);
		assert.is(foobar1.b, 2);
		assert.is(foobar2.b, 4);
		assert.is(foobar1.c, undefined);
		assert.is(foobar2.c, 5);
		foobar2.incrementC();
		assert.is(foobar2.c, 6);
		foobar2.incrementD();
		assert.is(foobar2.d, 9);
	});
});
