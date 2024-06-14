import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { XStack, useTheme } from 'tamagui';

import { FieldsScoutPoints } from '~/lib/db/schemas';
import { Text } from '~/tamagui.config';
import { Severity } from '~/types/global.types';
import getSeverity from '~/utils/get-severity';

export default function ScoutPointListItem({
  point,
  onPress,
}: {
  point: FieldsScoutPoints;
  onPress?: () => void;
}) {
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={onPress}>
      <XStack
        alignItems="center"
        justifyContent="space-between"
        backgroundColor="muted"
        padding="$1">
        <XStack gap="$4" alignItems="center" alignContent="flex-start">
          <MaterialCommunityIcons
            name="alert-circle"
            size={32}
            color={
              point.severity.toLocaleLowerCase()
                ? getSeverity(point.severity.toLocaleLowerCase() as Severity, {
                    late: () => theme.red10.get(),
                    moderate: () => theme.orange10.get(),
                    early: () => theme.yellow10.get(),
                  })
                : theme.yellow10.get()
            }
          />
          <Text size="$4">{format(point.date, 'EE ,d MMM yyy HH:mm aaa')}</Text>
        </XStack>
        <Text size="$4">{point.category}</Text>
      </XStack>
    </TouchableOpacity>
  );
}
