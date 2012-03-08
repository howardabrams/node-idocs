var assert = require('assert');

var getfiles = require('../lib/getfiles');

suite('getfiles', function() {
    suite('#getall()', function() {

        test('no exclusions', function() {
            var results = getfiles.all('test/data1');
            // console.log(results);
            assert.equal(4, results.length, "Did not get 4 results");
        });
        test('exclude by filename', function() {
            var results = getfiles.all('test/data1', [ 'shark.js' ]);
            // console.log(results);
            assert.equal(3, results.length, "Did not get 3 results");
        });
        test('exclude by regular expression', function() {
            var results = getfiles.all('test/data1', [ /poo/ ]);
            // console.log(results);
            assert.equal(3, results.length, "Did not get 3 results");
        });
        test('exclude by directory', function() {
            var results = getfiles.all('test/data1', [ 'mammal' ]);
            // console.log(results);
            assert.equal(2, results.length, "Did not get 2 results");
        });
    });

    suite('#excluded()', function() {
        test('fullnames', function() {
            assert.ok(getfiles.excluded('bob', [ 'bob', 'dog' ]));
        });

        test('not in the array', function() {
            assert.ok(!getfiles.excluded('bob', [ 'cat', 'dog' ]));
        });

        test('positive regular expression', function() {
            assert.ok(getfiles.excluded('bob.js', [ 'gunk', /.js$/, 'test' ]));
        });

        test('not in the array', function() {
            assert.ok(!getfiles.excluded('bob.js', [ /bobo+/, /.c$/ ]));
        });

        test('single element array', function() {
            assert.ok(getfiles.excluded('bob.js', /.js$/));
        });

        test('empty array is ok', function() {
            assert.ok(!getfiles.excluded('bob.js', []));
        });

        test('null array is ok', function() {
            assert.ok(!getfiles.excluded('bob.js', null));
        });
    });

    suite('#arrayToMap()', function() {
        test('simple positive', function() {
            var file1 = 'lib/blah.js';
            var name1 = 'blah';
            
            var file2 = 'lib/foobar.js';
            var name2 = 'foobar';
            
            var file3 = 'dog.js';
            var name3 = 'dog';
            
            var file4 = 'a/b/c/d.js';
            var name4 = 'd';
            
            var orig = [ file1, file2, file3, file4 ];
            
            var results = getfiles.arrayToMap(orig);
            // console.log(results);
            
            assert.equal(file1, results[name1] );
            assert.equal(file2, results[name2] );
            assert.equal(file3, results[name3] );
            assert.equal(file4, results[name4] );
        });
    });
});