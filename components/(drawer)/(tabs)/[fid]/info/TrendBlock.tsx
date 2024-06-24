import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Stack, YStack, useTheme } from 'tamagui';
import { useLanguage } from '~/lib/providers/language-provider';

import { Text } from '~/tamagui.config';

interface TrendBlockProps {
  value: number;
  isNegativeNature?: boolean;
  label: string;
}

export default function TrendBlock({ isNegativeNature, label, value }: TrendBlockProps) {
  const theme = useTheme();
  const isTrendingPositive = isNegativeNature ? value <= 0 : value >= 0;
  const { currentLanguage } = useLanguage();
  return (
    <YStack alignItems={'flex-start'}>
      <YStack alignItems={'flex-start'}>
        <Feather
          name={isTrendingPositive ? 'trending-up' : 'trending-down'}
          size={32}
          color={isTrendingPositive ? theme.green9.get() : theme.red9.get()}
        />
        <Text size="$9">{label}</Text>
      </YStack>
      <Stack>
        <Text size="$9" color={isTrendingPositive ? theme.green9.get() : theme.red9.get()}>
          {value.toFixed(2)}%
        </Text>
      </Stack>
    </YStack>
  );
}
