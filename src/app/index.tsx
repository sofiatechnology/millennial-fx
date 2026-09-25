import { LabeledDropdown } from '@/components/labeled-dropdown';
import { PriceDisplay } from '@/components/price-display';
import { ResultDialog } from '@/components/result-dialog';
import { ValidatedField } from '@/components/validated-field';
import { useAppTheme } from '@/constants/theme';
import { useCalculator } from '@/hooks/use-calculator';
import { usePriceFetcher } from '@/hooks/use-price-fetcher';
import { useCallback, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const CURRENCY_PAIRS = [
  'XAU/USD',
  'XAG/USD',
  'XRP/UST',
  'BTC/USD',
  'ETH/USD',
  'EUR/USD',
  'GBP/USD',
  'USD/JPY',
  'USD/CHF',
  'AUD/USD',
  'USD/CAD',
  'NZD/USD',
  'EUR/GBP',
  'EUR/JPY',
  'GBP/JPY',
];

const DEFAULTS = {
  currencyPair: 'EUR/USD',
  accountBalance: '100000',
  riskPercent: '1',
  stopLossPips: '20',
  unitsToTrade: '',
};

export default function HomeScreen() {
  const { colors } = useAppTheme();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [currencyPair, setCurrencyPair] = useState(DEFAULTS.currencyPair);
  const [accountBalance, setAccountBalance] = useState(DEFAULTS.accountBalance);
  const [riskPercent, setRiskPercent] = useState(DEFAULTS.riskPercent);
  const [stopLossPips, setStopLossPips] = useState(DEFAULTS.stopLossPips);
  const [unitsToTrade, setUnitsToTrade] = useState(DEFAULTS.unitsToTrade);

  const { price, isLoading, lastUpdated, isFallback, error } =
    usePriceFetcher(currencyPair);

  const { result, errors, calculate, reset, setErrors } = useCalculator();

  const handleCalculate = useCallback(() => {
    if (!price) {
      setErrors({
        ...errors,
        accountBalance: error ?? 'Unable to fetch current price',
      });
      return;
    }

    const outcome = calculate(
      {
        accountBalance,
        riskPercent,
        stopLossPips,
        unitsToTrade,
        currencyPair,
      },
      price,
    );

    if (outcome) {
      setIsAlertOpen(true);
    }
  }, [
    accountBalance,
    calculate,
    currencyPair,
    error,
    errors,
    price,
    riskPercent,
    setErrors,
    stopLossPips,
    unitsToTrade,
  ]);

  const handleReset = () => {
    setCurrencyPair(DEFAULTS.currencyPair);
    setAccountBalance(DEFAULTS.accountBalance);
    setRiskPercent(DEFAULTS.riskPercent);
    setStopLossPips(DEFAULTS.stopLossPips);
    setUnitsToTrade(DEFAULTS.unitsToTrade);
    reset();
    setIsAlertOpen(false);
  };

  return (
    <SafeAreaView
      edges={['left', 'right', 'bottom']}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 16, gap: 16 }}
        >
          <Text variant="bodyMedium" selectable style={{ color: colors.primary }}>
            Determine the exact currency units to buy or sell per trade, based
            on your risk rules and account balance.
          </Text>

          <PriceDisplay
            price={price}
            isLoading={isLoading}
            lastUpdated={lastUpdated}
            isFallback={isFallback}
          />

          <LabeledDropdown
            label="Currency Pair"
            selectedLabel={currencyPair}
            options={CURRENCY_PAIRS}
            onSelect={setCurrencyPair}
          />

          <ValidatedField
            label="Account Balance"
            value={accountBalance}
            onChangeText={setAccountBalance}
            keyboardType="number-pad"
            error={errors.accountBalance}
          />

          <ValidatedField
            label="Risk Percentage"
            value={riskPercent}
            onChangeText={setRiskPercent}
            keyboardType="decimal-pad"
            error={errors.riskPercent}
          />

          <ValidatedField
            label="Stop Loss Pips"
            value={stopLossPips}
            onChangeText={setStopLossPips}
            keyboardType="number-pad"
            error={errors.stopLossPips}
          />

          <ValidatedField
            label="Units to Trade (Optional)"
            value={unitsToTrade}
            onChangeText={setUnitsToTrade}
            keyboardType="number-pad"
            error={errors.unitsToTrade}
          />

          <Button
            mode="contained"
            onPress={handleCalculate}
            disabled={isLoading}
            style={{ width: '100%' }}
          >
            {isLoading ? 'Loading...' : 'Calculate'}
          </Button>

          <Button mode="outlined" onPress={handleReset} style={{ width: '100%' }}>
            Reset
          </Button>

          <Text
            variant="bodySmall"
            selectable
            style={{ color: colors.onSurfaceVariant }}
          >
            Results are estimates. Always verify with your broker before
            placing trades. Live prices update every 30 seconds.
          </Text>

          <ResultDialog
            isOpen={isAlertOpen}
            result={result}
            onDismiss={() => setIsAlertOpen(false)}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
