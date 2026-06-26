import { database, TradeHistory } from "@/database/db";
import { Button, Column, Host, Row, Spacer, Text, useTheme } from "@expo/ui";
import { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, TouchableOpacity, View } from "react-native";

interface HistoryScreenProps {
  onBack: () => void;
  onPreview: (trade: TradeHistory) => void;
}

export function HistoryScreen({ onBack, onPreview }: HistoryScreenProps) {
  const [trades, setTrades] = useState<TradeHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();

  const loadTrades = useCallback(async () => {
    try {
      const allTrades = await database.getTrades();
      setTrades(allTrades);
    } catch (error) {
      console.error("Failed to load trades:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrades();
  }, [loadTrades]);

  const handleDelete = useCallback(
    async (id: number) => {
      Alert.alert(
        "Delete Trade",
        "Are you sure you want to delete this trade?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              await database.deleteTrade(id);
              await loadTrades();
            },
          },
        ],
      );
    },
    [loadTrades],
  );

  const handleClearAll = useCallback(async () => {
    Alert.alert(
      "Clear All History",
      "Are you sure you want to clear all trade history?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            await database.clearAllTrades();
            await loadTrades();
          },
        },
      ],
    );
  }, [loadTrades]);

  const getStatusColor = (status: string) => {
    switch (status) {
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "TP":
        return "Take Profit";
      case "SL":
        return "Stop Loss";
      case "BE":
        return "Break Even";
      default:
        return status;
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const renderTradeItem = ({ item }: { item: TradeHistory }) => (
    <TouchableOpacity
      onPress={() => onPreview(item)}
      style={{
        padding: 12,
        backgroundColor: theme.colors.surface,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: theme.colors.border,
      }}
    >
      <Row alignment="center">
        <Column spacing={4} flexible>
          <Row alignment="center">
            <Text textStyle={{ fontWeight: "600", fontSize: 16 }}>
              {item.pair}
            </Text>
            <Spacer size={8} horizontal />
            <View
              style={{
                backgroundColor: getStatusColor(item.status),
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 12,
              }}
            >
              <Text
                textStyle={{
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: "600",
                }}
              >
                {getStatusLabel(item.status)}
              </Text>
            </View>
          </Row>
          <Text textStyle={{ fontSize: 12, color: theme.colors.textSecondary }}>
            {formatDate(item.timestamp)}
          </Text>
        </Column>
        <Column spacing={2} alignment="end">
          <Text textStyle={{ fontWeight: "500" }}>
            {item.lotSize.toFixed(2)} lots
          </Text>
          <Text textStyle={{ fontSize: 12, color: theme.colors.textSecondary }}>
            Risk: {item.moneyAtRisk.toFixed(2)} {item.accountCurrency}
          </Text>
          {item.riskRewardRatio && (
            <Text
              textStyle={{ fontSize: 12, color: theme.colors.textSecondary }}
            >
              R:R {item.riskRewardRatio.toFixed(1)}
            </Text>
          )}
        </Column>
      </Row>
      <Row spacing={8} style={{ marginTop: 8 }}>
        <Button
          variant="ghost"
          label="Delete"
          size="small"
          onPress={() => handleDelete(item.id!)}
        />
        <Button
          variant="outlined"
          label="Preview"
          size="small"
          onPress={() => onPreview(item)}
        />
      </Row>
    </TouchableOpacity>
  );

  return (
    <Host style={{ flex: 1 }}>
      <Column spacing={16} style={{ padding: 16, flex: 1 }}>
        <Row alignment="center">
          <Button variant="ghost" label="← Back" onPress={onBack} />
          <Spacer flexible />
          <Button
            variant="outlined"
            label="Clear All"
            size="small"
            onPress={handleClearAll}
            style={{ borderColor: "#f44336" }}
          />
        </Row>

        <Text textStyle={{ fontSize: 24, fontWeight: "700" }}>
          Trade History
        </Text>

        {trades.length === 0 ? (
          <Column
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            spacing={8}
          >
            <Text
              textStyle={{ fontSize: 16, color: theme.colors.textSecondary }}
            >
              No trades yet
            </Text>
            <Text
              textStyle={{ fontSize: 14, color: theme.colors.textSecondary }}
            >
              Calculate your first position to see it here
            </Text>
          </Column>
        ) : (
          <FlatList
            data={trades}
            renderItem={renderTradeItem}
            keyExtractor={(item) => item.id!.toString()}
            contentContainerStyle={{ paddingBottom: 16 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </Column>
    </Host>
  );
}
