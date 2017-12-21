'use strict';

var Shape = require('./shape.js');

function Rectangle(width, height) {
    if (arguments.length !== 2) {
        throw new Error(`Rectangle constructor expected 2 arguments (${arguments.length} given).`);
    }
    if (typeof width !== 'number' || !isFinite(width)) {
        throw new TypeError(
            `First argument to Rectangle constructor must be a number (${typeof width} given).`
        );
    }
    if (typeof height !== 'number' || !isFinite(height)) {
        throw new TypeError(
            `Second argument to Rectangle constructor must be a number (${typeof height} given).`
        );
    }

    // invoke superclass constructor to add class attributes
    Shape.call(this);
    this.width = width;
    this.height = height;
    this.type = 'Rectangle';
}

Rectangle.prototype = new Shape();
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.draw = function(graphicsEngine) {
    var context = graphicsEngine.getContext();

    context.save();
    context.fillStyle = this.color.toString();

    if (this.hasBorder) {
        context.lineWidth = this.lineWidth;
        context.strokeStyle = this.stroke.toString();
    }

    context.beginPath();
    context.translate(this.x + this.width / 2, this.y + this.height / 2);
    context.rotate(this.rotation);
    // Note: after transforming [0,0] is visually [x,y]
    // so the rect needs to be offset accordingly when drawn
    context.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    context.closePath();

    if (this.hasBorder) {
        context.stroke();
    }

    context.fill();
    context.restore();
};

Rectangle.prototype.containsPoint = function(x, y) {
    return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
};

Rectangle.prototype.getWidth = function() {
    return this.width;
};

Rectangle.prototype.getHeight = function() {
    return this.height;
};

module.exports = Rectangle;
