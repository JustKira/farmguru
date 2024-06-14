import { MaterialIcons } from '@expo/vector-icons';
import React, { useState, useMemo } from 'react';
import { SelectProps, Adapt, Label, Select, Sheet, XStack, YStack } from 'tamagui';
import { LinearGradient } from 'tamagui/linear-gradient';

type CustomSelectProps = {
  items: { name: string }[];
  label: string;
  id: string;
} & Omit<SelectProps, 'children'>;

export const CustomSelect: React.FC<CustomSelectProps> = ({ items, label, id, ...props }) => {
  const [val, setVal] = useState(items[0]?.name.toLowerCase() || '');

  return (
    <YStack gap="$4">
      <XStack ai="center" gap="$4">
        <Label htmlFor={id} f={1} miw={80}>
          {label}
        </Label>
        <Select value={val} onValueChange={setVal} disablePreventBodyScroll {...props}>
          <Select.Trigger
            width={220}
            iconAfter={<MaterialIcons name="keyboard-arrow-down" size={20} />}>
            <Select.Value placeholder="Select an item" />
          </Select.Trigger>

          <Adapt when="sm" platform="touch">
            <Sheet
              modal
              dismissOnSnapToBottom
              animationConfig={{
                type: 'spring',
                damping: 20,
                mass: 1.2,
                stiffness: 250,
              }}>
              <Sheet.Frame>
                <Sheet.ScrollView>
                  <Adapt.Contents />
                </Sheet.ScrollView>
              </Sheet.Frame>
              <Sheet.Overlay
                animation="lazy"
                enterStyle={{ opacity: 0 }}
                exitStyle={{ opacity: 0 }}
              />
            </Sheet>
          </Adapt>

          <Select.Content zIndex={200000}>
            <Select.ScrollUpButton
              alignItems="center"
              justifyContent="center"
              position="relative"
              width="100%"
              height="$3">
              <YStack zIndex={10}>
                <MaterialIcons name="keyboard-arrow-up" size={20} />
              </YStack>
              <LinearGradient
                start={[0, 0]}
                end={[0, 1]}
                fullscreen
                colors={['$background', 'transparent']}
                borderRadius="$4"
              />
            </Select.ScrollUpButton>

            <Select.Viewport minWidth={200}>
              <Select.Group>
                <Select.Label>{label}</Select.Label>
                {useMemo(
                  () =>
                    items.map((item, i) => {
                      return (
                        <Select.Item index={i} key={item.name} value={item.name.toLowerCase()}>
                          <Select.ItemText>{item.name}</Select.ItemText>
                          <Select.ItemIndicator marginLeft="auto">
                            <MaterialIcons name="check" size={16} />
                          </Select.ItemIndicator>
                        </Select.Item>
                      );
                    }),
                  [items]
                )}
              </Select.Group>
            </Select.Viewport>

            <Select.ScrollDownButton
              alignItems="center"
              justifyContent="center"
              position="relative"
              width="100%"
              height="$3">
              <YStack zIndex={10}>
                <MaterialIcons name="keyboard-arrow-down" size={20} />
              </YStack>
              <LinearGradient
                start={[0, 0]}
                end={[0, 1]}
                fullscreen
                colors={['transparent', '$background']}
                borderRadius="$4"
              />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select>
      </XStack>
    </YStack>
  );
};
