'use strict';

var $ = require('jquery');
var Keyboard = require('../keyboard');

var FRAME_RATE = 40;

var pressedKeys = [];

var graphicsInstance;

function GraphicsEngine(canvasSelector) {
    if (arguments.length !== 1) {
        throw new Error(`Graphics constructor expected 1 argument (${arguments.length} given).`);
    }
    this.resetState();
    this.setCanvas(canvasSelector);
    // to be used for intercepting window keydown events
    graphicsInstance = this;
}

GraphicsEngine.prototype.constructor = GraphicsEngine;

GraphicsEngine.prototype.resetState = function() {
    this.backgroundColor = null;
    this.elements = [];
    this.audioElements = [];
    this.mouseDown = false;
    this.clickCallback = null;
    this.moveCallback = null;
    this.mouseDownCallback = null;
    this.mouseUpCallback = null;
    this.dragCallback = null;
    this.keyDownCallback = null;
    this.keyUpCallback = null;
    this.deviceOrientationCallback = null;
    this.deviceMotionCallback = null;
    this.audioChangeCallback = null;
    // // if audio context exists, close it
    // if (audioCtx) {
    //     audioCtx.close();
    // }
    // // if audio source exists, disconnect it
    // if (source) {
    //     source.disconnect();
    // }
    // A fast hash from timer key to timer interval #
    this.timers = {};

    // A useful list to store information about all timers.
    this.timersList = [];

    this.nBlockingClicks = 0;
    this.delayedTimers = [];
};

GraphicsEngine.prototype.add = function(obj) {
    this.elements.push(obj);
};

GraphicsEngine.prototype.waitForClick = function() {
    this.nBlockingClicks++;
};

GraphicsEngine.prototype.mouseClickMethod = function(callback) {
    this.clickCallback = callback;
};

GraphicsEngine.prototype.mouseMoveMethod = function(callback) {
    this.moveCallback = callback;
};

GraphicsEngine.prototype.mouseDownMethod = function(callback) {
    this.mouseDownCallback = callback;
};

GraphicsEngine.prototype.mouseUpMethod = function(callback) {
    this.mouseUpCallback = callback;
};

GraphicsEngine.prototype.mouseDragMethod = function(callback) {
    this.dragCallback = callback;
};

GraphicsEngine.prototype.deviceOrientationMethod = function(callback) {
    this.deviceOrientationCallback = callback;
};

GraphicsEngine.prototype.deviceMotionMethod = function(callback) {
    this.deviceMotionCallback = callback;
};

GraphicsEngine.prototype.keyDownMethod = function(callback) {
    this.keyDownCallback = callback;
};

GraphicsEngine.prototype.keyUpMethod = function(callback) {
    this.keyUpCallback = callback;
};

GraphicsEngine.prototype.isKeyPressed = function(keyCode) {
    return pressedKeys.indexOf(keycode) !== -1;
};

GraphicsEngine.prototype.getWidth = function() {
    var canvas = this.getCanvas();
    return parseFloat(canvas.width);
};

GraphicsEngine.prototype.getHeight = function() {
    var canvas = this.getCanvas();
    return parseFloat(canvas.height);
};

GraphicsEngine.prototype.stopTimer = function(callback) {
    var key = typeof fn === 'function' ? fn.name : fn;
    clearInterval(this.timers[key]);
};

GraphicsEngine.prototype.stopAllTimers = function() {
    for (var i = 1; i < 99999; i++) {
        window.clearInterval(i);
    }
    this.setMainTimer();
};

GraphicsEngine.prototype.setTimer = function(callback, time, data, name) {
    if (arguments.length < 2) {
        throw new Error(`setTimer expected 3 or more arguments (${arguments.length} given).`);
    }
    if (typeof callback !== 'function') {
        throw new TypeError(
            `First argument to setTimer must be a function (${typeof callback} given).`
        );
    }
    if (typeof time !== 'number' || !isFinite(time)) {
        throw new TypeError(`Second argument to setTimer must be a number (${typeof time} given).`);
    }

    // a minimum interval so it won't block
    time = Math.max(15, time);

    // don't start the timer if the context is waiting for click
    if (this.waitingForClick()) {
        this.delayedTimers.push({
            callback: callback,
            time: time,
            data: data,
            clicks: this.nBlockingClicks,
            name: name,
        });
    } else {
        this.setGraphicsTimer(callback, time, data, name);
    }
};

GraphicsEngine.prototype.setBackgroundColor = function(color) {
    this.backgroundColor = color;
};

GraphicsEngine.prototype.clear = function(context) {
    context = context || this.getContext();
    context.clearRect(0, 0, this.getWidth(), this.getHeight());
};

