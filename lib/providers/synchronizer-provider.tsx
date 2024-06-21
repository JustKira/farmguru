import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { createContext, useEffect, useState, useCallback } from 'react';

import { useAuth } from './auth-provider';
import { useNetInfo } from './netinfo-provider';
import db from '../db';
import {
  FieldsScoutPoints,
  fieldsDetailSchema,
  fieldsMapInfoSchema,
  fieldsSchema,
  fieldsScoutPointsSchema,
} from '../db/schemas';
import getFieldDetailsEndpoint from '../endpoints/get-field-details';
import getFieldEndpoint from '../endpoints/get-fields';
import { fieldDetailsInfoParser } from '../parsers/field-detail-parser';
import { fieldDetailsImageParser } from '../parsers/field-map-detail';
import { fieldParser } from '../parsers/field-parser';
import { fieldScoutPointParser } from '../parsers/field-scout-point-parser';
import { synchronizeFieldsDetails } from '../sync/synchronize-field-details';
import { synchronizeFieldMapDetails } from '../sync/synchronize-field-map-details';
import {
  synchronizeFieldScoutPoint,
  synchronizeScoutPointInsertUpdate,
} from '../sync/synchronize-field-scout-points';
import { synchronizeFields } from '../sync/synchronize-fields';

import { UserData } from '~/types/global.types';
import {
  SyncState,
  NO_CONNECTION_NO_CACHE,
  NO_CONNECTION_CACHE,
  LOADING,
  SYNCING,
  SYNCED,
  ERROR,
} from '~/utils/sync-states';
import useSyncScoutPoints from '../sync/hooks/synchronize-fields-scout-point';

type FieldsDetailLoading =
  | 'FETCHING_DETAILS'
  | 'FETCHING_MAP_DETAILS'
  | 'FETCHING_SCOUT_POINTS'
  | 'SYNCING_SCOUT_POINTS'
  | 'COMPLETED'
  | 'NO_ANALYTICS'
  | 'ERROR';

export interface ContextType {
  isInitialLoaded: boolean;
  syncState: SyncState;
  syncStateDetailed: Record<string, FieldsDetailLoading>;
  forceSync: () => void;
}

const SynchronizerContext = createContext<ContextType | undefined>(undefined);

export const useSynchronizer = () => {
  const context = React.useContext(SynchronizerContext);
  if (context === undefined) {
    throw new Error('useSynchronizer must be used within a SynchronizerProvider');
  }
  return context;
};

const LAST_SYNC_TIME_KEY = 'last_sync_time';

const getLastSyncTime = async () => {
  try {
    const lastSyncTime = await AsyncStorage.getItem(LAST_SYNC_TIME_KEY);
    return lastSyncTime ? new Date(lastSyncTime) : null;
  } catch (error) {
    console.error('Error retrieving last sync time:', error);
    return null;
  }
};

const setLastSyncTime = async (date?: Date) => {
  try {
    if (!date) {
      await AsyncStorage.removeItem(LAST_SYNC_TIME_KEY);
    } else {
      await AsyncStorage.setItem(LAST_SYNC_TIME_KEY, date.toISOString());
    }
  } catch (error) {
    console.error('Error setting last sync time:', error);
  }
};

const shouldSync = (lastSyncTime: Date | null): boolean => {
  if (!lastSyncTime) return true;
  const twoHoursInMillis = 2 * 60 * 60 * 1000;
  return new Date().getTime() - lastSyncTime.getTime() > twoHoursInMillis;
};

