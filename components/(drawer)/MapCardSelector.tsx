import { useTranslation } from 'react-i18next';
import MapView, { PROVIDER_GOOGLE, Polygon } from 'react-native-maps';
import { YStack } from 'tamagui';
import { useSynchronizer } from '~/lib/providers/synchronizer-provider';
import { Button } from '~/tamagui.config';

interface MapCardSelectorProps {
  id: string;
  name: string;
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  polyCoords: {
    latitude: number;
    longitude: number;
  }[];
  onPress?: () => void;
}

const MapCardSelector: React.FC<MapCardSelectorProps> = ({
  initialRegion,
  polyCoords,
  id,
  name,
  onPress,
}) => {
  const { syncStateDetailed } = useSynchronizer();
  const { t } = useTranslation();
  return (
    <YStack
      flex={1}
      h="$16"
      flexDirection="column-reverse"
      my="$2"
      gap="$2"
      p="$2"
      borderColor="$muted"
      borderRadius="$2"
      borderWidth="$0.5">
      <Button
        backgroundColor={
          syncStateDetailed[id] === 'NO_ANALYTICS' ||
          syncStateDetailed[id] === 'FETCHING_DETAILS' ||
          syncStateDetailed[id] === 'FETCHING_MAP_DETAILS' ||
          syncStateDetailed[id] === 'SYNCING_SCOUT_POINTS' ||
          syncStateDetailed[id] === 'FETCHING_SCOUT_POINTS'
            ? '$foregroundMuted'
            : '$primary'
        }
        color={
          syncStateDetailed[id] === 'NO_ANALYTICS' ||
          syncStateDetailed[id] === 'FETCHING_DETAILS' ||
          syncStateDetailed[id] === 'FETCHING_MAP_DETAILS' ||
          syncStateDetailed[id] === 'SYNCING_SCOUT_POINTS' ||
          syncStateDetailed[id] === 'FETCHING_SCOUT_POINTS'
            ? '$foreground'
            : '$background'
        }
        disabled={
          syncStateDetailed[id] === 'NO_ANALYTICS' ||
          syncStateDetailed[id] === 'FETCHING_DETAILS' ||
          syncStateDetailed[id] === 'FETCHING_MAP_DETAILS' ||
          syncStateDetailed[id] === 'SYNCING_SCOUT_POINTS' ||
          syncStateDetailed[id] === 'FETCHING_SCOUT_POINTS'
        }
        onPress={onPress}>
        {syncStateDetailed[id] === 'SYNCING_SCOUT_POINTS'
          ? t('home.syncing_scout_points')
          : syncStateDetailed[id] === 'FETCHING_DETAILS'
            ? t('home.loading_details')
            : syncStateDetailed[id] === 'FETCHING_MAP_DETAILS'
              ? t('home.loading_map_details')
              : syncStateDetailed[id] === 'FETCHING_SCOUT_POINTS'
                ? t('home.loading_scout_points')
                : syncStateDetailed[id] === 'NO_ANALYTICS'
                  ? t('home.analytics_not_available')
                  : name}
      </Button>
      <MapView
        initialRegion={initialRegion}
        provider={PROVIDER_GOOGLE}
        mapType="satellite"
        scrollEnabled={false}
        pitchEnabled={false}
        zoomEnabled={false}
        style={{ flex: 1 }}>
        <Polygon coordinates={polyCoords} strokeWidth={1} strokeColor="rgb(64 165 120)" />
      </MapView>
    </YStack>
  );
};

export default MapCardSelector;
