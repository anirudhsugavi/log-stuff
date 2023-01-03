const { Account } = require('../../models');
const { NotFoundError } = require('../../util/app-errors');

async function createAccount(account) {
  const result = await Account.create(account);
  return result;
}

async function findAccount({ _id, name }) {
  const account = await Account.findById(_id);
  if (account == null) {
    throw new NotFoundError({ description: `account ${name} not found` });
  }
  return account;
}

module.exports = {
  createAccount, findAccount,
};
