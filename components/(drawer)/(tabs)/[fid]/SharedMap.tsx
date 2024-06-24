import React, { useEffect, useRef } from 'react';
import MapView, { Details, PROVIDER_GOOGLE, Polygon, Region } from 'react-native-maps';
import { Field } from '~/lib/db/schemas';
import { useSharedFieldData } from '~/lib/providers/field-shared-data-provider';

export function SharedMap({ children }: { children: React.ReactNode }) {
  const shared = useSharedFieldData();

  const mapRef = useRef<MapView>(null);

  const field = shared.field as Field;

  const onRegionChange = async (region: Region, details: Details) => {
    if (details.isGesture === true) {
      if (mapRef.current) {
        const camera = await mapRef.current?.getCamera();
        shared.setMapCamera({
          center: {
            latitude: region.latitude,
            longitude: region.longitude,
          },
          pitch: camera.pitch,
          heading: camera.heading,
          altitude: camera.altitude,
          zoom: camera.zoom,
        });
      }
      shared.setMapRegion(region);
    }
  };

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

  return (
    <MapView
      ref={mapRef}
      initialRegion={initialRegion}
      camera={shared.camera}
      style={{ width: '100%', height: '100%' }}
      provider={PROVIDER_GOOGLE}
      mapType="satellite"
      // region={shared.region ?? initialRegion}
      showsUserLocation
      showsMyLocationButton
      followsUserLocation
      onRegionChangeComplete={onRegionChange}>
      {children}
      <Polygon coordinates={polygonCoordinates} strokeWidth={4} strokeColor="rgb(64 165 120)" />
    </MapView>
  );
}
