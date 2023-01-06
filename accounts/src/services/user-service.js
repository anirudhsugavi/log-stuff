const { createNewAccount, findAccount } = require('./account-service');
const { userRepo } = require('../db/repositories');
const { BadRequestError } = require('../util/app-errors');
const { hashPassword } = require('../util/crypto-util');
const logger = require('../util/logger');
const {
  isValidEmail, isStrongPassword, isValidUsername, isValidRoles,
} = require('../validator');

async function getUserById(req, res) {
  const user = await userRepo.findUser({ _id: req.params.userId });
  res.json({ status: 'success', user });
}

async function createNewUser({ user, createAccount }) {
  validateInput(user);

  const { password, account, ...newUser } = user;
  newUser.password = await hashPassword(password);
  newUser.account = createAccount ? await createDefaultAccount(user)
    : await getAccount(account);

  return userRepo.createUser(newUser);
}

function validateInput(user) {
  logger.debug('validating user input');

  const { email, password, username } = user;

  if (!isValidEmail(email)) {
    throw new BadRequestError({ description: 'invalid email' });
  }

  if (!isStrongPassword(password)) {
    throw new BadRequestError({ description: 'password does not meet requirements' });
  }

  if (username && !isValidUsername(username)) {
    throw new BadRequestError({ description: 'special characters not allowed in username' });
  }

  if (!isValidRoles(user.roles)) {
    throw new BadRequestError({ description: 'invalid roles' });
  }
}

async function createDefaultAccount(user) {
  logger.debug('creating account for the user');
  const account = user.account ?? { name: user.email };
  return createNewAccount(account);
}

async function getAccount(account) {
  if (!account?._id) {
    throw new BadRequestError({ description: 'missing account id for creating a user' });
  }

  return findAccount({ _id: account._id });
}

module.exports = {
  createNewUser,
  getUserById,
};
