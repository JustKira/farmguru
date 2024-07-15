import api from './api';

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
  VoiceNote?: string;
}

export default async function createUpdateScoutPointEndpoint(data: ScoutPoint) {
  const response = await api.post('/fields/markers/add', {
    ...data,
    Status: 'NEW',
  });
  return response.data.data as Marker;
}
