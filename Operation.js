"use strict";

module.exports = class Operation {

    constructor(marketBuy, marketSale) {
        this.purchase = marketBuy;
        this.sale = marketSale;
        this.transacion = marketBuy.symbol.toString().slice(0, 3);
        this.currencyBuy = marketBuy.symbol.toString().slice(4, 7);
        this.currencySell = marketSale.symbol.toString().slice(4, 7);
        this.priceBuyOrigin = 0.0;
        this.priceSellOrigin = 0.0;
        this.priceBuyDefault = 0.0;
        this.priceSellDefault = 0.0;
        this.quantityMax = 0.0;
        this.profitMax = 0.0
    }

    async updateSpread(currenciesRates, currencyDefault) {

        let purchaseSymbol = this.purchase.symbol.toString();
        let saleSymbol = this.sale.symbol.toString();

        this.purchase.exchange.orderbooks[purchaseSymbol] =
            await this.purchase.exchange.fetchOrderBook(purchaseSymbol);
        this.sale.exchange.orderbooks[saleSymbol] =
            await this.sale.exchange.fetchOrderBook(saleSymbol);

        let orderBuy = this.purchase.exchange.orderbooks[purchaseSymbol].asks;
        let orderSale = this.sale.exchange.orderbooks[saleSymbol].bids;

        this.priceBuyOrigin = orderBuy[0][0];
        this.priceSellOrigin = orderSale[0][0];
        this.quantityMax = orderBuy[0][1] <= orderSale[0][1] ? orderSale[0][1] : orderBuy[0][1];

        let rate = 0.0;
        this.priceBuyDefault = this.priceBuyOrigin;
        this.priceSellDefault = this.priceSellOrigin;

        if(this.currencyBuy !== currencyDefault){
            rate = currenciesRates[this.currencyBuy][currencyDefault];
            this.priceBuyDefault = this.priceBuyOrigin * rate;
        }
        if (this.currencySell !== currencyDefault){
            rate = currenciesRates[this.currencySell][currencyDefault];
            this.priceSellDefault = this.priceSellOrigin * rate;
        }

        this.profitMax = (this.priceSellDefault * this.quantityMax) - (this.priceBuyDefault * this.quantityMax);

    }
};