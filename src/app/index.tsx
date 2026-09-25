import { LabeledDropdown } from '@/components/labeled-dropdown';
import { PriceDisplay } from '@/components/price-display';
import { ResultDialog } from '@/components/result-dialog';
import { ValidatedField } from '@/components/validated-field';
import { useShellSearch } from '@/components/app-shell';
import {
  outlinedSurfaceStyle,
  pillStyle,
  shape,
  useAppTheme,
} from '@/constants/theme';
import { useCalculator } from '@/hooks/use-calculator';
import { usePriceFetcher } from '@/hooks/use-price-fetcher';
import { useCallback, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, useWindowDimensions, View } from 'react-native';
import { Button, Chip, Text } from 'react-native-paper';

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
  const { query } = useShellSearch();
  const { width } = useWindowDimensions();
  const wide = width > 1240;
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [currencyPair, setCurrencyPair] = useState(DEFAULTS.currencyPair);
  const [accountBalance, setAccountBalance] = useState(DEFAULTS.accountBalance);
  const [riskPercent, setRiskPercent] = useState(DEFAULTS.riskPercent);
  const [stopLossPips, setStopLossPips] = useState(DEFAULTS.stopLossPips);
  const [unitsToTrade, setUnitsToTrade] = useState(DEFAULTS.unitsToTrade);

  const { price, isLoading, lastUpdated, isFallback, error } =
    usePriceFetcher(currencyPair);

  const { result, errors, calculate, reset, setErrors } = useCalculator();

  const filteredPairs = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return CURRENCY_PAIRS;
    return CURRENCY_PAIRS.filter((pair) => pair.toLowerCase().includes(needle));
  }, [query]);

  const dropdownOptions = useMemo(() => {
    if (filteredPairs.includes(currencyPair) || filteredPairs.length === 0) {
      return filteredPairs.length === 0 ? [currencyPair] : filteredPairs;
    }
    return [currencyPair, ...filteredPairs];
  }, [currencyPair, filteredPairs]);

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

  const form = (
    <View style={{ padding: wide ? 24 : 16, gap: 4, ...outlinedSurfaceStyle(colors) }}>
      <Text variant="titleLarge" style={{ color: colors.onSurface, marginBottom: 8 }}>
        Risk parameters
      </Text>
      <LabeledDropdown
        label="Currency pair"
        selectedLabel={currencyPair}
        options={dropdownOptions}
        onSelect={setCurrencyPair}
      />
      <ValidatedField
        label="Account balance"
        value={accountBalance}
        onChangeText={setAccountBalance}
        keyboardType="number-pad"
        error={errors.accountBalance}
        supportingText="Balance used to compute money at risk."
      />
      <ValidatedField
        label="Risk percentage"
        value={riskPercent}
        onChangeText={setRiskPercent}
        keyboardType="decimal-pad"
        error={errors.riskPercent}
        supportingText="Recommended range is 1–2%."
      />
      <ValidatedField
        label="Stop loss pips"
        value={stopLossPips}
        onChangeText={setStopLossPips}
        keyboardType="number-pad"
        error={errors.stopLossPips}
        supportingText="Distance from entry to the stop, in pips."
      />
      <ValidatedField
        label="Units to trade (optional)"
        value={unitsToTrade}
        onChangeText={setUnitsToTrade}
        keyboardType="number-pad"
        error={errors.unitsToTrade}
        supportingText="Leave empty to size the position from risk."
      />
    </View>
  );

  const actions = (
    <View style={{ gap: 12 }}>
      <Button
        mode="contained"
        onPress={handleCalculate}
        disabled={isLoading}
        buttonColor={colors.primary}
        textColor={colors.onPrimary}
        style={pillStyle}
        contentStyle={{ height: 40 }}
      >
        {isLoading ? 'Loading...' : 'Calculate'}
      </Button>
      <Button
        mode="contained-tonal"
        onPress={handleReset}
        buttonColor={colors.secondaryContainer}
        textColor={colors.onSecondaryContainer}
        style={pillStyle}
        contentStyle={{ height: 40 }}
      >
        Reset
      </Button>
    </View>
  );

  const priceCard = (
    <PriceDisplay
      pair={currencyPair}
      price={price}
      isLoading={isLoading}
      lastUpdated={lastUpdated}
      isFallback={isFallback}
    />
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          padding: wide ? 24 : 16,
          gap: 16,
          flexGrow: 1,
        }}
      >
        <Text variant="bodyLarge" selectable style={{ color: colors.onSurfaceVariant }}>
          Determine the exact currency units to buy or sell per trade, based on
          your risk rules and account balance.
        </Text>

        {filteredPairs.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flexGrow: 0 }}
            contentContainerStyle={{ gap: 8 }}
          >
            {filteredPairs.map((pair) => {
              const selected = pair === currencyPair;
              return (
                <Chip
                  key={pair}
                  compact
                  mode={selected ? 'flat' : 'outlined'}
                  selected={selected}
                  showSelectedOverlay
                  onPress={() => setCurrencyPair(pair)}
                  style={{
                    borderRadius: shape.full,
                    backgroundColor: selected
                      ? colors.secondaryContainer
                      : colors.surfaceContainerLowest,
                  }}
                  textStyle={{
                    color: selected ? colors.onSecondaryContainer : colors.onSurfaceVariant,
                  }}
                >
                  {pair}
                </Chip>
              );
            })}
          </ScrollView>
        ) : (
          <Text variant="bodyMedium" selectable style={{ color: colors.onSurfaceVariant }}>
            {`No currency pairs match “${query.trim()}”.`}
          </Text>
        )}

        {wide ? (
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 24 }}>
            <View style={{ flex: 1 }}>{form}</View>
            <View style={{ width: 320, gap: 16 }}>
              {priceCard}
              {actions}
            </View>
          </View>
        ) : (
          <View style={{ gap: 16 }}>
            {priceCard}
            {form}
            {actions}
          </View>
        )}

        <Text variant="bodySmall" selectable style={{ color: colors.onSurfaceVariant }}>
          Results are estimates. Always verify with your broker before placing
          trades. Live prices update every 30 seconds.
        </Text>

        <ResultDialog
          isOpen={isAlertOpen}
          result={result}
          onDismiss={() => setIsAlertOpen(false)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
