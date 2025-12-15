import { useState, useEffect, useCallback, useRef } from 'react';
import { AuthContext } from './contexts';
import { authApi } from '../services/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(() => !!localStorage.getItem('token')); // Only loading if we have a token to verify
  const initialized = useRef(false);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore logout errors
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const token = localStorage.getItem('token');

    if (!token) return;

    authApi.getUser()
      .then(response => {
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
      })
      .catch(() => {
        logout();
      })
      .finally(() => setLoading(false));
  }, [logout]);

  const login = async (email, password) => {
    const response = await authApi.login(email, password);
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    setUser(response.user);
    return response;
  };

  const register = async (data) => {
    const response = await authApi.register(data);
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
    }
    return response;
  };

  const isAdmin = () => user?.role?.name === 'admin';
  const isIncharge = () => user?.role?.name === 'incharge';
  const isUser = () => user?.role?.name === 'user';
  const isStaff = () => isAdmin() || isIncharge();

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      isAdmin,
      isIncharge,
      isUser,
      isStaff,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
