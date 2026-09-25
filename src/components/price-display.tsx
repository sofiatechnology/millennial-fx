import { View } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';

interface PriceDisplayProps {
  price: number | null;
  isLoading: boolean;
  lastUpdated: string;
  isFallback: boolean;
}

export function PriceDisplay({
  price,
  isLoading,
  lastUpdated,
  isFallback,
}: PriceDisplayProps) {
  const theme = useTheme();

  return (
    <Surface elevation={1} style={{ padding: 12, borderRadius: 12 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
        <Text variant="titleMedium" selectable style={{ color: theme.colors.onSurface }}>
          Live Price:
        </Text>
        <Text
          variant="titleMedium"
          selectable
          style={{ color: theme.colors.primary, fontVariant: ['tabular-nums'] }}
        >
          {isLoading ? 'Loading...' : price ? price.toFixed(5) : 'N/A'}
        </Text>
        {isFallback && !isLoading && price ? (
          <Text variant="bodySmall" selectable style={{ color: theme.colors.onSurfaceVariant }}>
            (Fallback)
          </Text>
        ) : null}
        {lastUpdated ? (
          <Text variant="bodySmall" selectable style={{ color: theme.colors.onSurfaceVariant }}>
            Updated: {lastUpdated}
          </Text>
        ) : null}
      </View>
    </Surface>
  );
}
