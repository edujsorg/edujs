'use strict';

var Shape = require('./shape.js');

/**
 * @class Line
 * @augments Shape
 * @param {number} x1 - x coordinate of starting point of line.
 * @param {number} y1 - y coordinate of starting point of line.
 * @param {number} x2 - x coordinate of end point of line.
 * @param {number} y2 - y coordinate of end point of line.
 */
function Line(x1, y1, x2, y2) {
    if (arguments.length !== 4) {
        throw new Error(`Line constructor expected 4 arguments (${arguments.length} given).`);
    }
    if (
        typeof x1 !== 'number' ||
        typeof y1 !== 'number' ||
        typeof x2 !== 'number' ||
        typeof y2 !== 'number'
    ) {
        throw new TypeError(`Arguments to Line constructor must be numbers.`);
    }
    if (!isFinite(x1) || !isFinite(y1) || !isFinite(x2) || !isFinite(y2)) {
        throw new TypeError(`Arguments to Line constructor must be finite.`);
    }
    Shape.call(this);
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.lineWidth = 2;
    this.type = 'Line';
}

Line.prototype = new Shape();
Line.prototype.constructor = Line;

/**
 * Sets the color of a line.
 *
 * @param {Color} color - Sets the color of the line.
 */
Line.prototype.setColor = function(color) {
    if (arguments.length !== 1) {
        throw new Error(`setColor expected 1 argument (${arguments.length} given).`);
    }
    if (color === undefined) {
        throw new TypeError('Invalid color');
    }
    this.stroke = color;
};

/**
 * Gets the color of a line.
 *
 * @returns {Color} Color of the line.
 */
Line.prototype.getColor = function() {
    return this.stroke;
};

Line.prototype.draw = function(graphicsInstance) {
    var context = graphicsInstance.getContext();
    // http://stackoverflow.com/questions/17125632/html5-canvas-rotate-object-without-moving-coordinates
    context.save();
    context.fillStyle = this.color.toString();
    context.beginPath();
    context.strokeStyle = this.stroke.toString();
    context.lineWidth = this.lineWidth;
    var rotatedPoints = getRotatedPoints(this.x1, this.y1, this.x2, this.y2, this.rotation);
    context.moveTo(rotatedPoints[0], rotatedPoints[1]);
    context.lineTo(rotatedPoints[2], rotatedPoints[3]);
    context.closePath();
    context.stroke();
    context.restore();
};

/**
 * Gets the new points based on their rotated values.
 *
 */
/**
 * Gets the new points based on their rotated values.
 *
 * @param  {number} x1       X coordinate of start point
 * @param  {number} y1       Y coordinate of start point
 * @param  {number} x2       X coordinate of end point
 * @param  {number} y2       Y Coordinate of end point
 * @param  {number} rotation radians rotated (Expected in radians)
 * @return {array}          List of coordinates of both points.
 */
var getRotatedPoints = function(x1, y1, x2, y2, rotation) {
    var midX = (x1 + x2) / 2;
    var midY = (y1 + y2) / 2;
    var sinAngle = Math.sin(rotation);
    var cosAngle = Math.cos(rotation);
    var newX;
    var newY;
    // Rotate point 1
    x1 -= midX;
    y1 -= midY;
    newX = x1 * cosAngle - y1 * sinAngle;
    newY = x1 * sinAngle + y1 * cosAngle;
    x1 = newX + midX;
    y1 = newY + midY;

    // Rotate point 2
    x2 -= midX;
    y2 -= midY;
    newX = x2 * cosAngle - y2 * sinAngle;
    newY = x2 * sinAngle + y2 * cosAngle;
    x2 = newX + midX;
    y2 = newY + midY;

    return [x1, y1, x2, y2];
};

/**
 * Checks if a given point is contained in the line.
 * Will always be false, just written as an override.
 *
 * @param {number} x - x coordinate of the point being tested.
 * @param {number} y - y coordinate of the point being tested.
 */
Line.prototype.containsPoint = function(x, y) {
    return false;
};

/**
 * Returns the width of the line.
 *
 * @returns {number} The width of the line.
 */
Line.prototype.getWidth = function() {
    return this.width;
};

/**
 * Returns the height of the line.
 *
 * @returns {number} The width of the line.
 */
Line.prototype.getHeight = function() {
    return this.height;
};

/**
 * Sets the width of the line.
 *
 * @param {number} width - The resulting width of the line.
 */
