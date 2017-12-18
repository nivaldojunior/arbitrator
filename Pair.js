"use strict";

module.exports = class Pair {

    constructor (marketA, marketB) {
        this.marketA = marketA;
        this.marketB = marketB;
    }

    async loadOrderbooks() {
        this.marketA.exchange.orderbooks[marketA.symbol] = await marketA.exchange.fetchOrderBook(marketA.symbol);
        this.marketB.exchange.orderbooks[marketB.symbol] = await marketB.exchange.fetchOrderBook(marketB.symbol);
    }
}