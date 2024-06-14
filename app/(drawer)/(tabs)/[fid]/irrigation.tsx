import { MaterialIcons } from '@expo/vector-icons';
import { Overlay } from 'react-native-maps';
import { XStack, YStack, ZStack, useTheme } from 'tamagui';

import { SharedMap } from '~/components/(drawer)/(tabs)/[fid]/SharedMap';
import ConfiguredSheet from '~/components/(drawer)/(tabs)/[fid]/Sheet';
import InfoCard from '~/components/(drawer)/(tabs)/[fid]/irrigation/InfoCard';
import NavStackStyled from '~/components/NavStackStyled';
import { Field, FieldDetail, FieldsMapInfo } from '~/lib/db/schemas';
import { useSharedFieldData } from '~/lib/providers/field-shared-data-provider';
import { Text } from '~/tamagui.config';

export default function Irrigation() {
  const shared = useSharedFieldData();

  const theme = useTheme();

  const field = shared.field as Field;
  const map = shared.map as FieldsMapInfo;
  const details = shared.details as FieldDetail;

  return (
    <ZStack fullscreen>
      <NavStackStyled />
      <SharedMap>
        {map.irrigationOverlayImgPath && field.bounds ? (
          <Overlay bounds={field.bounds} image={{ uri: map.irrigationOverlayImgPath }} />
        ) : (
          <></>
        )}
      </SharedMap>

      <ConfiguredSheet screen="IRRIGATION">
        <YStack>
          <YStack flex={1} gap="$6">
            <Text size="$8">Water Status</Text>
            <XStack flex={1} justifyContent="space-between">
              <InfoCard
                label="Soil Moisture Root Zone"
                icon={<MaterialIcons name="water-drop" size={32} color={theme.primary.get()} />}
                value={`${details.soilMoisture}%`}
              />
              <InfoCard
                label="Days To Wilting"
                icon={<MaterialIcons name="water-drop" size={32} color={theme.primary.get()} />}
                value={`${details.daysToWilting} Days`}
              />
            </XStack>
          </YStack>
          <YStack flex={1} gap="$6">
            <Text size="$8">Irrigation</Text>
            <XStack flex={1} justifyContent="space-between">
              <InfoCard
                label="Next Irrigation"
                icon={<MaterialIcons name="water-drop" size={32} color={theme.primary.get()} />}
                value={`${details.nextIrrigation} Days`}
              />
              <InfoCard
                label="Advised Water"
                icon={<MaterialIcons name="water-drop" size={32} color={theme.primary.get()} />}
                value={`${details.advisedWater} Hours`}
              />
            </XStack>
          </YStack>
        </YStack>
      </ConfiguredSheet>
    </ZStack>
  );
}
