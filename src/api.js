import axios from "axios";

// Use environment variable if available, otherwise fall back to the live Render backend URL
const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://grievance-backend-e6gr.onrender.com";

// Create a reusable Axios instance with the base URL pre-configured
const api = axios.create({
  baseURL: API_URL,
});

// ==================== Request Interceptor ====================
// Automatically attach the JWT token to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==================== Response Interceptor ====================
// If any API response returns 401, clear auth data and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Only redirect if we're not already on the login/register page
      if (
        !window.location.pathname.includes("/login") &&
        !window.location.pathname.includes("/register")
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
