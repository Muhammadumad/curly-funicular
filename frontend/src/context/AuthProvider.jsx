import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import api from '../services/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Consolidated auth validation runner
  const checkAuth = async () => {
    try {
      const response = await api.get('/api/user');
      setUser(response.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Triggers only once when the provider mounts to the DOM tree
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkAuth();
  }, []);

  const login = async (email, password) => {
    await api.get('/sanctum/csrf-cookie');
    const response = await api.post('/api/login', { email, password });
    setUser(response.data.user);
    return response.data;
  };

  const register = async (name, email, password, passwordConfirmation) => {
    await api.get('/sanctum/csrf-cookie');
    const response = await api.post('/api/register', {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    });
    setUser(response.data.user);
    return response.data;
  };

  const logout = async () => {
    await api.post('/api/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
