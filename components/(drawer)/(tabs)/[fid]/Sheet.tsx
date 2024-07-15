import { Entypo, FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Sheet, Stack, XStack, YStack, useTheme } from 'tamagui';

import { Field, FieldDetail } from '~/lib/db/schemas';
import { useSharedFieldData } from '~/lib/providers/field-shared-data-provider';
import { useLanguage } from '~/lib/providers/language-provider';
import { Text } from '~/tamagui.config';
import { localizedDateFormate } from '~/utils/localizedDateFormate';

interface ConfiguredSheetProps {
  children?: React.ReactNode;
  header?: () => React.ReactNode;
  footer?: React.ReactNode;
  screen: 'CROP' | 'IRRIGATION' | 'SCOUT' | 'INFO';
}

export default function ConfiguredSheet({ children, header, screen }: ConfiguredSheetProps) {
  const shared = useSharedFieldData();
  const theme = useTheme();
  const details = shared.details as FieldDetail;
  const field = shared.field as Field;
  const snapPoints = useMemo(() => [85, 50, 17.5], []);

  const { currentLanguage } = useLanguage();

  const [sheetPosition, setSheetPosition] = useState(snapPoints.length - 1);

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

  const { t } = useTranslation();

  return (
    <Sheet
      open
      modal={false}
      snapPoints={snapPoints}
      snapPointsMode="percent"
      dismissOnOverlayPress={false}
      dismissOnSnapToBottom={false}
      position={sheetPosition}
      onPositionChange={setSheetPosition}
      zIndex={100}>
      <Sheet.Handle />
      <Sheet.Frame>
        {header ? (
          <YStack paddingHorizontal="$4" gap="$2" backgroundColor="$background">
            {header()}
          </YStack>
        ) : null}

        <ScrollView mt="$8">
          <YStack flex={1} paddingHorizontal="$4" gap="$2" mb="$4" backgroundColor="$background">
            <XStack borderRadius="$2" padding="$2">
              <Text size="$5">{field.name}</Text>
            </XStack>
            <XStack
              justifyContent="space-between"
              backgroundColor="$muted"
              borderRadius="$2"
              alignItems="center"
              elevation={0.15}>
              <YStack aspectRatio={1} flex={1} justifyContent="center" alignItems="center">
                <FontAwesome6 name="wheat-awn" size={32} color={theme.primary.get()} />
                <Text size="$2">{t('dialog.crop_info.type')}</Text>
                <Text size="$4">{details?.cropType}</Text>
              </YStack>
              <YStack aspectRatio={1} flex={1} justifyContent="center" alignItems="center">
                <Entypo name="flower" size={32} color={theme.primary.get()} />
                <Text size="$2">{t('dialog.crop_info.age')}</Text>
                <Text size="$4">{details?.cropAge}</Text>
              </YStack>
              <YStack aspectRatio={1} flex={1} justifyContent="center" alignItems="center">
                <MaterialIcons name="update" size={32} color={theme.primary.get()} />
                <Text size="$2">{t('last_update')}</Text>
                <Text size="$4">
                  {lastUpdate
                    ? localizedDateFormate(new Date(lastUpdate), 'yyyy/MM/dd', currentLanguage)
                    : ''}
                </Text>
              </YStack>
            </XStack>
            {children}
          </YStack>
        </ScrollView>
      </Sheet.Frame>
    </Sheet>
  );
}
