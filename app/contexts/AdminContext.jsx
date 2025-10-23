'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(null);
  const [sessionExpiry, setSessionExpiry] = useState(null);

  // Check for existing session on load
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('adminToken');
      const savedExpiry = localStorage.getItem('sessionExpiry');

      if (token) {
        try {
          // Check if session has expired
          if (savedExpiry && parseInt(savedExpiry) < new Date().getTime()) {
            // Session expired
            localStorage.removeItem('adminToken');
            localStorage.removeItem('sessionExpiry');
            setIsLoading(false);
            return;
          }

          const response = await fetch('/api/auth/verify', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setIsAuthenticated(true);
            setUser(data.user);
            // Use existing expiry or set new one
            if (savedExpiry) {
              setSessionExpiry(parseInt(savedExpiry));
            } else {
              const expiry = new Date().getTime() + (30 * 60 * 1000);
              setSessionExpiry(expiry);
              localStorage.setItem('sessionExpiry', expiry.toString());
            }
          } else {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('sessionExpiry');
          }
        } catch (error) {
          console.error('Session verification failed:', error);
          localStorage.removeItem('adminToken');
          localStorage.removeItem('sessionExpiry');
        }
      }

      setIsLoading(false);
    };

    checkSession();
  }, []);

  const login = async (username, password) => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        setIsAuthenticated(true);
        setUser(data.user);
        setLoginAttempts(0);
        setLockoutTime(null);
        // Set session expiry (30 minutes from now)
        const expiry = new Date().getTime() + (30 * 60 * 1000);
        setSessionExpiry(expiry);
        localStorage.setItem('sessionExpiry', expiry.toString());
        return { success: true };
      } else {
        setLoginAttempts(prev => prev + 1);
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('sessionExpiry');
    setIsAuthenticated(false);
    setUser(null);
    setLoginAttempts(0);
    setLockoutTime(null);
    setSessionExpiry(null);
  };

  const getSessionTimeRemaining = () => {
    if (!sessionExpiry) {
      const savedExpiry = localStorage.getItem('sessionExpiry');
      if (savedExpiry) {
        return parseInt(savedExpiry) - new Date().getTime();
      }
      return 0;
    }
    return sessionExpiry - new Date().getTime();
  };

  const extendSession = () => {
    const newExpiry = new Date().getTime() + (15 * 60 * 1000); // Extend by 15 minutes
    setSessionExpiry(newExpiry);
    localStorage.setItem('sessionExpiry', newExpiry.toString());
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    loginAttempts,
    lockoutTime,
    getSessionTimeRemaining,
    extendSession,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};