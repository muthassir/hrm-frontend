import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // const API = "http://localhost:5000"
  const API = "https://hrm-nia6.onrender.com"
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("accessToken") || null);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  useEffect(() => {
    if (accessToken) localStorage.setItem("accessToken", accessToken);
    else localStorage.removeItem("accessToken");
  }, [accessToken]);

  // login function
  const login = async (email, password) => {
      const res = await axios.post(`${API}/api/auth/login`, { email, password });
    setUser(res.data.data.user);
    setAccessToken(res.data.data.accessToken);
    return res.data;
  };

  // logout function
  const logout = async () => {
    if (accessToken) {
      try {
        await axios.post(`${API}/api/auth/logout`, { refreshToken: localStorage.getItem("refreshToken") });
      } catch {}
    }
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("refreshToken");
  };

  // register function
  const register = async (name, email, password, role) => {
        const res = await axios.post(`${API}/api/auth/register`, { name, email, password, role });
    return res.data;
   
  };

  const axiosAuth = axios.create();
  axiosAuth.interceptors.request.use(config => {
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  });

  return (
    <AuthContext.Provider value={{ user, login, logout, register, accessToken, axiosAuth, API }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
