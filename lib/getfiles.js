/**
 * Function for collecting all of the files that we will need to use when
 * generating the documentation.
 */

var fs   = require('fs');
var path = require('path');
var util = require('util');

/**
 * Returns an array of file pathnames for directories listed in `include`.
 * 
 * Keep in mind that you can remove particular files by including them in
 * the `exclude` array.
 * 
 * @param include {Array} list of directories to search. Defaults to `.`
 * @param exclude {Array} list of filenames and regular expressions.
 * @returns {Array} list of full pathnames of matching files.
 */
var getall = function(include, exclude) {
    if ( ! include ) {
        include = '.';
    }
    return collectFiles(/\.js$/, include, exclude);
};
exports.all = getall;

/**
 * Recursively called function for matching filenames that adhere to a 
 * particular pattern in a given directory.
 *
 * @param pattern {String} A regular expression used on each filename, e.g. /\.js$/
 * @param include {Array} list of directories to search. Defaults to `.`
 * @param exclude {Array} list of filenames and regular expressions.
 * @param parent {String} A full pathname to a particular directory
 * @returns {Array} list of full pathnames matching files in a given directory.
 */

function collectFiles(pattern, include, exclude, parent) {
    var results = [];

    if ( include ) {
        if ( ! util.isArray(include) ) {
            include = [ include ];
        }
        
        include.forEach( function(p) {
            var file  = p;
            if (parent) {
                file = path.join(parent, p);
            }
                        
            var stats = fs.statSync(file);
            if (stats.isDirectory()) {
                if ( ! excluded(file, exclude) ) {
                    // console.log("Read directory: ", file);
                    var files = fs.readdirSync(file);
                    results = results.concat( 
                            collectFiles(pattern, files, exclude, file) );
                }
            }
            else if ( stats.isFile() && pattern.test(file) && 
                    !(excluded(file, exclude))) {
                results.push(file);
            }
        });
    }

    return results;
}

/**
 * Returns `true` if `file` matches any of the entries in `excludes`.
 * 
 * The `excluded` array can contain either strings (which will exact match of 
 * the name of the file), or a regular expression (in `/.../`).
 * 
 * Keep in mind that a regular expressions match the entire path, whereas
 * strings can only match the filename. Keep in mind, excluding a directory
 * by its filename excludes all of the files inside it.
 *
 * @param file     The name of the file to match
 * @param excludes The array of matches
 * @returns        `true` if the file matches any thing in the array.
 */
function excluded(file, excludes) {

    if ( excludes ) {
        if ( !util.isArray(excludes) ) {
            excludes = [ excludes ];
        }
        
        for (var i = 0; i < excludes.length; i++) {
            var e = excludes[i];
            // console.log("Comparing: %s and %s", e, file);

            if ( util.isRegExp(e) ) {
                if ( e.test(file) ) {
                    // console.log("%s.test(%s) is true", e, file);
                    return true;
                }
            }
            else {
                if ( excludes[i] === path.basename(file) ) {
                    // console.log("%s === %s is true", e, file);
                    return true;
                }
            }
        }
    }
    return false;
}
exports.excluded = excluded; // Only used to help test this module.


/**
 * Takes the array of filenames retrieved by `getall`, and returns a hashmap
 * of entries where each key is the basename, e.g. `lib/blah.js` is `blah`.
 * 
 * @param {Array} a An array of full filenames
 * @returns {Object} map where *key* is the basename and *value* is fullname. 
 */
function arrayToMap(a) {
    var results = {};
    for ( var i = 0; i < a.length; i++ ) {
        var basename = path.basename(a[i], '.js');
        results[basename] = a[i];
        var filename = path.basename(a[i]);
        results[filename] = a[i];
    }
    return results;
}
exports.arrayToMap = arrayToMap;