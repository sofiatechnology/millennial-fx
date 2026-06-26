import { PreviewModal } from "@/components/preview-modal";
import {
  calculatePositionSize
} from "@/utils/position-size";
import {
  Button,
  Column,
  FieldGroup,
  Host,
  Row,
  Spacer,
  Text
} from "@expo/ui";
import { useCallback, useState } from "react";
import { database, TradeHistory } from "../database/db";

// ... (BASE_CURRENCIES, QUOTE_CURRENCIES, ACCOUNT_CURRENCIES from original)

export default function HomeScreen() {
  // ... (all state from original)

  const [showHistory, setShowHistory] = useState(false);
  const [previewTrade, setPreviewTrade] = useState<TradeHistory | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // ... (validation and calculation logic)

  const handleCalculateWithSave = useCallback(async () => {
    if (!validate()) {
      setResults(null);
      return;
    }

    const size = Number(accountSize.value);
    const risk = Number(riskRatio.value);
    const pips = Number(stopLossPips.value);
    const tpPips = transactionSize.value
      ? Number(transactionSize.value)
      : undefined;

    const output = calculatePositionSize({
      accountBalance: size,
      riskPercent: risk,
      riskAmount: risk,
      stopLossPips: pips,
      takeProfitPips: tpPips,
      pair: pairLabel,
      accountCurrency: accountCurrency,
      isRiskAmount: riskAsAmount,
    });

    setResults({
      moneyAtRisk: `${output.moneyAtRisk.toFixed(2)} ${accountCurrency}`,
      units: output.units.toFixed(0),
      sizing: `${output.lotSize.toFixed(2)} lot${output.lotSize >= 2 ? "s" : ""}`,
      potentialProfit: output.potentialProfit
        ? `${output.potentialProfit.toFixed(2)} ${accountCurrency}`
        : null,
      riskRewardRatio: output.riskRewardRatio
        ? output.riskRewardRatio.toFixed(1)
        : null,
    });

    // Save to history
    try {
      await database.insertTrade({
        pair: pairLabel,
        accountCurrency,
        accountBalance: size,
        riskPercent: risk,
        riskAmount: output.riskAmount,
        stopLossPips: pips,
        takeProfitPips: tpPips || null,
        lotSize: output.lotSize,
        units: output.units,
        moneyAtRisk: output.moneyAtRisk,
        potentialProfit: output.potentialProfit,
        riskRewardRatio: output.riskRewardRatio,
        status: "BE",
        entryPrice: null,
        stopLossPrice: null,
        takeProfitPrice: null,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("Failed to save trade:", error);
    }
  }, [
    accountSize.value,
    riskRatio.value,
    stopLossPips.value,
    transactionSize.value,
    riskAsAmount,
    accountCurrency,
    pairLabel,
    validate,
  ]);

  const handlePreviewTrade = useCallback((trade: TradeHistory) => {
    setPreviewTrade(trade);
    setShowPreviewModal(true);
  }, []);

  const handlePreviewClose = useCallback(() => {
    setShowPreviewModal(false);
    setPreviewTrade(null);
  }, []);

  const handleHistoryUpdate = useCallback(async () => {
    // Refresh history data if needed
  }, []);

  if (showHistory) {
    return (
      <HistoryScreen
        onBack={() => setShowHistory(false)}
        onPreview={handlePreviewTrade}
      />
    );
  }

  return (
    <Host style={{ flex: 1 }}>
      <Column spacing={16} style={{ padding: 16 }}>
        {/* ... (existing UI) */}

        <Row spacing={12} alignment="center">
          <Button
            variant="outlined"
            label="History"
            onPress={() => setShowHistory(true)}
          />
          <Button variant="outlined" label="Reset" onPress={handleReset} />
          <Button
            variant="filled"
            label="Calculate"
            onPress={handleCalculateWithSave}
          />
        </Row>

        {results && (
          <FieldGroup>
            <FieldGroup.Section title="Results">
              {/* ... (existing results) */}
              {results.potentialProfit && (
                <Row alignment="center">
                  <Text>Potential Profit</Text>
                  <Spacer flexible />
                  <Text textStyle={{ fontWeight: "600", color: "#4caf50" }}>
                    {results.potentialProfit}
                  </Text>
                </Row>
              )}
              {results.riskRewardRatio && (
                <Row alignment="center">
                  <Text>Risk-Reward</Text>
                  <Spacer flexible />
                  <Text textStyle={{ fontWeight: "600" }}>
                    {results.riskRewardRatio}:1
                  </Text>
                </Row>
              )}
            </FieldGroup.Section>
          </FieldGroup>
        )}
      </Column>

      <PreviewModal
        visible={showPreviewModal}
        trade={previewTrade}
        onClose={handlePreviewClose}
        onStatusUpdate={handleHistoryUpdate}
      />
    </Host>
  );
}
