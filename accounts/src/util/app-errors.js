const StatusCode = require('./status-code');

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
    statusCode = StatusCode.BAD_REQUEST,
    description = 'Bad request',
    errorStack = new Error(),
  }) {
    super({ statusCode, description, errorStack });
  }
}

class UnauthenticatedError extends AppError {
  constructor({
    statusCode = StatusCode.UNAUTHENTICATED,
    description = 'Unauthenticated',
    errorStack = new Error(),
  }) {
    super({ statusCode, description, errorStack });
  }
}

class UnauthorizedError extends AppError {
  constructor({
    statusCode = StatusCode.UNAUTHORIZED,
    description = 'Unauthorized',
    errorStack = new Error(),
  }) {
    super({ statusCode, description, errorStack });
  }
}

class NotFoundError extends AppError {
  constructor({
    statusCode = StatusCode.NOT_FOUND,
    description = 'Not found',
    errorStack = new Error(),
  }) {
    super({ statusCode, description, errorStack });
  }
}

class InternalError extends AppError {
  constructor({
    statusCode = StatusCode.INTERNAL,
    description = 'Internal server error',
    errorStack = new Error(),
  }) {
    super({ statusCode, description, errorStack });
  }
}

module.exports = {
  AppError, BadRequestError, UnauthenticatedError, UnauthorizedError, NotFoundError, InternalError,
};
