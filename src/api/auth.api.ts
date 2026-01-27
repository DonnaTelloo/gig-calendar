/**
 * Authentication API service
 * Handles API requests related to authentication
 */
import { apiClient, ENDPOINTS } from './config';
import { setToken, setRefreshToken } from '../services/auth.service';
import { navigateToAuth } from '../services/navigation.service';

/**
 * Login response interface
 */
interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

/**
 * Login credentials interface
 */
interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Authenticates a user with email and password
 * @param credentials User credentials (email and password)
 * @returns Promise with login response
 */
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    console.log('Sending login request to:', ENDPOINTS.AUTH.LOGIN);
    console.log('With credentials:', { email: credentials.email, password: '******' });

    const response = await apiClient.post<LoginResponse>(
      ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    console.log('API login response:', response.data);

    // Store tokens in localStorage
    const { token, refreshToken } = response.data;
    setToken(token);
    setRefreshToken(refreshToken);

    return response.data;
  } catch (error: any) {
    // Handle specific error cases
    if (error.response?.status === 401) {
      throw new Error('Invalid email or password');
    }

    throw error;
  }
};

/**
 * Logs out the current user
 */
export const logout = async (): Promise<void> => {
  try {
    // Call logout endpoint if server needs to invalidate the token
    await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Always remove tokens from localStorage
    setToken('');
    setRefreshToken('');
    navigateToAuth();
  }
};
