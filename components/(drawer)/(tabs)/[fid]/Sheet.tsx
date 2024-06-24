import { format } from 'date-fns';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Sheet, XStack, YStack } from 'tamagui';

import { FieldDetail } from '~/lib/db/schemas';
import { useSharedFieldData } from '~/lib/providers/field-shared-data-provider';
import { useLanguage } from '~/lib/providers/language-provider';
import { Text } from '~/tamagui.config';
import { localizedDateFormate } from '~/utils/localizedDateFormate';

interface ConfiguredSheetProps {
  children?: React.ReactNode;
  screen: 'CROP' | 'IRRIGATION' | 'SCOUT' | 'INFO';
}

export default function ConfiguredSheet({ children, screen }: ConfiguredSheetProps) {
  const shared = useSharedFieldData();

  const details = shared.details as FieldDetail;
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
      snapPoints={snapPoints}
      snapPointsMode="percent"
      dismissOnOverlayPress={false}
      dismissOnSnapToBottom={false}
      position={sheetPosition}
      onPositionChange={setSheetPosition}
      zIndex={100}>
      <Sheet.Handle />
      <Sheet.Frame>
        <YStack flex={1} padding="$4" backgroundColor="$background">
          <XStack justifyContent="space-between">
            <YStack aspectRatio={1}>
              <Text size="$3">{t('dialog.crop_info.type')}</Text>
              <Text size="$5">{details?.cropType}</Text>
            </YStack>
            <YStack aspectRatio={1}>
              <Text size="$3">{t('dialog.crop_info.age')}</Text>
              <Text size="$5">{details?.cropAge}</Text>
            </YStack>
            <YStack aspectRatio={1}>
              <Text size="$3">{t('last_update')}</Text>
              <Text size="$5">
                {lastUpdate
                  ? localizedDateFormate(new Date(lastUpdate), 'yyyy/MM/dd', currentLanguage)
                  : ''}
              </Text>
            </YStack>
          </XStack>
          <ScrollView>{children}</ScrollView>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
}
