import { BACKEND_API } from '..';

export default async function uploadStorage(data: string, actionMaker: string, type: string) {
  return fetch(`${BACKEND_API}/storage/upload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ Data: data, ActionMaker: actionMaker, Type: type }),
  }).then(async (res) => {
    if (res.ok) {
      const r = await res.json();
      console.log('Upload Storage', r);
      return r.data as string;
    }
  });
}
