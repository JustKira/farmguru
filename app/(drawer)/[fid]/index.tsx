import { MaterialIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { Stack, useGlobalSearchParams } from 'expo-router';
import MapView, { PROVIDER_GOOGLE, Polygon } from 'react-native-maps';
import { Button, XStack, ZStack } from 'tamagui';

import ConfiguredSheet from '~/components/(drawer)/[fid]/Sheet';
import { Container } from '~/components/Container';
import db from '~/lib/db';
import { Text } from '~/tamagui.config';

export default function Field() {
  const { fid } = useGlobalSearchParams();

  console.log(fid);

  const fieldQuery = useQuery({
    queryKey: ['field', fid],
    enabled: !!fid,
    queryFn: async () =>
      db.query.fieldsSchema.findFirst({
        where(fields, operators) {
          return operators.eq(fields.id, fid as string);
        },
      }),
  });

  const fieldDetailsQuery = useQuery({
    queryKey: ['field', 'details', fid],
    enabled: !!fid,
    queryFn: async () =>
      db.query.fieldsDetailSchema.findFirst({
        where(fields, operators) {
          return operators.eq(fields.id, fid as string);
        },
      }),
  });

  const fieldMapInfoQuery = useQuery({
    queryKey: ['field', 'map', fid],
    enabled: !!fid,
    queryFn: async () =>
      db.query.fieldsMapInfoSchema.findFirst({
        where(fields, operators) {
          return operators.eq(fields.id, fid as string);
        },
      }),
  });

  if (!fieldQuery.data || !fieldDetailsQuery.data || !fieldMapInfoQuery.data) {
    return (
      <>
        <Stack.Screen options={{ title: 'Tab One' }} />
        <Container>
          <Text size="$5">Loading...</Text>
        </Container>
      </>
    );
  }

  const position = fieldQuery.data.position as [number, number];
  const coordinates = fieldQuery.data.location as [number, number][];
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
    <>
      <Stack.Screen options={{ title: 'Tab One' }} />

      <ZStack flex={1}>
        <MapView
          initialRegion={initialRegion}
          provider={PROVIDER_GOOGLE}
          mapType="satellite"
          style={{ flex: 1 }}>
          <Polygon coordinates={polygonCoordinates} strokeWidth={4} strokeColor="rgb(64 165 120)" />
        </MapView>
        <ConfiguredSheet>
          <Text>asd</Text>
        </ConfiguredSheet>
        <XStack
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          zIndex={105}
          justifyContent="center"
          alignContent="center"
          gap="$2"
          backgroundColor="$background"
          p="$5">
          <Button width={56} h={56} p={0} icon={<MaterialIcons name="add-box" size={28} />} />
          <Button width={56} h={56} p={0} icon={<MaterialIcons name="add-box" size={28} />} />
          <Button width={56} h={56} p={0} icon={<MaterialIcons name="add-box" size={28} />} />
        </XStack>
      </ZStack>
    </>
  );
}
