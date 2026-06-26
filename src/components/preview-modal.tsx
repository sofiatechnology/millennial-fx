import {
  Button,
  Column,
  FieldGroup,
  Host,
  Row,
  Spacer,
  Text,
  useTheme
} from "@expo/ui";
import { useCallback, useEffect, useState } from "react";
import { Modal, View } from "react-native";
import { TradeHistory, database } from "../database/db";

interface PreviewModalProps {
  visible: boolean;
  trade: TradeHistory | null;
  onClose: () => void;
  onStatusUpdate: () => void;
}

export function PreviewModal({
  visible,
  trade,
  onClose,
  onStatusUpdate,
}: PreviewModalProps) {
  const theme = useTheme();
  const [status, setStatus] = useState<"TP" | "SL" | "BE" | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (trade) {
      setStatus(null);
    }
  }, [trade]);

  if (!trade) return null;

  const handleStatusUpdate = useCallback(async () => {
    if (!status || !trade.id) return;

    setIsUpdating(true);
    try {
      await database.updateTradeStatus(trade.id, status);
      await onStatusUpdate();
      onClose();
    } catch (error) {
      console.error("Failed to update trade status:", error);
    } finally {
      setIsUpdating(false);
    }
  }, [status, trade.id, onStatusUpdate, onClose]);

  const getStatusColor = (statusValue: string) => {
    switch (statusValue) {
      case "TP":
        return "#4caf50";
      case "SL":
        return "#f44336";
      case "BE":
        return "#ff9800";
      default:
        return "#757575";
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            backgroundColor: theme.colors.background,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            padding: 20,
            maxHeight: "80%",
          }}
        >
          <Host>
            <Column spacing={16}>
              <Row alignment="center">
                <Text textStyle={{ fontSize: 20, fontWeight: "700" }}>
                  Trade Preview
                </Text>
                <Spacer flexible />
                <Button variant="ghost" label="✕" onPress={onClose} />
              </Row>

              <FieldGroup>
                <FieldGroup.Section title="Details">
                  <Row alignment="center">
                    <Text>Pair</Text>
                    <Spacer flexible />
                    <Text textStyle={{ fontWeight: "500" }}>{trade.pair}</Text>
                  </Row>
                  <Row alignment="center">
                    <Text>Date</Text>
                    <Spacer flexible />
                    <Text textStyle={{ fontWeight: "500" }}>
                      {formatDate(trade.timestamp)}
                    </Text>
                  </Row>
                  <Row alignment="center">
                    <Text>Account Currency</Text>
                    <Spacer flexible />
                    <Text textStyle={{ fontWeight: "500" }}>
                      {trade.accountCurrency}
                    </Text>
                  </Row>
                </FieldGroup.Section>

                <FieldGroup.Section title="Position">
                  <Row alignment="center">
                    <Text>Lot Size</Text>
                    <Spacer flexible />
                    <Text textStyle={{ fontWeight: "500" }}>
                      {trade.lotSize.toFixed(2)}
                    </Text>
                  </Row>
                  <Row alignment="center">
                    <Text>Units</Text>
                    <Spacer flexible />
                    <Text textStyle={{ fontWeight: "500" }}>
                      {trade.units.toFixed(0)}
                    </Text>
                  </Row>
                  <Row alignment="center">
                    <Text>Money at Risk</Text>
                    <Spacer flexible />
                    <Text textStyle={{ fontWeight: "500", color: "#f44336" }}>
                      {trade.moneyAtRisk.toFixed(2)} {trade.accountCurrency}
                    </Text>
                  </Row>
                  {trade.potentialProfit && (
                    <Row alignment="center">
                      <Text>Potential Profit</Text>
                      <Spacer flexible />
                      <Text textStyle={{ fontWeight: "500", color: "#4caf50" }}>
                        {trade.potentialProfit.toFixed(2)}{" "}
                        {trade.accountCurrency}
                      </Text>
                    </Row>
                  )}
                  {trade.riskRewardRatio && (
                    <Row alignment="center">
                      <Text>Risk-Reward Ratio</Text>
                      <Spacer flexible />
                      <Text textStyle={{ fontWeight: "500" }}>
                        {trade.riskRewardRatio.toFixed(1)}:1
                      </Text>
                    </Row>
                  )}
                </FieldGroup.Section>

                <FieldGroup.Section title="Current Status">
                  <Row alignment="center" spacing={8}>
                    <Text>Status</Text>
                    <Spacer flexible />
                    <View
                      style={{
                        backgroundColor: getStatusColor(trade.status),
                        paddingHorizontal: 12,
                        paddingVertical: 4,
                        borderRadius: 12,
                      }}
                    >
                      <Text
                        textStyle={{
                          color: "#fff",
                          fontSize: 12,
                          fontWeight: "600",
                        }}
                      >
                        {trade.status}
                      </Text>
                    </View>
                  </Row>
                </FieldGroup.Section>

                <FieldGroup.Section title="Update Status">
                  <Column spacing={8}>
                    <Row spacing={8}>
                      {(["TP", "SL", "BE"] as const).map((s) => (
                        <Button
                          key={s}
                          variant={status === s ? "filled" : "outlined"}
                          label={s}
                          onPress={() => setStatus(s)}
                          style={{
                            flex: 1,
                            backgroundColor:
                              status === s ? getStatusColor(s) : undefined,
                            borderColor: getStatusColor(s),
                          }}
                        />
                      ))}
                    </Row>
                    <Button
                      variant="filled"
                      label="Update Status"
                      onPress={handleStatusUpdate}
                      disabled={!status || isUpdating}
                    />
                  </Column>
                </FieldGroup.Section>
              </FieldGroup>
            </Column>
          </Host>
        </View>
      </View>
    </Modal>
  );
}
