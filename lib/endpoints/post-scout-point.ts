import { BACKEND_API } from '..';

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
  return fetch(`${BACKEND_API}/fields/markers/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...data,
      Status: 'NEW',
    }),
  }).then(async (res) => {
    if (res.ok) {
      const r = await res.json();
      return r.data as Marker;
    }
  });
}
