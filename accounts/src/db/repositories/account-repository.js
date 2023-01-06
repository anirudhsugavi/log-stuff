const { Account } = require('../../models');
const { NotFoundError, BadRequestError } = require('../../util/app-errors');

async function createAccount(account) {
  const result = Account.create(account);
  return result;
}

async function findAccount({ _id, name }) {
  if (_id) {
    const account = await findAccountById(_id);
    if (!account) {
      throw new NotFoundError({ description: `account ${_id} does not exist` });
    }
    return account;
  }

  if (name) {
    const account = await findAccountByName(name);
    if (!account) {
      throw new NotFoundError({ description: `account ${name} does not exist` });
    }
    return account;
  }

  throw new BadRequestError({ description: 'account ID or name is required to find account' });
}

async function findAllAccountsByName({ name }) {
  const allAccounts = await Account.find({ name });
  if (!allAccounts) {
    throw new NotFoundError({ description: `no accounts found for "${name}"` });
  }

  return allAccounts;
}

async function findAccountById(accountId) {
  return Account.findById(accountId);
}

async function findAccountByName(name) {
  return Account.findOne({ name });
}

module.exports = {
  createAccount, findAccount, findAllAccountsByName,
};
