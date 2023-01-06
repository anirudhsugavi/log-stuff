const {
  BAD_REQUEST, UNAUTHENTICATED, UNAUTHORIZED, NOT_FOUND, INTERNAL,
} = require('./constants');
const logger = require('./logger');

class AppError extends Error {
  constructor(err) {
    super(err.description);
    Object.setPrototypeOf(this, new.target.prototype);
    this.statusCode = err.statusCode;
    this.description = err.description;
    this.errorStack = err.errorStack;
    Error.captureStackTrace(this);
  }
}

class BadRequestError extends AppError {
  constructor({
    statusCode = BAD_REQUEST,
    description = 'Bad request',
    errorStack = new Error().stack,
  }) {
    super({ statusCode, description, errorStack });
  }
}

class UnauthenticatedError extends AppError {
  constructor({
    statusCode = UNAUTHENTICATED,
    description = 'Unauthenticated',
    errorStack = new Error().stack,
  }) {
    super({ statusCode, description, errorStack });
  }
}

class UnauthorizedError extends AppError {
  constructor({
    statusCode = UNAUTHORIZED,
    description = 'Unauthorized',
    errorStack = new Error().stack,
  }) {
    super({ statusCode, description, errorStack });
  }
}

class NotFoundError extends AppError {
  constructor({
    statusCode = NOT_FOUND,
    description = 'Not found',
    errorStack = new Error().stack,
  }) {
    super({ statusCode, description, errorStack });
  }
}

class InternalError extends AppError {
  constructor({
    statusCode = INTERNAL,
    description = 'Internal server error',
    errorStack = new Error().stack,
  }) {
    super({ statusCode, description, errorStack });
  }
}

function handleErrors(err) {
  logger.error(err);

  // handle app errors
  if (err instanceof AppError) {
    return {
      statusCode: err.statusCode,
      messages: { message: err.description },
    };
  }

  // handle duplicate email
  if (err.code === 11000) {
    return {
      statusCode: BAD_REQUEST,
      messages: { email: 'email already exists' },
    };
  }

  // handle validation errors
  if (err.message.includes('user validation failed')) {
    const messages = {};
    Object.values(err.errors).forEach(({ properties }) => {
      messages[properties.path] = properties.message;
    });

    return {
      statusCode: BAD_REQUEST,
      messages,
    };
  }

  // handle any other errors
  return {
    statusCode: INTERNAL,
    messages: { message: err.message },
  };
}

module.exports = {
  AppError,
  BadRequestError,
  UnauthenticatedError,
  UnauthorizedError,
  NotFoundError,
  InternalError,
  handleErrors,
};
