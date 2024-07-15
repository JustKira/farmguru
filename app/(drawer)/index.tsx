import { MaterialIcons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { XStack, Button, Stack } from 'tamagui';

import MapCardSelector from '~/components/(drawer)/MapCardSelector';
import { Container } from '~/components/Container';
import NavStackStyled from '~/components/NavStackStyled';
import db from '~/lib/db';
import { useSynchronizer } from '~/lib/providers/synchronizer-provider';
import { Text } from '~/tamagui.config';

export default function Home() {
  const { isInitialLoaded, forceSync, syncState } = useSynchronizer();
  const router = useRouter();

  const farmsQuery = useQuery({
    queryKey: ['farms', 'list'],
    enabled: isInitialLoaded,
    queryFn: async () => db.query.farmsSchema.findMany(),
  });

  const fieldsQuery = useQuery({
    queryKey: ['fields', 'list'],
    enabled: isInitialLoaded,
    queryFn: async () => db.query.fieldsSchema.findMany(),
  });

  if (farmsQuery.isLoading || fieldsQuery.isLoading) {
    return <Text>Loading...</Text>;
  }

  if (farmsQuery.isError || fieldsQuery.isError) {
    return <Text>Error loading data</Text>;
  }

  const farms = farmsQuery.data;
  const fields = fieldsQuery.data;

  // Group fields by farm
  const farmsWithFields = farms?.map((farm) => {
    return {
      ...farm,
      fields: fields?.filter((field) => field.farmId === farm.id),
    };
  });

  return (
    <>
      <NavStackStyled options={{ title: 'Home' }} />
      <Container>
        <XStack justifyContent="space-between" alignItems="center">
          <Stack>
            <Text size="$4" color="$primary">
              {syncState === 'SYNCING'
                ? 'Data is being Updated'
                : syncState === 'ERROR'
                  ? 'Error in updating data'
                  : 'Data is Updated'}
            </Text>
          </Stack>
          <Button
            aspectRatio={1}
            padding={0}
            icon={<MaterialIcons name="refresh" size={20} color="$background" />}
            onPress={() => {
              forceSync();
            }}
          />
        </XStack>
        <FlashList
          data={farmsWithFields}
          renderItem={({ item: farm }) => (
            <>
              <Text size={'$6'}>{farm.name}</Text>

              <FlashList
                data={farm.fields}
                renderItem={({ item }) => {
                  const position = item.position as [number, number];
                  const coordinates = item.location as [number, number][];
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
                    <MapCardSelector
                      id={item.id}
                      name={item.name}
                      initialRegion={initialRegion}
                      polyCoords={polygonCoordinates}
                      onPress={() => router.navigate(`/(drawer)/(tabs)/${item.id}`)}
                    />
                  );
                }}
                extraData={fieldsQuery.isPending || fieldsQuery.isLoading}
                estimatedItemSize={15}
              />

              {/* {farm.fields?.map(field => {
                const position = field.position as [number, number];
                const coordinates = field.location as [number, number][];
                const initialRegion = {
                  latitude: position[0],
                  longitude: position[1],
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                };

                const polygonCoordinates = coordinates.map(coordinate => ({
                  latitude: coordinate[0],
                  longitude: coordinate[1],
                }));

                return (
                  <MapCardSelector
                    key={field.id}
                    id={field.id}
                    name={field.name}
                    initialRegion={initialRegion}
                    polyCoords={polygonCoordinates}
                    onPress={() => router.push(`/(drawer)/${field.id}`)}
                  />
                );
              })} */}
            </>
          )}
          extraData={fieldsQuery.isPending || fieldsQuery.isLoading}
          estimatedItemSize={15}
        />
      </Container>
    </>
  );
}
