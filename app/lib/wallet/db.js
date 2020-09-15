'use strict';
const encryption = require('lib/encryption');

const seeds = {
  public: null,
  private: null,
};

function getSeed(type) {
  return seeds[type];
}

function setSeed(type, seed, token) {
  seeds[type] = seed;
  if (token) {
    window.localStorage.setItem(type, encryption.encrypt(seed, token));
  }
}

function lockSeed(type) {
  setSeed(type, null);
}

function unlockSeed(type, token) {
  seeds[type] = encryption.decrypt(window.localStorage.getItem(type), token);
}

function getId() {
  return window.localStorage.getItem('id');
}

function setId(id) {
  window.localStorage.setItem('id', id);
}

function getPinKey() {
  return window.localStorage.getItem('pinKey');
}

function setPinKey(pinKey) {
  window.localStorage.setItem('pinKey', pinKey);
}

function getDetailsKey() {
  return window.localStorage.getItem('detailsKey');
}

function setDetailsKey(detailsKey) {
  window.localStorage.setItem('detailsKey', detailsKey);
}

function getPublicKey(networkName) {
  return encryption.decrypt(window.localStorage.getItem(`_cs_public_key_${networkName}`), seeds['public']);
}

function setPublicKey(wallet) {
  const backup = encryption.encrypt(wallet.publicKey(), seeds['public']);
  window.localStorage.setItem(`_cs_public_key_${wallet.networkName}`, backup);
}

// DEPRECATED
function getCredentials() {
  const credentials = window.localStorage.getItem('_cs_credentials');
  return credentials ? JSON.parse(encryption.decrypt(credentials, 'seedCoinspace')) : null;
}

// DEPRECATED
function deleteCredentials() {
  window.localStorage.removeItem('_cs_credentials');
}

// DEPRECATED
function getPin() {
  const pin = window.localStorage.getItem('_pin_cs');
  return pin ? encryption.decrypt(pin, 'pinCoinSpace') : null;
}

function isRegistered() {
  return !!window.localStorage.getItem('id')
    && !!window.localStorage.getItem('public')
    && !!window.localStorage.getItem('private')
    && !!window.localStorage.getItem('pinKey')
    && !!window.localStorage.getItem('detailsKey');
}

function reset() {
  window.localStorage.removeItem('id');
  window.localStorage.removeItem('public');
  window.localStorage.removeItem('private');
  window.localStorage.removeItem('pinKey');
  window.localStorage.removeItem('detailsKey');
  window.localStorage.removeItem('_cs_public_key_bitcoin');
  window.localStorage.removeItem('_cs_public_key_litecoin');
  window.localStorage.removeItem('_cs_public_key_bitcoincash');
  window.localStorage.removeItem('_cs_public_key_bitcoinsv');
  window.localStorage.removeItem('_cs_public_key_dogecoin');
  window.localStorage.removeItem('_cs_public_key_dash');
  window.localStorage.removeItem('_cs_public_key_ethereum');
  window.localStorage.removeItem('_cs_public_key_ripple');
  window.localStorage.removeItem('_cs_public_key_stellar');
  window.localStorage.removeItem('_cs_public_key_eos');
}

module.exports = {
  getCredentials, // DEPRECATED
  getPin, // DEPRECATED
  deleteCredentials, // DEPRECATED
  isRegistered,
  getSeed,
  setSeed,
  lockSeed,
  unlockSeed,
  getId,
  setId,
  getPinKey,
  setPinKey,
  getDetailsKey,
  setDetailsKey,
  getPublicKey,
  setPublicKey,
  reset,
};
