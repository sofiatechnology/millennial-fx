import { buildPaperTheme, ThemeProvider, useAppTheme } from '@/constants/theme';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { IconButton, PaperProvider } from 'react-native-paper';

export default function Layout() {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}

function ThemedApp() {
  const router = useRouter();
  const { colors, scheme } = useAppTheme();
  const paperTheme = useMemo(
    () => buildPaperTheme(scheme, colors),
    [scheme, colors],
  );

  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.onSurface,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Lot Size Calculator',
            headerRight: () => (
              <IconButton
                icon="dots-vertical"
                size={24}
                onPress={() => router.push('/about')}
                accessibilityLabel="More options to about screen"
              />
            ),
          }}
        />
        <Stack.Screen
          name="about"
          options={{
            title: 'About Millennial FX',
            presentation: 'modal',
          }}
        />
      </Stack>
    </PaperProvider>
  );
}
