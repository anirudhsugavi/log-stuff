const { BadRequestError, UnauthorizedError } = require('../util/app-errors');
const { EXPIRES_IN, TOKEN_ISSUER } = require('../util/constants');
const { comparePassword, generateJwt, verifyJwt } = require('../util/crypto-util');
const { isValidRoles } = require('../validator');
const userService = require('./user-service');

async function createToken({
  _id, email, username, password, requiredRoles,
}) {
  const user = await userService.getUser({ _id, email, username });
  const result = await comparePassword(password, user.password);
  if (!result) {
    throw new BadRequestError({ description: 'incorrect password' });
  }

  validateRoles(requiredRoles);
  return {
    tokenType: 'Bearer',
    accessToken: await generateJwt({
      id: user.id, password: user.password, roles: requiredRoles ?? user.roles,
    }),
    expiresIn: EXPIRES_IN,
    issuer: TOKEN_ISSUER,
  };
}

async function authenticateUser({
  _id, email, username, token, requiredRoles,
}) {
  // authentication
  const user = await userService.getUser({ _id, email, username });
  const payload = await verifyJwt({ token, password: user.password });

  // authorization
  validateRoles(requiredRoles);
  const roles = requiredRoles ?? payload.roles;
  const hasRoles = user.roles.includes('admin') || roles.every((role) => user.roles.includes(role));
  if (!hasRoles) {
    throw new UnauthorizedError({ description: 'access denied' });
  }
}

function validateRoles(roles) {
  if (roles && !isValidRoles(roles)) {
    throw new BadRequestError({ description: 'invalid roles' });
  }
}

module.exports = {
  createToken,
  authenticateUser,
};
