import { MaterialIcons } from '@expo/vector-icons';
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Overlay } from 'react-native-maps';
import { Text, XStack, YStack, ZStack } from 'tamagui';

import { MapLegend } from '~/components/(drawer)/(tabs)/[fid]/MapLegend';
import SharedMap from '~/components/(drawer)/(tabs)/[fid]/SharedMap';
import ConfiguredSheet from '~/components/(drawer)/(tabs)/[fid]/Sheet';
import FieldPercentages from '~/components/(drawer)/(tabs)/[fid]/crop/FieldPercentages';
import NavStackStyled from '~/components/NavStackStyled';
import { Field, FieldDetail, FieldsMapInfo } from '~/lib/db/schemas';
import { useSharedFieldData } from '~/lib/providers/field-shared-data-provider';
import { Button } from '~/tamagui.config';

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
  //   const mapRef = useRef<SharedMapRef>(null);
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

      <YStack m="$2">
        <XStack justifyContent="space-between">
          <XStack gap="$2">
            {availableMaps.map((m) => (
              <Button
                key={m.value}
                onPress={() => setSelected(m.value as MapTypes)}
                color={m.value === selected ? '$background' : '$foreground'}
                backgroundColor={m.value === selected ? '$primary' : '$muted'}>
                {/* @ts-ignore */}
                {t(`${m.label.toLowerCase()}`)}
              </Button>
            ))}
          </XStack>

          {/* <Button
            icon={<MaterialIcons name="home" size={15} />}
            padding={0}
            aspectRatio={1}
            // onPress={() => {
            //   if (mapRef.current) {
            //     mapRef.current.resetPosition();
            //   }
            // }}
          /> */}
        </XStack>
      </YStack>

      <ConfiguredSheet
        screen="CROP"
        header={() => {
          switch (selected) {
            case 'nitrogen':
              return (
                <YStack backgroundColor="$background" m="$2" padding="$2" borderRadius={'$2'}>
                  <Text fontSize="$3">{t('map_legend')}</Text>
                  <MapLegend
                    items={[
                      { color: '#ffff66', name: t('very_low') },
                      { color: '#aad466', name: t('low') },
                      { color: '#55aa66', name: t('medium') },
                      { color: '#007f66', name: t('high') },
                    ]}
                  />
                </YStack>
              );
            case 'anomaly':
              return (
                <YStack backgroundColor="$background" m="$2" padding="$2" borderRadius={'$2'}>
                  <Text fontSize="$3">{t('map_legend')}</Text>
                  <MapLegend
                    items={[
                      { color: '#8b0000', name: t('very_low') },
                      { color: '#ffa500', name: t('low') },
                      { color: '#ffff00', name: t('medium') },
                      { color: '#006837', name: t('high') },
                    ]}
                  />
                </YStack>
              );
            case 'growth':
              return (
                <YStack backgroundColor="$background" m="$2" padding="$2" borderRadius={'$2'}>
                  <Text fontSize="$3">{t('map_legend')}</Text>
                  <MapLegend
                    items={[
                      { color: '#b9e176', name: t('very_low') },
                      { color: '#c7e77f', name: t('low') },
                      { color: '#d7ee89', name: t('medium') },
                      { color: '#e3f399', name: t('high') },
                    ]}
                  />
                </YStack>
              );
          }
        }}>
        <YStack rowGap="$2">
          <FieldPercentages
            label={t('nutrients')}
            colors={['#ffff66', '#aad466', '#55aa66', '#007f66']}
            percentages={details?.nutrientsPercentage ?? undefined}
          />
          <FieldPercentages
            label={t('growth')}
            colors={['#b9e176', '#c7e77f', '#d7ee89', '#e3f399']}
            percentages={details?.growthPercentage ?? undefined}
          />
          <FieldPercentages
            label={t('stress')}
            colors={['#8b0000', '#ffa500', '#ffff00', '#006837']}
            percentages={details?.stressPercentage ?? undefined}
          />
        </YStack>
      </ConfiguredSheet>
    </ZStack>
  );
}
