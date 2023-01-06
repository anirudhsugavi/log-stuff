const { createNewAccount, findAccount } = require('./account-service');
const { userRepo } = require('../db/repositories');
const { BadRequestError, NotFoundError } = require('../util/app-errors');
const { hashPassword } = require('../util/crypto-util');
const logger = require('../util/logger');
const validator = require('../validator');

async function getUser({ _id, email, username }) {
  if (_id) {
    logger.debug('finding user by ID', { _id });
    validateId(_id);
    const user = await userRepo.getUserById(_id);
    if (!user) {
      throw new NotFoundError({ description: `user with ID ${_id} does not exist` });
    }
    return user;
  }

  if (email) {
    logger.debug('finding user by email', { email });
    const user = await userRepo.getUserByEmail(email);
    if (!user) {
      throw new NotFoundError({ description: `user with email ${email} does not exist` });
    }
    return user;
  }

  if (username) {
    logger.debug('finding user by username', { username });
    const user = await userRepo.getUserByUsername(username);
    if (!user) {
      throw new NotFoundError({ description: `user with username ${username} does not exist` });
    }
    return user;
  }

  throw new BadRequestError({ description: 'user ID, email, or username is required' });
}

async function createUser({ user, createAccount }) {
  validateInput(user);

  const { password, account, ...newUser } = user;
  newUser.password = await hashPassword(password);
  newUser.account = createAccount ? await createDefaultAccount(user)
    : await getAccount(account);

  return userRepo.createUser(newUser);
}

async function createDefaultAccount(user) {
  logger.debug('needs creating default account');
  const account = user.account ?? { name: user.email };
  return createNewAccount(account);
}

async function getAccount(account) {
  if (!account?._id) {
    throw new BadRequestError({ description: 'missing account id for creating a user' });
  }

  validateId(account._id);
  return findAccount({ _id: account._id });
}

function validateInput(user) {
  logger.debug('validating user input');

  const { email, password, username } = user;

  if (!validator.isValidEmail(email)) {
    throw new BadRequestError({ description: 'invalid email' });
  }

  if (!validator.isStrongPassword(password)) {
    throw new BadRequestError({ description: 'password does not meet requirements' });
  }

  if (username && !validator.isValidUsername(username)) {
    throw new BadRequestError({ description: 'special characters not allowed in username' });
  }

  if (!validator.isValidRoles(user.roles)) {
    throw new BadRequestError({ description: 'invalid roles' });
  }
}

function validateId(id) {
  if (!validator.isValidId(id)) {
    throw new BadRequestError({ description: 'invalid ID' });
  }
}

module.exports = {
  createUser,
  getUser,
};
