// components/ResultDialog.tsx
import { ResultRow } from "@/components/result-row";
import {
    BasicAlertDialog,
    Column,
    Spacer,
    Surface,
    Text,
    TextButton,
} from "@expo/ui/jetpack-compose";
import {
    align,
    clip,
    fillMaxWidth,
    height,
    padding,
    Shapes,
    wrapContentHeight,
    wrapContentWidth
} from "@expo/ui/jetpack-compose/modifiers";

interface CalculationResult {
  lotSize: number;
  unitsToTrade: number;
  riskAmount: number;
  pipValue: number;
  price: number;
}

interface ResultDialogProps {
  isOpen: boolean;
  result: CalculationResult | null;
  onDismiss: () => void;
  colors: {
    primary: string;
    onSurface: string;
    onSurfaceVariant: string;
  };
}

export function ResultDialog({
  isOpen,
  result,
  onDismiss,
  colors,
}: ResultDialogProps) {
  if (!isOpen || !result) return null;

  return (
    <BasicAlertDialog onDismissRequest={onDismiss}>
      <Surface
        tonalElevation={6}
        modifiers={[
          wrapContentWidth(),
          wrapContentHeight(),
          clip(Shapes.RoundedCorner(28)),
        ]}
      >
        <Column modifiers={[padding(16, 16, 16, 16)]}>
          <Text
            style={{ typography: "titleMedium" }}
            color={colors.primary}
            modifiers={[padding(0, 0, 12, 0)]}
          >
            Calculation Results
          </Text>

          <Column verticalArrangement={{ spacedBy: 12 }} modifiers={[fillMaxWidth()]}>
            <ResultRow
              label="Current Price:"
              value={result.price ? result.price.toFixed(5) : "N/A"}
              labelColor={colors.onSurfaceVariant}
              valueColor={colors.primary}
            />
            <ResultRow
              label="Lot Size:"
              value={result.lotSize.toFixed(2)}
              labelColor={colors.onSurfaceVariant}
              valueColor={colors.onSurface}
            />
            <ResultRow
              label="Units to Trade:"
              value={result.unitsToTrade.toLocaleString()}
              labelColor={colors.onSurfaceVariant}
              valueColor={colors.onSurface}
            />
            <ResultRow
              label="Risk Amount:"
              value={`$${result.riskAmount.toLocaleString()}`}
              labelColor={colors.onSurfaceVariant}
              valueColor={colors.onSurface}
            />
            <ResultRow
              label="Pip Value / Lot:"
              value={`$${result.pipValue.toFixed(2)}`}
              labelColor={colors.onSurfaceVariant}
              valueColor={colors.onSurface}
            />
          </Column>

          <Spacer modifiers={[height(24)]} />

          <TextButton onClick={onDismiss} modifiers={[align("centerEnd")]}>
            <Text>Close</Text>
          </TextButton>
        </Column>
      </Surface>
    </BasicAlertDialog>
  );
}