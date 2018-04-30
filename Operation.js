"use strict";

module.exports = class Operation {

    constructor(marketBuy, marketSell) {
        this.marketBuy = marketBuy;
        this.marketSell = marketSell;
        this.transacion = marketBuy.symbol.toString().slice(0, 3);
        this.currencyBuy = marketBuy.symbol.toString().slice(4, 7);
        this.currencySell = marketSell.symbol.toString().slice(4, 7);
        this.priceBuy = 0.0;
        this.priceSell = 0.0;
        this.priceBuyDefault = 0.0;
        this.priceSellDefault = 0.0;
        this.quantityMax = 0.0;
        this.profitMax = 0.0;
    }

    async updateSpread(currenciesRates, currencyDefault) {

        let purchaseSymbol = this.marketBuy.symbol.toString();
        let saleSymbol = this.marketSell.symbol.toString();

        this.marketBuy.exchange.orderbooks[purchaseSymbol] =
            await this.marketBuy.exchange.fetchOrderBook(purchaseSymbol);
        this.marketSell.exchange.orderbooks[saleSymbol] =
            await this.marketSell.exchange.fetchOrderBook(saleSymbol);

        let orderBuy = this.marketBuy.exchange.orderbooks[purchaseSymbol].asks;
        let orderSale = this.marketSell.exchange.orderbooks[saleSymbol].bids;

        this.priceBuy = orderBuy[0][0];
        this.priceSell = orderSale[0][0];
        this.quantityMax = orderBuy[0][1] <= orderSale[0][1] ? orderSale[0][1] : orderBuy[0][1];

        this.priceBuyDefault =
            this.currencyBuy === currencyDefault
            ? this.priceBuy
            : this.priceBuy * currenciesRates[this.currencyBuy][currencyDefault];

        this.priceSellDefault =
            this.currencySell === currencyDefault
            ? this.priceSell
            : this.priceSell * currenciesRates[this.currencySell][currencyDefault];

        this.profitMax = (this.priceSellDefault * this.quantityMax) - (this.priceBuyDefault * this.quantityMax);

    }
};