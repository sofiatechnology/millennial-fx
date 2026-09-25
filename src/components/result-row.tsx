import { View } from 'react-native';
import { Text } from 'react-native-paper';

export function ResultRow({
  label,
  value,
  labelColor,
  valueColor,
}: {
  label: string;
  value: string;
  labelColor: string;
  valueColor: string;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
      }}
    >
      <Text variant="bodyLarge" selectable style={{ color: labelColor }}>
        {label}
      </Text>
      <Text
        variant="bodyLarge"
        selectable
        style={{
          color: valueColor,
          fontWeight: '500',
          fontVariant: ['tabular-nums'],
        }}
      >
        {value}
      </Text>
    </View>
  );
}
