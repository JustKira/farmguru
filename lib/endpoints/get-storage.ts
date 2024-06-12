import { BACKEND_API } from '..';

export default async function getStorageEndpoint(key: string, actionMaker: string) {
  return fetch(`${BACKEND_API}/storage/get`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ Key: key, ActionMaker: actionMaker }),
  }).then(async (res) => {
    if (res.ok) {
      const r = await res.json();
      return r.data as string;
    }
  });
}
