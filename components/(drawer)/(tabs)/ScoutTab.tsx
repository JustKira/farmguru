// ScoutTab.tsx
import { FontAwesome } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import React, { useRef } from 'react';
import { Marker, Overlay } from 'react-native-maps';
import { Button, useTheme, XStack, YStack } from 'tamagui';

import ConfiguredSheet from '~/components/(drawer)/(tabs)/[fid]/Sheet';
import ScoutInsertForm, {
  ScoutInsertFormHandle,
} from '~/components/(drawer)/(tabs)/[fid]/scout/ScoutInsertForm';
import ScoutPointDetails, {
  ScoutPointDetailsHandle,
} from '~/components/(drawer)/(tabs)/[fid]/scout/ScoutPointDetails';
import ScoutPointListItem from '~/components/(drawer)/(tabs)/[fid]/scout/ScoutPointListItem';
import { Text } from '~/tamagui.config';
import { TabContent, TabContentProps } from '~/types/tabs.types';

export const ScoutTab: TabContent = {
  map: {
    header: ({ t }) => null, // No header for the map
    overlays: ({ shared }) => {
      const { field, map, scoutPoints } = shared;

      if (!map || !field || !scoutPoints) return null;

      return (
        <>
          <Overlay bounds={field.bounds} image={{ uri: map.defaultOverlayImgPath ?? '' }} />
          {scoutPoints.map((point) => (
            <Marker
              key={point.id}
              coordinate={{
                latitude: point.location[0],
                longitude: point.location[1],
              }}
              onPress={() => {
                // Example action on press
              }}
            />
          ))}
        </>
      );
    },
  },
  sheet: {
    header: ({ t }) => null,
    body: (props) => <ScoutPointList {...props} />,
  },
  icon: function Icon(active: boolean) {
    const theme = useTheme();
    return <FontAwesome name="search" size={24} color={active ? theme.primary.get() : '#8E8E93'} />;
  },
};

const ScoutPointList: React.FC<TabContentProps> = ({ shared, t }) => {
  const { scoutPoints, field } = shared;
  const scoutPointDetailsRef = useRef<ScoutPointDetailsHandle>(null);
  const scoutInsertFormRef = useRef<ScoutInsertFormHandle>(null);
  const theme = useTheme();

  // Check for required data
  if (!scoutPoints || !field) return null;

  return (
    <>
      <YStack gap="$2">
        <YStack flex={1} gap="$6">
          <Text size="$8">{t('dash.scout.field_points')}</Text>
          <YStack flex={1} justifyContent="space-between">
            <Button
              backgroundColor="$foregroundMuted"
              color="$background"
              onPress={() => scoutInsertFormRef.current?.openScoutPointForm()}>
              {t('dash.scout.add_marker')}
            </Button>
            <FlashList
              data={scoutPoints}
              renderItem={({ item }) => (
                <ScoutPointListItem
                  point={item}
                  onPress={() => scoutPointDetailsRef.current?.openScoutPointDetails(item)}
                />
              )}
              estimatedItemSize={20}
            />
          </YStack>
        </YStack>
      </YStack>
      <ScoutPointDetails ref={scoutPointDetailsRef} />
      <ScoutInsertForm fid={field.id as string} ref={scoutInsertFormRef} />
    </>
  );
};

export default ScoutTab;
