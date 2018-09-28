import test from 'ava';



$versions.forEach($ => {
	let jqueryVersionString = ' @ jQuery '+$().jquery;



	test('$.urlParameter'+jqueryVersionString, (assert) => {
		let url1 = 'foobar.com/foo',
			url2 = 'https://www.foo.bar',
			url3 = '//foo.bar/foo/bar/',
			qString = '?boofar&foo=123&bar=%C3%BC%C3%A4%C3%B6%C3%9C%C3%84%C3%96%C3%9F%2B-%3C%3E%3F%26%3D&boo=boo&boo=oob&far[]=raf&far[]=%C3%BC%C3%A4%C3%B6%C3%9C%C3%84%C3%96%C3%9F%2B-%3C%3E%3F%26%3D';
		
		for(let url of [url1, url2, url3]){
			assert.true($.urlParameter(url+qString, 'boofar'));
			assert.is($.urlParameter(url+qString, 'foo'), '123');
			assert.is($.urlParameter(url+qString, 'bar'), 'üäöÜÄÖß+-<>?&=');
			assert.deepEqual($.urlParameter(url+qString, 'boo'), ['boo', 'oob']);
			assert.deepEqual($.urlParameter(url+qString, 'far[]'), ['raf', 'üäöÜÄÖß+-<>?&=']);
			assert.deepEqual($.urlParameter(url+qString), {
				'boofar' : true,
				'foo' : '123',
				'bar' : 'üäöÜÄÖß+-<>?&=',
				'boo' : ['boo', 'oob'],
				'far[]' : ['raf', 'üäöÜÄÖß+-<>?&=']
			});
			assert.deepEqual($.urlParameters(url+qString), {
				'boofar' : true,
				'foo' : '123',
				'bar' : 'üäöÜÄÖß+-<>?&=',
				'boo' : ['boo', 'oob'],
				'far[]' : ['raf', 'üäöÜÄÖß+-<>?&=']
			});
			assert.is($.urlParameter(url+qString, 'test'), null);
			assert.true($.urlParameter('test', 'test'));
			assert.is($.urlParameter('test', 'testo'), null);
		}
	});



	test('$.urlParameters'+jqueryVersionString, (assert) => {
		assert.pass('included in $.urlParameter');
	});



	test('$.fn.urlParameter'+jqueryVersionString, (assert) => {
		let paramString = '?boofar&foo=123&bar=%C3%BC%C3%A4%C3%B6%C3%9C%C3%84%C3%96%C3%9F%2B-%3C%3E%3F%26%3D&boo=boo&boo=oob&far[]=raf&far[]=%C3%BC%C3%A4%C3%B6%C3%9C%C3%84%C3%96%C3%9F%2B-%3C%3E%3F%26%3D',
			$dummyWindow = $('<window></window>'),
			$foo = $('<img src="https://www.ifschleife.de/img/foo.png'+paramString+'" alt=""/>'),
			$bar = $('<a href="http://test.ifschleife.de/bar/'+paramString+'" target="_blank">bar</a>');

		$dummyWindow.get(0).location = {
			href : 'https://ifschleife.de/foobar',
			search : paramString
		};
		
		for( let $element of [$dummyWindow, $foo, $bar] ){
			assert.true($element.urlParameter('boofar'));
			assert.is($element.urlParameter('foo'), '123');
			assert.is($element.urlParameter('bar'), 'üäöÜÄÖß+-<>?&=');
			assert.deepEqual($element.urlParameter('boo'), ['boo', 'oob']);
			assert.deepEqual($element.urlParameter('far[]'), ['raf', 'üäöÜÄÖß+-<>?&=']);
			assert.deepEqual($element.urlParameter(), {
				'boofar' : true,
				'foo' : '123',
				'bar' : 'üäöÜÄÖß+-<>?&=',
				'boo' : ['boo', 'oob'],
				'far[]' : ['raf', 'üäöÜÄÖß+-<>?&=']
			});
			assert.deepEqual($element.urlParameters(), {
				'boofar' : true,
				'foo' : '123',
				'bar' : 'üäöÜÄÖß+-<>?&=',
				'boo' : ['boo', 'oob'],
				'far[]' : ['raf', 'üäöÜÄÖß+-<>?&=']
			});
			assert.is($element.urlParameter('test'), null);
		}
	});



	test('$.fn.urlParameters'+jqueryVersionString, (assert) => {
		assert.pass('included in $.fn.urlParameter');
	});



	test('$.urlAnchor'+jqueryVersionString, (assert) => {
		let url1 = 'foobar.com/foo',
			url2 = 'https://www.foo.bar',
			url3 = '//foo.bar/foo/bar/',
			anchor1 = '#foo',
			anchor2 = '#bar=foo',
			anchor3 = '#%C3%BC%C3%A4%C3%B6%C3%9C%C3%84%C3%96%C3%9F%2B-%3C%3E%3F%26%3D',
			anchors = ['#foo', '#bar=foo', '#üäöÜÄÖß+-<>?&='],
			rawAnchors = ['foo', 'bar=foo', 'üäöÜÄÖß+-<>?&='];
		
		for(let url of [url1, url2, url3]){
			for(let anchor of [anchor1, anchor2, anchor3]){
				assert.true(anchors.indexOf($.urlAnchor(url+anchor)) >= 0);
				assert.true(rawAnchors.indexOf($.urlAnchor(url+anchor, true)) >= 0);
			}
		}
	});



	test('$.fn.urlAnchor'+jqueryVersionString, (assert) => {
		let anchor = '#%C3%BC%C3%A4%C3%B6%C3%9C%C3%84%C3%96%C3%9F%2B-%3C%3E%3F%26%3D',
			$dummyWindow = $('<window></window>'),
			$foo = $('<img src="https://www.ifschleife.de/img/foo.png'+anchor+'" alt=""/>'),
			$bar = $('<a href="http://test.ifschleife.de/bar/'+anchor+'" target="_blank">bar</a>');

		$dummyWindow.get(0).location = {
			href : 'https://ifschleife.de/foobar',
			hash : anchor
		};
		
		for( let $element of [$dummyWindow, $foo, $bar] ){
			assert.is($element.urlAnchor(), '#üäöÜÄÖß+-<>?&=');
			assert.is($element.urlAnchor(true), 'üäöÜÄÖß+-<>?&=');
		}
	});
});
