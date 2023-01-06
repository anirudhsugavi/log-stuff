const { accountRepo } = require('../db/repositories');
const { BadRequestError } = require('../util/app-errors');
const logger = require('../util/logger');

async function createNewAccount(account) {
  logger.debug('creating new account');
  validateInputs(account);
  return accountRepo.createAccount(account);
}

async function updateAccount() {
  // todo
}

async function findAccount({ _id, name }) {
  logger.debug('finding account', { _id, name });
  return accountRepo.findAccount({ _id, name });
}

function validateInputs(account) {
  if (!account) {
    throw new BadRequestError({ description: 'missing account info' });
  }
}

module.exports = {
  createNewAccount,
  updateAccount,
  findAccount,
};
