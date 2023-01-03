const { hash, compare } = require('bcryptjs');
const { BadRequestError } = require('./app-errors');
const logger = require('./logger');

const SALT_ROUND = 10;

const requireNonNull = (...strings) => {
  if (strings.length < 1) {
    throw new BadRequestError({ description: 'insufficient number of arguments', errorStack: new RangeError() });
  }

  strings.forEach((str) => {
    if (str == null) {
      throw new BadRequestError({ description: 'argument is null/undefined' });
    }
    if (str.trim().length < 1) {
      throw new BadRequestError({ description: 'argument is empty' });
    }
  });
};

async function hashPassword(password) {
  logger.debug('hashing password', { 'salt-round': SALT_ROUND });
  requireNonNull(password);
  return hash(password, SALT_ROUND);
}

async function comparePassword(unhashed, hashed) {
  logger.debug('comparing passwords');
  requireNonNull(unhashed, hashed);
  return compare(unhashed, hashed);
}

module.exports = {
  hashPassword,
  comparePassword,
};
