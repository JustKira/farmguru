import { useQuery } from '@tanstack/react-query';
import React, { createContext, useState } from 'react';

import db from '../db';
import { Field, FieldDetail, FieldsMapInfo, FieldsScoutPoints } from '../db/schemas';

import { Text } from '~/tamagui.config';
import { Container } from '~/components/Container';
import { YStack } from 'tamagui';
import { Region } from 'react-native-maps';

export interface ContextType {
  field?: Field;
  details?: FieldDetail;
  map?: FieldsMapInfo;
  scoutPoints?: FieldsScoutPoints[];
  region?: Region;
  setMapRegion: (region: Region) => void;
}

export const FieldSharedDataContext = createContext<ContextType>({
  details: undefined,
  field: undefined,
  map: undefined,
  scoutPoints: undefined,
  region: undefined,
  setMapRegion: () => {},
});

export const useSharedFieldData = () => {
  const context = React.useContext(FieldSharedDataContext);
  if (context === undefined) {
    throw new Error('useFieldSharedData must be used within a FieldSharedDataProvider');
  }
  return context;
};

export const FieldSharedDataProvider: React.FC<{
  children: JSX.Element;
  fid: string;
}> = ({ children, fid }) => {
  const [region, setRegion] = useState<Region>();

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

  const fieldScoutPointsQuery = useQuery({
    queryKey: ['field', 'scout', fid],
    enabled: !!fid,
    queryFn: async () =>
      db.query.fieldsScoutPointsSchema.findMany({
        where(fields, operators) {
          return operators.eq(fields.fieldId, fid as string);
        },
      }),
  });

  function setMapRegion(region: Region) {
    setRegion(region);
  }

  if (
    fieldQuery.isLoading ||
    fieldDetailsQuery.isLoading ||
    fieldMapInfoQuery.isLoading ||
    fieldScoutPointsQuery.isLoading
  ) {
    return (
      <Container>
        <YStack flex={1} justifyContent="center" alignContent="center">
          <Text>loading</Text>
        </YStack>
      </Container>
    );
  }

  if (
    !fieldQuery.data ||
    !fieldDetailsQuery.data ||
    !fieldMapInfoQuery.data ||
    !fieldScoutPointsQuery.data
  ) {
    return (
      <Container>
        <YStack flex={1} justifyContent="center" alignContent="center">
          <Text>Error</Text>
        </YStack>
      </Container>
    );
  }

  return (
    <FieldSharedDataContext.Provider
      value={{
        field: fieldQuery.data as Field,
        details: fieldDetailsQuery.data as FieldDetail,
        map: fieldMapInfoQuery.data as FieldsMapInfo,
        scoutPoints: fieldScoutPointsQuery.data as FieldsScoutPoints[],
        region,
        setMapRegion,
      }}>
      {children}
    </FieldSharedDataContext.Provider>
  );
};
