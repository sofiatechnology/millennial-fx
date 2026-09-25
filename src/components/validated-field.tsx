import { shape, useAppTheme } from '@/constants/theme';
import { View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';

interface FieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType: 'number-pad' | 'decimal-pad';
  error?: string;
  supportingText?: string;
}

export function ValidatedField({
  label,
  value,
  onChangeText,
  keyboardType,
  error,
  supportingText,
}: FieldProps) {
  const { colors } = useAppTheme();
  const message = error ?? supportingText;

  return (
    <View>
      <TextInput
        mode="outlined"
        label={label}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        error={Boolean(error)}
        outlineColor={colors.outline}
        activeOutlineColor={colors.primary}
        textColor={colors.onSurface}
        outlineStyle={{ borderRadius: shape.extraSmall }}
      />
      {message ? (
        <HelperText type={error ? 'error' : 'info'} visible selectable>
          {message}
        </HelperText>
      ) : null}
    </View>
  );
}
