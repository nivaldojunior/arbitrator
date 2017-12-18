"use strict";

const ccxt = require('ccxt');

let permuteExchanges = function (exchanges) {
    let pairs = [];

    for (let i in exchanges) {
        for(let curriencie of exchanges[i].symbols){
             for(let j in exchanges){
                 if(i === j)
                     continue;

                 if(exchanges[j].symbols.filter(item => item.includes(curriencie.slice (0, 3)))){
                     console.log(exchanges[i].id + '->' + exchanges[j].id + '(' + curriencie + ')');
                 }
             }
        }
    }
    return pairs;
};

(async function main () {

    let ids = ['mercado', 'btcmarkets'];
    let currencies = ['BRL', 'AUD'];
    let exchanges = {};
    let pairs = {};

    for (let id of ids) {

        let exchange = new ccxt[id]();
        exchanges[id] = exchange;
        await exchange.loadMarkets();

        //filter only markets have the currencies that I want
        exchange.symbols = exchange.symbols.filter(symbol => currencies.some(currencie => symbol.includes(currencie)));

        //load Orderbooks
        //for (let symbol of exchange.symbols) {
            //exchange.orderbooks[symbol] = await exchange.fetchOrderBook(symbol);
        //}
    }

    //permutate all exchanges in pairs
    pairs = permuteExchanges(exchanges);

    process.exit ();
})();