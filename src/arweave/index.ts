import { Arweave } from "./arweave";
import { Transaction, Tag } from "./lib/transaction";



// const crypto = require('crypto');

export default function init(){
    console.log('initing arweave');
    // return new Crypto;
}


// let tx = new Transaction({id: '123', tags: [new Tag('some', 'value')]});

// console.log(tx);

let arweave = new Arweave({api: {host: 'wallet-1.nodes.arweave.org'}});

(async () => {
    
    console.log(await arweave.network.info());
    console.log(await arweave.network.peers());
    console.log((await arweave.transactions.get('Fr6QEPtcEgE0xiXfBaPtxy5iPRCoJJuDc6dloc6onFc')).get('reward'));
    console.log((await arweave.transactions.get('Fr6QEPtcEgE0xiXfBaPtxy5iPRCoJJuDc6dloc6onFc')).getDecoded('data', {toString: true}));
    console.log(await arweave.transactions.getStatus('Fr6QEPtcEgE0xiXfBaPtxy5iPRCoJJuDc6dloc6onFc'));

    let balance = await arweave.wallets.getBalance('5g-QPcEZ37pa62O11Wu49opvtrypAOG1TxDO2GoqWm4');

    console.log(typeof balance, balance, arweave.formatting.winstonToAr(balance));
    console.log(typeof balance, balance, arweave.formatting.winstonToAr(balance, {formatted: false, decimals: 5}));
    console.log(typeof balance, balance, arweave.formatting.winstonToAr(balance, {formatted: false, decimals: 8}));
    console.log(typeof balance, balance, arweave.formatting.winstonToAr(balance, {formatted: true, decimals: 8}));
    console.log(typeof balance, balance, arweave.formatting.winstonToAr(balance, {formatted: true, decimals: 3}));

    let ar = "7.508";

    console.log(typeof ar, ar, arweave.formatting.arToWinston(ar));
    console.log(typeof ar, ar, arweave.formatting.arToWinston(ar, {formatted: true}));

    
})();



// try {
//     throw new ArweaveError(ArweaveErrorType.TX_PENDING);
// } catch (error) {
//     if (error instanceof ArweaveError && error.type == ArweaveErrorType.TX_PENDING) {
//     }
// }
