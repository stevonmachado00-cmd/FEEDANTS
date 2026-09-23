import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../utils/colors';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme === 'dark') {
        setIsDarkMode(true);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    await AsyncStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const themeColors = isDarkMode
    ? {
        ...COLORS,
        background: '#121212',
        surface: '#1E1E1E',
        textPrimary: '#FFFFFF',
        textSecondary: '#A0A0A0',
      }
    : {
        ...COLORS,
        background: COLORS.offWhite,
        surface: COLORS.white,
      };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme: themeColors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
