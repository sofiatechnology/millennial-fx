/**
 * theme.ts
 * Single source of truth for app theming, generated from your
 * Material Theme Builder export (seed #35668E).
 *
 * - `lightColors` / `darkColors` -> use anywhere in plain React Native
 *   (StyleSheet, inline styles, styled-components, NativeWind, etc.)
 * - `seedColor` -> pass to <Host seedColor={seedColor} .../> from
 *   @expo/ui/jetpack-compose so native Compose widgets (Android) are
 *   seeded from the SAME color and stay visually consistent with the
 *   rest of your app.
 * - `useAppTheme()` -> hook that returns the right palette for the
 *   current color scheme, with manual override support.
 */

import React, { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

// -----------------------------------------------------------------------
// 1. Seed color (also feed this to @expo/ui's <Host seedColor="..."/>)
// -----------------------------------------------------------------------
export const seedColor = '#35668E';

// -----------------------------------------------------------------------
// 2. Palettes pulled straight from your Material Theme Builder export
//    (light + dark schemes; add light-medium-contrast / dark-high-contrast
//    etc. the same way if you need accessibility variants later)
// -----------------------------------------------------------------------
export const lightColors = {
  primary: '#174E75',
  onPrimary: '#FFFFFF',
  primaryContainer: '#35668E',
  onPrimaryContainer: '#C6E1FF',
  secondary: '#4F6071',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#D3E4F9',
  onSecondaryContainer: '#556677',
  tertiary: '#613C6C',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#7B5485',
  onTertiaryContainer: '#F9D2FF',
  error: '#BA1A1A',
  onError: '#FFFFFF',
  errorContainer: '#FFDAD6',
  onErrorContainer: '#93000A',
  background: '#F9F9FD',
  onBackground: '#191C1F',
  surface: '#F9F9FD',
  onSurface: '#191C1F',
  surfaceVariant: '#DEE3EB',
  onSurfaceVariant: '#41474E',
  outline: '#72787F',
  outlineVariant: '#C1C7CF',
  shadow: '#000000',
  scrim: '#000000',
  inverseSurface: '#2E3133',
  inverseOnSurface: '#F0F0F4',
  inversePrimary: '#9CCBF8',
  primaryFixed: '#CDE5FF',
  onPrimaryFixed: '#001D32',
  primaryFixedDim: '#9CCBF8',
  onPrimaryFixedVariant: '#114A71',
  secondaryFixed: '#D3E4F9',
  onSecondaryFixed: '#0B1D2C',
  secondaryFixedDim: '#B7C8DC',
  onSecondaryFixedVariant: '#384859',
  tertiaryFixed: '#FAD7FF',
  onTertiaryFixed: '#2E0C39',
  tertiaryFixedDim: '#E5B7EF',
  onTertiaryFixedVariant: '#5D3968',
  surfaceDim: '#D9DADD',
  surfaceBright: '#F9F9FD',
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#F3F3F7',
  surfaceContainer: '#EDEEF1',
  surfaceContainerHigh: '#E7E8EC',
  surfaceContainerHighest: '#E2E2E6',
} as const;

export const darkColors = {
  primary: '#9CCBF8',
  onPrimary: '#003352',
  primaryContainer: '#35668E',
  onPrimaryContainer: '#C6E1FF',
  secondary: '#B7C8DC',
  onSecondary: '#213241',
  secondaryContainer: '#384859',
  onSecondaryContainer: '#A6B7CA',
  tertiary: '#E5B7EF',
  onTertiary: '#452250',
  tertiaryContainer: '#7B5485',
  onTertiaryContainer: '#F9D2FF',
  error: '#FFB4AB',
  onError: '#690005',
  errorContainer: '#93000A',
  onErrorContainer: '#FFDAD6',
  background: '#111416',
  onBackground: '#E2E2E6',
  surface: '#111416',
  onSurface: '#E2E2E6',
  surfaceVariant: '#41474E',
  onSurfaceVariant: '#C1C7CF',
  outline: '#8B9199',
  outlineVariant: '#41474E',
  shadow: '#000000',
  scrim: '#000000',
  inverseSurface: '#E2E2E6',
  inverseOnSurface: '#2E3133',
  inversePrimary: '#31628A',
  primaryFixed: '#CDE5FF',
  onPrimaryFixed: '#001D32',
  primaryFixedDim: '#9CCBF8',
  onPrimaryFixedVariant: '#114A71',
  secondaryFixed: '#D3E4F9',
  onSecondaryFixed: '#0B1D2C',
  secondaryFixedDim: '#B7C8DC',
  onSecondaryFixedVariant: '#384859',
  tertiaryFixed: '#FAD7FF',
  onTertiaryFixed: '#2E0C39',
  tertiaryFixedDim: '#E5B7EF',
  onTertiaryFixedVariant: '#5D3968',
  surfaceDim: '#111416',
  surfaceBright: '#37393C',
  surfaceContainerLowest: '#0C0E11',
  surfaceContainerLow: '#191C1F',
  surfaceContainer: '#1E2023',
  surfaceContainerHigh: '#282A2D',
  surfaceContainerHighest: '#333538',
} as const;

export type ThemeColors = typeof lightColors;
export type ColorSchemeChoice = 'light' | 'dark' | 'system';

// -----------------------------------------------------------------------
// 3. Context + provider so any screen/component can read the theme and
//    a settings screen can force light/dark instead of following system
// -----------------------------------------------------------------------
type ThemeContextValue = {
  colors: ThemeColors;
  scheme: 'light' | 'dark';
  seedColor: string;
  choice: ColorSchemeChoice;
  setChoice: (choice: ColorSchemeChoice) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [choice, setChoice] = useState<ColorSchemeChoice>('system');

  // Fix: Ensure we only use 'light' or 'dark' by falling back to 'light'
  const scheme: 'light' | 'dark' = 
    choice === 'system' 
      ? (systemScheme === 'dark' ? 'dark' : 'light')  // Handle null, 'unspecified', etc.
      : choice;

  // Fix: Use type assertion to tell TypeScript this is definitely ThemeColors
  const colors = useMemo<ThemeColors>(
    () => (scheme === 'dark' ? darkColors : lightColors) as ThemeColors,
    [scheme]
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      colors,
      scheme,
      seedColor,
      choice,
      setChoice,
    }),
    [colors, scheme, choice]
  );

  return React.createElement(ThemeContext.Provider, { value }, children);
}

/** Read the current theme anywhere under <ThemeProvider>. */
export function useAppTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useAppTheme must be used within a <ThemeProvider>');
  }
  return ctx;
}