/**
 * theme.ts
 * Material Design 3 tokens for Millennial FX.
 *
 * Color hex values live only here (and the matching CSS custom properties
 * in src/global.css). Components read semantic roles — primary, surface
 * containers, on-surface, outline — and light/dark mode swaps this object.
 *
 * Seed color: #35668E (Material Theme Builder).
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Platform, useColorScheme, type ViewStyle } from 'react-native';
import {
  configureFonts,
  MD3DarkTheme,
  MD3LightTheme,
  type MD3Theme,
} from 'react-native-paper';

export const seedColor = '#35668E';

const brandFont =
  Platform.select({
    web: 'Inter, Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
    ios: 'System',
    default: 'sans-serif',
  }) ?? 'sans-serif';

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

/** M3 corner scale. Cards, drawers, and dialogs use extraLarge. Controls use full. */
export const shape = {
  none: 0,
  extraSmall: 4,
  small: 8,
  medium: 12,
  large: 16,
  extraLarge: 28,
  full: 9999,
} as const;

/** M3 standard easing and durations (200–400ms). */
export const motion = {
  durationShort: 200,
  durationMedium: 300,
  durationLong: 400,
  easingStandard: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
} as const;

/** M3 window-size classes and navigation widths. */
export const layout = {
  compact: 600,
  expanded: 1240,
  drawerWidth: 360,
  railWidth: 80,
  navBarHeight: 80,
} as const;

export type NavigationLayout = 'bar' | 'rail' | 'drawer';

export function navigationLayout(width: number): NavigationLayout {
  if (width < layout.compact) return 'bar';
  if (width <= layout.expanded) return 'rail';
  return 'drawer';
}

type TypeRole = {
  fontFamily: string;
  fontWeight: '400' | '500';
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
};

/** M3 typescale. Sizes, weights, line height, and tracking match the spec. */
export const typeScale: Record<string, TypeRole> = {
  displayLarge: { fontFamily: brandFont, fontWeight: '400', fontSize: 57, lineHeight: 64, letterSpacing: -0.25 },
  displayMedium: { fontFamily: brandFont, fontWeight: '400', fontSize: 45, lineHeight: 52, letterSpacing: 0 },
  displaySmall: { fontFamily: brandFont, fontWeight: '400', fontSize: 36, lineHeight: 44, letterSpacing: 0 },
  headlineLarge: { fontFamily: brandFont, fontWeight: '400', fontSize: 32, lineHeight: 40, letterSpacing: 0 },
  headlineMedium: { fontFamily: brandFont, fontWeight: '400', fontSize: 28, lineHeight: 36, letterSpacing: 0 },
  headlineSmall: { fontFamily: brandFont, fontWeight: '400', fontSize: 24, lineHeight: 32, letterSpacing: 0 },
  titleLarge: { fontFamily: brandFont, fontWeight: '400', fontSize: 22, lineHeight: 28, letterSpacing: 0 },
  titleMedium: { fontFamily: brandFont, fontWeight: '500', fontSize: 16, lineHeight: 24, letterSpacing: 0.15 },
  titleSmall: { fontFamily: brandFont, fontWeight: '500', fontSize: 14, lineHeight: 20, letterSpacing: 0.1 },
  bodyLarge: { fontFamily: brandFont, fontWeight: '400', fontSize: 16, lineHeight: 24, letterSpacing: 0.5 },
  bodyMedium: { fontFamily: brandFont, fontWeight: '400', fontSize: 14, lineHeight: 20, letterSpacing: 0.25 },
  bodySmall: { fontFamily: brandFont, fontWeight: '400', fontSize: 12, lineHeight: 16, letterSpacing: 0.4 },
  labelLarge: { fontFamily: brandFont, fontWeight: '500', fontSize: 14, lineHeight: 20, letterSpacing: 0.1 },
  labelMedium: { fontFamily: brandFont, fontWeight: '500', fontSize: 12, lineHeight: 16, letterSpacing: 0.5 },
  labelSmall: { fontFamily: brandFont, fontWeight: '500', fontSize: 11, lineHeight: 16, letterSpacing: 0.5 },
};

function paperFonts() {
  return configureFonts({ config: typeScale });
}

/** Web-only transition. Native relies on Paper's ripple and state layers. */
export function motionStyle(property: string): ViewStyle {
  if (Platform.OS !== 'web') return {};
  return {
    transitionProperty: property,
    transitionDuration: `${motion.durationMedium}ms`,
    transitionTimingFunction: motion.easingStandard,
  } as ViewStyle;
}

/** Filled card: tonal surface, no shadow. */
export function filledSurfaceStyle(colors: ThemeColors): ViewStyle {
  return {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: shape.extraLarge,
    boxShadow: 'none',
  };
}

/** Outlined card: lowest container plus a 1px outline-variant stroke. */
export function outlinedSurfaceStyle(colors: ThemeColors): ViewStyle {
  return {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: shape.extraLarge,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    boxShadow: 'none',
  };
}

/** Pill controls: buttons, chips, search, FABs. */
export const pillStyle: ViewStyle = {
  borderRadius: shape.full,
};

/** Map the app palette onto React Native Paper's Material 3 theme. */
export function buildPaperTheme(
  scheme: 'light' | 'dark',
  colors: ThemeColors,
): MD3Theme {
  const base = scheme === 'dark' ? MD3DarkTheme : MD3LightTheme;

  return {
    ...base,
    roundness: shape.extraSmall,
    fonts: paperFonts(),
    colors: {
      ...base.colors,
      primary: colors.primary,
      onPrimary: colors.onPrimary,
      primaryContainer: colors.primaryContainer,
      onPrimaryContainer: colors.onPrimaryContainer,
      secondary: colors.secondary,
      onSecondary: colors.onSecondary,
      secondaryContainer: colors.secondaryContainer,
      onSecondaryContainer: colors.onSecondaryContainer,
      tertiary: colors.tertiary,
      onTertiary: colors.onTertiary,
      tertiaryContainer: colors.tertiaryContainer,
      onTertiaryContainer: colors.onTertiaryContainer,
      error: colors.error,
      onError: colors.onError,
      errorContainer: colors.errorContainer,
      onErrorContainer: colors.onErrorContainer,
      background: colors.background,
      onBackground: colors.onBackground,
      surface: colors.surface,
      onSurface: colors.onSurface,
      surfaceVariant: colors.surfaceVariant,
      onSurfaceVariant: colors.onSurfaceVariant,
      outline: colors.outline,
      outlineVariant: colors.outlineVariant,
      shadow: colors.shadow,
      scrim: colors.scrim,
      inverseSurface: colors.inverseSurface,
      inverseOnSurface: colors.inverseOnSurface,
      inversePrimary: colors.inversePrimary,
      elevation: {
        level0: 'transparent',
        level1: colors.surfaceContainerLow,
        level2: colors.surfaceContainer,
        level3: colors.surfaceContainerHigh,
        level4: colors.surfaceContainerHigh,
        level5: colors.surfaceContainerHighest,
      },
    },
  };
}

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

  const scheme: 'light' | 'dark' =
    choice === 'system'
      ? systemScheme === 'dark'
        ? 'dark'
        : 'light'
      : choice;

  const colors = useMemo<ThemeColors>(
    () => (scheme === 'dark' ? darkColors : lightColors) as ThemeColors,
    [scheme],
  );

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    document.documentElement.dataset.colorScheme = scheme;
    document.documentElement.style.colorScheme = scheme;
  }, [scheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      colors,
      scheme,
      seedColor,
      choice,
      setChoice,
    }),
    [colors, scheme, choice],
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
