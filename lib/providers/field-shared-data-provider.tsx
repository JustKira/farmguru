import { useQuery } from '@tanstack/react-query';
import React, { createContext, useState } from 'react';
import { Camera, Region } from 'react-native-maps';
import { YStack } from 'tamagui';

import db from '../db';
import { Field, FieldDetail, FieldsMapInfo, FieldsScoutPoints } from '../db/schemas';

import { Container } from '~/components/Container';
import { Text } from '~/tamagui.config';

export interface ContextType {
  field?: Field;
  details?: FieldDetail;
  map?: FieldsMapInfo;
  scoutPoints?: FieldsScoutPoints[];
  region?: Region;
  camera?: Camera;
  setMapRegion: (region: Region) => void;
  setMapCamera: (camera: Camera) => void;
}

export const FieldSharedDataContext = createContext<ContextType>({
  setMapRegion: () => {},
  setMapCamera: () => {},
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

  const [camera, setCamera] = useState<Camera>();
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

  function setMapCamera(camera: Camera) {
    setCamera(camera);
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
        camera,
        setMapCamera,
      }}>
      {children}
    </FieldSharedDataContext.Provider>
  );
};
