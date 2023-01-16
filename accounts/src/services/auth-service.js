const { BadRequestError, UnauthorizedError } = require('../util/app-errors');
const { EXPIRES_IN, TOKEN_ISSUER, TOKEN_TYPE } = require('../util/constants');
const { comparePassword, generateJwt, verifyJwt } = require('../util/crypto-util');
const { JWT_SECRET } = require('../util/properties-loader');
const { isValidRoles } = require('../validator');
const { getUser } = require('./user-service');

async function createToken({
  _id, email, username, password, requiredRoles,
}) {
  const user = await getUser({ _id, email, username }, true);
  const result = await comparePassword(password, user.password);
  if (!result) {
    throw new BadRequestError({ description: 'incorrect password' });
  }

  validateRoles(requiredRoles);
  return {
    tokenType: TOKEN_TYPE,
    accessToken: await generateJwt({
      id: user.id, secret: JWT_SECRET, roles: requiredRoles ?? user.roles,
    }),
    expiresIn: EXPIRES_IN,
    issuer: TOKEN_ISSUER,
  };
}

async function authenticateUser({ token, requiredRoles }) {
  // authentication
  const payload = await verifyJwt({ token, secret: JWT_SECRET });

  // authorization
  validateRoles(requiredRoles);
  const roles = requiredRoles ?? payload.roles;
  const hasRoles = payload.roles.includes('admin') || roles.every((role) => payload.roles.includes(role));
  if (!hasRoles) {
    throw new UnauthorizedError({ description: 'access denied' });
  }
  return payload;
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
