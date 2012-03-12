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

/**
 * Primary interface to this module.
 * 
 * Given the collection of `options`, this function generates all the 
 * documentation for a project.
 * 
 * ### Options:
 * 
 *   - `include`- An array of files and directories to look for `*.js` script files.
 *   - `exclude`- An array of files and directories to exclude from the list of included files.
 *   - `output`- A directory where the generated HTML files should be written.
 *   - `pagetemplate`- A Handlebar template to use for each source file
 *   - `toctemplate`- A Handlebar template to use for creating a list of all source files.
 *   
 * @param {Object} options A collection of named parameters
 * @api public
 */

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
    
    mkdirs( options.output );
    
    for (var f in files) {
        var file = files[f];
        var outputFile = path.join ( options.output, 
                path.basename( file, '.js' ) + '.html' );
        console.log("Processing Script:", file, "->", outputFile);
        generateFile(file, options.pagetemplate, outputFile);
    }
}
exports.generate = generate;

/**
 * Combines a *template* with the model (read by parsing the `file`) and writes
 * out to a given `output` file.
 * 
 * @param {String} file name of the JavaScript file to read and parse
 * @param {Object} template the Handebar template instance
 * @param {String} output name of the HTML file to write the results
 */
var generateFile = function(file, template, output) {
    var model = getFileGuts(file);

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
    
    try {
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
                if ( tag.type === 'returns' || tag.type === 'return') {
                    // console.log("Returns", JSON.stringify(tag));
                    fun.returns = tag;
                }
            }
        }
        model.functions = functions;
    }
    catch (err) {
        console.log("Can not process %s- %s", file, err);
    }
    return model;
}

/**
 * Creates the complete directory including parents, similar to the `mkdir -p`
 * shell command.
 * 
 * The directory created is in the `parent` directory, which should
 * probably be the `__dirname` value.
 * 
 * **Note:** If the directory can not be created (for instance, if it already
 * exists), then the error is silently ignored. This will probably caused us
 * problems.
 * 
 * @param {String} file   The pathname to create, e.g. `public/docs` 
 */
function mkdirs ( file ) {
    // console.log(file);
    if ( file === '/' || file === '.' ) {
        return;
    }
    mkdirs ( path.dirname(file) );
    
    try {
        fs.mkdirSync( file );
    }
    catch (e) {
        if (e.code !== 'EEXIST') {
            console.warn(file, JSON.stringify(e) );
        }
    }
}