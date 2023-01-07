module.exports = {
  // HTTP status codes
  BAD_REQUEST: 400,
  UNAUTHENTICATED: 401,
  UNAUTHORIZED: 403,
  NOT_FOUND: 404,
  INTERNAL: 500,
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,

  // user roles
  USER_ROLES: ['admin', 'read', 'write', 'delete'],

  // 1 day in seconds
  EXPIRES_IN: 24 * 60 * 60,
  TOKEN_ISSUER: 'log-stuff-accounts',
};
