"use strict";

const Operation = require('./Operation');

module.exports = class Pair {

    constructor(marketA, marketB) {
        this.marketA = marketA;
        this.marketB = marketB;
    }

    getOperations() {
        let operations = [];
        operations.push(new Operation(this.marketA, this.marketB));
        operations.push(new Operation(this.marketB, this.marketA));
        return operations;
    }
}