import { ResultRow } from '@/components/result-row';
import { pillStyle, shape, useAppTheme } from '@/constants/theme';
import type { CalculationResult } from '@/hooks/use-calculator';
import { View } from 'react-native';
import { Button, Dialog, Divider, Portal } from 'react-native-paper';

interface ResultDialogProps {
  isOpen: boolean;
  result: CalculationResult | null;
  onDismiss: () => void;
}

export function ResultDialog({ isOpen, result, onDismiss }: ResultDialogProps) {
  const { colors } = useAppTheme();

  const rows = result
    ? [
        {
          label: 'Current price',
          value: result.price ? result.price.toFixed(5) : 'N/A',
          emphasize: true,
        },
        { label: 'Lot size', value: result.lotSize.toFixed(2), emphasize: false },
        {
          label: 'Units to trade',
          value: result.unitsToTrade.toLocaleString(),
          emphasize: false,
        },
        {
          label: 'Risk amount',
          value: `$${result.riskAmount.toLocaleString()}`,
          emphasize: false,
        },
        {
          label: 'Pip value / lot',
          value: `$${result.pipValue.toFixed(2)}`,
          emphasize: false,
        },
      ]
    : [];

  return (
    <Portal>
      <Dialog
        visible={isOpen && result != null}
        onDismiss={onDismiss}
        style={{
          borderRadius: shape.extraLarge,
          backgroundColor: colors.surfaceContainerHigh,
          boxShadow: 'none',
        }}
      >
        <Dialog.Title selectable style={{ color: colors.onSurface }}>
          Calculation results
        </Dialog.Title>
        <Dialog.Content>
          <View>
            {rows.map((row, index) => (
              <View key={row.label}>
                {index > 0 ? (
                  <Divider style={{ backgroundColor: colors.outlineVariant }} />
                ) : null}
                <ResultRow
                  label={row.label}
                  value={row.value}
                  labelColor={colors.onSurfaceVariant}
                  valueColor={row.emphasize ? colors.primary : colors.onSurface}
                />
              </View>
            ))}
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss} textColor={colors.primary} style={pillStyle}>
            Close
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
