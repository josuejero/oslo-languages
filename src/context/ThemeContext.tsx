// src/context/ThemeContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { tokens } from '@/styles/colors';

type ThemeMode = 'light' | 'dark' | 'highContrast';
type ColorSchemePreference = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: ThemeMode;
  colorScheme: ColorSchemePreference;
  setColorScheme: (scheme: ColorSchemePreference) => void;
  toggleHighContrast: () => void;
  isHighContrast: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorScheme, setColorScheme] = useState<ColorSchemePreference>('system');
  const [isHighContrast, setIsHighContrast] = useState(false);

  // Determine the actual theme mode based on color scheme preference
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    // Load saved preferences from localStorage
    const savedScheme = localStorage.getItem('color-scheme') as ColorSchemePreference;
    const savedContrast = localStorage.getItem('high-contrast') === 'true';

    if (savedScheme) setColorScheme(savedScheme);
    if (savedContrast) setIsHighContrast(true);
  }, []);

  useEffect(() => {
    const updateTheme = () => {
      let newMode: ThemeMode;

      if (isHighContrast) {
        newMode = 'highContrast';
      } else if (colorScheme === 'system') {
        newMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } else {
        newMode = colorScheme;
      }

      setMode(newMode);
      document.documentElement.setAttribute('data-theme', newMode);

      // Apply theme colors
      const colors = isHighContrast ? tokens.highContrast : tokens[newMode as keyof typeof tokens];
      Object.entries(colors).forEach(([category, values]) => {
        Object.entries(values as Record<string, string>).forEach(([name, value]) => {
          document.documentElement.style.setProperty(
            `--color-${category}-${name}`,
            value
          );
        });
      });
    };

    updateTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => updateTheme();
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, [colorScheme, isHighContrast]);

  const toggleHighContrast = () => {
    const newValue = !isHighContrast;
    setIsHighContrast(newValue);
    localStorage.setItem('high-contrast', String(newValue));
  };

  const handleColorSchemeChange = (scheme: ColorSchemePreference) => {
    setColorScheme(scheme);
    localStorage.setItem('color-scheme', scheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        mode,
        colorScheme,
        setColorScheme: handleColorSchemeChange,
        toggleHighContrast,
        isHighContrast,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}