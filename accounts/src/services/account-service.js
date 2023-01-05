const { accountRepo } = require('../db/repositories');
const logger = require('../util/logger');

async function createNewAccount(account) {
  try {
    const created = await accountRepo.createAccount(account);
    return created;
  } catch (err) {
    logger.error(err);
    throw err;
  }
}

async function updateAccount() {
  // todo
}

async function findAccount() {
  // todo
}

module.exports = {
  createNewAccount,
  updateAccount,
  findAccount,
};
