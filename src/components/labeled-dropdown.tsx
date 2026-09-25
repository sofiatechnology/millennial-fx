import { shape, useAppTheme } from '@/constants/theme';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Menu, TextInput } from 'react-native-paper';

interface DropdownProps {
  label: string;
  selectedLabel: string;
  options: string[];
  onSelect: (value: string) => void;
}

export function LabeledDropdown({
  label,
  selectedLabel,
  options,
  onSelect,
}: DropdownProps) {
  const { colors } = useAppTheme();
  const [expanded, setExpanded] = useState(false);
  const [anchorWidth, setAnchorWidth] = useState(0);

  return (
    <Menu
      visible={expanded}
      onDismiss={() => setExpanded(false)}
      anchorPosition="bottom"
      contentStyle={{
        backgroundColor: colors.surfaceContainer,
        borderRadius: shape.extraSmall,
        ...(anchorWidth > 0 ? { width: anchorWidth } : null),
      }}
      anchor={
        <View
          onLayout={(event) => {
            const width = event.nativeEvent.layout.width;
            setAnchorWidth((current) => (current === width ? current : width));
          }}
        >
          <View style={{ pointerEvents: 'none' }}>
            <TextInput
              mode="outlined"
              label={label}
              value={selectedLabel}
              editable={false}
              outlineColor={colors.outline}
              activeOutlineColor={colors.primary}
              textColor={colors.onSurface}
              outlineStyle={{ borderRadius: shape.extraSmall }}
              right={<TextInput.Icon icon="menu-down" color={colors.onSurfaceVariant} />}
            />
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={label}
            onPress={() => setExpanded(true)}
            style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
          />
        </View>
      }
    >
      {options.map((option) => (
        <Menu.Item
          key={option}
          title={option}
          onPress={() => {
            onSelect(option);
            setExpanded(false);
          }}
        />
      ))}
    </Menu>
  );
}
