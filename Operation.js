"use strict";

const fetch = require('node-fetch');

module.exports = class Operation {

    constructor(marketBuy, marketSale) {
        this.purshase = marketBuy.exchange.id;
        this.sale = marketSale.exchange.id;
        this.transacion = marketBuy.symbol.toString().slice(0, 3);
        this.currencieBase = marketBuy.symbol.toString().slice(4, 7);
        this.currencieFinal = marketSale.symbol.toString().slice(4, 7);
        this.overseasBolean = !(this.currencieBase === this.currencieFinal);
        this.rate = 0.0;
        if (this.overseasBolean) {
            this.getRate(this.currencieBase, this.currencieFinal).then(result => this.rate = result);
        }
        this.priceBuy = marketBuy.exchange.orderbooks[marketBuy.symbol].asks[0][0];
        this.priceSell = marketSale.exchange.orderbooks[marketSale.symbol].bids[0][0];
        this.spread = 0.0;
        if (this.overseasBolean) {
            this.spread = (((this.priceSell / this.priceBuy) / this.rate) - 1) * 100.0;
        } else {
            this.spread = ((this.priceSell / this.priceBuy) - 1) * 100;
        }
    }

    getRate(currencyBase, currencyFinal) {
        return fetch('https://api.fixer.io/latest?base=' + currencyBase)
            .then(resp => resp.json())
            .then(data => data.rates[currencyFinal])
            .catch(error => console.log(error));
    }
}