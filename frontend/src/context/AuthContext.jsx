import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext();

const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  // Lấy role từ JWT token scope
  const getRole = () => {
    if (!token) return null;
    const payload = parseJwt(token);
    if (!payload?.scope) return null;
    if (payload.scope.includes('ROLE_ADMIN')) return 'ADMIN';
    if (payload.scope.includes('ROLE_DOCTOR')) return 'DOCTOR';
    if (payload.scope.includes('ROLE_PATIENT')) return 'PATIENT';
    return 'USER';
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      const accessToken = res.accessToken;
      localStorage.setItem('token', accessToken);
      setToken(accessToken);

      // Lấy thông tin user hiện tại
      try {
        const userInfo = await authApi.getMyInfo();
        localStorage.setItem('user', JSON.stringify(userInfo));
        setUser(userInfo);
      } catch (err) {
        const fallbackUser = { email };
        localStorage.setItem('user', JSON.stringify(fallbackUser));
        setUser(fallbackUser);
      }
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        role: getRole(),
        isAuthenticated: !!token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
