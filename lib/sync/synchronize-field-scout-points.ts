import { eq } from 'drizzle-orm';
import * as FileSystem from 'expo-file-system';

import db from '../db';
import {
  FieldsScoutPoints,
  NewFieldsScoutPoints,
  fieldsScoutPointsSchema,
} from '../db/schemas/fields-scout-point.schema';
import createUpdateScoutPointEndpoint from '../endpoints/post-scout-point';
import uploadStorage from '../endpoints/upload-storage';

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

interface ScoutPoint {
  MarkerId?: string;
  Date?: string;
  FieldId: string;
  ActionMaker: string;
  IssueCategory?: string;
  IssueSeverity?: string;
  Location?: [number, number];
  Notes?: string;
  Status: string;
  Photos?: string[];
  VoiceNotes?: string;
}

async function synchronizeScoutPointInsertUpdate(
  data: FieldsScoutPoints,
  fieldId: string,
  user: UserData,
  isNew: boolean
) {
  const dataToSync = data;

  if (dataToSync.photosFiles?.length !== 0) {
    const file = dataToSync.photosFiles?.[0];

    if (file) {
      const base64 = await FileSystem.readAsStringAsync(file, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const fileExtension = file.split('.').pop();

      if (base64 && fileExtension) {
        const key = await uploadStorage(base64, user.accountId, fileExtension);
        console.log('Photo Key', key);
        if (key) dataToSync.photosKeys = [key];
      }
    }
  }

  if (dataToSync.voiceNoteFile) {
    const base64 = await FileSystem.readAsStringAsync(dataToSync.voiceNoteFile, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const fileExtension = dataToSync.voiceNoteFile.split('.').pop();

    if (base64 && fileExtension) {
      const key = await uploadStorage(base64, user.accountId, fileExtension);
      console.log('Voice Note Key', key);
      if (key) dataToSync.voiceNoteKey = key;
    }
  }

  try {
    const dts: ScoutPoint = {
      ActionMaker: user.accountId,
      Date: new Date(dataToSync.date).toISOString(),

      Status: 'New',
      FieldId: fieldId,
      IssueCategory: dataToSync.category,
      IssueSeverity: dataToSync.severity,
      Location: dataToSync.location,
      Notes: dataToSync.notes ?? '',
      Photos: dataToSync.photosKeys ?? [''],
      VoiceNotes: dataToSync.voiceNoteKey ?? '',
    };

    if (!isNew) {
      dts.MarkerId = dataToSync.id;
    }

    const res = await createUpdateScoutPointEndpoint(dts);

    console.log('Scout Point Synced, Sync Type', !isNew ? 'Update' : 'Create');
    const updatedPoint = await db
      .update(fieldsScoutPointsSchema)
      .set({
        ...res,
        isDirty: false,
        isNew: false,
      })
      .where(eq(fieldsScoutPointsSchema.id, data.id))
      .returning();

    return updatedPoint?.[0];
  } catch (error) {
    console.error('Error Syncing Scout Point', error);
  }
}

export { synchronizeFieldScoutPoint, synchronizeScoutPointInsertUpdate };
