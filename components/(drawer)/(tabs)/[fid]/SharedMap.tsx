import { useDebounce } from '@uidotdev/usehooks';
import React, { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import MapView, {
  Marker,
  Polygon,
  PROVIDER_GOOGLE,
  Region,
  Details,
  MapViewProps,
} from 'react-native-maps';
import * as Location from 'expo-location'; // Import expo-location

import { Field } from '~/lib/db/schemas';
import { useSharedFieldData } from '~/lib/providers/field-shared-data-provider';

// Define the types for the props
interface SharedMapProps {
  children: React.ReactNode;
}

// Define the type for user location
interface UserLocation {
  latitude: number;
  longitude: number;
}

const SharedMap: React.FC<SharedMapProps> = ({ children }) => {
  const shared = useSharedFieldData();
  const mapRef = useRef<MapView>(null);
  const field = shared.field as Field;

  const [mapState, setMapState] = useState<{
    region: Region | null;
    camera: MapViewProps['camera'] | null;
  }>({
    region: null,
    camera: null,
  });

  const [userLocation, setUserLocation] = useState<UserLocation | null>(null); // State to store user's location
  const debouncedMapState = useDebounce(mapState, 600);

  // Request user location permission and get current location with high accuracy
  useEffect(() => {
    (async () => {
      // Request foreground permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      // Fetch user's current location with high accuracy
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });

      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      // Optionally set the initial region to user's location
      if (mapRef.current && location) {
        mapRef.current.animateToRegion(
          {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          },
          1000
        );
      }
    })();
  }, []);

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
          region,
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
      onRegionChangeComplete={onRegionChange}
      ref={mapRef}>
      {children}
      <Polygon coordinates={polygonCoordinates} strokeWidth={4} strokeColor="rgb(64 165 120)" />

      {/* Add a Marker for user location */}
      {userLocation && <Marker coordinate={userLocation} title="Your Location" />}
    </MapView>
  );
};

export default SharedMap;
