import { useQuery } from '@tanstack/react-query';
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { SQLJsDatabase } from 'drizzle-orm/sql-js';
import React, { createContext, useEffect, useState } from 'react';

import { useAuth } from './auth-provider';
import { useDatabase } from './database-provider';
import getFieldEndpoint from '../endpoints/get-fields';
import { fieldParser } from '../parsers/field-parser';
import { synchronizeFields } from '../sync/synchronize-fields';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ContextType {}

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

const setLastSyncTime = async (date: Date) => {
  try {
    await AsyncStorage.setItem(LAST_SYNC_TIME_KEY, date.toISOString());
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
  const { db } = useDatabase();

  const [checkingSync, setCheckingSync] = useState(true);
  const [lastSyncTime, setLastSyncTimeState] = useState<Date | null>(null);

  useEffect(() => {
    (async () => {
      const lastSync = await getLastSyncTime();
      setLastSyncTimeState(lastSync);
      console.log('Last sync time:', lastSync);
      setCheckingSync(false);
    })();
  }, []);

  useEffect(() => {
    if (shouldSync(lastSyncTime)) {
      console.log('Sync Time Passed');
    } else {
      console.log('Sync Time Not Passed, skipping sync..., loading fields from Local database...');
    }
  }, [lastSyncTime]);

  const syncFields = useQuery({
    queryKey: ['sync-fields'],
    enabled: !!user?.accountId && !!db && !checkingSync && shouldSync(lastSyncTime),
    queryFn: async () => {
      console.log('Starting synchronization...');
      const _db: SQLJsDatabase | ExpoSQLiteDatabase = db as any;
      const actionMaker = user?.accountId as string;

      const fields = await getFieldEndpoint(actionMaker);

      const parsedFields = fields?.map(fieldParser);

      await synchronizeFields(_db, parsedFields ?? []);
      console.log('Fields synchronized to database.');

      const now = new Date();
      await setLastSyncTime(now);
      setLastSyncTimeState(now);
      console.log('Last sync time updated:', now);

      return null;
    },
  });

  return <SynchronizerContext.Provider value={{}}>{children}</SynchronizerContext.Provider>;
};
