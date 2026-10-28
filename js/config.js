// Deposit/withdrawal settings. Edit this file only; nothing on the website can change it.
const DEPOSIT_CONFIG=Object.freeze({
  notice:'',
  placeholderAddress:'bc1qfruf5ef4tlqcns70rf5u0k2zck9tdzw4dxhqmm',
  assets:{
    BTC:{label:'Bitcoin (BTC)',networks:['Bitcoin']},
    USDT:{label:'Tether (USDT)',networks:['Tron (TRC20)','Ethereum (ERC20)','BNB Smart Chain (BEP20)']}
  },
  statuses:{deposit:'Pending',withdrawal:'Request Submitted'},
  minUsd:10,
  maxUsd:1000000
});
// Safety check: the page stops with an error if this is not obviously fictional text.
if(!/^_/.test(DEPOSIT_CONFIG.placeholderAddress))throw Error('placeholderAddress must be fictional text starting with _');