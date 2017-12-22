"use strict";

const ccxt = require('ccxt')
    , Operation = require('./Operation')
    , fetch = require('node-fetch');

let fetchCurrencyRate = async function (currency) {
    return fetch('https://api.fixer.io/latest?base=' + currency)
        .then(resp => resp.json())
        .then(data => data.rates)
};

let getCurrenciesRates = async function (currencies) {
    let currenciesRates = {};
    for (let currency of currencies) {
        currenciesRates[currency] = await fetchCurrencyRate(currency);
    }
    return currenciesRates;
};

(async function main() {

    let ids = ['mercado', 'btcmarkets', 'acx'];
    let currencies = ['BRL', 'AUD'];

    let exchanges = {};
    let operations = [];
    let currenciesRates = {};

    currenciesRates = await getCurrenciesRates(currencies);

    for (let id of ids) {
        let exchange = new ccxt[id]();
        exchanges[id] = exchange;
        await exchange.loadMarkets();
        //filter only markets have the currencies that I want
        exchange.symbols = exchange.symbols.filter(symbol => currencies.some(currency => symbol.includes(currency)));
    }

    //permutate all exchanges in pairs
    for (let i = 0; i < ids.length; i++) {
        for (let currencyA of exchanges[ids[i]].symbols) {
            for (let j = i + 1; j < ids.length; j++) {
                let currencyB = exchanges[ids[j]].symbols.filter(item => item.includes(currencyA.slice(0, 3)));
                if (currencyB.length === 1) {
                    operations.push(new Operation(exchanges[ids[i]].getMarket(currencyA), exchanges[ids[j]].getMarket(currencyB)));
                    operations.push(new Operation(exchanges[ids[j]].getMarket(currencyB), exchanges[ids[i]].getMarket(currencyA)));
                }
            }
        }
    }
    while (true) {
        for (let operation of operations) {
            await operation.updateSpread(currenciesRates);
        }
        operations.sort(function (a, b) {
            return (a.spread - b.spread) * -1;
        });
        process.stdout.write("\u001b[2J\u001b[0;0H");
        for (let operation of operations) {
            console.log(operation.purchase.exchange.name + ' -> ' + operation.sale.exchange.name);
            console.log(operation.quantity.toPrecision(4) + operation.transacion + '\t\t' + operation.spread.toPrecision(2) + '%');
        }
    }

    process.exit();

})();