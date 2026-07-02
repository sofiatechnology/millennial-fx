import { seedColor, useAppTheme } from '@/constants/theme';
import {
  BasicAlertDialog,
  Button,
  Column,
  DropdownMenuItem,
  ExposedDropdownMenu,
  ExposedDropdownMenuBox,
  Host,
  ObservableState,
  OutlinedButton,
  OutlinedTextField,
  Row,
  Spacer,
  Surface,
  Text,
  TextButton,
  useNativeState,
} from "@expo/ui/jetpack-compose";
import {
  align,
  clip,
  fillMaxWidth,
  height,
  menuAnchor,
  padding,
  paddingAll,
  Shapes,
  wrapContentHeight,
  wrapContentWidth,
} from "@expo/ui/jetpack-compose/modifiers";
import { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Types ───────────────────────────────────────────────────────────────────

interface CalculationResult {
  lotSize: number;
  unitsToTrade: number;
  riskAmount: number;
  pipValue: number;
}

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
};

// ─── Reusable Dropdown ───────────────────────────────────────────────────────
// The anchor field is bound to a useNativeState observable, per the
// ExposedDropdownMenuBox docs: "The anchor is a read-only TextField bound to
// a useNativeState observable. Update that observable in each item's onClick
// to reflect the selected value." A plain string prop doesn't reliably
// reflect selection because Compose expects to read/write .value directly.
interface DropdownProps {
  label: string;
  selectedLabel: ObservableState<string>;
  options: string[];
  onSelect: (value: string) => void;
}

function LabeledDropdown({
  label,
  selectedLabel,
  options,
  onSelect,
}: DropdownProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <ExposedDropdownMenuBox
      expanded={expanded}
      onExpandedChange={setExpanded}
      modifiers={[fillMaxWidth()]}
    >
      <OutlinedTextField
        value={selectedLabel}
        readOnly
        modifiers={[menuAnchor(), fillMaxWidth()]}
      >
        <OutlinedTextField.Label>
          <Text>{label}</Text>
        </OutlinedTextField.Label>
      </OutlinedTextField>
      <ExposedDropdownMenu
        expanded={expanded}
        onDismissRequest={() => setExpanded(false)}
      >
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt}
            onClick={() => {
              onSelect(opt);
              setExpanded(false);
            }}
          >
            <DropdownMenuItem.Text>
              <Text>{opt}</Text>
            </DropdownMenuItem.Text>
          </DropdownMenuItem>
        ))}
      </ExposedDropdownMenu>
    </ExposedDropdownMenuBox>
  );
}

// A labeled field bound to a useNativeState observable + inline error.
interface FieldProps {
  label: string;
  state: ObservableState<string>;
  keyboardType: "number" | "decimal";
  error?: string;
  errorColor: string;
}

function ValidatedField({
  label,
  state,
  keyboardType,
  error,
  errorColor,
}: FieldProps) {
  return (
    <Column verticalArrangement={{ spacedBy: 4 }} modifiers={[fillMaxWidth()]}>
      <OutlinedTextField
        value={state}
        keyboardOptions={{ keyboardType }}
        modifiers={[fillMaxWidth()]}
      >
        <OutlinedTextField.Label>
          <Text>{label}</Text>
        </OutlinedTextField.Label>
      </OutlinedTextField>
      {error && (
        <Text
          color={errorColor}
          style={{ typography: "bodySmall" }}
          modifiers={[padding(4, 0, 0, 0)]}
        >
          {error}
        </Text>
      )}
    </Column>
  );
}

