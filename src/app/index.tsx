import Home from "@expo/material-symbols/home.xml";
import {
  BasicAlertDialog,
  Button,
  Column,
  DropdownMenuItem,
  ExposedDropdownMenu,
  ExposedDropdownMenuBox,
  Host,
  Icon,
  OutlinedButton,
  OutlinedTextField,
  Row,
  Text,
} from "@expo/ui/jetpack-compose";
import { fillMaxWidth, menuAnchor } from "@expo/ui/jetpack-compose/modifiers";
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

// ─── Reusable Dropdown ───────────────────────────────────────────────────────

interface DropdownProps {
  label: string;
  selectedLabel: string;
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

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const [currencyPair, setCurrencyPair] = useState("EUR/USD");
  const [usdPrice] = useState("1.00000");
  const [accountBalance, setAccountBalance] = useState("100000");
  const [riskPercent, setRiskPercent] = useState("1");
  const [stopLossPips, setStopLossPips] = useState("20");

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!accountBalance || isNaN(+accountBalance) || +accountBalance <= 0)
      e.accountBalance = "Enter a valid account balance";
    if (
      !riskPercent ||
      isNaN(+riskPercent) ||
      +riskPercent <= 0 ||
      +riskPercent > 100
    )
      e.riskPercent = "Risk must be between 0 and 100";
    if (!stopLossPips || isNaN(+stopLossPips) || +stopLossPips <= 0)
      e.stopLossPips = "Enter a valid stop loss";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCalculate = useCallback(() => {
    if (!validate()) return;
    const price = parseFloat(usdPrice);
    const pipValue = currencyPair.includes("JPY")
      ? (0.01 * 100_000) / price
      : (0.0001 * 100_000) / price;

    setResult(
      calculateLotSize(
        parseFloat(accountBalance),
        parseFloat(riskPercent),
        parseFloat(stopLossPips),
        pipValue,
      ),
    );
    setIsAlertOpen(true);
  }, [accountBalance, riskPercent, stopLossPips, usdPrice, currencyPair]);

  const handleReset = () => {
    setCurrencyPair("EUR/USD");
    setAccountBalance("100000");
    setRiskPercent("1");
    setStopLossPips("20");
    setResult(null);
    setErrors({});
    setIsAlertOpen(false);
  };

  return (
    <SafeAreaView>
      <Host
        matchContents={{ vertical: true }}
        style={{ width: "100%" }}
        seedColor={"#35668E"}
      >
        <Column modifiers={[fillMaxWidth()]}>
          {/* FIXED: Adjusted design tokens to match verified Expo UI text style schemas */}
          <Text style={{ typography: "bodyMedium", color: "#125df3" }}>
            Determine the exact currency units to buy or sell per trade, based
            on your risk rules and account balance.
          </Text>

          {/* Currency Dropdown */}
          <LabeledDropdown
            label="Currency Pair"
            selectedLabel={currencyPair}
            options={CURRENCY_PAIRS}
            onSelect={setCurrencyPair}
          />

          {/* Account Balance */}
          <Column modifiers={[fillMaxWidth()]}>
            <OutlinedTextField
              value={accountBalance}
              onValueChange={setAccountBalance}
              keyboardOptions={{ keyboardType: "number" }}
              modifiers={[fillMaxWidth()]}
            >
              <OutlinedTextField.Label>
                <Text>Account Balance</Text>
              </OutlinedTextField.Label>
            </OutlinedTextField>
            {errors.accountBalance && (
              <Text
                style={{
                  typography: "bodySmall",
                  color: "#B3261E",
                  paddingLeft: 4,
                }}
              >
                {errors.accountBalance}
              </Text>
            )}
          </Column>

          {/* Risk Percentage */}
          <Column
            verticalArrangement={{ spacedBy: 4 }}
            modifiers={[fillMaxWidth()]}
          >
            <OutlinedTextField
              value={riskPercent}
              onValueChange={setRiskPercent}
              keyboardOptions={{ keyboardType: "decimal" }}
              modifiers={[fillMaxWidth()]}
            >
              <OutlinedTextField.Label>
                <Text>Risk Percentage</Text>
              </OutlinedTextField.Label>
            </OutlinedTextField>
            {errors.riskPercent && (
              <Text
                style={{
                  typography: "bodySmall",
                  color: "#B3261E",
                  paddingLeft: 4,
                }}
              >
                {errors.riskPercent}
              </Text>
            )}
          </Column>

          {/* Stop Loss Pips */}
          <Column
            verticalArrangement={{ spacedBy: 4 }}
            modifiers={[fillMaxWidth()]}
          >
            <OutlinedTextField
              value={stopLossPips}
              onValueChange={setStopLossPips}
              keyboardOptions={{ keyboardType: "number" }}
              modifiers={[fillMaxWidth()]}
            >
              <OutlinedTextField.Label>
                <Text>Stop Loss Pips</Text>
              </OutlinedTextField.Label>
            </OutlinedTextField>
            {errors.stopLossPips && (
              <Text
                style={{
                  typography: "bodySmall",
                  color: "#B3261E",
                  paddingLeft: 4,
                }}
              >
                {errors.stopLossPips}
              </Text>
            )}
          </Column>

          {/* Actions Button */}
          <Button modifiers={[fillMaxWidth()]} onPress={handleCalculate}>
            <Text>Calculate</Text>
          </Button>

          {/* Disclaimer Warning */}
          <Row
            horizontalArrangement={{ spacedBy: 12 }}
            modifiers={[fillMaxWidth()]}
          >
            <Icon source={Home} contentDescription="Warning" />
            <Text
              style={{ typography: "bodySmall", color: "#9CA3AF", flex: 1 }}
            >
              Results are estimates. Always verify with your broker before
              placing trades.
            </Text>
          </Row>

          {/* ─── Material 3 Basic Alert Dialog ───────────────────────────────── */}
          {result && (
            <BasicAlertDialog
              visible={isAlertOpen}
              onDismissRequest={() => setIsAlertOpen(false)}
            >
              <Column verticalArrangement={{ spacedBy: 16 }}>
                <Text
                  style={{
                    typography: "titleLarge",
                    color: "#111827",
                    fontWeight: "600",
                  }}
                >
                  Calculation Result
                </Text>

                <Column
                  verticalArrangement={{ spacedBy: 12 }}
                  modifiers={[fillMaxWidth()]}
                >
                  <Row
                    horizontalArrangement={{ spaceBetween: true }}
                    modifiers={[fillMaxWidth()]}
                  >
                    <Text
                      style={{
                        typography: "bodyMedium",
                        color: "#4B5563",
                        fontWeight: "500",
                      }}
                    >
                      Lot Size:
                    </Text>
                    <Text
                      style={{
                        typography: "bodyMedium",
                        color: "#111827",
                        fontWeight: "700",
                      }}
                    >
                      {result.lotSize.toFixed(2)}
                    </Text>
                  </Row>
                  <Row
                    horizontalArrangement={{ spaceBetween: true }}
                    modifiers={[fillMaxWidth()]}
                  >
                    <Text
                      style={{
                        typography: "bodyMedium",
                        color: "#4B5563",
                        fontWeight: "500",
                      }}
                    >
                      Units to Trade:
                    </Text>
                    <Text
                      style={{
                        typography: "bodyMedium",
                        color: "#111827",
                        fontWeight: "700",
                      }}
                    >
                      {result.unitsToTrade.toLocaleString()}
                    </Text>
                  </Row>
                  <Row
                    horizontalArrangement={{ spaceBetween: true }}
                    modifiers={[fillMaxWidth()]}
                  >
                    <Text
                      style={{
                        typography: "bodyMedium",
                        color: "#4B5563",
                        fontWeight: "500",
                      }}
                    >
                      Risk Amount:
                    </Text>
                    <Text
                      style={{
                        typography: "bodyMedium",
                        color: "#111827",
                        fontWeight: "700",
                      }}
                    >
                      ${result.riskAmount.toLocaleString()}
                    </Text>
                  </Row>
                  <Row
                    horizontalArrangement={{ spaceBetween: true }}
                    modifiers={[fillMaxWidth()]}
                  >
                    <Text
                      style={{
                        typography: "bodyMedium",
                        color: "#4B5563",
                        fontWeight: "500",
                      }}
                    >
                      Pip Value / Lot:
                    </Text>
                    <Text
                      style={{
                        typography: "bodyMedium",
                        color: "#111827",
                        fontWeight: "700",
                      }}
                    >
                      ${result.pipValue.toFixed(2)}
                    </Text>
                  </Row>
                </Column>

                {/* Modal Actions Footer */}
                <Row
                  horizontalArrangement={{ spacedBy: 8 }}
                  style={{ justifyContent: "flex-end" }}
                  modifiers={[fillMaxWidth()]}
                >
                  <OutlinedButton onPress={handleReset}>
                    <Text>Reset Form</Text>
                  </OutlinedButton>
                  <Button onPress={() => setIsAlertOpen(false)}>
                    <Text>Close</Text>
                  </Button>
                </Row>
              </Column>
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
