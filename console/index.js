'use strict';

var $ = require('jquery');

/**
 * @constructor
 */
function EduJSConsole(selector) {
    this.consoleSelector = selector;
}

/**
 * Check if a DOM element with the provided selector exists.
 * @returns {boolean}
 */
EduJSConsole.prototype.exists = function() {
    return $.find(this.consoleSelector).length;
};

/**
 * Gets the text output from the console.
 * @returns {string}
 */
EduJSConsole.prototype.getOutput = function() {
    return $(this.consoleSelector).text();
};

/**
 * Removes all text from the console.
 */
EduJSConsole.prototype.clear = function() {
    $(this.consoleSelector).text('');
};

EduJSConsole.prototype.scrollToBottom = function() {
    if (this.exists()) {
        var console = $(this.consoleSelector);
        console.scrollTop(console.scrollHeight);
    }
};

// TODO figure out how this works.
// it's mirroring readLinePrivate
EduJSConsole.prototype.readInput = function(promptStr, parser) {
    var input = prompt(promptStr);
    return parser(input);
};

EduJSConsole.prototype.println = function(output) {
    if (!this.exists()) {
        window.console.log(output);
    } else {
        var console = $(this.consoleSelector);
        console.append(output + '\n');
        this.scrollToBottom();
    }
};

EduJSConsole.prototype.readBoolean = function(promptStr) {
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

EduJSConsole.prototype.readInt = function(promptStr) {
    if (arguments.length !== 1) {
        throw new Error('readInt takes one argument.');
    }
    return this.readInput(promptStr, parseInt);
};

EduJSConsole.prototype.readFloat = function(promptStr) {
    if (arguments.length !== 1) {
        throw new Error('readFloat takes one argument.');
    }
    return this.readInput(promptStr, parseFloat);
};

module.exports = {
    EduJSConsole: EduJSConsole,
};
