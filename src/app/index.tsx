import { LabeledDropdown } from "@/components/labeled-dropdown";
import { PriceDisplay } from "@/components/price-display";
import { ResultDialog } from "@/components/result-dialog";
import { ValidatedField } from "@/components/validated-field";
import { seedColor, useAppTheme } from '@/constants/theme';
import { useCalculator } from "@/hooks/use-calculator";
import { usePriceFetcher } from "@/hooks/use-price-fetcher";
import {
  Button,
  Column,
  Host,
  OutlinedButton,
  Row,
  Text,
  useNativeState,
} from "@expo/ui/jetpack-compose";
import {
  fillMaxWidth,
  paddingAll,
} from "@expo/ui/jetpack-compose/modifiers";
import { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Constants ────────────────────────────────────────────────────────────────

const CURRENCY_PAIRS = [
  "XAU/USD",
  "XAG/USD",
  "XRP/UST",
  "BTC/USD",
  "ETH/USD",
  "EUR/USD",
  "GBP/USD",
  "USD/JPY",
  "USD/CHF",
  "AUD/USD",
  "USD/CAD",
  "NZD/USD",
  "EUR/GBP",
  "EUR/JPY",
  "GBP/JPY",
];

const DEFAULTS = {
  currencyPair: "EUR/USD",
  accountBalance: "100000",
  riskPercent: "1",
  stopLossPips: "20",
  unitsToTrade: "",
};

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const { colors, scheme } = useAppTheme();
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  // Native-state-backed fields
  const currencyPair = useNativeState(DEFAULTS.currencyPair);
  const accountBalance = useNativeState(DEFAULTS.accountBalance);
  const riskPercent = useNativeState(DEFAULTS.riskPercent);
  const stopLossPips = useNativeState(DEFAULTS.stopLossPips);
  const unitsToTrade = useNativeState(DEFAULTS.unitsToTrade);

  // Custom hooks
  const { price, isLoading, lastUpdated, isFallback, error } = 
    usePriceFetcher(currencyPair.value);
  
  const { result, errors, calculate, reset, setErrors } = useCalculator();

  const handleCalculate = useCallback(() => {
    if (!price) {
      setErrors({ ...errors, accountBalance: "Unable to fetch current price" });
      return;
    }

    const inputs = {
      accountBalance: accountBalance.value,
      riskPercent: riskPercent.value,
      stopLossPips: stopLossPips.value,
      unitsToTrade: unitsToTrade.value,
      currencyPair: currencyPair.value,
    };

    const result = calculate(inputs, price);
    if (result) {
      setIsAlertOpen(true);
    }
  }, [price, currencyPair.value, errors]);

  const handleReset = () => {
    currencyPair.value = DEFAULTS.currencyPair;
    accountBalance.value = DEFAULTS.accountBalance;
    riskPercent.value = DEFAULTS.riskPercent;
    stopLossPips.value = DEFAULTS.stopLossPips;
    unitsToTrade.value = DEFAULTS.unitsToTrade;
    reset();
    setIsAlertOpen(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Host
        matchContents={{ vertical: true }}
        style={{ width: "100%" }}
        colorScheme={scheme}
        seedColor={seedColor}
      >
        <Column
          verticalArrangement={{ spacedBy: 16 }}
          modifiers={[fillMaxWidth(), paddingAll(16)]}
        >
          <Text color={colors.primary} style={{ typography: "bodyMedium" }}>
            Determine the exact currency units to buy or sell per trade, based
            on your risk rules and account balance.
          </Text>

          <PriceDisplay
            price={price}
            isLoading={isLoading}
            lastUpdated={lastUpdated}
            isFallback={isFallback}
            colors={colors}
          />

          <LabeledDropdown
            label="Currency Pair"
            selectedLabel={currencyPair}
            options={CURRENCY_PAIRS}
            onSelect={(value) => {
              currencyPair.value = value;
            }}
          />

          <ValidatedField
            label="Account Balance"
            state={accountBalance}
            keyboardType="number"
            error={errors.accountBalance}
            errorColor={colors.error}
          />

          <ValidatedField
            label="Risk Percentage"
            state={riskPercent}
            keyboardType="decimal"
            error={errors.riskPercent}
            errorColor={colors.error}
          />

          <ValidatedField
            label="Stop Loss Pips"
            state={stopLossPips}
            keyboardType="number"
            error={errors.stopLossPips}
            errorColor={colors.error}
          />

          <ValidatedField
            label="Units to Trade (Optional)"
            state={unitsToTrade}
            keyboardType="number"
            error={errors.unitsToTrade}
            errorColor={colors.error}
          />

          <Button 
            modifiers={[fillMaxWidth()]} 
            onClick={handleCalculate}
            enabled={!isLoading}
          >
            <Text>{isLoading ? "Loading..." : "Calculate"}</Text>
          </Button>

          <OutlinedButton modifiers={[fillMaxWidth()]} onClick={handleReset}>
            <Text>Reset</Text>
          </OutlinedButton>

          <Row horizontalArrangement={{ spacedBy: 12 }} modifiers={[fillMaxWidth()]}>
            <Text
              color={colors.onSurfaceVariant}
              style={{ typography: "bodySmall" }}
              modifiers={[fillMaxWidth()]}
            >
              Results are estimates. Always verify with your broker before
              placing trades. Live prices update every 30 seconds.
            </Text>
          </Row>

          <ResultDialog
            isOpen={isAlertOpen}
            result={result}
            onDismiss={() => setIsAlertOpen(false)}
            colors={colors}
          />
        </Column>
      </Host>
    </SafeAreaView>
  );
}