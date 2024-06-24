import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Overlay } from 'react-native-maps';
import { Button, XStack, YStack, ZStack } from 'tamagui';

import { SharedMap } from '~/components/(drawer)/(tabs)/[fid]/SharedMap';
import ConfiguredSheet from '~/components/(drawer)/(tabs)/[fid]/Sheet';
import FieldPercentages from '~/components/(drawer)/(tabs)/[fid]/crop/FieldPercentages';
import NavStackStyled from '~/components/NavStackStyled';
import { Field, FieldDetail, FieldsMapInfo } from '~/lib/db/schemas';
import { useSharedFieldData } from '~/lib/providers/field-shared-data-provider';

type MapTypes = 'anomaly' | 'nitrogen' | 'growth';

const availableMaps = [
  { label: 'Stress', value: 'anomaly' },
  { label: 'Nutrients', value: 'nitrogen' },
  { label: 'Growth', value: 'growth' },
];

export default function Crop() {
  const shared = useSharedFieldData();

  const field = shared.field as Field;
  const map = shared.map as FieldsMapInfo;
  const details = shared.details as FieldDetail;

  const { t } = useTranslation();

  const [selected, setSelected] = useState<MapTypes>('nitrogen');
  return (
    <ZStack fullscreen>
      <NavStackStyled />
      <SharedMap>
        {map.defaultOverlayImgPath && field.bounds ? (
          <Overlay bounds={field.bounds} image={{ uri: map.defaultOverlayImgPath }} />
        ) : (
          <></>
        )}

        {/* @ts-ignore */}
        {map[`${selected}OverlayImgPath`] && field.bounds ? (
          <Overlay
            bounds={field.bounds}
            // @ts-ignore
            image={{ uri: map[`${selected}OverlayImgPath`] as string }}
          />
        ) : (
          <></>
        )}
      </SharedMap>

      <XStack gap="$2" m="$2">
        {availableMaps.map((m) => (
          <Button
            key={m.value}
            onPress={() => setSelected(m.value as MapTypes)}
            color={m.value === selected ? 'black' : 'white'}
            backgroundColor={m.value === selected ? '$primary' : '$muted'}>
            {/* @ts-ignore */}
            {t(`${m.label.toLowerCase()}`)}
          </Button>
        ))}
      </XStack>
      <ConfiguredSheet screen="CROP">
        <YStack rowGap="$2">
          <FieldPercentages
            label={t('nutrients')}
            percentages={details?.nutrientsPercentage ?? undefined}
          />
          <FieldPercentages
            label={t('growth')}
            percentages={details?.growthPercentage ?? undefined}
          />
          <FieldPercentages
            label={t('stress')}
            percentages={details?.stressPercentage ?? undefined}
          />
        </YStack>
      </ConfiguredSheet>
    </ZStack>
  );
}
