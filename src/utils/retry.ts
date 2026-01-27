/**
 * Utility for retrying failed operations
 */

interface RetryOptions {
  maxRetries: number;
  retryDelay: number;
  shouldRetry: (error: any) => boolean;
}

const defaultOptions: RetryOptions = {
  maxRetries: 3,
  retryDelay: 1000,
  shouldRetry: (error: any) => true
};

/**
 * Executes a function with retry logic
 * @param fn The function to execute
 * @param options Retry options
 * @returns Promise with the function result
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const config = { ...defaultOptions, ...options };
  let lastError: any;
  
  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Check if we should retry
      if (attempt >= config.maxRetries || !config.shouldRetry(error)) {
        break;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, config.retryDelay));
    }
  }
  
  throw lastError;
}

/**
 * Determines if an error is retryable based on status code
 * @param error The error to check
 * @returns True if the error is retryable
 */
export function isRetryableError(error: any): boolean {
  // Network errors or specific status codes (500, 502, 503, 504) are retryable
  if (!error.response) {
    return true; // Network error
  }
  
  const status = error.response.status;
  return [500, 502, 503, 504].includes(status);
}