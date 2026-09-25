import { outlinedSurfaceStyle, shape, useAppTheme, type ColorSchemeChoice } from '@/constants/theme';
import { ScrollView, View } from 'react-native';
import { SegmentedButtons, Surface, Text } from 'react-native-paper';

const SCHEME_OPTIONS: { value: ColorSchemeChoice; label: string; icon: string }[] = [
  { value: 'system', label: 'System', icon: 'theme-light-dark' },
  { value: 'light', label: 'Light', icon: 'white-balance-sunny' },
  { value: 'dark', label: 'Dark', icon: 'weather-night' },
];

export default function SettingsScreen() {
  const { colors, choice, setChoice, scheme } = useAppTheme();

  const hint =
    choice === 'system'
      ? `Following the system setting, which is ${scheme}.`
      : `Using the ${scheme} color scheme.`;

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
      <Surface mode="flat" elevation={0} style={{ padding: 24, gap: 16, ...outlinedSurfaceStyle(colors) }}>
        <View style={{ gap: 4 }}>
          <Text variant="titleLarge" selectable style={{ color: colors.onSurface }}>
            Color scheme
          </Text>
          <Text variant="bodyMedium" selectable style={{ color: colors.onSurfaceVariant }}>
            Light and dark mode swap semantic color roles. Surfaces, text, and
            controls all read those roles, so the whole app updates together.
          </Text>
        </View>
        <SegmentedButtons
          value={choice}
          onValueChange={(value) => setChoice(value as ColorSchemeChoice)}
          buttons={SCHEME_OPTIONS}
          style={{ borderRadius: shape.full }}
        />
        <Text variant="bodySmall" selectable style={{ color: colors.onSurfaceVariant }}>
          {hint}
        </Text>
      </Surface>
    </ScrollView>
  );
}
