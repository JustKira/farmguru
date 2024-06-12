import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { createContext, useEffect, useState, useCallback } from 'react';

import { useAuth } from './auth-provider';
import { useNetInfo } from './netinfo-provider';
import db from '../db';
import getFieldDetailsEndpoint from '../endpoints/get-field-details';
import getFieldEndpoint from '../endpoints/get-fields';
import { fieldParser } from '../parsers/field-parser';
import { synchronizeFields } from '../sync/synchronize-fields';

import {
  SyncState,
  NO_CONNECTION_NO_CACHE,
  NO_CONNECTION_CACHE,
  LOADING,
  SYNCING,
  SYNCED,
  ERROR,
} from '~/utils/sync-states';
import { fieldDetailsInfoParser } from '../parsers/field-detail-parser';
import { synchronizeFieldsDetails } from '../sync/synchronize-field-details';

type FieldsDetailLoading = 'FETCHING_DETAILS' | 'FETCHING_MAP_DETAILS' | 'FETCHING_SCOUT_POINTS';

export interface ContextType {
  syncState: SyncState;
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
  const { user } = useAuth();

  const [syncState, setSyncState] = useState<SyncState>(LOADING);

  const [syncChecking, setSyncChecking] = useState<boolean>(true);
  const [lastSyncTime, setLastSyncTimeState] = useState<Date | null>(null);

  const [fieldsDetailLoading, setFieldsDetailLoading] = useState<
    Record<string, FieldsDetailLoading>
  >({});

  const { checking, isConnected } = useNetInfo();

  const queryClient = useQueryClient();

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

  const syncFields = useQuery({
    queryKey: ['sync-fields'],
    enabled: !!user?.accountId && !syncChecking,
    queryFn: async () => {
      if (!shouldSync(lastSyncTime)) {
        console.log('Skipping synchronization, less than 2 hours since last sync.');
        setSyncState(SYNCED);

        return await db.query.fieldsSchema.findMany();
      }
      try {
        console.log('Starting synchronization...');
        setSyncState(SYNCING);

        const actionMaker = user?.accountId as string;

        const fields = await getFieldEndpoint(actionMaker);

        const parsedFields = fields?.map(fieldParser);

        await synchronizeFields(parsedFields ?? []);
        console.log('Fields synchronized to database.');

        const now = new Date();
        await setLastSyncTime(now);
        setLastSyncTimeState(now);
        console.log('Last sync time updated:', now);

        setSyncState(SYNCED);

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
        queryKey: ['sync', 'field', 'details', field.id],
        queryFn: async () => {
          const actionMaker = user?.accountId as string;
          console.log('Getting field details for:', field.id);
          setFieldsDetailLoading((prev) => ({
            ...prev,
            [field.id]: 'FETCHING_DETAILS',
          }));
          const details = await getFieldDetailsEndpoint(field.id, actionMaker);

          if (!details) {
            throw new Error('No details found');
          }

          const parsedDetails = fieldDetailsInfoParser(details);

          await synchronizeFieldsDetails([parsedDetails]);

          return parsedDetails;
          // await Promise.all([
          //   detailsProcessor(fields, field, user),
          //   mapProcessor(fields, field, user),
          // ]);
        },
        enabled: !!user?.accountId && !syncChecking && !!syncFields.data,
      })) ?? [],
  });

  const forceSync = useCallback(async () => {
    if (!isConnected) {
      return;
    }

    console.log('Forcing synchronization...');
    setSyncState(SYNCING);
    await setLastSyncTime(undefined);
    setLastSyncTimeState(null);
    await queryClient.invalidateQueries({
      queryKey: ['sync-fields'],
    });
  }, [queryClient]);

  return (
    <SynchronizerContext.Provider value={{ syncState, forceSync }}>
      {children}
    </SynchronizerContext.Provider>
  );
};
