// components/ScreenContent.tsx
import { Entypo, FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { XStack, YStack, useTheme } from 'tamagui';

import { Field, FieldDetail } from '~/lib/db/schemas';
import { useSharedFieldData } from '~/lib/providers/field-shared-data-provider';
import { useLanguage } from '~/lib/providers/language-provider';
import { Text } from '~/tamagui.config';
import { localizedDateFormate } from '~/utils/localizedDateFormate';

interface ScreenContentProps {
  screen: 'CROP' | 'IRRIGATION' | 'SCOUT' | 'INFO';
}

export default function ScreenContent({ screen }: ScreenContentProps) {
  const shared = useSharedFieldData();
  const theme = useTheme();
  const details = shared.details as FieldDetail;
  const field = shared.field as Field;
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();

  const lastUpdate = useMemo(() => {
    switch (screen) {
      case 'CROP':
        return details?.lastCropUpdate;
      case 'IRRIGATION':
        return details?.lastIrrigationUpdate;
      case 'SCOUT':
        return details?.lastScoutUpdate;
      default:
        return details?.lastInfoUpdate;
    }
  }, [screen, details]);

  return (
    <YStack mb="$4">
      <XStack borderRadius="$2" padding="$2">
        <Text size="$5">{field.name}</Text>
      </XStack>
      <XStack
        justifyContent="space-between"
        backgroundColor="$muted"
        borderRadius="$2"
        alignItems="center"
        py="$2"
        px="$6"
        elevation={0.15}>
        <YStack justifyContent="center" alignItems="center">
          <FontAwesome6 name="wheat-awn" size={20} color={theme.primary.get()} />
          <Text size="$1">{t('dialog.crop_info.type')}</Text>
          <Text size="$2">{details?.cropType}</Text>
        </YStack>
        <YStack justifyContent="center" alignItems="center">
          <Entypo name="flower" size={20} color={theme.primary.get()} />
          <Text size="$1">{t('dialog.crop_info.age')}</Text>
          <Text size="$2">{details?.cropAge}</Text>
        </YStack>
        <YStack justifyContent="center" alignItems="center">
          <MaterialIcons name="update" size={20} color={theme.primary.get()} />
          <Text size="$1">{t('last_update')}</Text>
          <Text size="$2">
            {lastUpdate
              ? localizedDateFormate(new Date(lastUpdate), 'yyyy/MM/dd', currentLanguage)
              : ''}
          </Text>
        </YStack>
      </XStack>
    </YStack>
  );
}
