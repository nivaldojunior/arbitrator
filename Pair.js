"use strict";

const Operation = require('./Operation');

module.exports = class Pair {

    constructor(marketA, marketB) {
        this.marketA = marketA;
        this.marketB = marketB;
    }

    getOperations() {
        let operations = [];
        //console.log(this.marketA.exchange.id + '->' + this.marketB.exchange.id + '(' + this.marketA.symbol + '->' + this.marketB.symbol + ')');
        //console.log(this.marketA.exchange.orderbooks[this.marketA.symbol].asks[0][0] / this.marketB.exchange.orderbooks[this.marketB.symbol].bids[0][0]);
        //console.log(this.marketB.exchange.id + '->' + this.marketA.exchange.id + '(' + this.marketB.symbol + '->' + this.marketA.symbol + ')');
        //console.log(this.marketB.exchange.orderbooks[this.marketB.symbol].asks[0][0] / this.marketA.exchange.orderbooks[this.marketA.symbol].bids[0][0]);
        operations.push(new Operation(this.marketA, this.marketB));
        operations.push(new Operation(this.marketB, this.marketA));
        return operations;
    }
}