/**
 * Aurelle Spaces — Application Error Hierarchy & Safe Error Serialization
 * 
 * Defines standard operational error classes with HTTP status codes and safe
 * serialization that prevents leakage of SQL queries, stack traces, internal paths,
 * or sensitive configuration values to clients.
 */

export type ErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "STORAGE_ERROR"
  | "DATABASE_ERROR"
  | "RATE_LIMIT_EXCEEDED"
  | "INTERNAL_ERROR";

export interface ErrorResponsePayload {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: unknown;
  };
}

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(
    message: string,
    code: ErrorCode = "INTERNAL_ERROR",
    statusCode: number = 500,
    isOperational: boolean = true,
    details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, "VALIDATION_ERROR", 400, true, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Authentication required to perform this action.") {
    super(message, "UNAUTHORIZED", 401, true);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "You do not have permission to access this resource.") {
    super(message, "FORBIDDEN", 403, true);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = "Resource", identifier?: string) {
    const msg = identifier
      ? `${resource} with identifier '${identifier}' was not found.`
      : `${resource} was not found.`;
    super(msg, "NOT_FOUND", 404, true);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, "CONFLICT", 409, true);
  }
}

export class StorageError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, "STORAGE_ERROR", 500, true, details);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, details?: unknown) {
    // Avoid leaking raw SQL or schema internals in client-facing messages
    super("A database operation failed while processing your request.", "DATABASE_ERROR", 500, true, details);
  }
}

export class InternalError extends AppError {
  constructor(message: string = "An unexpected internal error occurred.") {
    super(message, "INTERNAL_ERROR", 500, false);
  }
}

/**
 * Format any thrown error into a safe, client-facing JSON structure.
 * Strips raw internal exceptions, database queries, and filesystem paths.
 */
export function formatErrorResponse(error: unknown): ErrorResponsePayload {
  if (error instanceof AppError && error.isOperational) {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        ...(error.details !== undefined ? { details: error.details } : {}),
      },
    };
  }

  // Fallback for unhandled or non-operational errors
  return {
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: "An internal server error occurred. Please try again later.",
    },
  };
}

/**
 * Extract appropriate HTTP status code from any error.
 */
export function getErrorStatusCode(error: unknown): number {
  if (error instanceof AppError) {
    return error.statusCode;
  }
  return 500;
}

