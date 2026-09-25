import { Divider, List, Surface, Text, useTheme } from 'react-native-paper';
import { Stack } from 'expo-router';
import { Fragment } from 'react';
import { Linking, ScrollView, Share as RNShare } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const APP_NAME = 'Lot Size Calculator';
const APP_VERSION = '1.0.0';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=your.package.name';
const FEEDBACK_EMAIL = 'mailto:support@example.com?subject=Lot%20Size%20Calculator%20Feedback';
const PRIVACY_POLICY_URL = 'https://example.com/privacy';

interface SupportItem {
  icon: string;
  label: string;
  onSelect: () => void;
}

const SUPPORT_ITEMS: SupportItem[] = [
  {
    icon: 'share-variant',
    label: 'Share App',
    onSelect: () => {
      RNShare.share({
        message: `Check out ${APP_NAME} — a precision risk management tool for forex traders. ${PLAY_STORE_URL}`,
      });
    },
  },
  {
    icon: 'thumb-up-outline',
    label: 'Rate us',
    onSelect: () => {
      Linking.openURL(PLAY_STORE_URL);
    },
  },
  {
    icon: 'message-text-outline',
    label: 'Feedback',
    onSelect: () => {
      Linking.openURL(FEEDBACK_EMAIL);
    },
  },
  {
    icon: 'shield-account-outline',
    label: 'Privacy Policy',
    onSelect: () => {
      Linking.openURL(PRIVACY_POLICY_URL);
    },
  },
];

export default function AboutScreen() {
  const theme = useTheme();

  return (
    <>
      <Stack.Screen
        options={{
          title: 'About',
          headerBackTitle: 'Calculator',
        }}
      />

      <SafeAreaView
        edges={['left', 'right', 'bottom']}
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      >
        <ScrollView contentContainerStyle={{ paddingVertical: 8, gap: 4 }}>
          <Text
            variant="titleMedium"
            selectable
            style={{
              color: theme.colors.onBackground,
              fontWeight: '700',
              paddingHorizontal: 20,
              paddingTop: 16,
              paddingBottom: 8,
            }}
          >
            Support us
          </Text>

          {SUPPORT_ITEMS.map((item, index) => (
            <Fragment key={item.label}>
              <List.Item
                title={item.label}
                onPress={item.onSelect}
                left={(props) => (
                  <List.Icon {...props} icon={item.icon} color={theme.colors.primary} />
                )}
                right={(props) => (
                  <List.Icon {...props} icon="chevron-right" color={theme.colors.onSurfaceVariant} />
                )}
              />
              {index < SUPPORT_ITEMS.length - 1 ? <Divider /> : null}
            </Fragment>
          ))}

          <Surface
            elevation={0}
            style={{
              paddingTop: 12,
              paddingBottom: 20,
              backgroundColor: theme.colors.elevation.level1,
            }}
          >
            <Text
              variant="bodySmall"
              selectable
              style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}
            >
              {`Version ${APP_VERSION}`}
            </Text>
          </Surface>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
