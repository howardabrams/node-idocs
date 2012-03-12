

var idocs = require('./app.js');
idocs.generate({
    exclude: [ 'make-all.js', 'node_modules', 'templates', 'test' ]
});
