import { Overlay } from 'react-native-maps';
import { YStack, ZStack } from 'tamagui';

import { SharedMap } from '~/components/(drawer)/(tabs)/[fid]/SharedMap';
import ConfiguredSheet from '~/components/(drawer)/(tabs)/[fid]/Sheet';
import FieldPercentages from '~/components/(drawer)/(tabs)/[fid]/crop/FieldPercentages';
import NavStackStyled from '~/components/NavStackStyled';
import { Field, FieldDetail, FieldsMapInfo } from '~/lib/db/schemas';
import { useSharedFieldData } from '~/lib/providers/field-shared-data-provider';

export default function Crop() {
  const shared = useSharedFieldData();

  const field = shared.field as Field;
  const map = shared.map as FieldsMapInfo;
  const details = shared.details as FieldDetail;
  return (
    <ZStack fullscreen>
      <NavStackStyled />
      <SharedMap>
        {map.defaultOverlayImgPath && field.bounds ? (
          <Overlay bounds={field.bounds} image={{ uri: map.defaultOverlayImgPath }} />
        ) : (
          <></>
        )}
      </SharedMap>

      <ConfiguredSheet screen="CROP">
        <YStack rowGap="$2">
          <FieldPercentages
            label="Nutrients"
            percentages={details?.nutrientsPercentage ?? undefined}
          />
          <FieldPercentages label="Growth" percentages={details?.growthPercentage ?? undefined} />
          <FieldPercentages label="Stress" percentages={details?.stressPercentage ?? undefined} />
        </YStack>
      </ConfiguredSheet>
    </ZStack>
  );
}
