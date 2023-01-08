const {
  BAD_REQUEST, UNAUTHENTICATED, UNAUTHORIZED, NOT_FOUND, INTERNAL,
} = require('./constants');

class AppError extends Error {
  constructor(err) {
    super(err.description);
    Object.setPrototypeOf(this, new.target.prototype);
    this.statusCode = err.statusCode;
    this.description = err.description;
    Error.captureStackTrace(this);
  }
}

class BadRequestError extends AppError {
  constructor({
    statusCode = BAD_REQUEST,
    description = 'Bad request',
  }) {
    super({ statusCode, description });
  }
}

class UnauthenticatedError extends AppError {
  constructor({
    statusCode = UNAUTHENTICATED,
    description = 'Unauthenticated',
  }) {
    super({ statusCode, description });
  }
}

class UnauthorizedError extends AppError {
  constructor({
    statusCode = UNAUTHORIZED,
    description = 'Unauthorized',
  }) {
    super({ statusCode, description });
  }
}

class NotFoundError extends AppError {
  constructor({
    statusCode = NOT_FOUND,
    description = 'Not found',
  }) {
    super({ statusCode, description });
  }
}

class InternalError extends AppError {
  constructor({
    statusCode = INTERNAL,
    description = 'Internal server error',
  }) {
    super({ statusCode, description });
  }
}

module.exports = {
  AppError,
  BadRequestError,
  UnauthenticatedError,
  UnauthorizedError,
  NotFoundError,
  InternalError,
};
