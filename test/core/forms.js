import test from 'ava';



$versions.forEach($ => {
    let jqueryVersionString = ' @ jQuery '+$().jquery;
    


    let $testForm = $(`
        <form>
            <div>
                <input type="hidden" name="secret" value="666" />
            </div>
            <fieldset>
                <legend>Legend</legend>
                <label>
                    Label
                    <input type="text" name="foo" value="oof" />
                </label>
                <label>
                    Label
                    <input type="checkbox" name="boo" value="1" checked />
                </label>
                <label>
                    <input type="checkbox" name="boo" value="2" />
                    Label
                </label>
                <label>
                    <input type="checkbox" name="boo" value="3" />
                </label>
                <label>
                    <input type="checkbox" name="far[]" value="4" />
                    Label
                </label>
                <label>
                    <input type="checkbox" name="far[]" value="5" />
                    Label
                </label>
                <label>
                    Label
                    <input type="checkbox" name="far[]" value="6" checked />
                </label>
                <div>
                    <label>
                        Label
                        <select name="bar">
                            <option value=""></option>
                            <option value="7">Seven</option>
                            <option value="8">Eight</option>
                            <option value="9">Nine</option>
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        <input type="radio" name="fooboo" value="10" />
                        Label
                    </label>
                    <label>
                        <input type="radio" name="fooboo" value="11" />
                        Label
                    </label>
                    <label>
                        Label
                        <input type="radio" name="fooboo" value="12" checked />
                    </label>
                </div>
			</fieldset>
			<input type="file" name="testfile1" />
			<input type="file" name="testfile2" multiple />
        </form>
    `);



	test('$.fn.formDataToObject'+jqueryVersionString, (assert) => {
        let $tf = $($testForm.get(0).outerHTML);

		assert.deepEqual($tf.formDataToObject(), {
            secret : '666',
            foo : 'oof',
            boo : '1',
            far : ['6'],
            bar : '',
            fooboo : '12'
        });

        $tf.find('[name="foo"]').val('boom');
        $tf.find('[name="boo"][value="1"]').uncheck();
        $tf.find('[name="boo"][value="2"]').check();
        $tf.find('[name="boo"][value="3"]').check();
        $tf.find('[name="far[]"][value="4"]').check();
        $tf.find('[name="far[]"][value="6"]').check();
        $tf.find('[name="bar"]').val('8');
        $tf.find('[name="fooboo"][value="11"]').check();

        assert.deepEqual($tf.formDataToObject(), {
            secret : '666',
            foo : 'boom',
            boo : ['2', '3'],
            far : ['4', '6'],
            bar : '8',
            fooboo : '11'
        });
    });
    


    test('$.fn.formDataToFormData'+jqueryVersionString, (assert) => {
		let $tf = $($testForm.get(0).outerHTML),
			fd = $tf.formDataToFormData(['testfile1', 'testfile2'], {name : 'htmlblobname', content : '<em>IMPORTANT!</em>', mimetype : 'text/html'});

		assert.is(fd.get('secret'), '666');
		assert.is(fd.get('foo'), 'oof');
		assert.is(fd.get('boo'), '1');
		assert.deepEqual(fd.getAll('boo'), ['1']);
		assert.is(fd.get('far'), '6');
		assert.deepEqual(fd.getAll('far'), ['6']);
		assert.is(fd.get('bar'), '');
		assert.is(fd.get('fooboo'), '12');

        $tf.find('[name="foo"]').val('boom');
        $tf.find('[name="boo"][value="1"]').uncheck();
        $tf.find('[name="boo"][value="2"]').check();
        $tf.find('[name="boo"][value="3"]').check();
        $tf.find('[name="far[]"][value="4"]').check();
        $tf.find('[name="far[]"][value="6"]').check();
        $tf.find('[name="bar"]').val('8');
		$tf.find('[name="fooboo"][value="11"]').check();

		fd = $tf.formDataToFormData(['testfile1', 'testfile2'], {name : 'htmlblobname', content : '<em>IMPORTANT!</em>', mimetype : 'text/html'});
		
		assert.is(fd.get('foo'), 'boom');
		assert.is(fd.get('boo'), '2');
		assert.deepEqual(fd.getAll('boo'), ['2', '3']);
		assert.is(fd.get('far'), '4');
		assert.deepEqual(fd.getAll('far'), ['4', '6']);
		assert.is(fd.get('bar'), '8');
		assert.is(fd.get('fooboo'), '11');
		assert.false(fd.has('testfile1'));
		assert.false(fd.has('testfile2'));
		assert.is(fd.get('htmlblobname').type, 'text/html');
	});
});
