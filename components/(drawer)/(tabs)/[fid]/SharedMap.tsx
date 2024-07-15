import { useDebounce } from '@uidotdev/usehooks';
import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import MapView, { Details, PROVIDER_GOOGLE, Polygon, Region } from 'react-native-maps';

import { Field } from '~/lib/db/schemas';
import { useSharedFieldData } from '~/lib/providers/field-shared-data-provider';

const SharedMap = ({ children }: { children: React.ReactNode }) => {
  const shared = useSharedFieldData();
  const mapRef = useRef<MapView>(null);
  const field = shared.field as Field;

  const [mapState, setMapState] = React.useState({
    region: null,
    camera: null,
  });

  const debouncedMapState = useDebounce(mapState, 600);

  useEffect(() => {
    if (debouncedMapState.region && debouncedMapState.camera) {
      shared.setMapRegion(debouncedMapState.region);
      shared.setMapCamera(debouncedMapState.camera);
    }
  }, [debouncedMapState, shared]);

  const onRegionChange = useCallback(async (region: Region, details: Details) => {
    if (details.isGesture && mapRef.current) {
      const camera = await mapRef.current.getCamera();
      if (region && camera) {
        setMapState({
          //@ts-ignore
          region,
          //@ts-ignore
          camera: {
            center: {
              latitude: region.latitude,
              longitude: region.longitude,
            },
            pitch: camera.pitch,
            heading: camera.heading,
            altitude: camera.altitude,
            zoom: camera.zoom,
          },
        });
      }
    }
  }, []);

  const position = field.position as [number, number];
  const coordinates = field.location as [number, number][];

  const initialRegion = useMemo(
    () => ({
      latitude: position[0],
      longitude: position[1],
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    }),
    [position]
  );

  const polygonCoordinates = useMemo(
    () =>
      coordinates.map((coordinate) => ({
        latitude: coordinate[0],
        longitude: coordinate[1],
      })),
    [coordinates]
  );

  return (
    <MapView
      initialRegion={initialRegion}
      camera={shared.camera}
      style={{ width: '100%', height: '100%' }}
      provider={PROVIDER_GOOGLE}
      mapType="satellite"
      showsUserLocation
      showsMyLocationButton={false}
      followsUserLocation
      onRegionChangeComplete={onRegionChange}>
      {children}
      <Polygon coordinates={polygonCoordinates} strokeWidth={4} strokeColor="rgb(64 165 120)" />
    </MapView>
  );
};

export default SharedMap;
