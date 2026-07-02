
import { default as BarChart, default as Calculator, default as ShieldCheck } from "@expo/material-symbols/bar_chart.xml";
import SwapHoriz from "@expo/material-symbols/swap_horiz.xml";
import TrendingUp from "@expo/material-symbols/trending_up.xml";
import Warning from "@expo/material-symbols/warning.xml";

import { Icon } from "@expo/ui/jetpack-compose";
import { Stack } from "expo-router";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";

// ─── Types ───────────────────────────────────────────────────────────────────

interface InfoSection {
  icon: string;
  title: string;
  body: string;
  color: string;
  bg: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const SECTIONS: InfoSection[] = [
  {
    icon: "calculator-outline",
    title: "How It Works",
    color: "#1D4ED8",
    bg: "#EFF6FF",
    body: "Enter your account balance, the percentage of your capital you're willing to risk, your stop-loss in pips, and the currency pair. The calculator returns the number of lots and units you can safely trade to keep your risk within your defined limit.",
  },
  {
    icon: "shield-checkmark-outline",
    title: "Risk Management",
    color: "#059669",
    bg: "#ECFDF5",
    body: "Professional traders typically risk 1–2% per trade. Never exceed 5% on a single position. A stop-loss protects your account from large drawdowns — always set one before entering a trade.",
  },
  {
    icon: "trending-up-outline",
    title: "Lot Sizes Explained",
    color: "#7C3AED",
    bg: "#F5F3FF",
    body: "Standard lot = 100,000 units. Mini lot = 10,000 units. Micro lot = 1,000 units. Nano lot = 100 units. Beginners should start with micro or nano lots to limit risk while learning.",
  },
  {
    icon: "bar-chart-outline",
    title: "Pip Value",
    color: "#D97706",
    bg: "#FFFBEB",
    body: "A pip (Price Interest Point) is the smallest price move in a currency pair. For most pairs it equals 0.0001. For JPY pairs it equals 0.01. Pip value per lot = pip size × lot size ÷ current exchange rate.",
  },
  {
    icon: "swap-horizontal-outline",
    title: "Formula Used",
    color: "#0891B2",
    bg: "#ECFEFF",
    body: "Lot Size = (Account Balance × Risk %) ÷ (Stop Loss Pips × Pip Value per Lot)\n\nRisk Amount = Account Balance × (Risk % ÷ 100)\n\nPip Value = Pip Size × Lot Size ÷ Exchange Rate",
  },
  {
    icon: "warning-outline",
    title: "Important Disclaimer",
    color: "#DC2626",
    bg: "#FEF2F2",
    body: "This tool is for educational purposes only. Calculations are estimates based on the inputs provided. Always verify results with your broker. Forex trading involves significant risk and is not suitable for all investors. Past performance does not guarantee future results.",
  },
];

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function AboutScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "About",
          headerBackTitle: "Calculator",
        }}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Icon source={Calculator} contentDescription="Calculator" />
          </View>
          <Text style={styles.heroTitle}>Lot Size Calculator</Text>
          <Text style={styles.heroVersion}>Version 1.0.0</Text>
          <Text style={styles.heroSubtitle}>
            A precision risk management tool for forex traders
          </Text>
        </View>

        {/* Sections */}
        {SECTIONS.map((s) => (
          <View
            key={s.title}
            style={[styles.card, { borderLeftColor: s.color }]}
          >
            <View style={[styles.iconBadge, { backgroundColor: s.bg }]}>
              <Icon
                source={
                  s.icon === "calculator-outline"
                    ? Calculator
                    : s.icon === "shield-checkmark-outline"
                      ? ShieldCheck
                      : s.icon === "trending-up-outline"
                        ? TrendingUp
                        : s.icon === "bar-chart-outline"
                          ? BarChart
                          : s.icon === "swap-horizontal-outline"
                            ? SwapHoriz
                            : s.icon === "warning-outline"
                              ? Warning
                              : Calculator
                }
                contentDescription={s.title}
              />
              {/* <Ionicons name={s.icon} size={20} color={s.color} /> */}
            </View>
            <Text style={styles.cardTitle}>{s.title}</Text>
            <Text style={styles.cardBody}>{s.body}</Text>
          </View>
        ))}

        {/* Quick tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Quick Tips</Text>
          {[
            "Risk 1–2% per trade maximum",
            "Always set a stop-loss before trading",
            "Start with micro lots when testing strategies",
            "Keep a trading journal to track results",
            "Never risk money you can't afford to lose",
          ].map((tip, i) => (
            <View key={i} style={styles.tipRow}>
              <View style={styles.tipDot} />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.footer}>
          Built for traders who take risk management seriously.
        </Text>
      </ScrollView>
    </>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  container: {
    padding: 16,
    paddingBottom: 48,
  },
  // Hero
  hero: {
    alignItems: "center",
    paddingVertical: 28,
    marginBottom: 8,
  },
  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  heroVersion: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  // Cards
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  cardBody: {
    fontSize: 13.5,
    color: "#4B5563",
    lineHeight: 20,
  },
  // Tips
  tipsCard: {
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#F9FAFB",
    marginBottom: 12,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 8,
  },
  tipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#60A5FA",
    marginTop: 6,
  },
  tipText: {
    flex: 1,
    fontSize: 13.5,
    color: "#D1D5DB",
    lineHeight: 20,
  },
  footer: {
    textAlign: "center",
    fontSize: 12,
    color: "#9CA3AF",
    fontStyle: "italic",
  },
});
