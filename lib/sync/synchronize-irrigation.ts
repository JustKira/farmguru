import { eq } from 'drizzle-orm';

import db from '../db';
import { FieldIrrigation, fieldIrrigationSchema } from '../db/schemas';
import createUpdateIrrigationPointEndpoint from '../endpoints/post-irrigation-point';

import { UserData } from '~/types/global.types';

interface IrrigationPoint {
  FieldId?: string;
  duration?: string;
  datetime: string;
  ActionMaker: string;
}

async function synchronizeIrrigationInsert(data: FieldIrrigation, fieldId: string, user: UserData) {
  try {
    const irrigationData: IrrigationPoint = {
      FieldId: fieldId,
      duration: data.duration.toString(),
      datetime: new Date(data.date).toISOString(),
      ActionMaker: user.accountId,
    };

    const res = await createUpdateIrrigationPointEndpoint(irrigationData);

    if (!res.ok) {
      throw new Error('Failed to sync irrigation point');
    }

    console.log('Irrigation Point Synced');

    await db.delete(fieldIrrigationSchema).where(eq(fieldIrrigationSchema.id, data.id));

    return null;
  } catch (error) {
    console.error('Error Syncing Irrigation Point', error);
  }
}

export { synchronizeIrrigationInsert };
