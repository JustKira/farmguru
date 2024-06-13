import { NewFieldsScoutPoints } from '../db/schemas/fields-scout-point.schema';

export function fieldScoutPointParser(data: Marker[]): NewFieldsScoutPoints[] {
  const fieldsScoutPoints: NewFieldsScoutPoints[] = data.map((marker) => {
    return {
      id: marker.id,
      fieldId: marker.fieldId,
      category: marker.issueCategory,
      severity: marker.issueSeverity,
      location: marker.markerLocation,
      date: new Date(marker.markerDate),
      photosKeys: marker.photos,
      notes: marker.notes,
      lastUpdate: marker.lastView,
      reply: marker.reply,
      voiceNoteKey: marker.voiceNote,
      voiceReplyKey: marker.voiceReply,
    };
  });
  return fieldsScoutPoints;
}
