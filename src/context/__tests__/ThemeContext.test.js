import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../../context/ThemeContext';

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

beforeEach(() => {
  localStorage.clear();
});

/**
 * Minimal wrapper: just ThemeProvider — no auth or cart needed for context tests.
 */
const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;

// ---------------------------------------------------------------------------
// Criterion 3 — ThemeProvider initialises isDark from localStorage on mount
// ---------------------------------------------------------------------------

describe('useTheme — initialisation from localStorage (criterion 3)', () => {
  test('criterion 3: initialises isDark as true when shopTheme is pre-seeded as "dark"', () => {
    // Seed localStorage BEFORE mount so ThemeProvider reads it on initialisation
    localStorage.setItem('shopTheme', 'dark');

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.isDark).toBe(true);
  });

  test('criterion 3: initialises isDark as false when shopTheme is absent from localStorage', () => {
    // No seed — key is absent; default must be light (isDark === false)
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.isDark).toBe(false);
  });

  test('criterion 3: initialises isDark as false when shopTheme is "light"', () => {
    localStorage.setItem('shopTheme', 'light');

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.isDark).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Criterion 4 — toggleTheme writes correct value to localStorage
// ---------------------------------------------------------------------------

describe('useTheme — localStorage persistence on toggle (criterion 4)', () => {
  test('criterion 4: toggleTheme writes "dark" to localStorage when switching light → dark', () => {
    // No seed → starts in light mode (isDark === false)
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.isDark).toBe(false);

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.isDark).toBe(true);
    expect(localStorage.getItem('shopTheme')).toBe('dark');
  });

  test('criterion 4: toggleTheme writes "light" to localStorage when switching dark → light', () => {
    // Seed dark so we start in dark mode
    localStorage.setItem('shopTheme', 'dark');

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.isDark).toBe(true);

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.isDark).toBe(false);
    expect(localStorage.getItem('shopTheme')).toBe('light');
  });

  test('criterion 4: localStorage key is "shopTheme" (not another key)', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.toggleTheme();
    });

    // The written key must be exactly 'shopTheme'
    expect(localStorage.getItem('shopTheme')).toBe('dark');
    // No other theme-related key should have been written
    expect(localStorage.getItem('theme')).toBeNull();
    expect(localStorage.getItem('darkMode')).toBeNull();
  });

  test('criterion 4: toggleTheme updates isDark and localStorage consistently on repeated calls', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    // light → dark
    act(() => { result.current.toggleTheme(); });
    expect(result.current.isDark).toBe(true);
    expect(localStorage.getItem('shopTheme')).toBe('dark');

    // dark → light
    act(() => { result.current.toggleTheme(); });
    expect(result.current.isDark).toBe(false);
    expect(localStorage.getItem('shopTheme')).toBe('light');

    // light → dark again
    act(() => { result.current.toggleTheme(); });
    expect(result.current.isDark).toBe(true);
    expect(localStorage.getItem('shopTheme')).toBe('dark');
  });
});
