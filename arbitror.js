#!/usr/bin/env node

(async () => {
	var ccxt = require ('ccxt')
    let acx = new ccxt.acx ()
	let mercado = new ccxt.mercado ()
	let acxbook = await acx.fetchOrderBook ('BTC/AUD')
	let mercadobook = await mercado.fetchOrderBook ('BTC/BRL')
    console.log (acxbook.bids[0])
	console.log (mercadobook.asks[0])
	console.log(mercadobook.asks[0][0]/acxbook.bids[0][0])
}) ()