export const SynchronizerProvider: React.FC<{
  children: JSX.Element;
}> = ({ children }) => {
  const { user, status } = useAuth();

  const [syncState, setSyncState] = useState<SyncState>(LOADING);

  const [syncChecking, setSyncChecking] = useState<boolean>(true);
  const [lastSyncTime, setLastSyncTimeState] = useState<Date | null>(null);

  const [completedQueries, setCompletedQueries] = useState<number>(0);

  const [fieldsDetailLoading, setFieldsDetailLoading] = useState<
    Record<string, FieldsDetailLoading>
  >({});

  const { checking, isConnected } = useNetInfo();

  const queryClient = useQueryClient();

  const pointsSynchronizer = useSyncScoutPoints(isConnected, user ?? undefined);

  useEffect(() => {
    const clearDataOnLogout = async () => {
      if (status === 'LOGOUT') {
        queryClient.cancelQueries({
          queryKey: ['sync'],
          exact: false,
        });
        queryClient.clear();
        await Promise.all([
          db.delete(fieldsSchema),
          db.delete(fieldsMapInfoSchema),
          db.delete(fieldsScoutPointsSchema),
          db.delete(fieldsDetailSchema),
        ]);
        await setLastSyncTime(undefined);
        setLastSyncTimeState(null);
        setSyncState(LOADING);
      }
    };

    clearDataOnLogout();
  }, [status]);

  useEffect(() => {
    (async () => {
      const lastSync = await getLastSyncTime();
      setLastSyncTimeState(lastSync);
      console.log('Last sync time:', lastSync);
      if (!isConnected && !lastSync) {
        setSyncState(NO_CONNECTION_NO_CACHE);
      } else if (!isConnected && lastSync) {
        setSyncState(NO_CONNECTION_CACHE);
      }
      setSyncChecking(false);
    })();
  }, [checking]);

  useEffect(() => {
    console.log('Sync state:', syncState);
  }, [syncState]);

  useEffect(() => {
    (async () => {
      console.log('Completed queries:', completedQueries);
      if (syncFieldsDetails.length === completedQueries && syncState === SYNCING) {
        const now = new Date();
        await setLastSyncTime(now);
        setLastSyncTimeState(now);
        console.log('Last sync time updated:', now);
        setSyncState(SYNCED);
      }
    })();
  }, [completedQueries]);

  const syncFields = useQuery({
    queryKey: ['sync', 'field', 'list'],
    enabled:
      !!user?.accountId && !syncChecking && status !== 'UNAUTHENTICATED' && status !== 'LOADING',
    queryFn: async () => {
      if (!shouldSync(lastSyncTime)) {
        console.log('Skipping synchronization, less than 2 hours since last sync.');
        setSyncState(SYNCED);

        return await db.query.fieldsSchema.findMany();
      }

      try {
        if (!isConnected)
          return console.log('No internet connection Skipping synchronization... Of Scout Points');
        const _user = user as UserData;
        const scoutPoints = await db.query.fieldsScoutPointsSchema.findMany({
          where(fields, operators) {
            return operators.and(operators.eq(fields.isDirty, true));
          },
        });

        await Promise.all(
          scoutPoints.map(async (point) => {
            await synchronizeScoutPointInsertUpdate(
              point as FieldsScoutPoints,
              point.fieldId,
              _user,
              !point.isNew
            );
          })
        );
      } catch (error) {
        console.warn('Error synchronizing scout points:', error);
      }

      try {
        console.log('Starting synchronization...');
        setSyncState(SYNCING);

        const actionMaker = user?.accountId as string;

        const fields = await getFieldEndpoint(actionMaker);

        const parsedFields = fields?.map(fieldParser);

        await synchronizeFields(parsedFields ?? []);
        console.log('Fields synchronized to database.');

        return parsedFields;
      } catch (error) {
        setSyncState(ERROR);
        throw new Error(
          //@ts-expect-error
          `Error synchronizing fields: ${error.message ?? 'An error occurred'}`
        );
      }
    },
  });

  const syncFieldsDetails = useQueries({
    queries:
      syncFields.data?.map((field) => ({
        queryKey: ['sync', 'field', 'detail', field.id],
        queryFn: async () => {
          if (!shouldSync(lastSyncTime)) {
            console.log('Skipping synchronization, less than 2 hours since last sync.');
            setSyncState(SYNCED);

            try {
              const res = await db.query.fieldsSchema.findFirst({
                where(fields, operators) {
                  return operators.eq(fields.id, field.id);
                },
              });

              setFieldsDetailLoading((prev) => ({
                ...prev,
                [field.id]: 'COMPLETED',
              }));

              return res;
            } catch (_e) {
              setFieldsDetailLoading((prev) => ({
                ...prev,
                [field.id]: 'NO_ANALYTICS',
              }));
              return {
                details: null,
                mapDetails: null,
              };
            }
          }

          const _user = user as UserData;
          console.log('Getting field details for:', field.id);
          setFieldsDetailLoading((prev) => ({
            ...prev,
            [field.id]: 'FETCHING_DETAILS',
          }));
          const details = await getFieldDetailsEndpoint(field.id, _user.accountId);

          if (!details) {
            throw new Error('No details found');
          }

          if (details.hasAnalytics === false) {
            setFieldsDetailLoading((prev) => ({
              ...prev,
              [field.id]: 'NO_ANALYTICS',
            }));
            return {
              details: null,
              mapDetails: null,
            };
          }

          const parsedDetails = fieldDetailsInfoParser(details);
          const parsedMapDetails = fieldDetailsImageParser(details);
          const parsedScoutPoints = fieldScoutPointParser(details.markersList);
          const syncedDetails = await synchronizeFieldsDetails(parsedDetails);

          setFieldsDetailLoading((prev) => ({
            ...prev,
            [field.id]: 'FETCHING_MAP_DETAILS',
          }));

          const syncedMapDetails = await synchronizeFieldMapDetails(
            field.id,
            parsedMapDetails,
            _user
          );

          setFieldsDetailLoading((prev) => ({
            ...prev,
            [field.id]: 'FETCHING_SCOUT_POINTS',
          }));

          await synchronizeFieldScoutPoint(parsedScoutPoints, _user);

          setFieldsDetailLoading((prev) => ({
            ...prev,
            [field.id]: 'COMPLETED',
          }));

          setCompletedQueries((prev) => prev + 1);

          return {
            details: syncedDetails,
            mapDetails: syncedMapDetails,
          };
        },
        enabled: !!user?.accountId && !syncChecking && syncFields.isSuccess,
      })) ?? [],
  });

  const forceSync = async () => {
    if (!isConnected) {
      return;
    }

    console.log('Forcing synchronization...');
    setSyncState(SYNCING);
    await setLastSyncTime(undefined);
    setLastSyncTimeState(null);

    syncFields.refetch();
    setCompletedQueries(0);
    syncFieldsDetails.forEach((query) => query.refetch());
  };

  return (
    <SynchronizerContext.Provider
      value={{
        syncState,
        syncStateDetailed: fieldsDetailLoading,
        forceSync,
        isInitialLoaded: syncFields.isSuccess,
      }}>
      {children}
    </SynchronizerContext.Provider>
  );
};
