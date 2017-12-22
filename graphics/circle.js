'use strict';

var Shape = require('./shape.js');
var color = require('../color/index.js');

function Circle(radius) {
    if (arguments.length !== 1) {
        throw new Error(`Circle constructor expected 1 argument (${arguments.length} given).`);
    }
    if (typeof radius !== 'number' || !isFinite(radius)) {
        throw new TypeError(
            `First argument to Circle constructor must be a number (${typeof radius} given).`
        );
    }

    Shape.call(this);
    this.radius = Math.max(0, radius);
    this.lineWidth = 3;
    this.type = 'Circle';
}

Circle.prototype = new Shape();
Circle.prototype.constructor = Circle;

Circle.prototype.draw = function(graphicsEngine) {
    var context = graphicsEngine.getContext();
    context.beginPath();

    if (this.hasBorder) {
        context.strokeStyle = this.stroke.toString();
        context.lineWidth = this.lineWidth;
    }
    context.fillStyle = this.color.toString();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    context.closePath();

    if (this.hasBorder) {
        context.stroke();
    }
    context.fill();
};

Circle.prototype.getRadius = function() {
    return this.radius;
};

Circle.prototype.getHeight = function() {
    return this.radius * 2;
};

Circle.prototype.getWidth = function() {
    return this.radius * 2;
};

Circle.prototype.setRadius = function(radius) {
    if (arguments.length !== 1) {
        throw new Error(`setRadius expected 1 argument (${arguments.length} given).`);
    }
    if (typeof width !== 'number' || !isFinite(width)) {
        throw new TypeError(
            `First argument to setRadius must be a number (${typeof width} given).`
        );
    }

    this.radius = Math.max(0, radius);
};

Circle.prototype.containsPoint = function(x, y) {
    var circleEdge = this.radius;
    if (this.hasBorder) {
        circleEdge += this.lineWidth;
    }
    var dist = Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2));
    return dist < circleEdge;
};

module.exports = Circle;
