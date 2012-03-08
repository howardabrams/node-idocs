/**
 * Can we reference `file2` through one of these links:
 * 
 *   - Parens: [file2](file2.js)
 *   - Brackets: [file2][file2.js]
 *   - Single Brackets: [file2.js]
 *   - Double Brackets: [[file2.js]]
 *   - See: @see file2.js
 *
 * We probably need to set up a special model.
 */

var fs = require('fs');

/**
 * Adds *two numbers* together and returns the results.
 * 
 * *Note:* This doesn't sum multiple numbers, but it probably
 * should.
 *
 * @param {Number} a Some number to add.
 * @param {Number} b Another number to add.
 * @returns {Number} the value of adding `a` to `b`.
 * @see #sub
 */

function add(a, b) {
    return a+b;
}

/**
 * Subtracts the second number from the first number.
 * 
 * @param {Number} a Some number to begin.
 * @param {Number} b Another number to subtract from `a`.
 * @returns {Number} the value of subtracting `b` from `a`.
 * @see #add
 */

function sub(a, b) {
    return a-b;
}
