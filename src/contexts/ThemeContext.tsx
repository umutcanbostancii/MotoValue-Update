import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || 'system';
  });

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Tema değiştiğinde localStorage'a kaydet
    localStorage.setItem('theme', theme);

    // Sistem teması için medya sorgusu
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Temayı uygula
    const applyTheme = () => {
      const shouldBeDark = 
        theme === 'dark' || 
        (theme === 'system' && mediaQuery.matches);

      document.documentElement.classList.toggle('dark', shouldBeDark);
      setIsDark(shouldBeDark);
    };

    applyTheme();

    // Sistem teması değiştiğinde dinle
    const listener = () => applyTheme();
    mediaQuery.addEventListener('change', listener);

    return () => mediaQuery.removeEventListener('change', listener);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
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