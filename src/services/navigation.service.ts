// Navigation service to handle redirects in a more testable way
// This abstraction allows for easier mocking during tests

/**
 * Redirects to a specific route
 * @param route The route to redirect to
 */
export const navigateTo = (route: string): void => {
  window.location.href = route;
};

/**
 * Redirects to the authentication page
 */
export const navigateToAuth = (): void => {
  navigateTo('/auth');
};

/**
 * Redirects to the dashboard
 */
export const navigateToDashboard = (): void => {
  navigateTo('/dashboard');
};

/**
 * Redirects to the home page
 */
export const navigateToHome = (): void => {
  navigateTo('/');
};