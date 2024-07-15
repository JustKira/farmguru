import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { YStack, XStack, Text, useTheme } from 'tamagui';

export default function FieldPercentages({
  label,
  percentages,
  colors = ['#2E7D32', '#4CAF50', '#8BC34A', '#FFEB3B'], // Default colors
}: {
  label: string;
  percentages?: number[];
  colors?: string[];
}) {
  const theme = useTheme();
  const { t } = useTranslation();

  const levels = ['High', 'Medium', 'Low', 'Very_Low'];

  const data = useMemo(() => {
    return levels.map((level, index) => ({
      level,
      percentage: percentages?.[index] ?? 0,
      color: colors[index],
    }));
  }, [percentages, colors]);

  return (
    <YStack space="$1" my="$4" backgroundColor="$background">
      <Text fontSize="$6" fontWeight="bold" color={theme.foreground.get()}>
        {label}
      </Text>
      <Text fontSize="$2" color={theme.foregroundMuted.get()}>
        Level
      </Text>
      {data.map(({ level, percentage, color }) => (
        <XStack key={level} alignItems="center" space="$1">
          <Text fontSize="$4" color={theme.foreground.get()} width={70}>
            {/* @ts-ignore */}
            {t(level.toLowerCase())}
          </Text>
          <View style={{ flex: 1, height: 20, backgroundColor: '#E0E0E0', borderRadius: 4 }}>
            <View
              style={{
                width: `${percentage}%`,
                height: '100%',
                backgroundColor: color,
                borderRadius: 4,
              }}
            />
          </View>
          <Text fontSize="$3" color={theme.foreground.get()} width={50} textAlign="right">
            {percentage.toFixed(1)}%
          </Text>
        </XStack>
      ))}
    </YStack>
  );
}
