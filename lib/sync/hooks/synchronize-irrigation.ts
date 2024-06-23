import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';

import { synchronizeIrrigationInsert } from '../synchronize-irrigation'; // Adjust the import path as necessary

import db from '~/lib/db';
import { FieldIrrigation } from '~/lib/db/schemas';
import { UserData } from '~/types/global.types';

const synchronizeIrrigationPoints = async (user: UserData, isConnected: boolean) => {
  if (!isConnected) {
    console.log('No internet connection. Skipping synchronization of Irrigation Points.');
    return;
  }

  try {
    const irrigationPoints = await db.query.fieldIrrigationSchema.findMany();

    await Promise.all(
      irrigationPoints.map(async (point) => {
        await synchronizeIrrigationInsert(point as FieldIrrigation, point.fieldId, user);
      })
    );
  } catch (error) {
    console.warn('Error synchronizing irrigation points:', error);
  }
};

const useSyncIrrigationPoints = (isConnected: boolean, user?: UserData) => {
  const mutation = useMutation({
    mutationFn: async () => {
      if (user) {
        console.log('Synchronizing irrigation points...', user.accountId);
        await synchronizeIrrigationPoints(user, isConnected);
      }
    },
    onMutate: () => {
      console.log('Synchronizing irrigation points...');
    },
    onSuccess: () => {
      console.log('Irrigation points synchronized successfully');
    },
    onError: (error) => {
      console.warn('Error synchronizing irrigation points:', error);
    },
  });

  useEffect(() => {
    if (isConnected && user) {
      mutation.mutate();
    }
  }, [isConnected, user]);

  return mutation;
};

export default useSyncIrrigationPoints;
