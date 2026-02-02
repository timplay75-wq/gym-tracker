import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

/**
 * Hook for accessing theme context
 * 
 * @example
 * ```tsx
 * const { theme, isDark, toggleTheme, setTheme } = useTheme();
 * 
 * // Toggle between light and dark
 * <button onClick={toggleTheme}>
 *   {isDark ? '🌙' : '☀️'}
 * </button>
 * 
 * // Set specific theme
 * <select value={theme} onChange={(e) => setTheme(e.target.value)}>
 *   <option value="light">Light</option>
 *   <option value="dark">Dark</option>
 *   <option value="system">System</option>
 * </select>
 * ```
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}
