'use strict';

// Extend MouseEvent
MouseEvent.prototype.getX = function() {
    return EduJSGraphics.getMouseCoordinates(this).x;
};

MouseEvent.prototype.getY = function() {
    return EduJSGraphics.getMouseCoordinates(this).y;
};

if (typeof TouchEvent != 'undefined') {
    TouchEvent.prototype.getX = function() {
        return EduJSGraphics.getTouchCoordinates(this.touches[0]).x;
    };

    TouchEvent.prototype.getY = function() {
        return EduJSGraphics.getTouchCoordinates(this.touches[0]).y;
    };
}

module.exports = {
    Rectangle: require('./rectangle.js'),
    Circle: require('./circle.js'),
    Color: require('./color.js'),
    Grid: require('./grid.js'),
    Line: require('./line.js'),
    Randomizer: require('./randomizer.js'),
    GraphicsEngine: require('./graphics.js'),
};
