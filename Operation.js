"use strict";

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
            //this.rate = getRate(this.currencieBase, this.currencieFinal);
            if(this.currencieBase === 'BRL'){
                this.rate = 0.39;
            }else{
                this.rate = 2.50;
            }
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

    getRate(currencieBase, currencieFinal) {}

}