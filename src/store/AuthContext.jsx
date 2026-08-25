import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { authService } from "../services/authService";
import apiClient from "../services/apiClient";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Logs out the user session
  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore network errors on sign out
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem("bytevault_auth_token");
  };

  // Restore session from localStorage on startup
  const restoreSession = async () => {
    setLoading(true);
    setError(null);
    const storedToken = localStorage.getItem("bytevault_auth_token");
    if (storedToken) {
      try {
        setToken(storedToken);
        // Verify current session with Users endpoint
        const profile = await apiClient.get("/users/me");
        setUser(profile);
      } catch (err) {
        console.warn("Session restoration failed on load", err);
        // If 401 Unauthorized, try a token refresh
        if (err.status === 401) {
          try {
            await refreshSession();
          } catch {
            logout();
          }
        } else {
          logout();
        }
      }
    }
    setLoading(false);
  };

  // Perform session token refresh rotation
  const refreshSession = async () => {
    try {
      const res = await authService.refresh();
      setToken(res.token);
      localStorage.setItem("bytevault_auth_token", res.token);
      
      const profile = await apiClient.get("/users/me");
      setUser(profile);
      return profile;
    } catch (err) {
      console.error("Token session refresh failure", err);
      logout();
      throw err;
    }
  };

  useEffect(() => {
    restoreSession();
  }, []);

  // Listen to silent refresh failures from the apiClient interceptors
  useEffect(() => {
    const handleUnauthorizedEvent = () => {
      logout();
    };
    window.addEventListener("bytevault_unauthorized", handleUnauthorizedEvent);
    return () => window.removeEventListener("bytevault_unauthorized", handleUnauthorizedEvent);
  }, []);

  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const res = await authService.login(email, password);
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem("bytevault_auth_token", res.token);
      setLoading(false);
      return res.user;
    } catch (err) {
      setLoading(false);
      setError(err.message || "Login failed.");
      throw err;
    }
  };

  const register = async (name, email, password) => {
    setError(null);
    setLoading(true);
    try {
      const res = await authService.register({ name, email, password });
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem("bytevault_auth_token", res.token);
      setLoading(false);
      return res.user;
    } catch (err) {
      setLoading(false);
      setError(err.message || "Registration failed.");
      throw err;
    }
  };

  const value = {
    user,
    currentUser: user, // Alias mapping
    token,
    accessToken: token, // Alias mapping
    loading,
    error,
    login,
    register,
    logout,
    restoreSession,
    refreshSession,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
