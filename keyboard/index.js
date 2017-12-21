'use strict';

var Keyboard = {};

Keyboard = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    ENTER: 13,
    SHIFT: 16,
    SPACE: 32,
    BACKSPACE: 8,
    TAB: 9,
    CTRL: 17,
    ALT: 18,
    CAPS_LOCK: 20,
    LEFT_COMMAND: 91,
    LEFT_WINDOW: 91,
    RIGHT_WINDOW: 92,
    RIGHT_COMMAND: 93,
    SELECT: 93,
};

Keyboard.digit = function(dig) {
    dig = dig % 10; // so the digit is 0-9
    return dig + 48;
};

Keyboard.letter = function(letter) {
    if (letter.length === 0) {
        return null;
    }
    return letter.toUpperCase().charCodeAt(0);
};

Keyboard.nonEditingKeys = [
    Keyboard.LEFT,
    Keyboard.RIGHT,
    Keyboard.UP,
    Keyboard.DOWN,
    Keyboard.CTRL,
    Keyboard.SHIFT,
    Keyboard.ALT,
    Keyboard.CAPS_LOCK,
    Keyboard.LEFT_COMMAND,
    Keyboard.RIGHT_COMMAND,
    Keyboard.SELECT,
    Keyboard.LEFT_WINDOW,
    Keyboard.RIGHT_WINDOW,
];

Keyboard.isEditingKey = function(keyCode) {
    return Keyboard.nonEditingKeys.indexOf(keyCode) === -1;
};

module.exports = Keyboard;
