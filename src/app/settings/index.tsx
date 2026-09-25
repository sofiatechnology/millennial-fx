import { useAppTheme } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { Fragment } from 'react';
import { ScrollView } from 'react-native';
import { Divider, List } from 'react-native-paper';

const SECTIONS = [
  {
    href: '/settings/appearance',
    icon: 'palette-outline',
    title: 'Appearance',
    description: 'Light, dark, or system color scheme',
  },
  {
    href: '/settings/about',
    icon: 'information-outline',
    title: 'About',
    description: 'Version, feedback, and privacy',
  },
] as const;

export default function SettingsScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={{ paddingVertical: 8 }}>
      {SECTIONS.map((section, index) => (
        <Fragment key={section.href}>
          <List.Item
            title={section.title}
            description={section.description}
            onPress={() => router.push(section.href)}
            titleStyle={{ color: colors.onSurface }}
            descriptionStyle={{ color: colors.onSurfaceVariant }}
            left={(props) => (
              <List.Icon {...props} icon={section.icon} color={colors.onSurfaceVariant} />
            )}
            right={(props) => (
              <List.Icon {...props} icon="chevron-right" color={colors.onSurfaceVariant} />
            )}
          />
          {index < SECTIONS.length - 1 ? (
            <Divider style={{ backgroundColor: colors.outlineVariant }} />
          ) : null}
        </Fragment>
      ))}
    </ScrollView>
  );
}
