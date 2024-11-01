import { useCallback, useContext } from 'react';
import { AuthContext } from '../context/auth';

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const login = useCallback(async (options = {}) => {
    const response = await fetch('/api/auth/login');
    const { url } = await response.json();
    window.location.href = url;
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout');
    window.location.href = '/';
  }, []);

  return {
    user: context.user,
    loading: context.loading,
    error: context.error,
    login,
    logout,
    isAuthenticated: !!context.user
  };
}