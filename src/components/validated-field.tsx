import { View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';

interface FieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType: 'number-pad' | 'decimal-pad';
  error?: string;
}

export function ValidatedField({
  label,
  value,
  onChangeText,
  keyboardType,
  error,
}: FieldProps) {
  return (
    <View>
      <TextInput
        mode="outlined"
        label={label}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        error={Boolean(error)}
      />
      {error ? (
        <HelperText type="error" visible selectable>
          {error}
        </HelperText>
      ) : null}
    </View>
  );
}
