import { BACKEND_API } from '..';

export default async function getFarmsEndpoint(actionMaker: string) {
  return fetch(`${BACKEND_API}/fields/mobile/getFarms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ActionMaker: actionMaker }),
  }).then(async (res) => {
    if (res.ok) {
      const r = await res.json();
      return r.data as Farm[];
    }
  });
}
