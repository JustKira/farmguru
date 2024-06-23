import { format } from 'date-fns';
import { useMemo, useState } from 'react';
import { ScrollView, Sheet, XStack, YStack } from 'tamagui';

import { FieldDetail } from '~/lib/db/schemas';
import { useSharedFieldData } from '~/lib/providers/field-shared-data-provider';
import { Text } from '~/tamagui.config';

interface ConfiguredSheetProps {
  children?: React.ReactNode;
  screen: 'CROP' | 'IRRIGATION' | 'SCOUT' | 'INFO';
}

export default function ConfiguredSheet({ children, screen }: ConfiguredSheetProps) {
  const shared = useSharedFieldData();

  const details = shared.details as FieldDetail;
  const snapPoints = useMemo(() => [85, 50, 17.5], []);

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
              <Text size="$3">Crop Type</Text>
              <Text size="$5">{details?.cropType}</Text>
            </YStack>
            <YStack aspectRatio={1}>
              <Text size="$3">Crop Age</Text>
              <Text size="$5">{details?.cropAge}</Text>
            </YStack>
            <YStack aspectRatio={1}>
              <Text size="$3">Last Update</Text>
              <Text size="$5">{lastUpdate ? format(new Date(lastUpdate), 'yyyy/MM/dd') : ''}</Text>
            </YStack>
          </XStack>
          <ScrollView>{children}</ScrollView>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
}
