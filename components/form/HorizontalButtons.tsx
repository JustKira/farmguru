import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { YStack, XStack, useWindowDimensions, useTheme } from 'tamagui';
import testIdConverter from '~/lib/test-id-converter';

import { Text } from '~/tamagui.config';

type ButtonItem = {
  icon?: (color: string) => React.ReactNode;
  text: string;
  value: string;
};

type HorizontalButtonsProps = {
  items: ButtonItem[];
  onClick: (value: string) => void;
  square?: boolean;
  defaultSelected?: string;
  value: string;
};

export const HorizontalButtons: React.FC<HorizontalButtonsProps> = ({
  items,
  onClick,
  square = true,
  value,
  defaultSelected,
}) => {
  const { width } = useWindowDimensions();
  const theme = useTheme();
  const [selectedValue, setSelectedValue] = useState<string | undefined>(value ?? defaultSelected);

  const buttonSize = square ? width / items.length - 15 : width / items.length - 15;

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const handlePress = (value: string) => {
    setSelectedValue(value);
    onClick(value);
  };

  return (
    <XStack justifyContent="space-between">
      {items.map((item, index) => (
        <TouchableOpacity
          testID={testIdConverter(item.text)}
          key={index}
          onPress={() => handlePress(item.value)}>
          <YStack
            width={buttonSize}
            height={square ? buttonSize : undefined}
            alignItems="center"
            gap="$1"
            justifyContent="center"
            borderWidth={1}
            borderColor={theme.muted.get()}
            borderRadius="$4"
            padding={item.icon ? 0 : '$3'}
            backgroundColor={
              selectedValue === item.value ? theme.primary.get() : theme.background.get()
            }>
            {item.icon?.(
              selectedValue === item.value ? theme.background.get() : theme.foregroundMuted.get()
            )}
            <Text
              size="$1"
              color={
                selectedValue === item.value ? theme.background.get() : theme.foregroundMuted.get()
              }>
              {item.text}
            </Text>
          </YStack>
        </TouchableOpacity>
      ))}
    </XStack>
  );
};
