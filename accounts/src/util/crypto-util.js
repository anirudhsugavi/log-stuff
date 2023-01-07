const { hash, compare } = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { BadRequestError } = require('./app-errors');
const logger = require('./logger');
const { EXPIRES_IN, TOKEN_ISSUER } = require('./constants');

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

async function generateJwt({ _id, email, password }) {
  logger.debug('generating JWT');
  requireNonNull(_id, email, password);
  return jwt.sign({ _id, email }, password, {
    expiresIn: EXPIRES_IN,
    issuer: TOKEN_ISSUER,
  });
}

async function verifyJwt({ token, password }) {
  logger.debug('verifying JWT');
  requireNonNull(token, password);
  return jwt.verify(token, password, {
    issuer: TOKEN_ISSUER,
  });
}

module.exports = {
  hashPassword,
  comparePassword,
  generateJwt,
  verifyJwt,
};