Line.prototype.setLineWidth = function(width) {
    if (arguments.length !== 1) {
        throw new Error(`setLineWidth expected 1 argument (${arguments.length} given).`);
    }
    if (typeof width !== 'number' || !isFinite(width)) {
        throw new TypeError(`Argument to setLineWidth must be a number (${typeof width} given).`);
    }
    this.lineWidth = width;
};

/**
 * Sets the *starting* point of the line.
 *
 * @param {number} x - The x coordinate of the resulting ending point.
 * @param {number} y - The y coordinate of the resulting ending point.
 */
Line.prototype.setStartpoint = function(x, y) {
    if (arguments.length !== 1) {
        throw new Error(`setStartpoint expected 2 arguments (${arguments.length} given).`);
    }
    if (typeof x !== 'number' || !isFinite(x)) {
        throw new TypeError(
            `First argument to setStartpoint must be a number (${typeof x} given).`
        );
    }
    if (typeof y !== 'number' || !isFinite(y)) {
        throw new TypeError(
            `Second argument to setStartpoint must be a number (${typeof y} given).`
        );
    }

    this.setPosition(x, y);
};

/**
 * Sets the *starting* point of the line.
 *
 * @param {number} x - The x coordinate of the resulting starting point.
 * @param {number} y - The y coordinate of the resulting starting point.
 */
Line.prototype.setPosition = function(x, y) {
    if (arguments.length !== 2) {
        throw new Error(`setPosition expected 2 arguments (${arguments.length} given).`);
    }
    if (typeof x !== 'number' || !isFinite(x)) {
        throw new TypeError(`First argument to setPosition must be a number (${typeof x} given).`);
    }
    if (typeof y !== 'number' || !isFinite(y)) {
        throw new TypeError(`Second argument to setPosition must be a number (${typeof y} given).`);
    }
    this.x1 = x;
    this.y1 = y;
};

/**
 * Sets the *ending* point of the line.
 *
 * @param {number} x - The x coordinate of the resulting ending point.
 * @param {number} y - The y coordinate of the resulting ending point.
 */
Line.prototype.setEndpoint = function(x, y) {
    if (arguments.length !== 2) {
        throw new Error(`setEndpoint expected 2 arguments (${arguments.length} given).`);
    }
    if (typeof x !== 'number' || !isFinite(x)) {
        throw new TypeError(`First argument to setEndpoint must be a number (${typeof x} given).`);
    }
    if (typeof y !== 'number' || !isFinite(y)) {
        throw new TypeError(`Second argument to setEndpoint must be a number (${typeof y} given).`);
    }
    this.x2 = x;
    this.y2 = y;
};

/**
 * Moves the entire line.
 *
 * @param {number} dx - The change in x coordinate of both starting and ending points.
 * @param {number} dy - The change in y coordinate of both starting and ending points.
 */
Line.prototype.move = function(dx, dy) {
    if (arguments.length !== 2) {
        throw new Error(
            'You should pass exactly 2 arguments to <span ' + 'class="code">move</span>'
        );
    }
    if (typeof dx !== 'number' || !isFinite(dx)) {
        throw new TypeError(`First argument to setEndpoint must be a number (${typeof dx} given).`);
    }
    if (typeof dy !== 'number' || !isFinite(dy)) {
        throw new TypeError(`First argument to setEndpoint must be a number (${typeof dy} given).`);
    }
    this.x1 += dx;
    this.y1 += dy;
    this.x2 += dx;
    this.y2 += dy;
};

/**
 * Gets the x coordinate of the Line's start point.
 *
 * @returns {number} The x coordinate of the Line's start point.
 */
Line.prototype.getX = function() {
    return this.x1;
};

/**
 * Gets the y coordinate of the Line's start point.
 *
 * @returns {number} The y coordinate of the Line's start point.
 */
Line.prototype.getY = function() {
    return this.y1;
};

/**
 * Gets the x coordinate of the Line's start point.
 *
 * @returns {number} The x coordinate of the Line's start point.
 */
Line.prototype.getStartX = function() {
    return this.x1;
};

/**
 * Gets the y coordinate of the Line's start point.
 *
 * @returns {number} The y coordinate of the Line's start point.
 */
Line.prototype.getStartY = function() {
    return this.y1;
};

/**
 * Gets the x coordinate of the Line's end point.
 *
 * @returns {number} The x coordinate of the Line's end point.
 */
Line.prototype.getEndX = function() {
    return this.x2;
};

/**
 * Gets the y coordinate of the Line's end point.
 *
 * @returns {number} The y coordinate of the Line's end point.
 */
Line.prototype.getEndY = function() {
    return this.y2;
};

module.exports = Line;
