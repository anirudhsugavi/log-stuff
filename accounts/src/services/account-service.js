const { accountRepo } = require('../db/repositories');
const { BadRequestError, NotFoundError } = require('../util/app-errors');
const logger = require('../util/logger');

async function createNewAccount(account) {
  logger.debug('creating new account');
  validateInputs(account);
  return accountRepo.createAccount(account);
}

async function updateAccount() {
  // todo
}

async function getAccount({ _id, name }) {
  if (_id) {
    logger.debug('finding account by ID', { _id });
    const account = await accountRepo.getAccountById(_id);
    if (!account) {
      throw new NotFoundError({ description: `account with ID ${_id} does not exist` });
    }
    return account;
  }

  if (name) {
    logger.debug('finding account by name', { name });
    const account = await accountRepo.getAccountByName(name);
    if (!account) {
      throw new NotFoundError({ description: `account with name ${name} does not exist` });
    }
    return account;
  }

  throw new BadRequestError({ description: 'account ID or name is required' });
}

function validateInputs(account) {
  if (!account) {
    throw new BadRequestError({ description: 'missing account info' });
  }
}

module.exports = {
  createNewAccount,
  updateAccount,
  getAccount,
};
