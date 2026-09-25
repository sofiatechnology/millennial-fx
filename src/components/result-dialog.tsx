import { ResultRow } from '@/components/result-row';
import type { CalculationResult } from '@/hooks/use-calculator';
import { View } from 'react-native';
import { Button, Dialog, Portal, useTheme } from 'react-native-paper';

interface ResultDialogProps {
  isOpen: boolean;
  result: CalculationResult | null;
  onDismiss: () => void;
}

export function ResultDialog({ isOpen, result, onDismiss }: ResultDialogProps) {
  const theme = useTheme();

  return (
    <Portal>
      <Dialog
        visible={isOpen && result != null}
        onDismiss={onDismiss}
        style={{ borderRadius: 28 }}
      >
        <Dialog.Title selectable style={{ color: theme.colors.primary }}>
          Calculation Results
        </Dialog.Title>
        <Dialog.Content>
          {result ? (
            <View style={{ gap: 12 }}>
              <ResultRow
                label="Current Price:"
                value={result.price ? result.price.toFixed(5) : 'N/A'}
                labelColor={theme.colors.onSurfaceVariant}
                valueColor={theme.colors.primary}
              />
              <ResultRow
                label="Lot Size:"
                value={result.lotSize.toFixed(2)}
                labelColor={theme.colors.onSurfaceVariant}
                valueColor={theme.colors.onSurface}
              />
              <ResultRow
                label="Units to Trade:"
                value={result.unitsToTrade.toLocaleString()}
                labelColor={theme.colors.onSurfaceVariant}
                valueColor={theme.colors.onSurface}
              />
              <ResultRow
                label="Risk Amount:"
                value={`$${result.riskAmount.toLocaleString()}`}
                labelColor={theme.colors.onSurfaceVariant}
                valueColor={theme.colors.onSurface}
              />
              <ResultRow
                label="Pip Value / Lot:"
                value={`$${result.pipValue.toFixed(2)}`}
                labelColor={theme.colors.onSurfaceVariant}
                valueColor={theme.colors.onSurface}
              />
            </View>
          ) : null}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Close</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