function ResultRow({
  label,
  value,
  labelColor,
  valueColor,
}: {
  label: string;
  value: string;
  labelColor: string;
  valueColor: string;
}) {
  return (
    <Row horizontalArrangement="spaceBetween" modifiers={[fillMaxWidth()]}>
      <Text color={labelColor} style={{ typography: "bodyMedium", fontWeight: "500" }}>
        {label}
      </Text>
      <Text color={valueColor} style={{ typography: "bodyMedium", fontWeight: "700" }}>
        {value}
      </Text>
    </Row>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const { colors, scheme } = useAppTheme();

  // Native-state-backed fields — typing and selection happen on the
  // Compose side; we only read .value when we actually need it (validate,
  // calculate, reset).
  const currencyPair = useNativeState(DEFAULTS.currencyPair);
  const accountBalance = useNativeState(DEFAULTS.accountBalance);
  const riskPercent = useNativeState(DEFAULTS.riskPercent);
  const stopLossPips = useNativeState(DEFAULTS.stopLossPips);
  const [usdPrice] = useState("1.00000");

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    const balance = accountBalance.value;
    const risk = riskPercent.value;
    const stopLoss = stopLossPips.value;

    if (!balance || isNaN(+balance) || +balance <= 0)
      e.accountBalance = "Enter a valid account balance";
    if (!risk || isNaN(+risk) || +risk <= 0 || +risk > 100)
      e.riskPercent = "Risk must be between 0 and 100";
    if (!stopLoss || isNaN(+stopLoss) || +stopLoss <= 0)
      e.stopLossPips = "Enter a valid stop loss";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCalculate = useCallback(() => {
    if (!validate()) return;
    const price = parseFloat(usdPrice);
    const pair = currencyPair.value;
    const pipValue = pair.includes("JPY")
      ? (0.01 * 100_000) / price
      : (0.0001 * 100_000) / price;

    setResult(
      calculateLotSize(
        parseFloat(accountBalance.value),
        parseFloat(riskPercent.value),
        parseFloat(stopLossPips.value),
        pipValue,
      ),
    );
    setIsAlertOpen(true);
    // useNativeState values live outside React state, so they don't belong
    // in the dependency array — reading .value at call time is intentional.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usdPrice]);

  const handleReset = () => {
    currencyPair.value = DEFAULTS.currencyPair;
    accountBalance.value = DEFAULTS.accountBalance;
    riskPercent.value = DEFAULTS.riskPercent;
    stopLossPips.value = DEFAULTS.stopLossPips;
    setResult(null);
    setErrors({});
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

          {/* Button variants (Button, OutlinedButton, FilledTonalButton,
              ElevatedButton, TextButton) fire on `onClick`, not `onPress`.
              That mismatch is why Calculate/Reset previously did nothing. */}
          <Button modifiers={[fillMaxWidth()]} onClick={handleCalculate}>
            <Text>Calculate</Text>
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
              placing trades.
            </Text>
          </Row>

          {/* ─── Material 3 Basic Alert Dialog ───────────────────────────────── */}
          {/*
            This follows the BasicAlertDialog docs example exactly:
            https://docs.expo.dev/versions/latest/sdk/ui/jetpack-compose/basicalertdialog/
            Surface(tonalElevation, modifiers: [wrapContentWidth, wrapContentHeight,
            clip(Shapes.RoundedCorner(28))]) > Column(padding(16,16,16,16)) >
            supportive content > Spacer(height 24) > TextButton(align('centerEnd')).
            One button only — no custom colors/shape props beyond what the
            example uses, so this renders as the plain native dialog design.
          */}
          {isAlertOpen && (
            <BasicAlertDialog onDismissRequest={() => setIsAlertOpen(false)}>
              <Surface
                tonalElevation={6}
                modifiers={[
                  wrapContentWidth(),
                  wrapContentHeight(),
                  clip(Shapes.RoundedCorner(28)),
                ]}
              >
                <Column modifiers={[padding(16, 16, 16, 16)]}>
                  <Text style={{ typography: "titleLarge" }}>Calculation Result</Text>

                  <Spacer modifiers={[height(12)]} />

                  <Column verticalArrangement={{ spacedBy: 12 }} modifiers={[fillMaxWidth()]}>
                    <ResultRow
                      label="Lot Size:"
                      value={result ? result.lotSize.toFixed(2) : "—"}
                      labelColor={colors.onSurfaceVariant}
                      valueColor={colors.onSurface}
                    />
                    <ResultRow
                      label="Units to Trade:"
                      value={result ? result.unitsToTrade.toLocaleString() : "—"}
                      labelColor={colors.onSurfaceVariant}
                      valueColor={colors.onSurface}
                    />
                    <ResultRow
                      label="Risk Amount:"
                      value={result ? `$${result.riskAmount.toLocaleString()}` : "—"}
                      labelColor={colors.onSurfaceVariant}
                      valueColor={colors.onSurface}
                    />
                    <ResultRow
                      label="Pip Value / Lot:"
                      value={result ? `$${result.pipValue.toFixed(2)}` : "—"}
                      labelColor={colors.onSurfaceVariant}
                      valueColor={colors.onSurface}
                    />
                  </Column>

                  <Spacer modifiers={[height(24)]} />

                  <TextButton
                    onClick={() => setIsAlertOpen(false)}
                    modifiers={[align("centerEnd")]}
                  >
                    <Text>Close</Text>
                  </TextButton>
                </Column>
              </Surface>
            </BasicAlertDialog>
          )}
        </Column>
      </Host>
    </SafeAreaView>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calculateLotSize(
  accountBalance: number,
  riskPercent: number,
  stopLossPips: number,
  pipValuePerLot: number,
): CalculationResult {
  const riskAmount = (accountBalance * riskPercent) / 100;
  const lots = riskAmount / (stopLossPips * pipValuePerLot);
  return {
    lotSize: Math.round(lots * 100) / 100,
    unitsToTrade: Math.round(lots * 100_000),
    riskAmount: Math.round(riskAmount * 100) / 100,
    pipValue: Math.round(pipValuePerLot * 100) / 100,
  };
}