const { hash, compare } = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { BadRequestError } = require('./app-errors');
const logger = require('./logger');
const { EXPIRES_IN, TOKEN_ISSUER } = require('./constants');

const SALT_ROUND = 10;

const requireNonNull = (...args) => {
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

function generateJwt({ id, secret, roles }) {
  logger.debug('generating JWT');
  requireNonNull(id, secret, roles);
  return new Promise((resolve, reject) => {
    jwt.sign({ id, roles }, secret, {
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

function verifyJwt({ token, secret }) {
  logger.debug('verifying JWT');
  requireNonNull(token, secret);
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, {
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
