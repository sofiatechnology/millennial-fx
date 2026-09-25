import { filledSurfaceStyle, useAppTheme } from '@/constants/theme';
import { View } from 'react-native';
import { Surface, Text } from 'react-native-paper';

interface PriceDisplayProps {
  pair: string;
  price: number | null;
  isLoading: boolean;
  lastUpdated: string;
  isFallback: boolean;
}

export function PriceDisplay({
  pair,
  price,
  isLoading,
  lastUpdated,
  isFallback,
}: PriceDisplayProps) {
  const { colors } = useAppTheme();

  const priceLabel = isLoading ? 'Loading...' : price ? price.toFixed(5) : 'N/A';
  const status = isFallback && !isLoading && price ? 'Cached price' : null;

  return (
    <Surface mode="flat" elevation={0} style={{ padding: 20, gap: 4, ...filledSurfaceStyle(colors) }}>
      <Text variant="labelLarge" style={{ color: colors.onSurfaceVariant }}>
        Live price
      </Text>
      <Text variant="titleMedium" selectable style={{ color: colors.onSurface }}>
        {pair}
      </Text>
      <Text
        variant="headlineMedium"
        selectable
        style={{ color: colors.primary, fontVariant: ['tabular-nums'] }}
      >
        {priceLabel}
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {status ? (
          <Text variant="bodySmall" selectable style={{ color: colors.onSurfaceVariant }}>
            {status}
          </Text>
        ) : null}
        {lastUpdated ? (
          <Text variant="bodySmall" selectable style={{ color: colors.onSurfaceVariant }}>
            {`Updated ${lastUpdated}`}
          </Text>
        ) : null}
      </View>
    </Surface>
  );
}
