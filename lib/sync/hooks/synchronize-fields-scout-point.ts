import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { synchronizeScoutPointInsertUpdate } from '../synchronize-field-scout-points';

import db from '~/lib/db';
import { FieldsScoutPoints } from '~/lib/db/schemas';
import { UserData } from '~/types/global.types';

const synchronizeScoutPoints = async (user: UserData, isConnected: boolean) => {
  if (!isConnected) {
    console.log('No internet connection. Skipping synchronization of Scout Points.');
    return;
  }

  try {
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
          user,
          point.isNew ?? false
        );
      })
    );
  } catch (error) {
    console.warn('Error synchronizing scout points:', error);
  }
};

const useSyncScoutPoints = (isConnected: boolean, user?: UserData) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      if (user) {
        console.log('Synchronizing scout points...', user.accountId);
        await synchronizeScoutPoints(user, isConnected);
      }
    },
    onMutate: () => {
      console.log('Synchronizing scout points...');
    },
    onSuccess: async () => {
      console.log('Scout points synchronized successfully');
      await queryClient.invalidateQueries({
        queryKey: ['field', 'scout'],
      });
    },
    onError: (error) => {
      console.warn('Error synchronizing scout points:', error);
    },
  });

  useEffect(() => {
    if (isConnected && user) {
      mutation.mutate();
    }
  }, [isConnected, user]);

  return mutation;
};

export default useSyncScoutPoints;