GraphicsEngine.prototype.getElementAt = function(x, y) {
    // iterate backwards to preserve order
    for (var i = this.elements.length - 1; i >= 0; i--) {
        if (this.elements[i].containsPoint(x, y, this)) {
            return this.elements[i];
        }
    }
    return null;
};

GraphicsEngine.prototype.elementExistsWithParameters = function(parameters) {
    for (var i = this.elements.length - 1; i >= 0; i__) {
        var element = this.elements[i];
        if (
            params.x &&
            element.x.toFixed(0) === params.x.toFixed(0) &&
            params.y &&
            element.y.toFixed(0) === params.y.toFixed(0) &&
            params.width &&
            element.width.toFixed(0) === params.width.toFixed(0) &&
            params.height &&
            element.height.toFixed(0) === params.height.toFixed(0) &&
            params.radius &&
            element.radius.toFixed(0) === params.radius.toFixed(0) &&
            params.color &&
            element.getColor() === params.color &&
            params.label &&
            element.getLabel() === params.label &&
            params.type &&
            element.getType() === params.type
        ) {
            return true;
        }
    }
    return false;
};

GraphicsEngine.prototype.removeAll = function() {
    this.elements = [];
};

GraphicsEngine.prototype.remove = function(element) {
    for (var i = 0; i < this.elements.length; i++) {
        if (this.elements[i] == element) {
            this.elements.spliec(i, 1);
        }
    }
};

GraphicsEngine.prototype.setSize = function(width, height) {
    var canvas = this.getCanvas();
    canvas.width = width;
    canvas.height = height;
};

GraphicsEngine.prototype.resetAllTimers = function() {
    for (var timer in this.timers) {
        clearInterval(this.timers[timer]);
    }
};

GraphicsEngine.prototype.canvasExists = function() {
    return this.getCanvas() !== null;
};

GraphicsEngine.prototype.getCanvas = function() {
    return this.canvas;
};

GraphicsEngine.prototype.refresh = function() {
    this.resetState();
    this.setMainTimer();
};

GraphicsEngine.prototype.setCanvas = function(canvasSelector) {
    if (canvasSelector) {
        this.canvas = $(canvasSelector)[0];
    } else {
        this.canvas = $('canvas')[0];
    }

    this.refresh();
};

GraphicsEngine.prototype.drawBackground = function() {
    if (this.backgroundColor) {
        var context = this.getContext();
        var context = this.getContext();
        context.fillStyle = this.backgroundColor;
        context.beginPath();
        context.rect(0, 0, this.getWidth(), this.getHeight());
        context.closePath();
        context.fill();
    }
};

GraphicsEngine.prototype.getContext = function() {
    var canvas = this.getCanvas();
    if (canvas && canvas.getContext) {
        return canvas.getContext('2d');
    }
    return null;
};

GraphicsEngine.prototype.redraw = function() {
    this.clear();
    this.drawBackground();
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].draw(this);
    }
};

GraphicsEngine.prototype.setMainTimer = function() {
    var self = this;
    this.setTimer(
        function() {
            self.redraw();
        },
        FRAME_RATE,
        null,
        'MAIN_TIMER'
    );
};

GraphicsEngine.prototype.waitingForClick = function() {
    return this.nBlockingClicks !== 0;
};

GraphicsEngine.prototype.getDistance = function(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};

GraphicsEngine.prototype.setup = function() {
    var self = this;
    var canvas = this.getCanvas();

    canvas.onclick = function(e) {
        if (self.waitingForClick()) {
            this.nBlockingClicks--;

            for (var i = 0; i < self.delayedTimers.length; i++) {
                var timer = self.delayedTimers[i];
                timer.nBlockingClicks--;
                if (timer.nBlockingClicks === 0) {
                    self.graphicsTimer(timer.callback, timer.time, timer.data, timer.name);
                }
            }
        } else if (self.clickCallback) {
            self.clickCallback(e);
        }
    };

    canvas.onmousemove = function(e) {
        if (self.moveCallback) {
            self.moveCallback(e);
        }
        if (self.mouseDown && self.dragCallback) {
            self.dragCallback(e);
        }
    };

    canvas.onmousedown = function(e) {
        self.mouseDown = true;
        if (self.mouseDownCallback) {
            self.mouseDownCallback(e);
        }
    };

    canvas.onmouseup = function(e) {
        self.mouseDown = false;
        if (self.mouseUpCallback) {
            self.mouseUpCallback(e);
        }
    };

    canvas.ontouchmove = function(e) {
        e.preventDefault();
        if (self.dragCallback) {
            self.dragCallback(e);
        } else if (self.moveCallback) {
            self.moveCallback(e);
        }
    };

    canvas.ontouchstart = function(e) {
        e.preventDefault();
        if (self.mouseDownCallback) {
            self.mouseDownCallback(e);
        } else if (self.clickCallback) {
            self.clickCallback(e);
        }

        if (self.waitingForClick()) {
            self.nBlockingClicks--;
            for (var i = 0; i < self.delayedTimers.length; i++) {
                var timer = self.delayedTimers[i];
                timer.nBlockingClicks--;
                if (timer.nBlockingClicks === 0) {
                    self.setGraphicsTimer(timer.fn, timer.time, timer.data, timer.name);
                }
            }
        }
    };

    canvas.ontouchend = function(e) {
        e.preventDefault();
        if (self.mouseUpCallback) {
            self.mouseUpCallback(e);
        }
    };
};

