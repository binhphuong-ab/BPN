import { useState, useEffect, useCallback } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  user: { username: string; role: string } | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    loading: true,
    user: null,
  });

  const checkAuth = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      
      // Check if token exists in localStorage
      const token = localStorage.getItem('admin-token');
      
      if (!token) {
        setAuthState({
          isAuthenticated: false,
          loading: false,
          user: null,
        });
        return;
      }

      // Verify token with server
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setAuthState({
          isAuthenticated: true,
          loading: false,
          user: { username: 'nguyenbinhphuong', role: 'admin' },
        });
      } else {
        // Token is invalid, remove it
        localStorage.removeItem('admin-token');
        setAuthState({
          isAuthenticated: false,
          loading: false,
          user: null,
        });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('admin-token');
      setAuthState({
        isAuthenticated: false,
        loading: false,
        user: null,
      });
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('admin-token');
      setAuthState({
        isAuthenticated: false,
        loading: false,
        user: null,
      });
    }
  }, []);

  const login = useCallback((token: string) => {
    localStorage.setItem('admin-token', token);
    setAuthState({
      isAuthenticated: true,
      loading: false,
      user: { username: 'nguyenbinhphuong', role: 'admin' },
    });
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    ...authState,
    checkAuth,
    logout,
    login,
  };
}
