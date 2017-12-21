'use strict';

/**
 * @constructor
 */
function Queue() {
    this.q = [];
}

Queue.prototype.size = function() {
    return this.q.length;
};

Queue.prototype.clear = function() {
    this.q = [];
};

Queue.prototype.enqueue = function(obj) {
    this.q.push(obj);
};

Queue.prototype.dequeue = function() {
    var obj = this.q[0];
    this.q.splice(0, 1);
    return obj;
};

Queue.prototype.peek = function() {
    return this.q[0];
};

Queue.prototype.hasNext = function() {
    return this.q.length > 0;
};

Queue.prototype.isEmpty = function() {
    return this.q.length === 0;
};

module.exports = Queue;
