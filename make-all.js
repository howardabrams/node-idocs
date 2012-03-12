

var idocs = require('./app.js');
idocs.generate({
    output: "public/docs",
    exclude: [ 'make-all.js', 'node_modules', 'templates', 'test' ]
});
