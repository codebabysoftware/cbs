import axios from "axios";

/**
 * ============================================
 * AXIOS INSTANCE
 * ============================================
 */

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * ============================================
 * TOKEN MANAGEMENT
 * ============================================
 */

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem("token");
    delete API.defaults.headers.common["Authorization"];
  }
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const clearToken = () => {
  localStorage.removeItem("token");
  delete API.defaults.headers.common["Authorization"];
};

/**
 * ============================================
 * REQUEST INTERCEPTOR
 * Attach token automatically
 * ============================================
 */

API.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * ============================================
 * RESPONSE INTERCEPTOR
 * Handle errors globally
 * ============================================
 */

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("Network error or backend down");
      return Promise.reject(error);
    }

    const status = error.response.status;

    // 🔴 Unauthorized → logout
    if (status === 401) {
      console.warn("401 Unauthorized → logging out");

      clearToken();

      // prevent infinite redirect loop
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }

    // 🟡 Forbidden → do NOT logout
    if (status === 403) {
      console.warn("403 Forbidden → access denied");
    }

    // 🔴 Server error
    if (status >= 500) {
      console.error("Server error:", error.response.data);
    }

    return Promise.reject(error);
  }
);

/**
 * ============================================
 * API HELPERS
 * ============================================
 */

export const apiGet = (url, config = {}) =>
  API.get(url, config);

export const apiPost = (url, data, config = {}) =>
  API.post(url, data, config);

export const apiPut = (url, data, config = {}) =>
  API.put(url, data, config);

export const apiDelete = (url, config = {}) =>
  API.delete(url, config);

/**
 * ============================================
 * EXPORT
 * ============================================
 */

export default API;