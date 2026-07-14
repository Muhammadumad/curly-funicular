import axios from 'axios';

const api = axios.create({
    baseURL: '/',
    withCredentials: true,
    withXSRFToken: true,
    headers: {
        'Accept': 'application/json',          // Forces Laravel to return JSON errors instead of HTML views
        'Content-Type': 'application/json',
    }
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check for CSRF token mismatch (419) or expired session (401)
    if (
      error.response &&
      (error.response.status === 419 || error.response.status === 401) &&
      !originalRequest._retry &&
      originalRequest.url !== '/sanctum/csrf-cookie' &&
      originalRequest.url !== '/api/login'
    ) {
      originalRequest._retry = true;
      try {
        // Fetch fresh CSRF cookie directly using clean axios instance to prevent loops
        await axios.get(
          '/sanctum/csrf-cookie',
          { withCredentials: true }
        );
        // Retry original request
        return api(originalRequest);
      } catch (retryError) {
        return Promise.reject(retryError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;