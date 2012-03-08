var assert = require('assert');

var app = require('../app');

suite('app', function() {
    suite('#generate()', function() {

        test('basic', function() {
            app.generate('test/data2', null, 'test/docs');
        });
    });
});