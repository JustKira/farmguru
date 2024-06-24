import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Bar } from 'react-native-progress';
import { YStack, XStack, Stack, Text, Progress, useTheme } from 'tamagui';

export default function FieldPercentages({
  label,
  percentages,
}: {
  label: string;
  percentages?: number[];
}) {
  const theme = useTheme();

  const { t } = useTranslation();
  const barConfig = useMemo(() => {
    return {
      color: theme.primary.get(),
      borderRadius: 12,
      height: 15,
      width: null,
    };
  }, [theme]);

  const { high, medium, low, veryLow } = useMemo(() => {
    return {
      high: percentages?.[0] ?? 0,
      medium: percentages?.[1] ?? 0,
      low: percentages?.[2] ?? 0,
      veryLow: percentages?.[3] ?? 0,
    };
  }, [label, percentages]);

  return (
    <YStack
      margin="$2"
      elevation="$0.25"
      backgroundColor="$background"
      p="$4"
      borderRadius="$4"
      borderColor="$muted"
      borderWidth="$0.5">
      <Text fontSize="$7" color={theme.foreground.get()}>
        {label}
      </Text>

      <YStack space="$3">
        <XStack justifyContent="space-between">
          <Text fontSize="$6" color={theme.foreground.get()}>
            {t('high')}
          </Text>
          <Text fontSize="$6" color={theme.primary.get()}>
            {high.toFixed(2)}%
          </Text>
        </XStack>
        <Bar progress={toZeroOne(high)} {...barConfig} />
      </YStack>

      <YStack space="$3">
        <XStack justifyContent="space-between">
          <Text fontSize="$6" color={theme.foreground.get()}>
            {t('medium')}
          </Text>
          <Text fontSize="$6" color={theme.primary.get()}>
            {medium.toFixed(2)}%
          </Text>
        </XStack>
        <Bar progress={toZeroOne(medium)} {...barConfig} />
      </YStack>

      <YStack space="$3">
        <XStack justifyContent="space-between">
          <Text fontSize="$6" color={theme.foreground.get()}>
            {t('low')}
          </Text>
          <Text fontSize="$6" color={theme.primary.get()}>
            {low.toFixed(2)}%
          </Text>
        </XStack>
        <Bar progress={toZeroOne(low)} {...barConfig} />
      </YStack>

      <YStack space="$3">
        <XStack justifyContent="space-between">
          <Text fontSize="$6" color={theme.foreground.get()}>
            {t('very_low')}
          </Text>
          <Text fontSize="$6" color={theme.primary.get()}>
            {veryLow.toFixed(2)}%
          </Text>
        </XStack>
        <Bar progress={toZeroOne(veryLow)} {...barConfig} />
      </YStack>
    </YStack>
  );
}

const toZeroOne = (value?: number) => {
  return value ? Math.abs(value / 100) : 0;
};
