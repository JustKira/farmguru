import api from './api';

export default async function getStorageEndpoint(key: string, actionMaker: string) {
  const response = await api.post('/storage/get', { Key: key, ActionMaker: actionMaker });
  return response.data.data as string;
}
