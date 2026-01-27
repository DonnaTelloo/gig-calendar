/**
 * Authentication service to handle token management
 * This abstraction improves testability and centralizes auth logic
 */
import axios from 'axios';
import { ENDPOINTS } from '../api/config';

// Token storage keys
const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

/**
 * Gets the authentication token from storage
 * @returns The token or null if not found
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Gets the refresh token from storage
 * @returns The refresh token or null if not found
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Sets the authentication token in storage
 * @param token The token to store
 */
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Sets the refresh token in storage
 * @param token The refresh token to store
 */
export const setRefreshToken = (token: string): void => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

/**
 * Removes the authentication token from storage
 */
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Removes the refresh token from storage
 */
export const removeRefreshToken = (): void => {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/**
 * Checks if the user is authenticated (has a valid token)
 * @returns True if authenticated, false otherwise
 */
export const isAuthenticated = (): boolean => {
  const token = getToken();
  return isTokenValid(token);
};

/**
 * Validates a JWT token
 * @param token The token to validate
 * @returns True if the token is valid, false otherwise
 */
export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

/**
 * Attempts to refresh the authentication token
 * @returns Promise with the new token or null if refresh failed
 */
export const refreshAuthToken = async (): Promise<string | null> => {
  // Prevent multiple refresh attempts
  if (isRefreshing) {
    return refreshPromise;
  }

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      // Create a new axios instance to avoid interceptors
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"}${ENDPOINTS.AUTH.REFRESH}`, {
        refreshToken
      });

      const { token, refreshToken: newRefreshToken } = response.data;

      // Store the new tokens
      setToken(token);
      setRefreshToken(newRefreshToken);

      return token;
    } catch (error) {
      // If refresh fails, log the user out
      logout();
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

/**
 * Authenticates a user with email and password
 * @param email User email
 * @param password User password
 * @returns Promise that resolves with the login response data
 */
export const login = async (email: string, password: string): Promise<any> => {
  try {
    // Import dynamically to avoid circular dependencies
    const { login: apiLogin } = await import('../api/auth.api');

    // Call the API login function
    const response = await apiLogin({ email, password });

    // Log the response for debugging
    console.log('Login response:', response);

    // Tokens are already stored by the API function
    return response;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

/**
 * Logs the user out by removing all tokens
 */
export const logout = (): void => {
  removeToken();
  removeRefreshToken();
};
