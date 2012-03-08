/**
 * We can run this program to generate the HTML docs for the API.
 *
 * Algorithm includes:
 *   - Reading the router.js and getting the list of files and functions.
 */

var dox  = require('dox');
var fs   = require('fs');
var path = require('path');

var getfiles  = require('./lib/getfiles');
var templates = require('./lib/templates');


function generate ( options ) {
    if ( ! options ) {
        options = {};
    }
    if ( ! options.include ) {
        options.include = '.';
    }
    if ( ! options.output ) {
        options.output = "public/docs";
    }
    if ( ! options.exclude ) {
        options.exclude = "node_modules";
    }

    if ( options.pagetemplate ) {
        options.pagetemplate = templates.get(options.pagetemplate);
    }
    else {
        options.pagetemplate = templates.page;
    }
    
    if ( options.toctemplate ) {
        options.toctemplate = templates.get(options.toctemplate);
    }
    else {
        options.toctemplate = templates.toc;
    }

    var files = getfiles.all( options.include, options.exclude );
    // var links = getfiles.arrayToMap(files);
    
    for (var f in files) {
        var file = files[f];
        var outputFile = path.join ( __dirname, options.output, 
                path.basename( file, '.js' ) + '.html' );
        console.log("Processing Script:", file, "->", outputFile);
        // generateFile(file, options.pagetemplate, outputFile);
    }
}
exports.generate = generate;

/**
 * Combines a *template* with the model (read by parsing the `file`) and writes
 * out to a given `output` file.
 * 
 * @param file {String} name of the JavaScript file to read and parse
 * @param template {Object} the Handebar template instance
 * @param output {String} name of the HTML file to write the results
 */
var generateFile = function(file, template, output) {
    var model = getFileGuts(file);
    /*
        console.log('---------------------------------------');
        console.log( model );
        console.log('---------------------------------------');
        console.log( template(model) );
     */
    fs.writeFileSync(output, template(model) );
};

/**
 * Reads and parses the file and returns a *model* (JSON object) of its contents.
 * 
 * The parsing begins with the `dox`project, but manipulates the results to
 * make the template a little easier to generate. Including:
 * 
 *   - `title` - The name of the script without path and the `.js` extension
 *   - `file` - The name of the script without a path.
 *   - `filename` - The path and name of the script
 *   - `head` - An initial comment at the beginning of the file before `requires`
 *   - `functions` - An array of the functions in the file. Each may have:
 *      - `params` - An array of the function parameters
 *      - `returns` - The return value
 *      
 * @param {String} file name of the file to read and parse 
 * @returns {Object} A JavaScript object
 */
function getFileGuts ( file ) {
    var comments = fs.readFileSync ( file, 'utf8' );
    
    var model = {
        title: path.basename(file, '.js'),
        file:  path.basename(file),
        filename: file
    };
    var functions = dox.parseComments(comments);
    if ( functions && functions[0] && functions[0].ctx.type == 'declaration' ) {
        model.head = functions.shift();
    }
    
    // The template gets a little complicated in the way the 'tags' section
    // works, so we are going to group them together in order to make our
    // templates simpler:
    
    for ( var f in functions ) {
        var fun = functions[f];
        for ( var t in fun.tags ) {
            var tag = fun.tags[t];
            if ( tag.type === 'param' ) {
                if ( ! fun.params ) {
                    fun.params = [];
                }
                fun.params.push(tag);
            }
            if ( tag.type === 'returns' ) {
                fun.returns = tag;
            }
        }
    }
    model.functions = functions;
    
    return model;
}

generate();