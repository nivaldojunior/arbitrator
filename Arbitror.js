"use strict";

const ccxt      = require('ccxt')
    , Operation = require('./Operation')
    , fetch     = require('node-fetch');

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

    let ids = ['foxbit', 'acx', 'mercado'];
    let currencies = ['BRL', 'AUD'];
    let currencyDefault = 'BRL';
    let profitMin = 500;

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
                    operations.push(new Operation(exchanges[ids[i]].getMarket(currencyA),
                        exchanges[ids[j]].getMarket(currencyB)));
                    operations.push(new Operation(exchanges[ids[j]].getMarket(currencyB),
                        exchanges[ids[i]].getMarket(currencyA)));
                }
            }
        }
    }
    while (true) {
        for (let operation of operations) {
            await operation.updateSpread(currenciesRates, currencyDefault);
        }
        operations.sort(function (a, b) {
            return (a.profitMax - b.profitMax) * -1;
        });
        process.stdout.write('\x1B[2J\x1B[0f');
        for (let operation of operations) {
            if(operation.profitMax > profitMin) {
                console.log(
                    operation.marketBuy.exchange.name + ' -> ' + operation.marketSell.exchange.name
                    + ' (' + operation.transacion + ')'
                    + '\n Quantity      = ' + operation.quantityMax.toFixed(4) + ' ' + operation.transacion
                    + '\n Price Buy     = ' + operation.priceBuy.toFixed(2) + ' ' + operation.currencyBuy
                    + '\n Price Sell    = ' + operation.priceSell.toFixed(2) + ' ' + operation.currencySell
                    + '\n Total Buy     = ' + (operation.priceBuy * operation.quantityMax).toFixed(2) + ' '
                    + operation.currencyBuy
                    + '\n Total Sell    = ' + (operation.priceSell * operation.quantityMax).toFixed(2)
                    + ' ' + operation.currencySell
                    + '\n AUD/BRL       = ' + currenciesRates['AUD']['BRL']
                    + '\n Profit        = ' + operation.profitMax.toFixed(2) + ' ' + currencyDefault + '\n'
                );
            }
        }
    }

    process.exit();

})();