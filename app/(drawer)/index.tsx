import { MaterialIcons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useRouter } from 'expo-router';
import { XStack, Button, Stack, YStack } from 'tamagui';

import MapCardSelector from '~/components/(drawer)/MapCardSelector';
import { Container } from '~/components/Container';
import NavStackStyled from '~/components/NavStackStyled';
import db from '~/lib/db';
import { useSynchronizer } from '~/lib/providers/synchronizer-provider';
import { Text } from '~/tamagui.config';

export default function Home() {
  const { isInitialLoaded, forceSync, syncState } = useSynchronizer();

  const router = useRouter();

  const { data, isLoading, isPending } = useQuery({
    queryKey: ['fields', 'list'],
    enabled: isInitialLoaded,
    queryFn: async () => db.query.fieldsSchema.findMany(),
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
            icon={<MaterialIcons name="refresh" size={20} color="white" />}
            onPress={() => {
              forceSync();
            }}
          />
        </XStack>
        <FlashList
          data={data}
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
                onPress={() => router.push(`/(drawer)/${item.id}`)}
              />
            );
          }}
          extraData={isPending || isLoading}
          estimatedItemSize={15}
        />
      </Container>
    </>
  );
}
