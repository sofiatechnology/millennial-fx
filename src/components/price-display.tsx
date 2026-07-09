// components/PriceDisplay.tsx
import { Row, Surface, Text } from "@expo/ui/jetpack-compose";
import { paddingAll } from "@expo/ui/jetpack-compose/modifiers";

interface PriceDisplayProps {
  price: number | null;
  isLoading: boolean;
  lastUpdated: string;
  isFallback: boolean;
  colors: {
    onSurface: string;
    primary: string;
    onSurfaceVariant: string;
    surface: string;
  };
}

export function PriceDisplay({
  price,
  isLoading,
  lastUpdated,
  isFallback,
  colors,
}: PriceDisplayProps) {
  return (
    <Surface tonalElevation={1} modifiers={[paddingAll(12)]}>
      <Row horizontalArrangement={{ spacedBy: 8 }}>
        <Text style={{ typography: "titleMedium" }} color={colors.onSurface}>
          Live Price:
        </Text>
        <Text style={{ typography: "titleMedium" }} color={colors.primary}>
          {isLoading ? "Loading..." : price ? price.toFixed(5) : "N/A"}
        </Text>
        {isFallback && !isLoading && price && (
          <Text style={{ typography: "bodySmall" }} color={colors.onSurfaceVariant}>
            (Fallback)
          </Text>
        )}
        {lastUpdated && (
          <Text style={{ typography: "bodySmall" }} color={colors.onSurfaceVariant}>
            Updated: {lastUpdated}
          </Text>
        )}
      </Row>
    </Surface>
  );
}