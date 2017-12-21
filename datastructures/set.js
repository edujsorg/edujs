'use strict';

function Set() {
    this.set = {};
    this.size = 0;
}

Set.prototype.size = function() {
    return this.size;
};

Set.prototype.isEmpty = function() {
    return this.size === 0;
};

Set.prototype.clear = function() {
    this.set = {};
    this.size = 0;
};

Set.prototype.key = function(obj) {
    var key = obj;
    if (typeof obj === 'object') key = obj.toString();
    return key;
};

Set.prototype.add = function(obj) {
    if (obj === null) {
        throw new TypeError('Cannot add a null element to a set.');
    }
    var key = this.key(obj);
    if (!this.containsKey(key)) {
        this.size++;
    }
    this.set[key] = obj;
};

Set.prototype.remove = function(obj) {
    if (obj === null) {
        throw new TypeError('Cannot remove a null element from a set.');
    }
    var key = this.key(obj);
    if (this.containsKey(key)) {
        delete this.set[key];
        this.size--;
    } else {
        throw new Error(`Set does not contain ${key}`);
    }
};

Set.prototype.containsKey = function(key) {
    return typeof this.set[key] !== 'undefined';
};

Set.prototype.contains = function(obj) {
    return typeof this.find(obj) !== 'undefined';
};

Set.prototype.find = function(obj) {
    var key = this.getKey(obj);
    return this.set[key];
};

Set.prototype.intersection = function(b) {
    var newSet = new Set();

    for (var obj in b.set) {
        if (this.contains(obj)) {
            newSet.add(obj);
            newSet.size++;
        }
    }
    return newSet;
};

Set.prototype.toString = function() {
    var result = 'Set: {';
    var i = 0;
    for (var key in this.set) {
        var cur = this.set[key];
        result += cur;
        if (i < this.size() - 1) {
            result += ', ';
        }
        i++;
    }
    result += '}';
    return result;
};

module.exports = Set;
