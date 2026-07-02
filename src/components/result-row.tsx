import { Row, Text } from '@expo/ui/jetpack-compose';
import { fillMaxWidth } from '@expo/ui/jetpack-compose/modifiers';


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
    <Row horizontalArrangement="spaceBetween" modifiers={[fillMaxWidth()]}>
      <Text color={labelColor} style={{ typography: "bodySmall" }}>
        {label}
      </Text>
      <Text color={valueColor} style={{ typography: "bodySmall", fontWeight: "500" }}>
        {value}
      </Text>
    </Row>
  );
}