export class BaseError extends Error {
  code: string
  statusCode: number
  payload?: Record<string, unknown>
  constructor(message: string, code: string, statusCode: number, payload?: Record<string, unknown>) {
    super(message)
    this.name = code
    this.code = code
    this.statusCode = statusCode
    this.payload = payload
  }
}

export const InvalidInputErrorCode = 'INVALID_INPUT'
export class InvalidInputError extends BaseError {
  constructor(message = 'Invalid input', { payload }: { payload?: Record<string, unknown> } = {}) {
    super(message, InvalidInputErrorCode, 400, payload)
  }
}

export const LimitExceededErrorCode = 'LIMIT_EXCEEDED'
export class LimitExceededError extends BaseError {
  constructor(message = 'Limit exceeded', { payload }: { payload?: Record<string, unknown> } = {}) {
    super(message, LimitExceededErrorCode, 400, payload)
  }
}

export const UnauthenticatedErrorCode = 'UNAUTHENTICATED'
export class UnauthenticatedError extends BaseError {
  constructor(message = 'Unauthenticated', { payload }: { payload?: Record<string, unknown> } = {}) {
    super(message, UnauthenticatedErrorCode, 401, payload)
  }
}

export const ForbiddenErrorCode = 'FORBIDDEN'
export class ForbiddenError extends BaseError {
  constructor(message = 'No permission', { payload }: { payload?: Record<string, unknown> } = {}) {
    super(message, ForbiddenErrorCode, 403, payload)
  }
}

export const NotFoundErrorCode = 'NOT_FOUND'
export class NotFoundError extends BaseError {
  constructor(message = 'Not found', { payload }: { payload?: Record<string, unknown> } = {}) {
    super(message, NotFoundErrorCode, 404, payload)
  }
}

export const UnknownErrorCode = 'UNKNOWN'
export class UnknownError extends BaseError {
  constructor(message = 'Something went wrong', { payload }: { payload?: Record<string, unknown> } = {}) {
    super(message, UnknownErrorCode, 500, payload)
  }
}
