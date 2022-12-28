interface IAppError {
  statusCode: number;
  description: string;
  errorStack: Error;
}

export const StatusCode = {
  BAD_REQUEST: 400,
  UNAUTHENTICATED: 401,
  UNAUTHORIZED: 403,
  NOT_FOUND: 404,
  INTERNAL: 500,
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
};

export class AppError extends Error {
  readonly statusCode;
  readonly description;
  readonly errorStack;

  constructor(err: IAppError) {
    super(err.description);
    Object.setPrototypeOf(this, new.target.prototype);
    this.statusCode = err.statusCode;
    this.description = err.description;
    this.errorStack = err.errorStack;
    Error.captureStackTrace(this);
  }
}

export class BadRequestError extends AppError {
  constructor({
    statusCode = StatusCode.BAD_REQUEST,
    description = 'Bad request',
    errorStack = new Error(),
  }) {
    super({ statusCode, description, errorStack });
  }
}

export class UnauthenticatedError extends AppError {
  constructor({
    statusCode = StatusCode.UNAUTHENTICATED,
    description = 'Unauthenticated',
    errorStack = new Error(),
  }) {
    super({ statusCode, description, errorStack });
  };
}

export class UnauthorizedError extends AppError {
  constructor({
    statusCode = StatusCode.UNAUTHORIZED,
    description = 'Unauthorized',
    errorStack = new Error(),
  }) {
    super({ statusCode, description, errorStack });
  };
}

export class NotFoundError extends AppError {
  constructor({
    statusCode = StatusCode.NOT_FOUND,
    description = 'Not found',
    errorStack = new Error(),
  }) {
    super({ statusCode, description, errorStack });
  };
}

export class InternalError extends AppError {
  constructor({
    statusCode = StatusCode.INTERNAL,
    description = 'Internal server error',
    errorStack = new Error(),
  }) {
    super({ statusCode, description, errorStack });
  };
}
