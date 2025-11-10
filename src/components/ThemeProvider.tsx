import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'high-contrast';

interface AccessibilitySettings {
  fontSize: 'normal' | 'large' | 'extra-large';
  reduceMotion: boolean;
  screenReaderOptimized: boolean;
}

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  accessibility: AccessibilitySettings;
  updateAccessibility: (settings: Partial<AccessibilitySettings>) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: React.PropsWithChildren) {
  const [theme, setTheme] = useState<Theme>('light');
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    fontSize: 'normal',
    reduceMotion: false,
    screenReaderOptimized: false,
  });

  useEffect(() => {
    // Remove all theme classes
    document.documentElement.classList.remove('light', 'dark', 'high-contrast');
    
    // Add current theme class
    document.documentElement.classList.add(theme);
    
    // Update font size
    const fontSizeMap = {
      normal: '16px',
      large: '18px',
      'extra-large': '20px',
    };
    document.documentElement.style.setProperty('--font-size', fontSizeMap[accessibility.fontSize]);
    
    // Apply reduce motion
    if (accessibility.reduceMotion) {
      document.documentElement.style.setProperty('--transition-duration', '0ms');
    } else {
      document.documentElement.style.setProperty('--transition-duration', '200ms');
    }
  }, [theme, accessibility]);

  const updateAccessibility = (settings: Partial<AccessibilitySettings>) => {
    setAccessibility(prev => ({ ...prev, ...settings }));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, accessibility, updateAccessibility }}>
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
