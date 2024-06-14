import { Overlay } from 'react-native-maps';
import { YStack, ZStack } from 'tamagui';

import { SharedMap } from '~/components/(drawer)/(tabs)/[fid]/SharedMap';
import ConfiguredSheet from '~/components/(drawer)/(tabs)/[fid]/Sheet';
import TrendBlock from '~/components/(drawer)/(tabs)/[fid]/info/TrendBlock';
import NavStackStyled from '~/components/NavStackStyled';
import { Field, FieldDetail, FieldsMapInfo } from '~/lib/db/schemas';
import { useSharedFieldData } from '~/lib/providers/field-shared-data-provider';

export default function Index() {
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

      <ConfiguredSheet screen="INFO">
        <YStack gap="$4">
          <TrendBlock label="Nutrients" value={Number(details?.nutrientsTrend ?? 0)} />

          <TrendBlock label="Growth" value={Number(details?.growthTrend ?? 0)} />

          <TrendBlock label="Stress" value={Number(details?.stressTrend ?? 0)} isNegativeNature />
        </YStack>
      </ConfiguredSheet>
    </ZStack>
  );
}
