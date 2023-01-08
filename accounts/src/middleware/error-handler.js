const { JsonWebTokenError } = require('jsonwebtoken');
const { AppError } = require('../util/app-errors');
const { BAD_REQUEST, INTERNAL } = require('../util/constants');
const logger = require('../util/logger');

function errorLogger(err, req, _res, next) {
  logger.error(req.path, err);
  next(err);
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, _req, res, _next) {
  // handle app errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ errors: { message: err.description } });
    return;
  }

  // handle jwt error
  if (err instanceof JsonWebTokenError) {
    res.status(BAD_REQUEST).json({ errors: { message: err.message } });
    return;
  }

  // handle duplicate email
  if (err.code === 11000) {
    res.status(BAD_REQUEST).json({ errors: { email: 'email already exists' } });
    return;
  }

  // handle validation errors
  if (err.message.includes('user validation failed')) {
    const messages = {};
    Object.values(err.errors).forEach(({ properties }) => {
      messages[properties.path] = properties.message;
    });

    res.status(BAD_REQUEST).json({ errors: messages });
    return;
  }

  // handle any other errors
  res.status(INTERNAL).json({ errors: { message: err.message } });
}

module.exports = {
  errorLogger,
  errorHandler,
};
