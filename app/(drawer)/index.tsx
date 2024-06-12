import { FlashList } from '@shopify/flash-list';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { Button } from 'tamagui';
import MapCardSelector from '~/components/(drawer)/MapCardSelector';

import { Container } from '~/components/Container';
import NavStackStyled from '~/components/NavStackStyled';
import db from '~/lib/db';
import { useSynchronizer } from '~/lib/providers/synchronizer-provider';
import { Text } from '~/tamagui.config';

export default function Home() {
  const { syncState, forceSync } = useSynchronizer();

  const { data, updatedAt } = useLiveQuery(db.query.fieldsSchema.findMany());

  return (
    <>
      <NavStackStyled options={{ title: 'Home' }} />
      <Container>
        <Button
          onPress={() => {
            forceSync();
          }}>
          Refresh
        </Button>
        <FlashList
          data={data}
          renderItem={({ item, index }) => {
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
                index={index}
                name={item.name}
                initialRegion={initialRegion}
                polyCoords={polygonCoordinates}
                onPress={() => {}}
              />
            );
          }}
          extraData={updatedAt}
          estimatedItemSize={15}
        />
      </Container>
    </>
  );
}
