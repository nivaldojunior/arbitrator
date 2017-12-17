(async () => {
    var ccxt = require('ccxt');

    let ids = ['acx', 'mercado', 'btcmarkets'];
    let currencies = ['BRL', 'AUD'];
    let exchanges = {};

    for (let id of ids) {
        let exchange = new ccxt[id]();
        exchanges[id] = exchange;
        await exchange.loadMarkets();

        //filter only markets have the currencies that I want
        exchange.symbols = exchange.symbols.filter(symbol => currencies.some(currencie => symbol.includes(currencie)));
        for (let symbol of exchange.symbols) {
            exchange.orderbooks = await exchange.fetchOrderBook(symbol);
        }
    }
    console.log(exchanges['btcmarkets'].orderbooks);

    // if (symbol in exchange.markets) {}
})();