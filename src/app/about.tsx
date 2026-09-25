import { useAppTheme } from '@/constants/theme';
import { Stack } from 'expo-router';
import { Fragment } from 'react';
import { Linking, ScrollView, Share as RNShare, View } from 'react-native';
import { Divider, List, Text } from 'react-native-paper';

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
      }).catch(() => {
        Linking.openURL(PLAY_STORE_URL);
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
  const { colors } = useAppTheme();

  return (
    <>
      <Stack.Screen options={{ title: 'About' }} />
      <ScrollView contentContainerStyle={{ paddingVertical: 8, gap: 4 }}>
        <Text
          variant="titleSmall"
          selectable
          style={{
            color: colors.onSurfaceVariant,
            paddingHorizontal: 16,
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
              titleStyle={{ color: colors.onSurface }}
              left={(props) => (
                <List.Icon {...props} icon={item.icon} color={colors.onSurfaceVariant} />
              )}
              right={(props) => (
                <List.Icon {...props} icon="chevron-right" color={colors.onSurfaceVariant} />
              )}
            />
            {index < SUPPORT_ITEMS.length - 1 ? (
              <Divider style={{ backgroundColor: colors.outlineVariant }} />
            ) : null}
          </Fragment>
        ))}

        <View style={{ paddingTop: 24, paddingBottom: 20 }}>
          <Text
            variant="bodySmall"
            selectable
            style={{ color: colors.onSurfaceVariant, textAlign: 'center' }}
          >
            {`Version ${APP_VERSION}`}
          </Text>
        </View>
      </ScrollView>
    </>
  );
}
