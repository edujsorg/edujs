'use strict';

var $ = require('jquery');
var Keyboard = require('../keyboard/index.js');

var FRAME_RATE = 40;

var pressedKeys = [];

function Engine(canvasSelector) {
    _resetState.call(this);
    _setCanvas.call(this, canvasSelector);
    _setup.call(this);
    $(document).on('load', _interceptWindowEvents.call(this));
    // to be used for intercepting window keydown events
}

Engine.prototype.constructor = Engine;

Engine.prototype.add = function(obj) {
    this.elements.push(obj);
};

Engine.prototype.waitForClick = function() {
    this.nBlockingClicks++;
};

Engine.prototype.mouseClickMethod = function(callback) {
    this.clickCallback = callback;
};

Engine.prototype.mouseMoveMethod = function(callback) {
    this.moveCallback = callback;
};

Engine.prototype.mouseDownMethod = function(callback) {
    this.mouseDownCallback = callback;
};

Engine.prototype.mouseUpMethod = function(callback) {
    this.mouseUpCallback = callback;
};

Engine.prototype.mouseDragMethod = function(callback) {
    this.dragCallback = callback;
};

Engine.prototype.deviceOrientationMethod = function(callback) {
    this.deviceOrientationCallback = callback;
};

Engine.prototype.deviceMotionMethod = function(callback) {
    this.deviceMotionCallback = callback;
};

Engine.prototype.keyDownMethod = function(callback) {
    this.keyDownCallback = callback;
};

Engine.prototype.keyUpMethod = function(callback) {
    this.keyUpCallback = callback;
};

Engine.prototype.isKeyPressed = function(keyCode) {
    return pressedKeys.indexOf(keycode) !== -1;
};

Engine.prototype.getWidth = function() {
    var canvas = this.canvas;
    return parseFloat(canvas.width);
};

Engine.prototype.getHeight = function() {
    var canvas = this.canvas;
    return parseFloat(canvas.height);
};

Engine.prototype.stopTimer = function(callback) {
    var key = typeof fn === 'function' ? fn.name : fn;
    clearInterval(this.timers[key]);
};

Engine.prototype.stopAllTimers = function() {
    for (var i = 1; i < 99999; i++) {
        window.clearInterval(i);
    }
    this.setMainTimer();
};

