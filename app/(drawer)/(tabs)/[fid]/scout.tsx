import { FlashList } from '@shopify/flash-list';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler } from 'react-native';
import { Marker, Overlay } from 'react-native-maps';
import { Button, YStack, ZStack } from 'tamagui';

import { SharedMap } from '~/components/(drawer)/(tabs)/[fid]/SharedMap';
import ConfiguredSheet from '~/components/(drawer)/(tabs)/[fid]/Sheet';
import ScoutInsertForm, {
  ScoutInsertFormHandle,
} from '~/components/(drawer)/(tabs)/[fid]/scout/ScoutInsertForm';
import ScoutPointDetails, {
  ScoutPointDetailsHandle,
} from '~/components/(drawer)/(tabs)/[fid]/scout/ScoutPointDetails';
import ScoutPointListItem from '~/components/(drawer)/(tabs)/[fid]/scout/ScoutPointListItem';
import NavStackStyled from '~/components/NavStackStyled';
import { Field, FieldsMapInfo, FieldsScoutPoints } from '~/lib/db/schemas';
import { useSharedFieldData } from '~/lib/providers/field-shared-data-provider';

export default function Scout() {
  const shared = useSharedFieldData();

  const [open, setOpen] = useState(false);
  const field = shared.field as Field;
  const map = shared.map as FieldsMapInfo;
  const scoutPoints = shared.scoutPoints as FieldsScoutPoints[];
  const scoutPointDetailsRef = useRef<ScoutPointDetailsHandle>(null);
  const scoutInsertFormRef = useRef<ScoutInsertFormHandle>(null);

  const { t } = useTranslation();

  useEffect(() => {
    const backAction = () => {
      if (open) {
        setOpen(false);
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  return (
    <ZStack fullscreen>
      <NavStackStyled />
      <SharedMap>
        {map.defaultOverlayImgPath && field.bounds ? (
          <Overlay bounds={field.bounds} image={{ uri: map.defaultOverlayImgPath }} />
        ) : (
          <></>
        )}

        {scoutPoints?.map((point) => {
          const latlng = point.location;

          return (
            <Marker
              key={point.id}
              coordinate={{
                latitude: latlng[0],
                longitude: latlng[1],
              }}
              onPress={() => {
                // router.navigate(`(drawer)/(tabs)/${params.fid}/scout/${point.id}`);
                // setShow(true);
                // setSelectedPoint(point as FieldScoutPointSchema);
                scoutPointDetailsRef.current?.openScoutPointDetails(point);
                console.log('Marker Pressed', point.id);
              }}
            />
          );
        })}
      </SharedMap>

      <ConfiguredSheet screen="SCOUT">
        <YStack gap="$4">
          <Button
            onPress={() => {
              scoutInsertFormRef.current?.openScoutPointForm();
            }}>
            {t('dash.scout.add_marker')}
          </Button>
          <FlashList
            data={scoutPoints}
            renderItem={({ item }) => {
              return (
                <ScoutPointListItem
                  point={item}
                  onPress={() => {
                    scoutPointDetailsRef.current?.openScoutPointDetails(item);
                  }}
                />
              );
            }}
            estimatedItemSize={20}
          />
        </YStack>
      </ConfiguredSheet>
      <ScoutInsertForm fid={field.id} ref={scoutInsertFormRef} />
      <ScoutPointDetails ref={scoutPointDetailsRef} />
    </ZStack>
  );
}
