import { eq } from 'drizzle-orm';
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { SQLJsDatabase } from 'drizzle-orm/sql-js';

import { NewField, fieldsSchema } from '../db/schemas';
import { NewFieldDetail, fieldsDetailSchema } from '../db/schemas/fields-detail.schema';
import getFieldDetailsEndpoint from '../endpoints/get-field-details';
import getFieldEndpoint from '../endpoints/get-fields';

export async function synchronizeFields(
  db: ExpoSQLiteDatabase | SQLJsDatabase,
  fields: FarmField[],
  actionMaker: string
) {
  const fieldsDetails = await Promise.allSettled(
    fields ? fields.map(async ({ id }) => getFieldDetailsEndpoint(id, actionMaker)) : []
  );
  await Promise.allSettled(
    fieldsDetails
      ? fieldsDetails.map(async (f) => {
          if (f.status === 'fulfilled') {
            const fieldDetails = f.value;
            if (!fieldDetails) return;

            const lastInfoUpdate = fieldDetails.tabs.info.lastUpdate;
            const lastCropUpdate = fieldDetails.tabs.croprobo.lastUpdate;
            const lastIrrigationUpdate = fieldDetails.tabs.irrigrobo.lastUpdate;
            const lastScoutUpdate = fieldDetails.tabs.scoutrobo.lastUpdate;

            const nutrients =
              fieldDetails.tabs.croprobo.cropData.find((cropData) => cropData.name === 'Nutrients')
                ?.percentages ?? [];
            const stress =
              fieldDetails.tabs.croprobo.cropData.find((cropData) => cropData.name === 'Stress')
                ?.percentages ?? [];

            const growth =
              fieldDetails.tabs.croprobo.cropData.find((cropData) => cropData.name === 'Growth')
                ?.percentages ?? [];

            const growthTrend = growth[0].value.toString();
            const nutrientsTrend = nutrients[0].value.toString();
            const stressTrend = stress[0].value.toString();

            const today = new Date();

            const cropAge = Math.abs(
              (new Date(fieldDetails.plantdate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
            ).toFixed();

            const parsedFieldData: NewFieldDetail = {
              id: fieldDetails.id,
              lastInfoUpdate,
              lastCropUpdate,
              lastIrrigationUpdate,
              lastScoutUpdate,
              cropAge: cropAge.toString(),
              cropType: fieldDetails.cropType,
              growthPercentage: [
                growth[1].value,
                growth[2].value,
                growth[3].value,
                growth[4].value,
              ],
              nutrientsPercentage: [
                nutrients[1].value,
                nutrients[2].value,
                nutrients[3].value,
                nutrients[4].value,
              ],
              stressPercentage: [
                stress[1].value,
                stress[2].value,
                stress[3].value,
                stress[4].value,
              ],
              growthTrend,
              nutrientsTrend,
              stressTrend,
            };

            const existingField = await db
              .select()
              .from(fieldsDetailSchema)
              .where(eq(fieldsDetailSchema.id, fieldDetails.id));

            if (existingField) {
              await db
                .update(fieldsDetailSchema)
                .set(parsedFieldData)
                .where(eq(fieldsDetailSchema.id, fieldDetails.id));
            } else {
              await db.insert(fieldsDetailSchema).values(parsedFieldData);
            }
          }
        })
      : []
  );
}
