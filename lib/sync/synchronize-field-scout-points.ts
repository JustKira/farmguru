import { eq } from 'drizzle-orm';

import db from '../db';
import {
  NewFieldsScoutPoints,
  fieldsScoutPointsSchema,
} from '../db/schemas/fields-scout-point.schema';

import { UserData } from '~/types/global.types';
import getCachedFilePathByKey from '~/utils/get-cached-file-path-by-key';

async function synchronizeFieldScoutPoint(points: NewFieldsScoutPoints[], user: UserData) {
  await Promise.allSettled(
    points.map(async (p) => {
      // Ensure photosFiles is initialized
      if (!p.photosFiles) p.photosFiles = [];

      const photoPromises = p.photosKeys
        ? p.photosKeys
            .filter((key) => key !== '')
            .map((value) => getCachedFilePathByKey(user.accountId, value))
        : [];
      const photoFiles = await Promise.allSettled(photoPromises);
      photoFiles.forEach((result) => {
        if (result.status === 'fulfilled' && result.value) p.photosFiles?.push(result.value);
      });

      const voiceNotePromise =
        p.voiceNoteKey && p.voiceNoteKey !== ''
          ? getCachedFilePathByKey(user.accountId, p.voiceNoteKey)
          : Promise.resolve(null);
      const voiceReplyPromise =
        p.voiceReplyKey && p.voiceReplyKey !== ''
          ? getCachedFilePathByKey(user.accountId, p.voiceReplyKey)
          : Promise.resolve(null);

      const [voiceNoteResult, voiceReplyResult] = await Promise.allSettled([
        voiceNotePromise,
        voiceReplyPromise,
      ]);

      if (voiceNoteResult.status === 'fulfilled') p.voiceNoteFile = voiceNoteResult.value;
      if (voiceReplyResult.status === 'fulfilled') p.voiceReplyFile = voiceReplyResult.value;

      // Perform database operations only if all required files are successfully retrieved
      try {
        await db.delete(fieldsScoutPointsSchema).where(eq(fieldsScoutPointsSchema.id, p.id));
        const res = await db.insert(fieldsScoutPointsSchema).values(p).returning();
        console.log(`Scout Points Inserted ${res[0].id}`);
      } catch (error) {
        console.error('Error Inserting Scout Points', error);
      }
    })
  );
}

export { synchronizeFieldScoutPoint };
