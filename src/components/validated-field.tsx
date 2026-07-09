// components/ValidatedField.tsx
import {
    Column,
    ObservableState,
    OutlinedTextField,
    Text,
} from "@expo/ui/jetpack-compose";
import {
    fillMaxWidth,
    padding,
} from "@expo/ui/jetpack-compose/modifiers";

interface FieldProps {
  label: string;
  state: ObservableState<string>;
  keyboardType: "number" | "decimal";
  error?: string;
  errorColor: string;
}

export function ValidatedField({
  label,
  state,
  keyboardType,
  error,
  errorColor,
}: FieldProps) {
  return (
    <Column verticalArrangement={{ spacedBy: 4 }} modifiers={[fillMaxWidth()]}>
      <OutlinedTextField
        value={state}
        keyboardOptions={{ keyboardType }}
        modifiers={[fillMaxWidth()]}
      >
        <OutlinedTextField.Label>
          <Text>{label}</Text>
        </OutlinedTextField.Label>
      </OutlinedTextField>
      {error && (
        <Text
          color={errorColor}
          style={{ typography: "bodySmall" }}
          modifiers={[padding(4, 0, 0, 0)]}
        >
          {error}
        </Text>
      )}
    </Column>
  );
}