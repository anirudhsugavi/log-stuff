const { hash, compare } = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { BadRequestError } = require('./app-errors');
const logger = require('./logger');
const { EXPIRES_IN, TOKEN_ISSUER } = require('./constants');

const SALT_ROUND = 10;

const requireNonNull = (...args) => {
  if (args.length < 1) {
    throw new BadRequestError({ description: 'insufficient number of arguments', errorStack: new RangeError() });
  }

  args.forEach((arg) => {
    if (arg == null) {
      throw new BadRequestError({ description: 'argument is null/undefined' });
    }
    if (typeof (arg) === 'string' && arg.trim().length < 1) {
      throw new BadRequestError({ description: 'argument is empty' });
    }
    if (Array.isArray(arg) && arg.length < 1) {
      throw new BadRequestError({ description: 'array argument is empty' });
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

function generateJwt({ id, password, roles }) {
  logger.debug('generating JWT');
  requireNonNull(id, password, roles);
  return new Promise((resolve, reject) => {
    jwt.sign({ id, roles }, password, {
      expiresIn: EXPIRES_IN,
      issuer: TOKEN_ISSUER,
    }, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
}

function verifyJwt({ token, password }) {
  logger.debug('verifying JWT');
  requireNonNull(token, password);
  return new Promise((resolve, reject) => {
    jwt.verify(token, password, {
      issuer: TOKEN_ISSUER,
    }, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });
}

module.exports = {
  hashPassword,
  comparePassword,
  generateJwt,
  verifyJwt,
};