Engine.prototype.setTimer = function(callback, time, data, name) {
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
    if (_waitingForClick.call(this)) {
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

Engine.prototype.setBackgroundColor = function(color) {
    this.backgroundColor = color;
};

Engine.prototype.clear = function(context) {
    context = context || this.getContext();
    context.clearRect(0, 0, this.getWidth(), this.getHeight());
};

Engine.prototype.getElementAt = function(x, y) {
    // iterate backwards to preserve order
    for (var i = this.elements.length - 1; i >= 0; i--) {
        if (this.elements[i].containsPoint(x, y, this)) {
            return this.elements[i];
        }
    }
    return null;
};

Engine.prototype.elementExistsWithParameters = function(parameters) {
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

Engine.prototype.removeAll = function() {
    this.elements = [];
};

Engine.prototype.remove = function(element) {
    for (var i = 0; i < this.elements.length; i++) {
        if (this.elements[i] == element) {
            this.elements.spliec(i, 1);
        }
    }
};

Engine.prototype.setSize = function(width, height) {
    var canvas = this.canvas;
    canvas.width = width;
    canvas.height = height;
};

Engine.prototype.resetAllTimers = function() {
    for (var timer in this.timers) {
        clearInterval(this.timers[timer]);
    }
};

function _setCanvas(canvasSelector) {
    if (canvasSelector) {
        this.canvas = $(canvasSelector)[0];
    } else {
        this.canvas = $('canvas')[0];
    }

    this.canvas = this.canvas || _createCanvas();
    _refresh.call(this);
}

Engine.prototype.drawBackground = function() {
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

Engine.prototype.getContext = function() {
    var canvas = this.canvas;
    if (canvas && canvas.getContext) {
        return canvas.getContext('2d');
    }
    return null;
};

function _redraw() {
    this.clear();
    this.drawBackground();
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].draw(this);
    }
}

function _setMainTimer() {
    var self = this;
    this.setTimer(
        function() {
            _redraw.call(self);
        },
        FRAME_RATE,
        null,
        'MAIN_TIMER'
    );
}

function _waitingForClick() {
    return this.nBlockingClicks !== 0;
}

Engine.prototype.getDistance = function(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};

function _setup() {
    var self = this;
    var canvas = this.canvas;

    canvas.onclick = function(e) {
        if (_waitingForClick.call(self)) {
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

        if (_waitingForClick.call(self)) {
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
}

Engine.prototype.setGraphicsTimer = function(callback, time, data, name) {
    if (typeof name === 'undefined') {
        name = callback.name;
    }

    this.timers[name] = setInterval(callback, time, data);
};

// Method based on: http://stackoverflow.com/questions/55677/how-do-i-get-the-coordinates-of-a-mouse-click-on-a-canvas-element
function _getBaseCoordinates(e, target) {
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
}

function _getMouseCoordinates(e) {
    var baseCoordinates = _getBaseCoordinates.call(this, e, $(e.currentTarget));
    var x = baseCoordinates.x;
    var y = baseCoordinates.y;

    // at zoom levels != 100%, x and y are floats.
    x = Math.round(x);
    y = Math.round(y);

    return {x: x, y: y};
}

function _getTouchCoordinates(e) {
    var baseCoordinates = _getBaseCoordinates(e, $(e.target));
    var x = baseCoordinates.x;
    var y = baseCoordinates.y;

    // canvas almost always gets scaled down for mobile screens, need to figure
    // out the x and y in terms of the unscaled canvas size in pixels otherwise
    // touch coordinates are off
    var screenCanvasWidth = this.getWidth();
    var fullCanvasWidth = this.canvas;
    var ratio = fullCanvasWidth / screenCanvasWidth;
    x = x * ratio;
    y = y * ratio;

    // at zoom levels != 100%, x and y are floats.
    x = Math.round(x);
    y = Math.round(y);

    return {x: x, y: y};
}

// Intercept window events
function _interceptWindowEvents() {
    window.addEventListener('keydown', function(e) {
        var index = pressedKeys.indexOf(e.keyCode);
        if (index === -1) {
            pressedKeys.push(e.keyCode);
        }
        if (this.keyDownCallback) {
            this.keyDownCallback(e);
        }
    });

    window.addEventListener('keyup', function(e) {
        var index = pressedKeys.indexOf(e.keyCode);
        if (index !== -1) {
            pressedKeys.splice(index, 1);
        }
        if (this.keyUpCallback) {
            this.keyUpCallback(e);
        }
    });

    /** MOBILE DEVICE EVENTS ****/
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', function(e) {
            if (this.deviceOrientationCallback) {
                this.deviceOrientationCallback(e);
            }
        });
    }

    if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', function(e) {
            if (this.deviceMotionCallback) {
                this.deviceMotionCallback(e);
            }
        });
    }

    // Extend MouseEvent
    MouseEvent.prototype.getX = function() {
        return _getMouseCoordinates(this).x;
    };

    MouseEvent.prototype.getY = function() {
        return _getMouseCoordinates(this).y;
    };

    if (typeof TouchEvent != 'undefined') {
        TouchEvent.prototype.getX = function() {
            return _getTouchCoordinates(this.touches[0]).x;
        };

        TouchEvent.prototype.getY = function() {
            return _getTouchCoordinates(this.touches[0]).y;
        };
    }
}

function _refresh() {
    _resetState.call(this);
    _setMainTimer.call(this);
}

function _createCanvas() {
    var canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 800;
    return canvas;
}

function _resetState() {
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
}

module.exports = Engine;
