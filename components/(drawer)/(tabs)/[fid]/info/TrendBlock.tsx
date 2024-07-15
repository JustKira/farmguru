import { Feather } from '@expo/vector-icons';
import React from 'react';
import { H3, H5, Stack, YStack, useTheme } from 'tamagui';

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
    <YStack
      flex={1}
      backgroundColor="$muted"
      padding="$2"
      aspectRatio={1}
      justifyContent="center"
      elevation={0.5}
      borderRadius="$2"
      alignItems="center">
      <YStack alignItems="center" alignContent="center" justifyContent="center">
        <H3>{label}</H3>
        <Feather
          name={isTrendingPositive ? 'trending-up' : 'trending-down'}
          size={90}
          color={isTrendingPositive ? theme.green9.get() : theme.red9.get()}
        />
      </YStack>
      {/* <Stack>
        <Text size="$9" color={isTrendingPositive ? theme.green9.get() : theme.red9.get()}>
          {value.toFixed(2)}%
        </Text>
      </Stack> */}
    </YStack>
  );
}
