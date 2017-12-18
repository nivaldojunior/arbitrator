"use strict";

const ccxt = require('ccxt');
const Pair = require('./Pair');
const Operation = require('./Operation');

const ids = ['mercado', 'btcmarkets', 'acx'];
const currencies = ['BRL', 'AUD'];

let permuteExchanges = function (exchanges) {
    let pairs = [];

    for (let i = 0; i < ids.length; i++) {
        for (let curriencie of exchanges[ids[i]].symbols) {
            for (let j = i + 1; j < ids.length; j++) {
                if (i === j)
                    continue;

                let curriencieB = exchanges[ids[j]].symbols.filter(item => item.includes(curriencie.slice(0, 3)));

                if (curriencieB.length === 1) {
                    //console.log(exchanges[ids[i]].id + '->' + exchanges[ids[j]].id + '(' + curriencie + '->' + curriencieB + ')');
                    pairs.push(new Pair(exchanges[ids[i]].getMarket(curriencie), exchanges[ids[j]].getMarket(curriencieB)));
                }
            }
        }
    }

    return pairs;
};

(async function main() {

    let exchanges = {};
    let pairs = [];
    let operations = [];

    for (let id of ids) {

        let exchange = new ccxt[id]();
        exchanges[id] = exchange;
        await exchange.loadMarkets();

        //filter only markets have the currencies that I want
        exchange.symbols = exchange.symbols.filter(symbol => currencies.some(currencie => symbol.includes(currencie)));

        //load Orderbooks
        for (let symbol of exchange.symbols) {
            exchange.orderbooks[symbol] = await exchange.fetchOrderBook(symbol);
        }
    }

    //permutate all exchanges in pairs
    pairs = permuteExchanges(exchanges);

    for (let pair of pairs) {
        operations = operations.concat(pair.getOperations());
    }

    operations.sort(function (a, b) {
        return (a.spread - b.spread) * -1;
    });

    for(let operation of operations){
        console.log(operation.purshase+ '/'+ operation.sale + ' ' + operation.currencieBase + '/' + operation.transacion + '/' + operation.currencieFinal + ' ' + operation.spread + '%');
    }

    process.exit();
})();