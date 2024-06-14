import React, { useState, useImperativeHandle, forwardRef } from 'react';
import MapView, { Marker, Region, PROVIDER_GOOGLE, Polygon } from 'react-native-maps';
import { Button, Sheet, YStack } from 'tamagui';

import { Field } from '~/lib/db/schemas';
import { useSharedFieldData } from '~/lib/providers/field-shared-data-provider';

export type MapSheetHandle = {
  openMapSheet: () => void;
  closeMapSheet: () => void;
};

type MapSheetProps = {
  children?: React.ReactNode;
  interactiveMarker?: boolean;
  singular?: boolean;
  onMarkerAdded?: (coordinate: { latitude: number; longitude: number }) => void;
};

const MapSheet = forwardRef<MapSheetHandle, MapSheetProps>(
  ({ children, singular, interactiveMarker = false, onMarkerAdded }, ref) => {
    const [open, setOpen] = useState(false);

    const [markers, setMarkers] = useState<{ latitude: number; longitude: number }[]>([]);

    const shared = useSharedFieldData();
    const field = shared.field as Field;
    const position = field.position as [number, number];
    const coordinates = field.location as [number, number][];

    const initialRegion = {
      latitude: position[0],
      longitude: position[1],
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };
    const polygonCoordinates = coordinates.map((coordinate) => {
      return { latitude: coordinate[0], longitude: coordinate[1] };
    });

    useImperativeHandle(ref, () => ({
      openMapSheet: () => setOpen(true),
      closeMapSheet: () => setOpen(false),
    }));

    const handleMapPress = (event: {
      nativeEvent: { coordinate: { latitude: number; longitude: number } };
    }) => {
      if (interactiveMarker) {
        const coordinate = event.nativeEvent.coordinate;
        setMarkers((prev) => (singular ? [coordinate] : [...prev, coordinate]));
        if (onMarkerAdded) {
          onMarkerAdded(coordinate);
        }
      }
    };

    return (
      <Sheet
        open={open}
        onOpenChange={setOpen}
        snapPoints={[100]}
        modal
        disableDrag
        zIndex={100_000}>
        <Sheet.Overlay
          animation="quick"
          enterStyle={{ opacity: 0 }}
          style={{ opacity: 0.5 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle />
        <Sheet.Frame>
          <YStack fullscreen paddingHorizontal="$4" borderRadius="$4" paddingTop="$10">
            <MapView
              style={{ flex: 1 }}
              provider={PROVIDER_GOOGLE}
              mapType="satellite"
              region={shared.region ?? initialRegion}
              onPress={handleMapPress}>
              {markers.map((marker, index) => (
                <Marker key={index} coordinate={marker} />
              ))}
              <Polygon
                coordinates={polygonCoordinates}
                strokeWidth={4}
                strokeColor="rgb(64 165 120)"
              />
              {children}
            </MapView>
            <Button
              onPress={() => {
                setOpen(false);
              }}>
              Close
            </Button>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    );
  }
);

export default MapSheet;
