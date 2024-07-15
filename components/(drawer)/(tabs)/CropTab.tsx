import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Overlay } from 'react-native-maps';
import { useTheme, XStack, YStack } from 'tamagui';

import { MapLegend } from './[fid]/MapLegend';
import FieldPercentages from './[fid]/crop/FieldPercentages';

import { Button } from '~/tamagui.config';
import { TabContent, TabContentProps } from '~/types/tabs.types';

export const CropTab: TabContent = {
  map: {
    header: function Header({ t, getState, setState }: TabContentProps) {
      const selected =
        (getState('crop_map_selected') as 'nitrogen' | 'anomaly' | 'growth') ?? 'nitrogen';

      return (
        <XStack gap="$2">
          {['nitrogen', 'anomaly', 'growth'].map((m) => (
            <Button
              h="$3"
              key={m}
              onPress={() => setState('crop_map_selected', m)}
              color={m === selected ? '$background' : '$foreground'}
              backgroundColor={m === selected ? '$primary' : '$muted'}>
              {/* @ts-ignore */}
              {t(`${m.toLowerCase()}`)}
            </Button>
          ))}
        </XStack>
      );
    },
    overlays: function Overlays({ shared, getState }: TabContentProps) {
      const map = shared.map;
      const field = shared.field;
      if (!map || !field) return null;

      const selected =
        (getState('crop_map_selected') as 'nitrogen' | 'anomaly' | 'growth') ?? 'nitrogen';

      return (
        <>
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
        </>
      );
    },
  },
  sheet: {
    header: function Header({ shared, getState, t }: TabContentProps) {
      const field = shared.field;
      if (!field) return null;

      const selected =
        (getState('crop_map_selected') as 'nitrogen' | 'anomaly' | 'growth') ?? 'nitrogen';

      switch (selected) {
        case 'nitrogen':
          return (
            <MapLegend
              items={[
                { color: '#ffff66', name: t('very_low') },
                { color: '#aad466', name: t('low') },
                { color: '#55aa66', name: t('medium') },
                { color: '#007f66', name: t('high') },
              ]}
            />
          );
        case 'anomaly':
          return (
            <MapLegend
              items={[
                { color: '#8b0000', name: t('very_low') },
                { color: '#ffa500', name: t('low') },
                { color: '#ffff00', name: t('medium') },
                { color: '#006837', name: t('high') },
              ]}
            />
          );
        case 'growth':
          return (
            <MapLegend
              items={[
                { color: '#b9e176', name: t('very_low') },
                { color: '#c7e77f', name: t('low') },
                { color: '#d7ee89', name: t('medium') },
                { color: '#e3f399', name: t('high') },
              ]}
            />
          );
      }
    },
    body: function Body({ shared, t }: TabContentProps) {
      const details = shared.details;
      return (
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
      );
    },
  },
  icon: function Icon(active: boolean) {
    const theme = useTheme();
    return (
      <FontAwesome5 name="seedling" size={24} color={active ? theme.primary.get() : '#8E8E93'} />
    );
  },
};