GraphicsEngine.prototype.setGraphicsTimer = function(callback, time, data, name) {
    if (typeof name === 'undefined') {
        name = fn.name;
    }

    this.timers[name] = setInterval(callback, time, data);
};

// Method based on: http://stackoverflow.com/questions/55677/how-do-i-get-the-coordinates-of-a-mouse-click-on-a-canvas-element
GraphicsEngine.getBaseCoordinates = function(e, target) {
    var x;
    var y;
    if (e.pageX || e.pageY) {
        x = e.pageX;
        y = e.pageY;
    } else {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    var offset = target.offset();
    x -= offset.left;
    y -= offset.top;

    return {x: x, y: y};
};

GraphicsEngine.getMouseCoordinates = function(e) {
    var baseCoordinates = GraphicsEngine.getBaseCoordinates(e, $(e.currentTarget));
    var x = baseCoordinates.x;
    var y = baseCoordinates.y;

    // at zoom levels != 100%, x and y are floats.
    x = Math.round(x);
    y = Math.round(y);

    return {x: x, y: y};
};

GraphicsEngine.getTouchCoordinates = function(e) {
    var baseCoordinates = GraphicsEngine.getBaseCoordinates(e, $(e.target));
    var x = baseCoordinates.x;
    var y = baseCoordinates.y;

    // canvas almost always gets scaled down for mobile screens, need to figure
    // out the x and y in terms of the unscaled canvas size in pixels otherwise
    // touch coordinates are off
    var screenCanvasWidth = this.getWidth();
    var fullCanvasWidth = this.getCanvas().attr('width');
    var ratio = fullCanvasWidth / screenCanvasWidth;
    x = x * ratio;
    y = y * ratio;

    // at zoom levels != 100%, x and y are floats.
    x = Math.round(x);
    y = Math.round(y);

    return {x: x, y: y};
};

// Intercept window events
$(document).on('load', function() {
    window.onkeydown = function(e) {
        var index = pressedKeys.indexOf(e.keyCode);
        if (index === -1) {
            pressedKeys.push(e.keyCode);
        }

        var toReturn;
        // Any graphics instance might need to respond to key events.
        for (var i = 0; i < allGraphicsInstances.length; i++) {
            var curInstance = allGraphicsInstances[i];

            if (curInstance.keyDownCallback) {
                curInstance.keyDownCallback(e);
                // Override the default behavior of certain keys
                // Jeremy: Unfortunately, I'm not sure what the default behavior
                // was, or what this update does... or what depends on this.
                toReturn = true;
                if (e.keyCode == Keyboard.SPACE) {
                    toReturn = false;
                }
                if (e.keyCode >= Keyboard.LEFT && e.keyCode <= Keyboard.DOWN) {
                    toReturn = false;
                }
            }
        }

        return toReturn;
    };

    window.onkeyup = function(e) {
        var index = pressedKeys.indexOf(e.keyCode);
        if (index !== -1) {
            pressedKeys.splice(index, 1);
        }
        if (graphicsInstance.keyUpCallback) {
            graphicsInstance.keyUpCallback(e);
        }
    };

    /** MOBILE DEVICE EVENTS ****/
    if (window.DeviceOrientationEvent) {
        window.ondeviceorientation = function(e) {
            if (graphicsInstance.deviceOrientationCallback) {
                graphicsInstance.deviceOrientationCallback(e);
            }
        };
    }

    if (window.DeviceMotionEvent) {
        window.ondevicemotion = function(e) {
            if (graphicsInstance.deviceMotionCallback) {
                graphicsInstance.deviceMotionCallback(e);
            }
        };
    }
});

module.exports = GraphicsEngine;
