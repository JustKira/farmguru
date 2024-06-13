import { eq } from 'drizzle-orm';

import db from '../db';
import { Field, NewFieldsMapInfo, fieldsMapInfoSchema } from '../db/schemas';

import { UserData } from '~/types/global.types';
import getCachedFilePathByKey from '~/utils/get-cached-file-path-by-key';

async function synchronizeFieldMapDetails(
  id: string,
  parsedMapInfo: {
    default: string;
    nitrogen?: string;
    anomaly?: string;
    growth?: string;
    irrigation?: string;
  },
  user: UserData
) {
  const fieldMapInfo: NewFieldsMapInfo = {
    id,
  };

  await Promise.all(
    Object.entries(parsedMapInfo).map(async ([key, value]) => {
      const localUri = await getCachedFilePathByKey(user.accountId, value);
      //@ts-ignore
      fieldMapInfo[`${key}OverlayImgKey`] = value;
      //@ts-ignore
      fieldMapInfo[`${key}OverlayImgPath`] = localUri;
    })
  );

  await db.delete(fieldsMapInfoSchema).where(eq(fieldsMapInfoSchema.id, id));

  try {
    const res = await db.insert(fieldsMapInfoSchema).values(fieldMapInfo).returning();

    console.group(`Map Inserted: ${res[0].id}`);
    console.log(`Default Overlay: %c${res[0].defaultOverlayImgPath ? 'Yes' : 'No'}`);
    console.log(`Growth Overlay: %c${res[0].growthOverlayImgPath ? 'Yes' : 'No'}`, 'color: blue;');
    console.log(`Nitrogen Overlay: %c${res[0].nitrogenOverlayImgPath ? 'Yes' : 'No'}`);
    console.log(`Anomaly Overlay: %c${res[0].anomalyOverlayImgPath ? 'Yes' : 'No'}`);
    console.log(`Irrigation Overlay: %c${res[0].irrigationOverlayImgPath ? 'Yes' : 'No'}`);
    console.groupEnd();
  } catch (error) {
    console.error('Error Inserting Map', error);
  }
}

export { synchronizeFieldMapDetails };
