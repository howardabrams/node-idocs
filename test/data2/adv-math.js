/**
 * Can we reference `file1` through one of these links:
 * 
 *   - Parens: [file1](file1.js)
 *   - Brackets: [file1][file1.js]
 *   - Single Brackets: [file1.js]
 *   - Double Brackets: [[file1.js]]
 *   - See: @see file1.js
 *
 * We probably need to set up a special model.
 */

var fs = require('fs');

/**
 * Computes the factorial of a number, e.g. `5!` == `120`
 *
 * @param {Number} n Number to compute
 * @returns {Number} the factorial of `n`
 */

function factorial(n) {
    if (n < 2) {
        return 1;
    }
    return n * factorial(n);
}