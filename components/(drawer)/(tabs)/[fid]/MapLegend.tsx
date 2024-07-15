import React from 'react';
import { XStack, YStack, Text, View } from 'tamagui';

interface LegendItem {
  color: string;
  name: string;
}

interface MapLegendProps {
  items: LegendItem[];
}

export function MapLegend({ items }: MapLegendProps) {
  return (
    <YStack px="$2">
      <XStack
        flexWrap="wrap"
        borderRadius="$4"
        backgroundColor={'$background'}
        gap="$3"
        my="$2"
        padding="$2">
        {items.map((item, index) => (
          <XStack key={index} alignItems="center" space="$1">
            <View width={24} height={12} backgroundColor={item.color} borderRadius="$1" />
            <Text fontSize="$1" color="$gray11">
              {item.name}
            </Text>
          </XStack>
        ))}
      </XStack>
    </YStack>
  );
}
