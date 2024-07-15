// components/tabs/InfoTab.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Overlay } from 'react-native-maps';
import { H3, useTheme, XStack, YStack } from 'tamagui';

import TrendBlock from '~/components/(drawer)/(tabs)/[fid]/info/TrendBlock';
import { TabContent } from '~/types/tabs.types';

export const InfoTab: TabContent = {
  map: {
    header: function Header() {
      return null;
    },
    overlays: function Overlays({ shared }) {
      const map = shared.map;
      const field = shared.field;
      if (!map || !field) return null;
      return (
        <>
          {map.defaultOverlayImgPath && field.bounds ? (
            <Overlay bounds={field.bounds} image={{ uri: map.defaultOverlayImgPath }} />
          ) : (
            <></>
          )}
        </>
      );
    },
  },
  sheet: {
    header: function Header() {
      return null;
    },
    body: function Body({ shared, t }) {
      const details = shared.details;
      return (
        <YStack gap="$4">
          <H3>{t('weekly_change')}</H3>
          <XStack justifyContent="space-between" gap="$2">
            <TrendBlock label={t('nutrients')} value={Number(details?.nutrientsTrend ?? 0)} />
            <TrendBlock
              label={t('stress')}
              value={Number(details?.stressTrend ?? 0)}
              isNegativeNature
            />
          </XStack>
          <XStack justifyContent="space-between" gap="$2">
            <TrendBlock label={t('growth')} value={Number(details?.growthTrend ?? 0)} />
            <XStack flex={1} opacity={0}>
              <TrendBlock
                label={t('stress')}
                value={Number(details?.stressTrend ?? 0)}
                isNegativeNature
              />
            </XStack>
          </XStack>
        </YStack>
      );
    },
  },
  icon: function Icon(active: boolean) {
    const theme = useTheme();
    return (
      <Ionicons
        name="information-circle"
        size={24}
        color={active ? theme.primary.get() : '#8E8E93'}
      />
    );
  },
};
