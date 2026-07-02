// components/LabeledDropdown.tsx
import {
    DropdownMenuItem,
    ExposedDropdownMenu,
    ExposedDropdownMenuBox,
    ObservableState,
    OutlinedTextField,
    Text,
} from "@expo/ui/jetpack-compose";
import {
    fillMaxWidth,
    menuAnchor,
} from "@expo/ui/jetpack-compose/modifiers";
import { useState } from "react";

interface DropdownProps {
  label: string;
  selectedLabel: ObservableState<string>;
  options: string[];
  onSelect: (value: string) => void;
}

export function LabeledDropdown({
  label,
  selectedLabel,
  options,
  onSelect,
}: DropdownProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <ExposedDropdownMenuBox
      expanded={expanded}
      onExpandedChange={setExpanded}
      modifiers={[fillMaxWidth()]}
    >
      <OutlinedTextField
        value={selectedLabel}
        readOnly
        modifiers={[menuAnchor(), fillMaxWidth()]}
      >
        <OutlinedTextField.Label>
          <Text>{label}</Text>
        </OutlinedTextField.Label>
      </OutlinedTextField>
      <ExposedDropdownMenu
        expanded={expanded}
        onDismissRequest={() => setExpanded(false)}
      >
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt}
            onClick={() => {
              onSelect(opt);
              setExpanded(false);
            }}
          >
            <DropdownMenuItem.Text>
              <Text>{opt}</Text>
            </DropdownMenuItem.Text>
          </DropdownMenuItem>
        ))}
      </ExposedDropdownMenu>
    </ExposedDropdownMenuBox>
  );
}