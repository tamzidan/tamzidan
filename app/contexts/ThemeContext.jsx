'use client';

import React, { createContext, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Force dark theme untuk semua user
  const theme = 'dark';

  useEffect(() => {
    // Selalu set dark mode
    document.documentElement.classList.add('dark');
    // Hapus localStorage theme agar tidak ada konflik
    localStorage.removeItem('theme');
  }, []);

  // toggleTheme tidak melakukan apa-apa, hanya untuk backward compatibility
  const toggleTheme = () => {
    // Dark mode permanen, tidak bisa diubah
    console.log('Theme is permanently set to dark mode');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};