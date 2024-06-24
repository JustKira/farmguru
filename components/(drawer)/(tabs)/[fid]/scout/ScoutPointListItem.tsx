import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';
import { XStack, useTheme } from 'tamagui';

import { FieldsScoutPoints } from '~/lib/db/schemas';
import { useLanguage } from '~/lib/providers/language-provider';
import { Text } from '~/tamagui.config';
import { Severity } from '~/types/global.types';
import getSeverity from '~/utils/get-severity';
import { localizedDateFormate } from '~/utils/localizedDateFormate';

export default function ScoutPointListItem({
  point,
  onPress,
}: {
  point: FieldsScoutPoints;
  onPress?: () => void;
}) {
  const theme = useTheme();

  const { t } = useTranslation();

  const { currentLanguage } = useLanguage();

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
          <Text size="$4">
            {localizedDateFormate(point.date, 'EE ,d MMM yyy HH:mm aaa', currentLanguage)}
          </Text>
        </XStack>
        {/* @ts-ignore */}
        <Text size="$4">{t(point.category.toLocaleLowerCase())}</Text>
      </XStack>
    </TouchableOpacity>
  );
}
