// Error Logging Utility
// Centralized error handling for consistent logging

type ErrorContext = {
  action?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
};

export function logError(message: string, error: unknown, context?: ErrorContext) {
  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.error(`[Error] ${message}`, {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      ...context,
    });
  }

  // In production, send to error tracking service (e.g., Sentry)
  // Example: Sentry.captureException(error, { tags: context });
}

export function logWarning(message: string, context?: ErrorContext) {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[Warning] ${message}`, context);
  }
}
