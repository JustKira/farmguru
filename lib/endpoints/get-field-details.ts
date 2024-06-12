import { BACKEND_API } from '..';

export default async function getFieldDetailsEndpoint(fieldId: string, actionMaker: string) {
  return fetch(`${BACKEND_API}/fields/mobile/getFieldDetails`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ FieldId: fieldId, ActionMaker: actionMaker }),
  }).then(async (res) => {
    if (res.ok) {
      const r = await res.json();
      return r.data as FarmFieldData;
    }
  });
}
