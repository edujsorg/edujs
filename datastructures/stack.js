'use strict';

function Stack() {
    this.stack = [];
}

Stack.prototype.size = function() {
    return this.stack.length;
};

Stack.prototype.clear = function() {
    this.stack = [];
};

Stack.prototype.push = function(obj) {
    this.stack.push(obj);
};

Stack.prototype.pop = function() {
    return this.stack.pop();
};

Stack.prototype.peek = function() {
    return this.stack[this.stack.length - 1];
};

Stack.prototype.hasNext = function() {
    return this.stack.length !== 0;
};

Stack.prototype.isEmpty = function() {
    return this.stack.length === 0;
};

module.exports = Stack;
