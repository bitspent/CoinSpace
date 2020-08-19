'use strict';

const Ractive = require('lib/ractive');
const emitter = require('lib/emitter');
const initShapeshift = require('./shapeshift');
const initChangelly = require('./changelly');
const initMoonpay = require('./moonpay');
const moonpay = require('lib/moonpay');
const { getWallet } = require('lib/wallet');
const showConfirmPurchase = require('widgets/modals/moonpay/confirm-purchase');

module.exports = function(el) {
  const ractive = new Ractive({
    el,
    template: require('./index.ract'),
  });

  const exchanges = {
    changelly: initChangelly(ractive.find('#exchange_changelly')),
    shapeshift: initShapeshift(ractive.find('#exchange_shapeshift')),
    moonpay: initMoonpay(ractive.find('#exchange_moonpay')),
    none: new Ractive({
      el: ractive.find('#exchange_none'),
      template: require('./choose.ract'),
      data: {
        choose,
        crypto: '',
        isSupportedMoonpay: false,
      },
    }),
  };

  exchanges.none.on('moonpay', () => {
    const wallet = getWallet();
    const symbol = wallet.denomination;
    moonpay.show(symbol.toLowerCase(), wallet.getNextAddress(), () => {
      showConfirmPurchase({ status: 'success' });
    });
  });

  let currentExchange = exchanges.none;

  ractive.on('before-show', () => {
    setMoonpayButton();
    if (process.env.BUILD_PLATFORM === 'mas') return showExchange(exchanges.none);

    const preferredExchange = window.localStorage.getItem('_cs_preferred_exchange');
    if (exchanges[preferredExchange]) {
      showExchange(exchanges[preferredExchange]);
    } else {
      showExchange(exchanges.none);
    }
  });

  ractive.on('before-hide', () => {
    currentExchange.hide();
  });

  emitter.on('moonpay-init', setMoonpayButton);

  emitter.on('set-exchange', (exchangeName) => {
    choose(exchangeName);
  });

  function choose(exchangeName) {
    window.localStorage.setItem('_cs_preferred_exchange', exchangeName);
    showExchange(exchanges[exchangeName]);
  }

  function setMoonpayButton() {
    const wallet = getWallet();
    const symbol = wallet.denomination;
    exchanges.none.set('crypto', wallet.name);
    exchanges.none.set('isSupportedMoonpay', moonpay.isSupported(symbol) && wallet.getNextAddress());
  }

  function showExchange(exchange) {
    setTimeout(() => {
      currentExchange.hide();
      exchange.show();
      currentExchange = exchange;
    });
  }

  return ractive;
};
