import axios from "axios";
import { getToken, refreshAuthToken } from "../services/auth.service";
import { navigateToAuth } from "../services/navigation.service";

/* ----------------------------------
   Types (kept simple & compatible)
----------------------------------- */
type AxiosRequestConfig = any;
type AxiosResponse<T = any> = {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: any;
};
type AxiosError = Error & {
  config?: any;
  request?: any;
  response?: {
    status: number;
    data: any;
  };
};

/* ----------------------------------
   Config
----------------------------------- */
const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL + "/api";

const API_TIMEOUT = 30_000;

/* ----------------------------------
   Axios instances
----------------------------------- */

// MAIN client (with interceptors)
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// REFRESH client (NO interceptors)
const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
});

/* ----------------------------------
   Auth endpoints (never intercept)
----------------------------------- */
const AUTH_URLS = [
  "/auth/login",
  "/auth/refresh",
  "/auth/logout",
];

/* ----------------------------------
   Request interceptor
   ONLY attaches token
----------------------------------- */
apiClient.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      const token = getToken();

      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

/* ----------------------------------
   Refresh lock (prevents multi-refresh)
----------------------------------- */
let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

const processQueue = (token: string) => {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
};

/* ----------------------------------
   Response interceptor
----------------------------------- */
apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & {
        _retry?: boolean;
      };

      const status = error.response?.status;
      const url = originalRequest?.url || "";

      /* -------------------------------
         Skip auth routes
      -------------------------------- */
      if (AUTH_URLS.some((u) => url.includes(u))) {
        return Promise.reject(error);
      }

      /* -------------------------------
         Handle 401 → refresh token
      -------------------------------- */
      if (status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve) => {
            refreshQueue.push((token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(apiClient(originalRequest));
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const newToken = await refreshAuthToken();

          processQueue(newToken);

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        } catch (err) {
          navigateToAuth();
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      /* -------------------------------
         Other errors
      -------------------------------- */
      if (error.response) {
        switch (status) {
          case 403:
            console.error("Forbidden:", url);
            break;
          case 404:
            console.error("Not found:", url);
            break;
          case 500:
          case 502:
          case 503:
            console.error("Server error:", status, url);
            break;
        }
      } else if (error.request) {
        console.error("Network error – no response");
      } else {
        console.error("Axios error:", error.message);
      }

      return Promise.reject(error);
    }
);

/* ----------------------------------
   API endpoints
----------------------------------- */
export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
  },
  CALENDAR: {
    YEARS: "/calendar/years",
  },
  EVENT: {
    ARTICLE_BY_DATE: "/calendar/monthly-articles",
    ARTICLES: "/calendar/monthly-articles",
    UPLOAD_IMAGE: "/calendar/upload-image",
    BASE: "/calendar",
    UPDATE_BY_DATE: "/calendar/update-by-date",
  },
};
