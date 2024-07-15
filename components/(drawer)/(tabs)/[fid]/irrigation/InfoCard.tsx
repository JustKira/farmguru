import React from 'react';
import { Stack, XStack, YStack, useTheme } from 'tamagui';

import { Text } from '~/tamagui.config';

interface InfoCardProps {
  value: string;
  icon: React.ReactNode;
  label: string;
}

export default function InfoCard({ icon, label, value }: InfoCardProps) {
  const theme = useTheme();

  return (
    <YStack
      aspectRatio={1}
      width="48%"
      alignItems="center"
      bg="$muted"
      padding="$3"
      borderRadius="$2"
      justifyContent="space-between"
      elevation={1}>
      <YStack gap="$2" alignItems="center" pt="$2">
        {icon}
        <Text size="$3">{label}</Text>
      </YStack>
      <Stack alignItems="center">
        <Text textAlign="center" size="$9">
          {value}
        </Text>
      </Stack>
    </YStack>
  );
}
