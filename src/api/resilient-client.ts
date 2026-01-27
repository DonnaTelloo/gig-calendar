/**
 * Resilient API client with retry capabilities
 */

import axios from 'axios';
import { apiClient } from './config';
import { withRetry, isRetryableError } from '../utils/retry';

// Define types locally to avoid import issues with newer axios versions
type AxiosRequestConfig = any;
type AxiosResponse<T = any> = {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: any;
};

/**
 * Makes a GET request with retry capability
 * @param url The URL to request
 * @param config Axios request config
 * @returns Promise with the response
 */
export async function getWithRetry<T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
  return withRetry(
    () => apiClient.get<T>(url, config),
    {
      maxRetries: 3,
      retryDelay: 1000,
      shouldRetry: isRetryableError
    }
  );
}

/**
 * Makes a POST request with retry capability
 * @param url The URL to request
 * @param data The data to send
 * @param config Axios request config
 * @returns Promise with the response
 */
export async function postWithRetry<T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
  return withRetry(
    () => apiClient.post<T>(url, data, config),
    {
      maxRetries: 3,
      retryDelay: 1000,
      shouldRetry: isRetryableError
    }
  );
}

/**
 * Makes a PUT request with retry capability
 * @param url The URL to request
 * @param data The data to send
 * @param config Axios request config
 * @returns Promise with the response
 */
export async function putWithRetry<T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
  return withRetry(
    () => apiClient.put<T>(url, data, config),
    {
      maxRetries: 3,
      retryDelay: 1000,
      shouldRetry: isRetryableError
    }
  );
}

/**
 * Makes a DELETE request with retry capability
 * @param url The URL to request
 * @param config Axios request config
 * @returns Promise with the response
 */
export async function deleteWithRetry<T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
  return withRetry(
    () => apiClient.delete<T>(url, config),
    {
      maxRetries: 3,
      retryDelay: 1000,
      shouldRetry: isRetryableError
    }
  );
}
