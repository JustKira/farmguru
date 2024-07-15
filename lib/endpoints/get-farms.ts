import api from './api';

export default async function getFarmsEndpoint(actionMaker: string) {
  const response = await api.post('/fields/mobile/getFarms', { ActionMaker: actionMaker });
  return response.data.data as Farm[];
}
