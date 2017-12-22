'use strict';

var color = require('../color/index.js');

var DEGREES = 0;
var RADIANS = 1;

function Shape() {
    this.x = 0;
    this.y = 0;
    this.color = color.black;
    this.stroke = '#000000';
    this.type = 'Shape';
    this.lineWidth = 1;
    this.filled = true;
    this.hasBorder = false;
    this.rotation = 0;
}

Shape.prototype.setIsFilled = function(isFilled) {
    this.filled = isFilled;
};

Shape.prototype.setHasBorder = function(hasBorder) {
    this.hasBorder = hasBorder;
};

Shape.prototype.setPosition = function(x, y) {
    this.x = x;
    this.y = y;
};

Shape.prototype.setRotation = function(degrees, unit) {
    if (!unit) unit = DEGREES;
    if (unit === DEGREES) this.rotation = degrees * Math.PI / 180;
    else this.rotation = degrees;
};

Shape.prototype.rotate = function(degrees, unit) {
    if (!unit) unit = DEGREES;
    if (unit === DEGREES) this.rotation += degrees * Math.PI / 180;
    else this.rotation += degrees;
};

Shape.prototype.setColor = function(color) {
    this.color = color;
};

Shape.prototype.setBorderColor = function(color) {
    this.stroke = color;
    this.hasBorder = true;
};

Shape.prototype.setBorderWidth = function(width) {
    this.lineWidth = width;
    this.hasBorder = true;
};

Shape.prototype.move = function(dx, dy) {
    this.x += dx;
    this.y += dy;
};

Shape.prototype.draw = function() {};

Shape.prototype.containsPoint = function(x, y) {
    return false;
};

module.exports = Shape;
