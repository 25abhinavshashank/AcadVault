import { createContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  const persistAuth = (nextToken, nextUser) => {
    localStorage.setItem("token", nextToken);
    setToken(nextToken);
    setUser(nextUser);
  };

  const clearAuth = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const loadCurrentUser = async () => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      // The token is restored from localStorage, but the source of truth remains the API.
      const { data } = await axiosInstance.get("/auth/me");
      setUser(data.user);
      setToken(storedToken);
    } catch (_error) {
      clearAuth();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const register = async (payload) => {
    const { data } = await axiosInstance.post("/auth/register", payload);
    persistAuth(data.token, data.user);
    return data;
  };

  const login = async (payload) => {
    const { data } = await axiosInstance.post("/auth/login", payload);
    persistAuth(data.token, data.user);
    return data;
  };

  const adminLogin = async (payload) => {
    const { data } = await axiosInstance.post("/auth/admin/login", payload);
    persistAuth(data.token, data.user);
    return data;
  };

  const logout = () => {
    clearAuth();
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(token && user),
    register,
    login,
    adminLogin,
    logout,
    refreshUser: loadCurrentUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
