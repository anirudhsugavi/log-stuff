const { createNewAccount } = require('./account-service');
const { userRepo } = require('../db/repositories');
const { BadRequestError } = require('../util/app-errors');
const { hashPassword } = require('../util/crypto-util');
const logger = require('../util/logger');
const { BAD_REQUEST } = require('../util/status-code');
const { isValidEmail, isStrongPassword, isValidUsername } = require('../validator');

async function createNewUser(req, res) {
  try {
    const account = req.body.createAccount ? await createNewAccount(req.body.account)
      : req.body.accountId;
    const user = {
      email: req.body.email,
      password: await hashPassword(req.body.password),
      name: req.body.name,
      account,
      roles: ['admin'],
    };

    const created = await userRepo.createUser(user);
    res.json({ status: 'success', created });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(errors.statusCode)
      .json({ status: 'failure', errors: errors.messages });
  }
}

async function getUserById(req, res) {
  const user = await userRepo.findUser({ _id: req.params.userId });
  res.json({ status: 'success', user });
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
}

function handleErrors(err) {
  logger.error(err);

  const errors = { statusCode: 500, messages: {} };

  // handle duplicate email
  if (err.code === 11000) {
    errors.statusCode = BAD_REQUEST;
    errors.messages.email = 'email already exists';
  }

  // handle validation errors
  if (err.message.includes('user validation failed')) {
    errors.statusCode = BAD_REQUEST;
    Object.values(err.errors).forEach(({ properties }) => {
      errors.messages[properties.path] = properties.message;
    });
  }

  // handle bad requests
  if (err instanceof BadRequestError) {
    errors.statusCode = err.statusCode;
    errors.messages.message = err.description;
  }

  return errors;
}

module.exports = {
  createNewUser,
  getUserById,
};
