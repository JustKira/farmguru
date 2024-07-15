import api from './api';

export default async function getFieldEndpoint(actionMaker: string) {
  const response = await api.post('/fields/mobile/getFields', { ActionMaker: actionMaker });
  return response.data.data as FarmField[];
}
