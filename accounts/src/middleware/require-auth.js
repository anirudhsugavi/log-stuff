const { authenticateUser } = require('../services/auth-service');
const { UnauthenticatedError } = require('../util/app-errors');

function requireAuth(roles) {
  return async (req, _res, next) => {
    const authHeader = req.headers.authorization;
    try {
      validateAuthHeader(authHeader);
      const token = authHeader.split(' ')[1];
      await authenticateUser({ _id: req.params.userId, token, requiredRoles: roles });
      next();
    } catch (err) {
      next(err);
    }
  };
}

function validateAuthHeader(authHeader) {
  if (!authHeader) {
    throw new UnauthenticatedError({ description: 'missing auth header' });
  }

  const auth = authHeader.split(' ');
  if (auth.length !== 2) {
    throw new UnauthenticatedError({ description: 'invalid auth header format' });
  }

  if (auth[0] !== 'Bearer') {
    throw new UnauthenticatedError({ description: `invalid token type '${auth[0]}'` });
  }
}

module.exports = requireAuth;
