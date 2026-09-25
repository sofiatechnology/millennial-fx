import { Platform, Text, View, type TextStyle } from 'react-native';
import { Icon } from 'react-native-paper';

const NATIVE_ICONS = {
  calculate: 'calculator-variant-outline',
  palette: 'palette-outline',
  info: 'information-outline',
  currency_exchange: 'swap-horizontal',
} as const;

export type MaterialSymbolName = keyof typeof NATIVE_ICONS;

interface MaterialSymbolProps {
  name: MaterialSymbolName;
  color: string;
  size?: number;
}

/**
 * Material Symbols Outlined on web:
 * font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24.
 * Native uses the matching Material Community icon.
 */
export function MaterialSymbol({ name, color, size = 24 }: MaterialSymbolProps) {
  if (Platform.OS === 'web') {
    return (
      <View
        style={{
          width: size,
          height: size,
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          selectable={false}
          allowFontScaling={false}
          style={
            {
              fontFamily: 'Material Symbols Outlined',
              fontSize: size,
              lineHeight: size,
              color,
              fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
            } as TextStyle
          }
        >
          {name}
        </Text>
      </View>
    );
  }

  return <Icon source={NATIVE_ICONS[name]} size={size} color={color} />;
}
