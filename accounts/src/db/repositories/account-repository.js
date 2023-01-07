const { Account } = require('../../models');

async function createAccount(account) {
  return Account.create(account);
}

async function getAccountById(accountId) {
  return Account.findById(accountId);
}

async function getAccountByName(name) {
  return Account.findOne({ name });
}

async function getAllAccounts() {
  return Account.find({});
}

module.exports = {
  createAccount,
  getAccountById,
  getAccountByName,
  getAllAccounts,
};
