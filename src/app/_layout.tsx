import '../global.css';

import { AppShell } from '@/components/app-shell';
import { buildPaperTheme, ThemeProvider, useAppTheme } from '@/constants/theme';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { PaperProvider } from 'react-native-paper';

export default function Layout() {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}

function ThemedApp() {
  const { colors, scheme } = useAppTheme();
  const paperTheme = useMemo(
    () => buildPaperTheme(scheme, colors),
    [scheme, colors],
  );

  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <AppShell>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.surfaceContainerLow },
            animation: 'fade',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="news" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="about" />
        </Stack>
      </AppShell>
    </PaperProvider>
  );
}
