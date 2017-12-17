"use strict";

module.exports = class Pair {

    constructor (marketA, marketB) {
        this.marketA = marketA;
        this.marketB = marketB;
        this.orderbookA = {};
        this.orderbookB = {};
    }

    async loadOrderbooks() {
        this.orderbookA = await marketA.exchange.fetchOrderBook(marketA.symbol);
        this.orderbookB = await marketB.exchange.fetchOrderBook(marketB.symbol);
    }
}