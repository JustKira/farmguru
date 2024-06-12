import MapView, { PROVIDER_GOOGLE, Polygon } from 'react-native-maps';
import { Button, YStack } from 'tamagui';

interface MapCardSelectorProps {
  index: number;
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
  index,
  name,
  onPress,
}) => {
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
      <Button onPress={onPress}>View {name}</Button>
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
