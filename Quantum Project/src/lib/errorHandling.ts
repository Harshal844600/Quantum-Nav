/**
 * Error Handling & Recovery Utilities
 * Provides consistent error handling, logging, and recovery patterns
 */

export type ErrorSeverity = 'debug' | 'info' | 'warn' | 'error' | 'critical';

export interface ErrorContext {
  component?: string;
  operation?: string;
  context?: string;
  data?: Record<string, unknown>;
}

export class AppError extends Error {
  readonly severity: ErrorSeverity;
  readonly context?: ErrorContext;
  readonly timestamp: Date;

  constructor(
    message: string,
    severity: ErrorSeverity = 'error',
    context?: ErrorContext
  ) {
    super(message);
    this.name = 'AppError';
    this.severity = severity;
    this.context = context;
    this.timestamp = new Date();
  }
}

/**
 * Safe error logger with dev/prod separation
 */
export function logError(
  error: unknown,
  severity: ErrorSeverity = 'error',
  context?: ErrorContext
): void {
  const isDev = import.meta.env.DEV;

  // Parse error
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  // Format log entry
  const logEntry = {
    timestamp: new Date().toISOString(),
    severity,
    message,
    context,
    ...(isDev && stack && { stack }),
  };

  // Log to console in development
  if (isDev) {
    const logFn = {
      debug: console.debug,
      info: console.info,
      warn: console.warn,
      error: console.error,
      critical: console.error,
    }[severity];

    logFn(`[${severity.toUpperCase()}] ${message}`, {
      context,
      ...((severity === 'error' || severity === 'critical') && { stack }),
    });
  } else {
    // In production, only log important errors
    if (severity === 'error' || severity === 'critical') {
      console.error(`[${severity}]`, message);
    }
  }

  // TODO: In production, send to error tracking service
  // if (severity === 'error' || severity === 'critical') {
  //   reportToErrorTracking(logEntry);
  // }
}

/**
 * Safely execute function with error handling and recovery
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  fallback: T,
  context?: ErrorContext
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    logError(error, 'error', {
      operation: 'safeAsync',
      ...context,
    });
    return fallback;
  }
}

/**
 * Safely execute synchronous function with error handling
 */
export function safeSync<T>(
  fn: () => T,
  fallback: T,
  context?: ErrorContext
): T {
  try {
    return fn();
  } catch (error) {
    logError(error, 'error', {
      operation: 'safeSync',
      ...context,
    });
    return fallback;
  }
}

/**
 * Try-catch wrapper with logging
 */
export async function tryAsync<T>(
  fn: () => Promise<T>,
  errorMessage?: string,
  severity: ErrorSeverity = 'error'
): Promise<[T | null, Error | null]> {
  try {
    const result = await fn();
    return [result, null];
  } catch (error) {
    const err =
      error instanceof Error ? error : new Error(String(error));
    logError(
      errorMessage || err.message,
      severity,
      {
        operation: 'tryAsync',
        data: {
          originalMessage: err.message,
        },
      }
    );
    return [null, err];
  }
}

/**
 * Validates a value exists and is not null/undefined
 */
export function ensureExists<T>(
  value: T | null | undefined,
  fieldName: string,
  context?: ErrorContext
): T {
  if (value === null || value === undefined) {
    const error = new AppError(
      `Required field missing: ${fieldName}`,
      'error',
      context
    );
    logError(error, 'error', context);
    throw error;
  }
  return value;
}

/**
 * Safely extract values from objects with type checking
 */
export function safeGet<T>(
  obj: unknown,
  path: string,
  defaultValue: T,
  context?: ErrorContext
): T {
  try {
    if (!obj || typeof obj !== 'object') {
      return defaultValue;
    }

    const keys = path.split('.');
    let current: any = obj;

    for (const key of keys) {
      if (current?.[key] !== undefined) {
        current = current[key];
      } else {
        return defaultValue;
      }
    }

    return current as T;
  } catch (error) {
    logError(error, 'debug', {
      operation: 'safeGet',
      data: { path },
      ...context,
    });
    return defaultValue;
  }
}

/**
 * Validate array is not empty and returns it
 */
export function ensureNonEmptyArray<T>(
  array: T[] | undefined | null,
  fieldName: string,
  context?: ErrorContext
): T[] {
  if (!Array.isArray(array) || array.length === 0) {
    const error = new AppError(
      `Expected non-empty array for: ${fieldName}`,
      'error',
      context
    );
    logError(error, 'error', context);
    throw error;
  }
  return array;
}

/**
 * Error recovery wrapper - returns safe default on error
 */
export function withErrorRecovery<T>(
  fn: () => T,
  recovery: T | (() => T),
  context?: ErrorContext
): T {
  try {
    return fn();
  } catch (error) {
    logError(error, 'warn', {
      operation: 'withErrorRecovery',
      ...context,
    });
    return typeof recovery === 'function' ? (recovery as () => T)() : recovery;
  }
}
