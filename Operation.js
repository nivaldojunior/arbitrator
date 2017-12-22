"use strict";

module.exports = class Operation {

    constructor(marketBuy, marketSale) {
        this.purchase = marketBuy;
        this.sale = marketSale;
        this.transacion = marketBuy.symbol.toString().slice(0, 3);
        this.currencyBase = marketBuy.symbol.toString().slice(4, 7);
        this.currencyFinal = marketSale.symbol.toString().slice(4, 7);
        this.overseasBolean = !(this.currencyBase === this.currencyFinal);
        this.spread = 0.0;
        this.operationRates = 0.0;
        this.priceSell = 0.0;
        this.priceBuy = 0.0;
        this.quantity = 0.0;
    }

    async updateSpread(currenciesRates) {

        let purchaseSymbol = this.purchase.symbol.toString();
        let saleSymbol = this.sale.symbol.toString();

        this.purchase.exchange.orderbooks[purchaseSymbol] =
            await this.purchase.exchange.fetchOrderBook(purchaseSymbol);
        this.sale.exchange.orderbooks[saleSymbol] =
            await this.sale.exchange.fetchOrderBook(saleSymbol);

        let orderBuy = this.purchase.exchange.orderbooks[purchaseSymbol].asks;
        let orderSale = this.sale.exchange.orderbooks[saleSymbol].bids;

        this.priceBuy = orderBuy[0][0];
        this.priceSell = orderSale[0][0];
        this.quantity = orderBuy[0][1] <= orderSale[0][1] ? orderSale[0][1] : orderBuy[0][1];

        if (this.overseasBolean) {
            let rate = currenciesRates[this.currencyBase][this.currencyFinal];
            this.spread = (((this.priceSell / this.priceBuy) / rate) - 1.0) * 100.0;
        } else {
            this.spread = ((this.priceSell / this.priceBuy) - 1.0) * 100.0;
        }
    }
};