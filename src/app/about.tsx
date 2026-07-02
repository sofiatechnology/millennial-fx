import { seedColor, useAppTheme } from '@/constants/theme';
import ChevronRight from "@expo/material-symbols/chevron_right.xml";
import Feedback from "@expo/material-symbols/feedback.xml";
import Policy from "@expo/material-symbols/policy.xml";
import Share from "@expo/material-symbols/share.xml";
import ThumbUp from "@expo/material-symbols/thumb_up.xml";
import {
  HorizontalDivider,
  Host,
  Icon,
  LazyColumn,
  ListItem,
  Text,
} from "@expo/ui/jetpack-compose";
import { background, clickable, fillMaxWidth, padding } from "@expo/ui/jetpack-compose/modifiers";
import { Stack } from "expo-router";
import { Fragment } from "react";
import { Linking, Share as RNShare } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// App metadata — wire these up to your real store listing / policy / etc.
const APP_NAME = "Lot Size Calculator";
const APP_VERSION = "1.0.0";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=your.package.name";
const FEEDBACK_EMAIL = "mailto:support@example.com?subject=Lot%20Size%20Calculator%20Feedback";
const PRIVACY_POLICY_URL = "https://example.com/privacy";

interface SupportItem {
  icon: any;
  label: string;
  onSelect: () => void;
}

const SUPPORT_ITEMS: SupportItem[] = [
  {
    icon: Share,
    label: "Share App",
    onSelect: () => {
      RNShare.share({
        message: `Check out ${APP_NAME} — a precision risk management tool for forex traders. ${PLAY_STORE_URL}`,
      });
    },
  },
  {
    icon: ThumbUp,
    label: "Rate us",
    onSelect: () => {
      Linking.openURL(PLAY_STORE_URL);
    },
  },
  {
    icon: Feedback,
    label: "Feedback",
    onSelect: () => {
      Linking.openURL(FEEDBACK_EMAIL);
    },
  },
  {
    icon: Policy,
    label: "Privacy Policy",
    onSelect: () => {
      Linking.openURL(PRIVACY_POLICY_URL);
    },
  },
];

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function AboutScreen() {
  const { colors, scheme } = useAppTheme();

  return (
    <>
      <Stack.Screen
        options={{
          title: "About",
          headerBackTitle: "Calculator",
        }}
      />

      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <Host style={{ flex: 1 }} colorScheme={scheme} seedColor={seedColor}>
          <LazyColumn modifiers={[fillMaxWidth()]}>
            <Text
              color={colors.onBackground}
              style={{ typography: "titleMedium", fontWeight: "700" }}
              modifiers={[padding(20, 24, 20, 8)]}
            >
              Support us
            </Text>

            {SUPPORT_ITEMS.map((item, index) => (
              <Fragment key={item.label}>
                <ListItem modifiers={[clickable(item.onSelect), fillMaxWidth()]}>
                  <ListItem.LeadingContent>
                    <Icon source={item.icon} size={22} tint={colors.primary} />
                  </ListItem.LeadingContent>
                  <ListItem.HeadlineContent>
                    <Text style={{ typography: "bodyLarge" }}>{item.label}</Text>
                  </ListItem.HeadlineContent>
                  <ListItem.TrailingContent>
                    <Icon
                      source={ChevronRight}
                      size={20}
                      tint={colors.onSurfaceVariant}
                    />
                  </ListItem.TrailingContent>
                </ListItem>
                {index < SUPPORT_ITEMS.length - 1 && (
                  <HorizontalDivider color={colors.outlineVariant} />
                )}
              </Fragment>
            ))}

            <ListItem
              modifiers={[
                fillMaxWidth(),
                background(colors.surfaceContainer),
                padding(0, 20, 0, 20),
              ]}
            >
              <ListItem.HeadlineContent>
                <Text
                  color={colors.onSurfaceVariant}
                  style={{ typography: "bodySmall", textAlign: "center" }}
                  modifiers={[fillMaxWidth()]}
                >
                  {`Version ${APP_VERSION}`}
                </Text>
              </ListItem.HeadlineContent>
            </ListItem>
          </LazyColumn>
        </Host>
      </SafeAreaView>
    </>
  );
}