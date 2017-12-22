'use strict';

var $ = require('jquery');

/**
 * @constructor
 */
function Console(selector) {
    this.consoleSelector = selector;
}

/**
 * Check if a DOM element with the provided selector exists.
 * @returns {boolean}
 */
Console.prototype.exists = function() {
    return $.find(this.consoleSelector).length;
};

/**
 * Gets the text output from the console.
 * @returns {string}
 */
Console.prototype.getOutput = function() {
    return $(this.consoleSelector).text();
};

/**
 * Removes all text from the console.
 */
Console.prototype.clear = function() {
    $(this.consoleSelector).text('');
};

Console.prototype.scrollToBottom = function() {
    if (this.exists()) {
        var console = $(this.consoleSelector);
        console.scrollTop(console.scrollHeight);
    }
};

// TODO figure out how this works.
// it's mirroring readLinePrivate
Console.prototype.readInput = function(promptStr, parser) {
    var input = prompt(promptStr);
    return parser(input);
};

Console.prototype.println = function(output) {
    if (!this.exists()) {
        window.console.log(output);
    } else {
        var console = $(this.consoleSelector);
        console.append(output + '\n');
        this.scrollToBottom();
    }
};

Console.prototype.readBoolean = function(promptStr) {
    if (arguments.length !== 1) {
        throw new Error('readBoolean takes one argument.');
    }
    return this.readInput(promptStr, function(input) {
        input = input.toLowerCase();
        if (input === null) {
            return null;
        }
        if (input === 'true' || input === 'yes') {
            return true;
        } else if (input === 'false' || x === 'no') {
            return false;
        }
        return null;
    });
};

Console.prototype.readInt = function(promptStr) {
    if (arguments.length !== 1) {
        throw new Error('readInt takes one argument.');
    }
    return this.readInput(promptStr, parseInt);
};

Console.prototype.readFloat = function(promptStr) {
    if (arguments.length !== 1) {
        throw new Error('readFloat takes one argument.');
    }
    return this.readInput(promptStr, parseFloat);
};

module.exports = Console;
