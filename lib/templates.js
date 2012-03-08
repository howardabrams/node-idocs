var fs         = require('fs');
var path       = require('path');
var handlebars = require('handlebars');

exports.page = get('/../templates/page.html');
exports.toc  = get('/../templates/toc.html');

/**
 * Read and compile a template page referenced by filename.
 * 
 * @param file The name of the file to read
 * @returns    A Handlebar template object
 */
function get ( file ) {
    return handlebars.compile( 
            fs.readFileSync ( path.join(__dirname, file), 'utf8') );
}
exports.get = get;