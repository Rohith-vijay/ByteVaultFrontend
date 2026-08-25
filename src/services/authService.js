// Authentication Service Wrapper calling apiClient
import apiClient from "./apiClient";

export const authService = {
  // Logs in user by sending credentials to API
  login: async (email, password) => {
    return apiClient.post("/auth/login", { email, password });
  },

  // Registers a new user
  register: async ({ name, email, password }) => {
    return apiClient.post("/auth/register", { name, email, password });
  },

  // Refreshes the JWT session token
  refresh: async () => {
    return apiClient.post("/auth/refresh");
  },

  // Logs out the user session
  logout: async () => {
    return apiClient.post("/auth/logout");
  },

  // Request password reset dispatch
  requestPasswordReset: async (email) => {
    return apiClient.post("/auth/reset-password-request", { email });
  },

  // Set new password with signature token
  resetPassword: async (token, newPassword) => {
    return apiClient.post("/auth/reset-password", { token, password: newPassword });
  },

  // Validates local session token or returns profile refresh
  verifySession: async (token) => {
    return apiClient.get("/auth/verify", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
};

export default authService;
