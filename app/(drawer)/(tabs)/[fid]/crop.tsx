import { Overlay } from 'react-native-maps';
import { ZStack } from 'tamagui';
import { SharedMap } from '~/components/(drawer)/(tabs)/[fid]/SharedMap';
import ConfiguredSheet from '~/components/(drawer)/(tabs)/[fid]/Sheet';
import { Field, FieldsMapInfo } from '~/lib/db/schemas';
import { useSharedFieldData } from '~/lib/providers/field-shared-data-provider';

export default function Crop() {
  const shared = useSharedFieldData();

  const field = shared.field as Field;
  const map = shared.map as FieldsMapInfo;

  return (
    <ZStack fullscreen>
      <SharedMap>
        {map.defaultOverlayImgPath && field.bounds ? (
          <Overlay bounds={field.bounds} image={{ uri: map.defaultOverlayImgPath }} />
        ) : (
          <></>
        )}
      </SharedMap>

      <ConfiguredSheet>
        <></>
      </ConfiguredSheet>
    </ZStack>
  );
}
